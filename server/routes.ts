import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import multer from "multer";
import * as XLSX from "xlsx";
import { objectStorageClient, signObjectURL } from "./replit_integrations/object_storage";
import { seedVideos } from "./seedVideos";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

function extractFilename(videoUrl: string): string | null {
  if (!videoUrl) return null;
  const match = videoUrl.match(/\/attached_assets\/(.+)$/);
  return match ? match[1] : null;
}

const CONTENT_TYPES: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.mov': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
};

function getContentType(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

// Validation schema for submitting a response
const submitResponseSchema = z.object({
  sessionId: z.string(),
  moduleId: z.string(),
  attemptNumber: z.number().int().min(1),
  partNumber: z.number().int().min(1).optional().default(1),
  userResponse: z.string().min(1),
  allResponses: z.array(z.string()).optional(),
  prompt: z.string(),
  idealAnswer: z.string(),
  scoringCriteria: z.string().optional(),
  socraticMode: z.boolean().optional(),
  aiHelpfulness: z.number().int().min(1).max(10).optional().default(5),
});

// Validation schema for summarizing responses
const summarizeResponseSchema = z.object({
  sessionId: z.string(),
  userResponses: z.array(z.string()),
  idealAnswer: z.string(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  try {
    await seedVideos();
  } catch (err) {
    console.error("Failed to seed videos:", err);
  }

  app.get("/api/test-video", (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html><head><title>Video Test</title></head>
<body style="background:#000;color:#fff;font-family:sans-serif;padding:20px">
<h2>Video Playback Test</h2>
<div id="log" style="background:#111;padding:10px;margin:10px 0;max-height:300px;overflow:auto;font-size:12px;font-family:monospace"></div>
<video id="v" width="640" height="360" controls preload="auto" style="border:1px solid #333"></video>
<br><br>
<button onclick="testNoRange()" style="padding:10px 20px;font-size:16px;background:#c00;color:#fff">Test NO Range Fetch</button>
<button onclick="testFetch()" style="padding:10px 20px;font-size:16px;margin-left:10px">Test Range Fetch</button>
<button onclick="testDiag()" style="padding:10px 20px;font-size:16px;margin-left:10px;background:#060;color:#fff">Server Diagnostic</button>
<button onclick="loadAndPlay()" style="padding:10px 20px;font-size:16px;margin-left:10px;background:#006;color:#fff">Load &amp; Play</button>
<script>
var video = document.getElementById('v');
var logEl = document.getElementById('log');
function log(msg) { logEl.innerHTML += new Date().toISOString().substr(11,12) + ' ' + msg + '<br>'; logEl.scrollTop = logEl.scrollHeight; console.log(msg); }
var src = '/api/video-stream/5233273_en_US_00_01_empower_VT_1770315104768.mp4';
log('Page loaded. Video src NOT set yet - use buttons to test.');
video.addEventListener('loadstart', function() { log('EVENT: loadstart'); });
video.addEventListener('loadeddata', function() { log('EVENT: loadeddata, readyState=' + video.readyState); });
video.addEventListener('loadedmetadata', function() { log('EVENT: loadedmetadata, duration=' + video.duration + ', readyState=' + video.readyState); });
video.addEventListener('canplay', function() { log('EVENT: canplay, readyState=' + video.readyState); });
video.addEventListener('canplaythrough', function() { log('EVENT: canplaythrough'); });
video.addEventListener('playing', function() { log('EVENT: playing'); });
video.addEventListener('play', function() { log('EVENT: play'); });
video.addEventListener('pause', function() { log('EVENT: pause'); });
video.addEventListener('waiting', function() { log('EVENT: waiting (buffering)'); });
video.addEventListener('stalled', function() { log('EVENT: stalled'); });
video.addEventListener('suspend', function() { log('EVENT: suspend'); });
video.addEventListener('error', function() { var e = video.error; log('EVENT: error code=' + (e?e.code:'?') + ' msg=' + (e?e.message:'?')); });
video.addEventListener('timeupdate', function() { if (Math.floor(video.currentTime) % 5 === 0) log('timeupdate: ' + video.currentTime.toFixed(1) + 's'); });
video.addEventListener('progress', function() { if (video.buffered.length > 0) log('EVENT: progress, buffered=' + video.buffered.end(0).toFixed(0) + 's'); });
function testNoRange() {
  log('--- TEST: Fetch WITHOUT Range header ---');
  fetch(src).then(function(r) {
    log('Response: status=' + r.status + ' statusText=' + r.statusText);
    log('Headers: content-type=' + r.headers.get('content-type') + ' content-length=' + r.headers.get('content-length') + ' accept-ranges=' + r.headers.get('accept-ranges'));
    if (r.status >= 400) {
      return r.text().then(function(t) { log('Error body: ' + t); });
    }
    var reader = r.body.getReader();
    var bytesRead = 0;
    function pump() {
      return reader.read().then(function(result) {
        if (result.done) { log('Stream done, total bytes=' + bytesRead); return; }
        bytesRead += result.value.length;
        if (bytesRead <= 8192) {
          var arr = result.value;
          var hex = Array.from(arr.slice(0,Math.min(8,arr.length))).map(function(b){return b.toString(16).padStart(2,'0')}).join(' ');
          log('Chunk: ' + arr.length + ' bytes, first=' + hex);
        }
        if (bytesRead > 65536) { log('Got 64KB+, aborting read. Total so far=' + bytesRead); reader.cancel(); return; }
        return pump();
      });
    }
    return pump();
  }).catch(function(e) { log('Fetch error: ' + e.name + ': ' + e.message); });
}
function testFetch() {
  log('--- TEST: Fetch WITH Range header (bytes=0-1023) ---');
  fetch(src, { headers: { 'Range': 'bytes=0-1023' } }).then(function(r) {
    log('Response: status=' + r.status + ' type=' + r.headers.get('content-type') + ' range=' + r.headers.get('content-range'));
    return r.arrayBuffer();
  }).then(function(buf) {
    var arr = new Uint8Array(buf);
    var hex = Array.from(arr.slice(0,8)).map(function(b){return b.toString(16).padStart(2,'0')}).join(' ');
    log('First 8 bytes: ' + hex + ' (size=' + buf.byteLength + ')');
    var magic = String.fromCharCode(arr[4],arr[5],arr[6],arr[7]);
    log('MP4 magic: ' + magic + (magic==='ftyp' ? ' VALID' : ' INVALID'));
  }).catch(function(e) { log('Fetch error: ' + e.message); });
}
function testDiag() {
  log('--- SERVER DIAGNOSTIC ---');
  fetch('/api/video-diag/5233273_en_US_00_01_empower_VT_1770315104768.mp4').then(function(r) { return r.json(); }).then(function(d) {
    log('Diagnostic: ' + JSON.stringify(d, null, 2));
  }).catch(function(e) { log('Diag error: ' + e.message); });
}
function loadAndPlay() {
  log('--- SIGNED URL LOAD AND PLAY ---');
  fetch('/api/video-url/5233273_en_US_00_01_empower_VT_1770315104768.mp4').then(function(r) { return r.json(); }).then(function(d) {
    if (d.error) { log('Error: ' + d.error); return; }
    log('Got signed URL: ' + d.url.substring(0, 80) + '...');
    video.src = d.url;
    video.load();
    log('Video src set to signed URL, calling load()');
  }).catch(function(e) { log('Error: ' + e.message); });
}
</script>
</body></html>`);
  });

  app.get("/api/video-diag/:filename(*)", async (req: Request, res: Response) => {
    try {
      const rawFilename = req.params.filename;
      const filename = rawFilename.replace(/\.\./g, '').replace(/^\/+/, '');
      const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
      if (!bucketId) {
        return res.json({ error: "No bucket ID", env: Object.keys(process.env).filter(k => k.includes('OBJECT') || k.includes('BUCKET')) });
      }
      const bucket = objectStorageClient.bucket(bucketId);
      const file = bucket.file(`public/${filename}`);
      const [exists] = await file.exists();
      if (!exists) {
        return res.json({ error: "File not found", path: `public/${filename}`, bucketId });
      }
      const [metadata] = await file.getMetadata();
      const fileSize = parseInt(String(metadata.size || "0"), 10);

      const results: any = { exists: true, fileSize, bucketId, path: `public/${filename}`, metadata: { contentType: metadata.contentType, size: metadata.size, name: metadata.name } };

      try {
        const stream = file.createReadStream({ start: 0, end: Math.min(1023, fileSize - 1) });
        const chunks: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
          stream.on('data', (chunk: Buffer) => chunks.push(chunk));
          stream.on('end', () => resolve());
          stream.on('error', (err) => reject(err));
        });
        const buf = Buffer.concat(chunks);
        results.rangeReadOK = true;
        results.rangeReadSize = buf.length;
        results.firstBytes = Array.from(buf.slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join(' ');
        results.magic = buf.slice(4, 8).toString('ascii');
      } catch (err: any) {
        results.rangeReadOK = false;
        results.rangeReadError = { message: err.message, code: err.code, name: err.name, stack: err.stack?.split('\n').slice(0, 5) };
      }

      try {
        const stream2 = file.createReadStream();
        const chunks2: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
          stream2.on('data', (chunk: Buffer) => {
            chunks2.push(chunk);
            if (Buffer.concat(chunks2).length > 1024) {
              stream2.destroy();
              resolve();
            }
          });
          stream2.on('end', () => resolve());
          stream2.on('error', (err) => reject(err));
        });
        const buf2 = Buffer.concat(chunks2);
        results.fullReadOK = true;
        results.fullReadSize = buf2.length;
      } catch (err: any) {
        results.fullReadOK = false;
        results.fullReadError = { message: err.message, code: err.code, name: err.name, stack: err.stack?.split('\n').slice(0, 5) };
      }

      res.json(results);
    } catch (err: any) {
      res.json({ error: err.message, code: err.code, name: err.name, stack: err.stack?.split('\n').slice(0, 5) });
    }
  });

  app.get("/api/video-url/:filename(*)", async (req: Request, res: Response) => {
    try {
      const rawFilename = req.params.filename;
      const filename = rawFilename.replace(/\.\./g, '').replace(/^\/+/, '');
      if (!filename || filename.includes('\0')) {
        return res.status(400).json({ error: "Invalid filename" });
      }

      const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
      if (!bucketId) {
        return res.status(500).json({ error: "Storage not configured" });
      }

      const bucket = objectStorageClient.bucket(bucketId);
      const file = bucket.file(`public/${filename}`);
      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({ error: "File not found" });
      }

      const signedUrl = await signObjectURL({
        bucketName: bucketId,
        objectName: `public/${filename}`,
        method: "GET",
        ttlSec: 3600,
      });

      res.json({ url: signedUrl });
    } catch (error: any) {
      console.error("video-url: Error generating signed URL:", error);
      res.status(500).json({ error: "Failed to generate video URL" });
    }
  });

  app.get("/api/video-stream/:filename(*)", async (req: Request, res: Response) => {
    try {
      const rawFilename = req.params.filename;
      const filename = rawFilename.replace(/\.\./g, '').replace(/^\/+/, '');
      if (!filename || filename.includes('\0')) {
        return res.status(400).json({ error: "Invalid filename" });
      }

      const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
      if (!bucketId) {
        return res.status(500).json({ error: "Storage not configured" });
      }

      const signedUrl = await signObjectURL({
        bucketName: bucketId,
        objectName: `public/${filename}`,
        method: "GET",
        ttlSec: 3600,
      });

      res.redirect(302, signedUrl);
    } catch (error: any) {
      console.error("video-stream: Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to stream video" });
      }
    }
  });

  app.get("/attached_assets/:filename(*)", async (req: Request, res: Response) => {
    res.redirect(`/api/video-stream/${req.params.filename}`);
  });

  // Health check with environment status
  app.get("/api/health", async (req: Request, res: Response) => {
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    let storageOk = false;
    let storageError = '';
    if (bucketId) {
      try {
        const bucket = objectStorageClient.bucket(bucketId);
        const [files] = await bucket.getFiles({ prefix: 'public/', maxResults: 1 });
        storageOk = files.length > 0;
      } catch (e: any) {
        storageError = e.message || String(e);
      }
    }

    res.json({
      status: "ok",
      env: process.env.NODE_ENV,
      hasAiBaseUrl: !!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      hasAiApiKey: !!process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      hasDatabase: !!process.env.DATABASE_URL,
      hasObjectStorage: !!process.env.PUBLIC_OBJECT_SEARCH_PATHS,
      hasBucketId: !!bucketId,
      storageAccessible: storageOk,
      storageError: storageError || undefined,
    });
  });

  // Get all available badges
  app.get("/api/badges", async (req: Request, res: Response) => {
    try {
      const allBadges = await storage.getAllBadges();
      res.json(allBadges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ error: "Failed to fetch badges" });
    }
  });

  // Get user's earned badges
  app.get("/api/badges/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const userBadges = await storage.getUserBadges(sessionId);
      res.json(userBadges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ error: "Failed to fetch user badges" });
    }
  });

  // Validation schema for badge check
const badgeCheckSchema = z.object({
  sessionId: z.string().min(1),
  moduleId: z.string().min(1),
  score: z.number().int().min(1).max(5),
});

  // Check and award badges based on current progress
  app.post("/api/badges/check", async (req: Request, res: Response) => {
    try {
      const validatedData = badgeCheckSchema.parse(req.body);
      const { sessionId, moduleId, score } = validatedData;
      const newBadges: any[] = [];
      
      // Only award badges for scores of 3 or higher
      if (score < 3) {
        return res.json({ newBadges });
      }
      
      // Get all user's attempts
      const allAttempts = await storage.getAllAttemptsBySession(sessionId);
      const moduleAttempts = allAttempts.filter(a => a.moduleId === moduleId);
      
      // Only count attempts with score >= 3 for badge eligibility
      const qualifyingAttempts = allAttempts.filter(a => a.score >= 3);
      const qualifyingModuleAttempts = moduleAttempts.filter(a => a.score >= 3);
      
      // Badge logic - only for scores 3, 4, or 5
      const badgeChecks = [
        { id: "first_attempt", condition: qualifyingAttempts.length === 1 && score >= 3 },
        { id: "perfect_score", condition: score === 5 },
        { id: "quick_learner", condition: qualifyingModuleAttempts.length === 1 && score >= 4 },
        { id: "persistent", condition: qualifyingModuleAttempts.length >= 3 },
        { id: "three_modules", condition: new Set(qualifyingAttempts.map(a => a.moduleId)).size >= 3 },
        { id: "score_improver", condition: qualifyingModuleAttempts.length >= 2 && score > (qualifyingModuleAttempts[qualifyingModuleAttempts.length - 2]?.score || 0) },
        { id: "high_achiever", condition: qualifyingAttempts.filter(a => a.score >= 4).length >= 5 },
        { id: "master_learner", condition: qualifyingAttempts.filter(a => a.score === 5).length >= 3 },
      ];
      
      for (const check of badgeChecks) {
        if (check.condition) {
          const hasIt = await storage.hasUserBadge(sessionId, check.id);
          if (!hasIt) {
            try {
              const awarded = await storage.awardBadge({ sessionId, badgeId: check.id, moduleId });
              const badge = await storage.getBadge(check.id);
              if (badge) {
                newBadges.push({ ...awarded, badge });
              }
            } catch (e) {
              // Badge might not exist in DB yet, skip
            }
          }
        }
      }
      
      res.json({ newBadges });
    } catch (error) {
      console.error("Error checking badges:", error);
      res.status(500).json({ error: "Failed to check badges" });
    }
  });

  // Seed default badges (called once on startup or manually)
  app.post("/api/badges/seed", async (req: Request, res: Response) => {
    try {
      const defaultBadges = [
        { id: "first_attempt", name: "First Steps", description: "Completed your first skill builder attempt", icon: "Rocket", color: "blue", category: "milestone", requirement: "Complete 1 attempt", points: 10 },
        { id: "perfect_score", name: "Perfect Score", description: "Achieved a score of 5 on a skill builder", icon: "Star", color: "gold", category: "mastery", requirement: "Score 5 on any module", points: 50 },
        { id: "quick_learner", name: "Quick Learner", description: "Scored 4+ on first attempt", icon: "Zap", color: "purple", category: "challenge", requirement: "Score 4+ on first try", points: 30 },
        { id: "persistent", name: "Persistence Pays", description: "Made 3 or more attempts on a module", icon: "Target", color: "green", category: "milestone", requirement: "Make 3+ attempts on one module", points: 20 },
        { id: "three_modules", name: "Explorer", description: "Attempted 3 different skill builders", icon: "Map", color: "teal", category: "milestone", requirement: "Try 3 different modules", points: 25 },
        { id: "score_improver", name: "Growth Mindset", description: "Improved your score on a retry", icon: "TrendingUp", color: "orange", category: "challenge", requirement: "Beat your previous score", points: 15 },
        { id: "high_achiever", name: "High Achiever", description: "Earned 5 scores of 4 or higher", icon: "Award", color: "red", category: "mastery", requirement: "Get 5 high scores", points: 40 },
        { id: "master_learner", name: "Master Learner", description: "Achieved 3 perfect scores", icon: "Crown", color: "amber", category: "mastery", requirement: "Get 3 perfect scores", points: 100 },
      ];
      
      for (const badge of defaultBadges) {
        const existing = await storage.getBadge(badge.id);
        if (!existing) {
          await storage.createBadge(badge);
        }
      }
      
      res.json({ success: true, message: "Badges seeded" });
    } catch (error) {
      console.error("Error seeding badges:", error);
      res.status(500).json({ error: "Failed to seed badges" });
    }
  });

  // Get previous attempts for a module
  app.get("/api/attempts/session/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const allAttempts = await storage.getAllAttemptsBySession(sessionId);
      
      const bestScores: Record<string, { score: number; userResponse: string; feedback: string; partScores?: Record<number, number> }> = {};
      const partBests: Record<string, Record<number, number>> = {};
      
      for (const attempt of allAttempts) {
        const existing = bestScores[attempt.moduleId];
        if (!existing || attempt.score > existing.score) {
          bestScores[attempt.moduleId] = {
            score: attempt.score,
            userResponse: attempt.userResponse,
            feedback: attempt.feedback
          };
        }
        
        const partNum = attempt.partNumber || 1;
        if (!partBests[attempt.moduleId]) {
          partBests[attempt.moduleId] = {};
        }
        if (!partBests[attempt.moduleId][partNum] || attempt.score > partBests[attempt.moduleId][partNum]) {
          partBests[attempt.moduleId][partNum] = attempt.score;
        }
      }
      
      for (const moduleId of Object.keys(bestScores)) {
        const parts = partBests[moduleId];
        if (parts && Object.keys(parts).length > 1) {
          bestScores[moduleId].partScores = parts;
        }
      }
      
      res.json(bestScores);
    } catch (error) {
      console.error("Error fetching session attempts:", error);
      res.status(500).json({ error: "Failed to fetch session attempts" });
    }
  });

  app.get("/api/attempts/:sessionId/:moduleId", async (req: Request, res: Response) => {
    try {
      const { sessionId, moduleId } = req.params;
      const attempts = await storage.getAttemptsBySession(sessionId, moduleId);
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching attempts:", error);
      res.status(500).json({ error: "Failed to fetch attempts" });
    }
  });

  // Submit a response and get AI-powered feedback
  app.post("/api/submit-response", async (req: Request, res: Response) => {
    try {
      const validatedData = submitResponseSchema.parse(req.body);
      const { sessionId, moduleId, attemptNumber, partNumber, userResponse, allResponses, prompt, idealAnswer, scoringCriteria, socraticMode, aiHelpfulness } = validatedData;

      // Fetch previous attempts for this module/part to detect potential backsliding
      const previousAttempts = await storage.getAttemptsBySession(sessionId, moduleId);
      const previousPartAttempts = previousAttempts.filter(a => a.partNumber === partNumber);
      const bestPreviousScore = previousPartAttempts.length > 0 
        ? Math.max(...previousPartAttempts.map(a => a.score))
        : 0;
      const bestPreviousAttempt = previousPartAttempts.find(a => a.score === bestPreviousScore);

      let systemPrompt: string;

      const isQuestionOnly = userResponse.startsWith('[QUESTION ABOUT TASK]');
      const hasLearnerNote = userResponse.includes('[LEARNER NOTE:');

      if (isQuestionOnly) {
        const questionText = userResponse.replace('[QUESTION ABOUT TASK]: ', '');
        systemPrompt = `You are a supportive AI tutor helping a learner with an Excel exercise. The learner hasn't uploaded a file yet — they're asking for guidance on how to approach the task.

The exercise they're working on:
${prompt}

The ideal solution covers:
${idealAnswer}

The learner's question:
"${questionText}"

INSTRUCTIONS:
- Answer their specific question with clear, practical guidance
- Reference the actual exercise context (column names, function names, data in the file)
- Give enough detail to unblock them without doing the entire exercise for them
- If they mention a specific concept they're struggling with, explain it with a concrete example from this exercise
- Be encouraging — they're actively trying to learn

Return your response as JSON:
{
  "score_reasoning": "Question-only submission — no file to score",
  "score": 0,
  "feedback": "",
  "strengths": ["<acknowledge their specific question or effort>"],
  "improvements": ["<practical guidance addressing their question>", "<next step or tip>"]
}

IMPORTANT: Set score to 0 (zero) since no file was submitted for evaluation. This is purely a help response.`;
      } else if (socraticMode) {
        // Socratic conversation mode - more conversational, encouraging continued dialogue
        let currentResponseText = `\n\nThe learner's current response:\n${userResponse}`;
        if (hasLearnerNote) {
          const noteMatch = userResponse.match(/\[LEARNER NOTE: (.+?)\]/);
          if (noteMatch) {
            currentResponseText += `\n\nThe learner also added this note about their work: "${noteMatch[1]}"
IMPORTANT: Address the learner's note in your feedback. If they're asking about a specific concept or expressing confusion, include targeted guidance in your "improvements" array.`;
          }
        }
        
        // Build backslide context if there are previous higher-scoring responses
        let backslideContext = '';
        if (bestPreviousScore > 0 && bestPreviousAttempt) {
          backslideContext = `\n\nBACKSLIDE PREVENTION CONTEXT:
The learner's best previous score for this question was ${bestPreviousScore}/5. Their best previous response was:
"${bestPreviousAttempt.userResponse}"

IMPORTANT: Score the current response on its own merits. However, if the current response scores LOWER than ${bestPreviousScore}, check what valuable content from the previous response was removed or lost. In your "improvements" feedback, gently point out the specific content that was previously included but is now missing, and encourage the learner to incorporate it back. Frame this constructively, e.g., "Your earlier response included [specific point] which strengthened your answer — consider adding that back." The goal is to help the learner keep moving forward without backsliding.`;
        }

        // AI Helpfulness rubric (1-10 scale) - affects balance of Socratic questions vs direct hints
        const helpfulnessGuidance = aiHelpfulness <= 3 
          ? `HELPFULNESS LEVEL: ${aiHelpfulness}/10 (Pure Socratic)
In the "improvements" array, lead with 2-3 open-ended Socratic questions that guide thinking. Do NOT reveal what's missing. Example questions: "What other roles at the hospital might impact scheduling?" or "Who else would need to be consulted?" Follow with at most 1 vague action statement.`
          : aiHelpfulness <= 6
          ? `HELPFULNESS LEVEL: ${aiHelpfulness}/10 (Balanced Guidance)
In the "improvements" array, include 1-2 Socratic questions first, then 1-2 action statements with subtle hints. Example question: "Consider who manages the physical spaces..." Example action: "Think about roles that handle logistics and coordination."`
          : `HELPFULNESS LEVEL: ${aiHelpfulness}/10 (Direct Help)
In the "improvements" array, skip Socratic questions entirely. Provide 2-3 direct, actionable recommendations about what's missing. Example: "Consider adding the Facilities Manager who handles room bookings." or "Don't forget the nursing staff leadership." Be specific and helpful.`;

        systemPrompt = `You are a supportive AI tutor evaluating a learner's response about project management.

The learner is working on this question:
${prompt}

The ideal answer covers these key points:
${idealAnswer}
${currentResponseText}

CRITICAL SCORING INSTRUCTION: Score based ONLY on the learner's CURRENT response above. Evaluate what the learner has written in this submission as a standalone answer.
${backslideContext}

SCORING PRIORITY: If the scoring criteria below includes a SCORING DECISION TREE, you MUST follow it strictly. The decision tree overrides any subjective quality judgment. Apply the tree step-by-step and assign the score it determines.

${scoringCriteria || `SCORING CRITERIA:
- 5 (Expert): Comprehensive coverage of all key points.
- 4 (Proficient): Covers most key points with good reasoning.
- 3 (Competent): Covers some key points with reasoning.
- 2 (Basic): Shows basic understanding with few specifics.
- 1 (Novice): Missing most key points or off-topic.`}

HANDLING NONSENSICAL OR HUMOROUS RESPONSES:
If the response is gibberish, doesn't make sense, or is completely unrelated:
- Give score 1
- If you detect humor or a joke in their response, respond with a touch of playful humor yourself before redirecting (e.g., "Ha! I appreciate the creativity, but let's channel that energy into the scenario...")
- If no humor detected, give neutral feedback (e.g., "This response doesn't quite connect to the scenario yet.")
- Still find something positive for strengths (e.g., "You've taken the time to engage with this exercise.")
- In improvements, gently redirect them back to the question (e.g., "Consider what specific stakeholders might be involved in this project...")

${helpfulnessGuidance}

FRUSTRATION/STUCK DETECTION: If this is attempt ${attemptNumber} and the learner seems stuck, frustrated, or asking for help directly, OVERRIDE the helpfulness level and provide more direct hints in improvements.

SCORE DETERMINATION (do this FIRST before writing feedback):
If a SCORING DECISION TREE is provided above, walk through it step-by-step now. Count the relevant items in the combined responses, check for errors, and determine the score. The score is LOCKED once determined by the tree—do not adjust it based on what you write in improvements.

OUTPUT FORMAT - "What you did well:" section appears FIRST. Only provide structured feedback:

1. "strengths" array: This section must be PURELY POSITIVE. Lean towards providing only 1 bullet point most of the time. Only add a 2nd bullet when the response truly merits it with multiple distinct, specific strengths.
   - For GOOD responses: Praise their specific understanding (e.g., "You've correctly identified key stakeholders and their roles.")
   - For WEAK responses: Find one genuine kernel of effort or partial understanding (e.g., "You're thinking about this from a practical perspective.")
   - NEVER use generic filler like "You've engaged with the scenario" or "You've taken the time to respond" - these waste a bullet. Find something specific or just use 1 bullet.
   - NEVER include negative observations like "This needs more detail" or "I'm not sure I follow" in strengths. Those belong in improvements.

2. "improvements" array: This is where constructive observations go. ORDER MATTERS - always structure feedback in this order:
   - FIRST: Call out any erroneous or incorrect ideas with DIRECT, CLEAR statements about why they don't fit. Do NOT use vague Socratic phrasing like "It's worth revisiting..." or "How likely is...?" Instead, be direct: "The CEO wouldn't typically be involved in day-to-day scheduling decisions for procedure rooms." or "Testing is actually a core project activity, not an operational task—it belongs in the WBS."
   - SECOND: Note what's missing from the response, what directions to explore, what could be added (e.g., "Consider what specific stakeholders might be involved." or "The response would benefit from addressing...")
   - Use the HELPFULNESS LEVEL for the "what's missing" portion, but ALWAYS be direct about errors regardless of helpfulness level.

3. "feedback" field: Leave this as an empty string "" - we are not using the opening paragraph.

Return your feedback as JSON:
{
  "score_reasoning": "<If a SCORING DECISION TREE exists: walk through each step and state the result. Example: 'Step 1: DETECT+PROTECT+GOVERN present? YES. Step 2: Uncorrected errors? NO. Step 3: Score Level 4.' Otherwise: brief justification for score.>",
  "score": <number 1-5>,
  "feedback": "",
  "strengths": ["<one specific, genuine positive>"],
  "improvements": ["<what's missing or could be added>", "<Socratic question or recommendation>"]
}

Keep strengths purely positive; save constructive observations for improvements. This is attempt ${attemptNumber}.`;
      } else {
        // Original direct feedback mode
        systemPrompt = `You are an AI tutor providing feedback on a learner's response to a project management question.

The learner was asked:
${prompt}

The ideal answer includes these key points:
${idealAnswer}

The learner's response:
${userResponse}

Provide brief, direct feedback (max 120 words) that:
1. Praises what they got right (if anything)
2. Points out what's missing or incorrect in a helpful, non-judgmental way
3. Assigns a skill level score (1-5) reflecting mastery

Scoring guidelines:
- 1 (Novice): Beginning understanding, requires significant development. Completely off-topic or misses nearly all key points.
- 2 (Basic): Foundational knowledge, needs more practice. Shows some awareness but misses important details.
- 3 (Competent): Working knowledge, can apply skills in standard situations. Covers most key points with minor gaps.
- 4 (Proficient): Strong understanding, can handle complex scenarios. Nearly complete answer with depth.
- 5 (Expert): Mastery level, deep expertise. Perfect answer covering all key concepts comprehensively.

Return your feedback as JSON with this exact structure:
{
  "score": <number between 1-5>,
  "feedback": "<your feedback message>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}

Be encouraging but honest. If the response is completely off-topic or useless, give a score of 1 (Novice). If this is attempt ${attemptNumber}, acknowledge their progress if they're improving.`;
      }

      const userMessageContent = userResponse;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessageContent }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.2,
      });

      const feedbackText = completion.choices[0]?.message?.content || "{}";
      let feedback: any;
      try {
        feedback = JSON.parse(feedbackText);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", feedbackText.substring(0, 200));
        feedback = { score: 3, feedback: "Your response has been received. Please try again for more detailed feedback.", strengths: ["You engaged with the exercise."], improvements: ["Try submitting again for AI-powered feedback."] };
      }

      const rawScore = feedback.score ?? 3;
      const score = isQuestionOnly ? 0 : Math.max(1, Math.min(5, rawScore));
      const message = feedback.feedback || feedback.message || "";
      const strengths = Array.isArray(feedback.strengths) ? feedback.strengths : [];
      const improvements = Array.isArray(feedback.improvements) ? feedback.improvements : [];

      if (isQuestionOnly) {
        res.json({
          id: 0,
          sessionId,
          moduleId,
          attemptNumber,
          partNumber,
          userResponse,
          score: 0,
          feedback: message,
          strengths,
          improvements,
        });
      } else {
        const attempt = await storage.createAttempt({
          sessionId,
          moduleId,
          attemptNumber,
          partNumber,
          userResponse,
          score,
          feedback: message,
          strengths,
          improvements,
        });
        res.json(attempt);
      }
    } catch (error) {
      console.error("Error processing response:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      
      // Log more details for debugging
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Full error details:", errorMessage);
      console.error("AI Base URL configured:", !!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL);
      
      res.status(500).json({ 
        error: "Failed to process response",
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  });

  // Finalize response - correct spelling errors
  app.post("/api/finalize-response", async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: "Text is required" });
      }

      const systemPrompt = `You are a proofreader. Your job is to:
1. Correct spelling and grammar errors
2. For longer responses (more than 3-4 sentences), add paragraph breaks where it semantically makes sense to improve readability

Text to correct:
${text}

Return your response as JSON:
{
  "correctedText": "<the text with corrections and paragraph breaks where appropriate>"
}

Important: Do NOT add, remove, or rephrase any content. Only fix spelling/grammar and add paragraph breaks for longer texts.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Please correct the spelling and grammar." }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(responseText);

      res.json({ correctedText: parsed.correctedText || text });
    } catch (error) {
      console.error("Error finalizing response:", error);
      res.status(500).json({ error: "Failed to finalize response", correctedText: req.body.text });
    }
  });

  // Summarize all user responses into a coherent final answer
  app.post("/api/summarize-response", async (req: Request, res: Response) => {
    try {
      const validatedData = summarizeResponseSchema.parse(req.body);
      const { userResponses, idealAnswer } = validatedData;

      const systemPrompt = `You are a helpful assistant that combines and polishes a learner's responses into one coherent, well-written answer.

The learner provided these responses during a Socratic dialogue:
${userResponses.map((r, i) => `Response ${i+1}: ${r}`).join('\n\n')}

The ideal answer for reference (do NOT copy this, use the learner's own language):
${idealAnswer}

Create a single, cohesive summary that:
1. Preserves the learner's original language and ideas as much as possible
2. Combines insights from all their responses
3. Fixes any spelling or grammar issues
4. Organizes the content logically
5. Does NOT add new information they didn't mention

Return your response as JSON:
{
  "summary": "<the combined, polished response in the learner's voice>"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Please summarize my responses." }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });

      const responseText = completion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(responseText);

      res.json({ summary: parsed.summary || userResponses.join('\n\n') });
    } catch (error) {
      console.error("Error summarizing response:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      
      res.status(500).json({ error: "Failed to summarize response" });
    }
  });

  // Get all videos
  app.get("/api/videos", async (req: Request, res: Response) => {
    try {
      const allVideos = await storage.getAllVideos();

      if (process.env.NODE_ENV === "production") {
        const videosWithProxyUrls = allVideos.map((video) => {
          if (!video.videoUrl) return video;
          const filename = extractFilename(video.videoUrl);
          if (!filename) return video;
          return { ...video, videoUrl: `/api/video-stream/${filename}` };
        });
        return res.json(videosWithProxyUrls);
      }

      res.json(allVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Get video by title
  app.get("/api/videos/by-title/:title", async (req: Request, res: Response) => {
    try {
      const { title } = req.params;
      const video = await storage.getVideoByTitle(decodeURIComponent(title));
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      if (process.env.NODE_ENV === "production" && video.videoUrl) {
        const filename = extractFilename(video.videoUrl);
        if (filename) {
          return res.json({ ...video, videoUrl: `/api/video-stream/${filename}` });
        }
      }

      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  // Get video by ID
  app.get("/api/videos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideoById(id);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      if (process.env.NODE_ENV === "production" && video.videoUrl) {
        const filename = extractFilename(video.videoUrl);
        if (filename) {
          return res.json({ ...video, videoUrl: `/api/video-stream/${filename}` });
        }
      }

      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  // Update video URL
  app.patch("/api/videos/:id/url", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { videoUrl } = req.body;
      if (!videoUrl) {
        return res.status(400).json({ error: "videoUrl is required" });
      }
      const updated = await storage.updateVideoUrl(id, videoUrl);
      if (!updated) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating video URL:", error);
      res.status(500).json({ error: "Failed to update video URL" });
    }
  });

  app.post("/api/upload-xlsx", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const allowedMimes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      const ext = req.file.originalname.toLowerCase();
      if (!allowedMimes.includes(req.file.mimetype) && !ext.endsWith('.xlsx') && !ext.endsWith('.xls')) {
        return res.status(400).json({ error: "Only Excel files (.xlsx, .xls) are accepted." });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer", cellFormula: true, cellStyles: false });
      const sheets: Record<string, any> = {};

      const sheetNames = workbook.SheetNames.slice(0, 10);
      for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        const formulaData: Record<string, string> = {};
        const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

        for (let r = range.s.r; r <= range.e.r; r++) {
          for (let c = range.s.c; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = sheet[addr];
            if (cell && cell.f) {
              formulaData[addr] = "=" + cell.f;
            }
          }
        }

        sheets[sheetName] = {
          data: jsonData.slice(0, 100),
          formulas: formulaData,
          rowCount: jsonData.length,
        };
      }

      let extractedText = `FILE: ${req.file.originalname}\n`;
      for (const [sheetName, sheetInfo] of Object.entries(sheets) as [string, any][]) {
        extractedText += `\n--- Sheet: ${sheetName} (${sheetInfo.rowCount} rows) ---\n`;

        if (sheetInfo.data.length > 0) {
          const headers = sheetInfo.data[0] as string[];
          extractedText += `Headers: ${headers.join(" | ")}\n`;
          const dataRows = sheetInfo.data.slice(1, 20);
          for (let i = 0; i < dataRows.length; i++) {
            extractedText += `Row ${i + 1}: ${(dataRows[i] as string[]).join(" | ")}\n`;
          }
          if (sheetInfo.rowCount > 21) {
            extractedText += `... (${sheetInfo.rowCount - 21} more rows)\n`;
          }
        }

        const formulaEntries = Object.entries(sheetInfo.formulas);
        if (formulaEntries.length > 0) {
          extractedText += `\nFormulas found:\n`;
          for (const [cell, formula] of formulaEntries) {
            extractedText += `  ${cell}: ${formula}\n`;
          }
        }
      }

      res.json({
        fileName: req.file.originalname,
        extractedText,
        sheets,
      });
    } catch (error) {
      console.error("Error parsing xlsx:", error);
      res.status(500).json({ error: "Failed to parse the uploaded file. Please make sure it's a valid Excel file." });
    }
  });

  return httpServer;
}
