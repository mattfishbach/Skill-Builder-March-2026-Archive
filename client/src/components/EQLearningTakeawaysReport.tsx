import { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MODULE_CONFIGS } from './SkillBuilderInline';
import headshotUrl from '@assets/image_1771025533039.png';

interface BestScoreData {
  score: number;
  userResponse: string;
  feedback: string;
  partScores?: Record<number, number>;
}

interface EQLearningTakeawaysReportProps {
  sessionId?: string;
  bestScores: Record<string, BestScoreData>;
  demoBestScores: Record<string, BestScoreData>;
  completedCount: number;
  totalModules: number;
  userName?: string;
}

interface ChapterContent {
  title: string;
  keyConcepts: string[];
  glossary: { term: string; definition: string }[];
  skillBuilderIds: string[];
}

const EQ_CHAPTER_CONTENT: ChapterContent[] = [
  {
    title: "Chapter 1: Getting Started with Emotional Intelligence",
    keyConcepts: [
      "Emotional intelligence (EQ) is the ability to recognize, understand, manage, and effectively use emotions\u2014both your own and others'\u2014in everyday interactions.",
      "Unlike IQ, emotional intelligence is not fixed\u2014it's a set of skills that can be developed and strengthened with practice and self-reflection.",
      "The four pillars of EQ\u2014self-awareness, self-management, social awareness, and relationship management\u2014build on each other in a developmental progression."
    ],
    glossary: [
      { term: "Emotional Intelligence (EQ)", definition: "The capacity to be aware of, control, and express one\u2019s emotions, and to handle interpersonal relationships judiciously and empathetically." },
      { term: "Self-Awareness", definition: "The ability to recognize and understand your own emotions, strengths, weaknesses, values, and impact on others." },
      { term: "Amygdala Hijack", definition: "When the emotional brain overrides rational thinking, causing an immediate, disproportionate emotional reaction." }
    ],
    skillBuilderIds: ["eq_emotional_chain", "eq_ch1_wrapup"]
  },
  {
    title: "Chapter 2: Building Self-Awareness",
    keyConcepts: [
      "Emotional triggers are specific situations, words, or behaviors that provoke strong automatic reactions\u2014identifying yours is the first step to managing them.",
      "The gap between stimulus and response is where emotional intelligence lives\u2014the more self-aware you are, the wider that gap becomes.",
      "Self-awareness isn\u2019t about eliminating emotions\u2014it\u2019s about understanding them well enough to choose how you respond rather than simply reacting."
    ],
    glossary: [
      { term: "Emotional Trigger", definition: "A specific stimulus (situation, word, behavior) that provokes an automatic emotional reaction, often rooted in past experiences." },
      { term: "Trigger Tracker", definition: "A reflective tool for documenting emotional triggers, physical responses, and patterns to build self-awareness." },
      { term: "Stimulus-Response Gap", definition: "The moment between experiencing an emotion and acting on it\u2014where conscious choice becomes possible." },
      { term: "Emotional Patterns", definition: "Recurring emotional reactions to similar situations that reveal underlying beliefs, values, or unresolved experiences." }
    ],
    skillBuilderIds: ["eq_cognitive_hijack", "eq_self_awareness_wrapup"]
  },
  {
    title: "Chapter 3: Mastering Self-Management",
    keyConcepts: [
      "Self-management is not about suppressing emotions\u2014it\u2019s about channeling them productively and choosing your response rather than being controlled by reactions.",
      "The ABCDE model (Activating event \u2192 Belief \u2192 Consequence \u2192 Dispute \u2192 new Effect) is a powerful technique for reframing unhelpful thought patterns.",
      "Building a personal toolkit of self-management strategies\u2014pause techniques, cognitive reframing, stress regulation\u2014allows you to stay effective under pressure."
    ],
    glossary: [
      { term: "Self-Management", definition: "The ability to regulate your emotions, thoughts, and behaviors effectively in different situations." },
      { term: "ABCDE Model", definition: "A cognitive restructuring technique: Activating event, Belief, Consequence, Dispute the belief, new Effect." },
      { term: "Cognitive Reframing", definition: "Changing the way you interpret a situation to alter your emotional response to it." },
      { term: "Pause Technique", definition: "Deliberately creating space between a trigger and your response\u2014even 60 seconds can shift your reaction from reactive to intentional." },
      { term: "Emotional Regulation", definition: "The ability to manage and modify your emotional reactions to maintain balance and effectiveness." }
    ],
    skillBuilderIds: ["eq_stress_response_review", "eq_abcde_model"]
  },
  {
    title: "Chapter 4: Developing Social Awareness",
    keyConcepts: [
      "Social awareness is the ability to accurately read the emotions, needs, and concerns of others\u2014it requires genuine curiosity and attention beyond words.",
      "Empathy has three dimensions: cognitive (understanding perspectives), emotional (feeling with others), and compassionate (being moved to help)\u2014effective leaders use all three.",
      "Reading the room means picking up on unspoken dynamics\u2014body language, tone, energy shifts, and group mood\u2014information that\u2019s invisible if you\u2019re only focused on content."
    ],
    glossary: [
      { term: "Social Awareness", definition: "The ability to understand and empathize with others, picking up on emotional cues and group dynamics." },
      { term: "Cognitive Empathy", definition: "Understanding another person\u2019s perspective or mental state intellectually, without necessarily feeling their emotions." },
      { term: "Emotional Empathy", definition: "Physically feeling what another person feels\u2014sharing their emotional experience." },
      { term: "Compassionate Empathy", definition: "Going beyond understanding and feeling to being moved to take helpful action." },
      { term: "Tentative Language", definition: "Phrasing observations as possibilities rather than certainties (e.g., \u201cIt seems like...\u201d vs \u201cYou are...\u201d) to create psychological safety." }
    ],
    skillBuilderIds: ["eq_social_awareness_wrapup", "eq_empathy_mistakes"]
  },
  {
    title: "Chapter 5: Managing Relationships",
    keyConcepts: [
      "Relationship management brings together all EQ skills\u2014you need self-awareness, self-management, and social awareness as foundations before you can effectively manage relationships.",
      "The gap between intent and impact is where most relationship friction lives\u2014understanding this gap helps you give feedback, resolve conflicts, and build trust.",
      "The Review/Refine/Repeat process creates a continuous improvement loop for relationships\u2014seek feedback, make small adjustments, and iterate."
    ],
    glossary: [
      { term: "Relationship Management", definition: "The ability to develop and maintain good relationships, communicate clearly, inspire and influence others, and manage conflict." },
      { term: "Intent vs Impact", definition: "The difference between what you meant to communicate (intent) and how it was actually received (impact)\u2014a common source of interpersonal friction." },
      { term: "Review/Refine/Repeat", definition: "A continuous improvement process for relationships\u2014regularly seek feedback, make targeted adjustments, and iterate." },
      { term: "Psychological Safety", definition: "An environment where people feel safe to take interpersonal risks, share ideas, and make mistakes without fear of punishment." },
      { term: "Active Listening", definition: "Fully concentrating on, understanding, and responding to a speaker\u2014going beyond hearing words to understanding meaning and emotion." }
    ],
    skillBuilderIds: ["eq_feedback_loop"]
  },
  {
    title: "Conclusion: Capstone",
    keyConcepts: [
      "Emotional intelligence is a practice, not a destination\u2014the most emotionally intelligent people are those who continuously reflect, adapt, and grow.",
      "The capstone brings together all four EQ pillars to address real leadership challenges, demonstrating that EQ skills are interconnected and mutually reinforcing."
    ],
    glossary: [
      { term: "Capstone Assessment", definition: "A comprehensive exercise that applies all four EQ pillars to real-world team leadership scenarios." },
      { term: "EQ Integration", definition: "The ability to fluidly combine self-awareness, self-management, social awareness, and relationship management in complex interpersonal situations." },
      { term: "Reflective Practice", definition: "The habit of regularly examining your emotional responses, interactions, and outcomes to extract lessons and improve." }
    ],
    skillBuilderIds: ["eq_capstone"]
  }
];

