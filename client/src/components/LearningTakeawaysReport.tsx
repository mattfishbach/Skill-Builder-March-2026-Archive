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

interface LearningTakeawaysReportProps {
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

const CHAPTER_CONTENT: ChapterContent[] = [
  {
    title: "Chapter 1: Intro to NIST CSF 2.0",
    keyConcepts: [
      "The NIST CSF 2.0 organizes cybersecurity into six functions\u2014Identify, Protect, Detect, Respond, Recover, and Govern\u2014creating a common language from engineers to executives.",
      "CSF 2.0 added the Govern function, expanded scope beyond critical infrastructure, and strengthened focus on supply chain risk.",
      "The framework is a flexible GPS for cybersecurity strategy\u2014not a checklist\u2014that scales from small businesses to global enterprises."
    ],
    glossary: [
      { term: "NIST CSF", definition: "National Institute of Standards and Technology Cybersecurity Framework\u2014a voluntary guide for managing cybersecurity risk." },
      { term: "Govern Function", definition: "The newest CSF function (added in v2.0) that ties leadership, strategy, and policy into the cybersecurity framework." },
      { term: "Supply Chain Risk", definition: "Security threats introduced through third-party vendors, partners, or service providers." },
      { term: "CSF Functions", definition: "Six high-level categories (Identify, Protect, Detect, Respond, Recover, Govern) that organize cybersecurity activities." }
    ],
    skillBuilderIds: ["csf_functions"]
  },
  {
    title: "Chapter 2: Deep Dive into Identify",
    keyConcepts: [
      "You cannot protect what you don\u2019t know you have\u2014asset management is the foundation of the Identify function and of all cybersecurity.",
      "Risk assessment turns chaos into clarity by helping you focus defenses where the stakes are highest, using likelihood and impact to prioritize.",
      "Governance ensures cybersecurity priorities are executed consistently with accountability at every level\u2014it belongs in the boardroom, not the basement."
    ],
    glossary: [
      { term: "Asset Management", definition: "Building and maintaining an accurate inventory of all hardware, software, data, and services in your environment." },
      { term: "Shadow IT", definition: "Unofficial apps or services used by teams without security review, creating hidden vulnerabilities." },
      { term: "Risk Appetite", definition: "The level of risk an organization\u2019s leadership is willing to tolerate." },
      { term: "Risk Register", definition: "A documented list of identified risks with their likelihood, impact, and mitigation plans." },
      { term: "Crown Jewels", definition: "An organization\u2019s most critical and sensitive assets that require the highest level of protection." }
    ],
    skillBuilderIds: ["asset_classification", "identify_wrapup"]
  },
  {
    title: "Chapter 3: Strengthening the Protect Function",
    keyConcepts: [
      "Identity is the new security perimeter\u2014with cloud and remote work, controlling who gets access (and to what) matters more than building walls.",
      "Data must be protected in all three states (at rest, in transit, in use) and classified by sensitivity so the right controls match the right data.",
      "Security awareness must be engaging, ongoing, and culture-driven\u2014technology alone can\u2019t stop someone from clicking a phishing link."
    ],
    glossary: [
      { term: "Least Privilege", definition: "Users should have only the minimum access necessary to do their job\u2014nothing more." },
      { term: "MFA", definition: "Multi-Factor Authentication\u2014requiring two or more forms of verification to prove identity." },
      { term: "Zero Trust", definition: "A security model that verifies every request every time, assuming breach rather than assuming trust." },
      { term: "EDR / XDR", definition: "Endpoint (or Extended) Detection and Response\u2014tools that monitor devices and systems for suspicious activity." },
      { term: "DLP", definition: "Data Loss Prevention\u2014tools that prevent sensitive data from leaving the organization." },
      { term: "Data Classification", definition: "Categorizing information (public, internal, confidential, restricted) to apply appropriate security levels." }
    ],
    skillBuilderIds: ["access_control", "protect_wrapup"]
  },
  {
    title: "Chapter 4: Detect, Respond, and Recover",
    keyConcepts: [
      "Detection is about raising the right alarms at the right time\u2014faster detection dramatically reduces breach costs and damage.",
      "Incident response requires a predefined plan with clear roles, not panic\u2014organizations that practice through tabletop exercises recover best.",
      "Recovery is about more than fixing systems\u2014it\u2019s about restoring trust, learning lessons, and coming back stronger and more resilient."
    ],
    glossary: [
      { term: "SIEM", definition: "Security Information and Event Management\u2014a platform that collects and analyzes security data from across the environment." },
      { term: "Anomaly Detection", definition: "Identifying unusual patterns or behaviors that deviate from the established baseline of \u2018normal.\u2019" },
      { term: "Continuous Monitoring", definition: "Ongoing surveillance of systems and networks to detect threats in real time." },
      { term: "Incident Response Plan", definition: "A predefined playbook outlining roles, responsibilities, and step-by-step actions for handling security incidents." },
      { term: "Tabletop Exercise", definition: "A discussion-based simulation where teams walk through an incident scenario to practice their response." },
      { term: "Resilience", definition: "An organization\u2019s ability to withstand, recover from, and adapt after a cybersecurity incident." }
    ],
    skillBuilderIds: ["incident_response", "drr_wrapup"]
  },
  {
    title: "Chapter 5: Implementing the Framework",
    keyConcepts: [
      "There is no one-size-fits-all\u2014tailor the CSF to your organization\u2019s unique risks, business processes, and regulatory landscape.",
      "Start with Identify (know what you have), then Protect and Detect, then build Respond and Recover maturity\u2014crawl, walk, run.",
      "Measure with outcome-focused metrics that connect to business goals, and communicate value in terms leadership understands (money, risk, trust)."
    ],
    glossary: [
      { term: "CSF Profiles", definition: "Customized alignments of the framework\u2019s outcomes to an organization\u2019s specific business requirements and risk tolerance." },
      { term: "Maturity Model", definition: "A framework for measuring how advanced and repeatable an organization\u2019s cybersecurity practices are." },
      { term: "Quick Wins", definition: "Low-effort, high-impact improvements that deliver immediate security value while building momentum." },
      { term: "Outcome-Focused Metrics", definition: "Measurements tied to business results (e.g., time-to-detect, risk reduction) rather than activity counts." }
    ],
    skillBuilderIds: ["implementation_plan"]
  },
  {
    title: "Conclusion: Capstone",
    keyConcepts: [
      "Cybersecurity is a continuous journey of learning, improving, and adapting\u2014not a one-and-done project.",
      "The capstone brings together all six CSF functions to assess an organization holistically, build a phased plan, and communicate it to leadership."
    ],
    glossary: [
      { term: "Capstone Assessment", definition: "A comprehensive exercise that applies all CSF functions to a real-world organizational scenario." },
      { term: "Phased Implementation", definition: "A crawl-walk-run approach to deploying the CSF\u2014starting with foundations (Identify/Govern) before adding protections and maturity." },
      { term: "Continuous Improvement", definition: "The ongoing cycle of assessing, implementing, measuring, and refining cybersecurity practices." }
    ],
    skillBuilderIds: ["csf_capstone"]
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
    csf_functions: "CSF Functions in Action",
    asset_classification: "Asset Classification",
    identify_wrapup: "Identify Wrap-Up",
    access_control: "Access Control Audit",
    protect_wrapup: "Protect Wrap-Up",
    incident_response: "Incident Response",
    drr_wrapup: "Detect, Respond & Recover Wrap-Up",
    implementation_plan: "Implementation Roadmap",
    csf_capstone: "Course Capstone"
  };
  return titles[moduleId] || moduleId;
}

function generateReportHTML(bestScores: Record<string, BestScoreData>, userName: string, headshotDataUrl?: string): string {
  const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let chaptersHTML = '';
  for (const chapter of CHAPTER_CONTENT) {
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
  <title>Learning Takeaways Report \u2013 NIST CSF 2.0</title>
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
      <h1>NIST Cybersecurity Framework 2.0</h1>
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
      Generated from AI Learning Assistant \u2022 NIST CSF 2.0 Course \u2022 ${reportDate}
    </div>
  </div>
</body>
</html>`;
}

interface LearningTakeawaysModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bestScores: Record<string, BestScoreData>;
  demoBestScores: Record<string, BestScoreData>;
  completedCount: number;
  totalModules: number;
  userName?: string;
}

export function LearningTakeawaysModal({ open, onOpenChange, bestScores, demoBestScores, completedCount, totalModules, userName }: LearningTakeawaysModalProps) {
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
              data-testid="button-generate-report-real"
            >
              {generatingType === 'real' ? 'Generating...' : 'Generate Report (real-time data)'}
            </Button>
            <Button
              onClick={() => handleGenerate(demoBestScores, 'demo')}
              disabled={generatingType !== null}
              className="flex-1 bg-[#d97706] hover:bg-[#b45309] text-white py-3 rounded-lg font-medium text-sm"
              data-testid="button-generate-report-demo"
            >
              {generatingType === 'demo' ? 'Generating...' : 'Generate Report (demo data)'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LearningTakeawaysButton({ sessionId, bestScores, demoBestScores, completedCount, totalModules, userName }: LearningTakeawaysReportProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 text-sm backdrop-blur-sm"
        data-testid="button-learning-takeaways"
      >
        <FileText className="w-4 h-4" />
        Create Learning Takeaways Report
      </Button>

      <LearningTakeawaysModal
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