const SKILL_LEVEL_LABELS: Record<number, string> = {
  1: 'Novice',
  2: 'Basic',
  3: 'Competent',
  4: 'Proficient',
  5: 'Expert'
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function getSkillBuilderQuestion(moduleId: string): string {
  const config = MODULE_CONFIGS[moduleId];
  if (!config) return '';
  return stripHtml(config.initialQuestion);
}

function getSkillBuilderTitle(moduleId: string): string {
  const titles: Record<string, string> = {
    eq_emotional_chain: "Emotional Chain",
    eq_ch1_wrapup: "EQ Foundations Wrap-Up",
    eq_cognitive_hijack: "Cognitive Hijack",
    eq_self_awareness_wrapup: "Self-Awareness Wrap-Up",
    eq_stress_response_review: "Stress Response Review",
    eq_abcde_model: "ABCDE Reframing",
    eq_social_awareness_wrapup: "Social Awareness Wrap-Up",
    eq_empathy_mistakes: "Empathy Mistakes",
    eq_feedback_loop: "Feedback Loop",
    eq_capstone: "Course Capstone"
  };
  return titles[moduleId] || moduleId;
}

function generateReportHTML(bestScores: Record<string, BestScoreData>, userName: string, headshotDataUrl?: string): string {
  const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let chaptersHTML = '';
  for (const chapter of EQ_CHAPTER_CONTENT) {
    const conceptsHTML = chapter.keyConcepts.map(c => `<li>${c}</li>`).join('\n');

    const glossaryRows = chapter.glossary.map(g =>
      `<tr><td class="term">${g.term}</td><td class="def">${g.definition}</td></tr>`
    ).join('\n');

    let skillBuildersHTML = '';
    for (const sbId of chapter.skillBuilderIds) {
      const scoreData = bestScores[sbId];
      const question = getSkillBuilderQuestion(sbId);
      const title = getSkillBuilderTitle(sbId);

      if (scoreData) {
        const scoreLabel = SKILL_LEVEL_LABELS[scoreData.score] || '';
        const scoreBarWidth = (scoreData.score / 5) * 100;
        const scoreColor = scoreData.score >= 4 ? '#057642' : scoreData.score >= 3 ? '#0a66c2' : '#b45309';
        skillBuildersHTML += `
          <div class="sb-card">
            <div class="sb-header">
              <span class="sb-title">${title}</span>
              <span class="sb-score" style="color: ${scoreColor}">Score: ${scoreData.score}/5 (${scoreLabel})</span>
            </div>
            <div class="sb-score-bar-bg"><div class="sb-score-bar" style="width: ${scoreBarWidth}%; background: ${scoreColor}"></div></div>
            <div class="sb-section">
              <div class="sb-label">Scenario / Question</div>
              <div class="sb-question">${question}</div>
            </div>
            <div class="sb-section">
              <div class="sb-label">Your Response</div>
              <div class="sb-response">${scoreData.userResponse || '<em>No response recorded</em>'}</div>
            </div>
          </div>`;
      } else {
        skillBuildersHTML += `
          <div class="sb-card sb-incomplete">
            <div class="sb-header">
              <span class="sb-title">${title}</span>
              <span class="sb-score" style="color: #9ca3af">Not completed</span>
            </div>
            <div class="sb-section">
              <div class="sb-label">Scenario / Question</div>
              <div class="sb-question">${question}</div>
            </div>
            <div class="sb-section">
              <div class="sb-label">Your Response</div>
              <div class="sb-response" style="color: #9ca3af; font-style: italic;">This activity has not been completed yet.</div>
            </div>
          </div>`;
      }
    }

    chaptersHTML += `
      <div class="chapter">
        <h2>${chapter.title}</h2>
        <div class="section">
          <h3>Key Concepts</h3>
          <ul class="concepts">${conceptsHTML}</ul>
        </div>
        <div class="section">
          <h3>Micro-Glossary</h3>
          <table class="glossary">
            <thead><tr><th>Term</th><th>Definition</th></tr></thead>
            <tbody>${glossaryRows}</tbody>
          </table>
        </div>
        <div class="section">
          <h3>Skill Builder Results</h3>
          ${skillBuildersHTML}
        </div>
      </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Learning Takeaways Report \u2013 Developing Your Emotional Intelligence</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1a1a2e;
      background: #f8fafc;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .page {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      min-height: 100vh;
    }
    .cover {
      background: linear-gradient(135deg, #0a66c2 0%, #004182 60%, #002855 100%);
      color: white;
      padding: 48px 40px 40px;
      position: relative;
      overflow: hidden;
    }
    .cover::before {
      content: '';
      position: absolute;
      top: -60px;
      right: -60px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: rgba(255,255,255,0.06);
    }
    .cover::after {
      content: '';
      position: absolute;
      bottom: -40px;
      left: -40px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .cover .badge {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .cover h1 {
      font-size: 28px;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 6px;
    }
    .cover .subtitle {
      font-size: 16px;
      font-weight: 400;
      opacity: 0.85;
      margin-bottom: 24px;
    }
    .cover .learner-info {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 4px;
    }
    .cover .headshot {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.4);
      object-fit: cover;
    }
    .cover .learner-name {
      font-size: 15px;
      font-weight: 500;
    }
    .cover .meta {
      display: flex;
      gap: 24px;
      font-size: 13px;
      opacity: 0.75;
    }
    .cover .meta span { display: flex; align-items: center; gap: 6px; }
    .content { padding: 32px 40px 60px; }
    .chapter {
      margin-bottom: 36px;
      page-break-inside: avoid;
    }
    .chapter h2 {
      font-size: 18px;
      font-weight: 700;
      color: #0a66c2;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 16px;
    }
    .section { margin-bottom: 20px; }
    .section h3 {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      margin-bottom: 8px;
    }
    ul.concepts {
      list-style: none;
      padding: 0;
    }
    ul.concepts li {
      position: relative;
      padding: 6px 0 6px 20px;
      font-size: 14px;
      color: #334155;
      line-height: 1.5;
    }
    ul.concepts li::before {
      content: '\u25B8';
      position: absolute;
      left: 0;
      color: #0a66c2;
      font-weight: bold;
      font-size: 14px;
    }
    table.glossary {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    table.glossary th {
      text-align: left;
      font-weight: 600;
      color: #475569;
      padding: 5px 8px;
      border-bottom: 2px solid #e2e8f0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table.glossary td {
      padding: 4px 8px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
      line-height: 1.4;
    }
    table.glossary td.term {
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      width: 140px;
    }
    table.glossary td.def { color: #475569; }
    table.glossary tr:last-child td { border-bottom: none; }
    .sb-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 12px;
      background: #fafbfc;
    }
    .sb-card.sb-incomplete { opacity: 0.6; }
    .sb-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .sb-title {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }
    .sb-score {
      font-size: 13px;
      font-weight: 600;
    }
    .sb-score-bar-bg {
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      margin-bottom: 12px;
      overflow: hidden;
    }
    .sb-score-bar {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s;
    }
    .sb-section { margin-bottom: 10px; }
    .sb-section:last-child { margin-bottom: 0; }
    .sb-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .sb-question {
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 12px;
    }
    .sb-response {
      font-size: 13px;
      color: #1e293b;
      line-height: 1.5;
      background: #f0f7ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      padding: 10px 12px;
      white-space: pre-wrap;
    }
    .footer {
      text-align: center;
      padding: 20px 40px 32px;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
    @media print {
      body { background: white; }
      .page { box-shadow: none; }
      .chapter { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="cover">
      <div class="badge">Learning Takeaways</div>
      <h1>Developing Your Emotional Intelligence</h1>
      <p class="subtitle">Course Learning Takeaways Report</p>
      <div class="learner-info">
        ${headshotDataUrl ? `<img src="${headshotDataUrl}" alt="${userName}" class="headshot" />` : ''}
        <span class="learner-name">${userName}</span>
      </div>
      <div class="meta">
        <span>\u{1F4C5} ${reportDate}</span>
      </div>
    </div>
    <div class="content">
      ${chaptersHTML}
    </div>
    <div class="footer">
      Generated from AI Learning Assistant \u2022 Developing Your Emotional Intelligence Course \u2022 ${reportDate}
    </div>
  </div>
</body>
</html>`;
}

interface EQLearningTakeawaysModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bestScores: Record<string, BestScoreData>;
  demoBestScores: Record<string, BestScoreData>;
  completedCount: number;
  totalModules: number;
  userName?: string;
}

export function EQLearningTakeawaysModal({ open, onOpenChange, bestScores, demoBestScores, completedCount, totalModules, userName }: EQLearningTakeawaysModalProps) {
  const [generatingType, setGeneratingType] = useState<'real' | 'demo' | null>(null);

  const handleGenerate = async (scores: Record<string, BestScoreData>, type: 'real' | 'demo') => {
    setGeneratingType(type);
    try {
      let headshotDataUrl: string | undefined;
      try {
        const resp = await fetch(headshotUrl);
        const blob = await resp.blob();
        headshotDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch {}
      const html = generateReportHTML(scores, userName || 'Matt Fishbach', headshotDataUrl);
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(htmlBlob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } finally {
      setGeneratingType(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Learning Takeaways Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-1">
          <p className="text-base text-gray-600 leading-relaxed">
            Generate a Learning Takeaways Report that will be saved as part of your course material.
            This report contains the following:
          </p>
          <ul className="text-base text-gray-600 space-y-2 ml-2">
            <li className="flex items-start gap-3">
              <span className="text-[#0a66c2] text-lg leading-6">&#x25B8;</span>
              <span>Summary of the key concepts per chapter</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0a66c2] text-lg leading-6">&#x25B8;</span>
              <span>Micro-glossary per chapter</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0a66c2] text-lg leading-6">&#x25B8;</span>
              <span>Your Skill Builder work and scores</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0a66c2] text-lg leading-6">&#x25B8;</span>
              <span>Your Role Play work and scores</span>
            </li>
          </ul>

          <div className="flex gap-3">
            <Button
              onClick={() => handleGenerate(bestScores, 'real')}
              disabled={generatingType !== null}
              className="flex-1 bg-[#0a66c2] hover:bg-[#004182] text-white py-3 rounded-lg font-medium text-sm"
              data-testid="button-generate-eq-report-real"
            >
              {generatingType === 'real' ? 'Generating...' : 'Generate Report (real-time data)'}
            </Button>
            <Button
              onClick={() => handleGenerate(demoBestScores, 'demo')}
              disabled={generatingType !== null}
              className="flex-1 bg-[#d97706] hover:bg-[#b45309] text-white py-3 rounded-lg font-medium text-sm"
              data-testid="button-generate-eq-report-demo"
            >
              {generatingType === 'demo' ? 'Generating...' : 'Generate Report (demo data)'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EQLearningTakeawaysButton({ sessionId, bestScores, demoBestScores, completedCount, totalModules, userName }: EQLearningTakeawaysReportProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 text-sm backdrop-blur-sm"
        data-testid="button-eq-learning-takeaways"
      >
        <FileText className="w-4 h-4" />
        Create Learning Takeaways Report
      </Button>

      <EQLearningTakeawaysModal
        open={showModal}
        onOpenChange={setShowModal}
        bestScores={bestScores}
        demoBestScores={demoBestScores}
        completedCount={completedCount}
        totalModules={totalModules}
        userName={userName}
      />
    </>
  );
}
