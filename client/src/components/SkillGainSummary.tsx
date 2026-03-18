import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { X, ExternalLink, Share2, Users, UserCircle, Linkedin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LearningTakeawaysButton } from './LearningTakeawaysReport';

const RefBadge = ({ num }: { num: string }) => null;

const getSkillLabel = (score: number) => {
  switch(score) {
    case 1: return 'Novice';
    case 2: return 'Basic';
    case 3: return 'Competent';
    case 4: return 'Proficient';
    case 5: return 'Expert';
    default: return '';
  }
};

const SKILL_COLORS: Record<string, string> = {
  "CSF Framework Knowledge": "#0a66c2",
  "Risk Analysis": "#057642",
  "Security Architecture": "#0891b2",
  "Incident Management": "#5f4bb6",
  "Strategic Planning": "#915907",
  "Executive Communication": "#c026d3",
};

interface SkillMapping {
  skills: string[];
  weights: number[];
}

const SKILL_MAP: Record<string, SkillMapping> = {
  csf_functions: {
    skills: ["CSF Framework Knowledge", "Risk Analysis"],
    weights: [0.7, 0.3]
  },
  asset_classification: {
    skills: ["Risk Analysis"],
    weights: [1.0]
  },
  identify_wrapup: {
    skills: ["CSF Framework Knowledge", "Executive Communication"],
    weights: [0.6, 0.4]
  },
  access_control: {
    skills: ["Security Architecture", "Risk Analysis"],
    weights: [0.6, 0.4]
  },
  protect_wrapup: {
    skills: ["Security Architecture", "Executive Communication"],
    weights: [0.5, 0.5]
  },
  incident_response: {
    skills: ["Incident Management"],
    weights: [1.0]
  },
  drr_wrapup: {
    skills: ["Incident Management", "Executive Communication"],
    weights: [0.6, 0.4]
  },
  implementation_plan: {
    skills: ["Strategic Planning", "Executive Communication"],
    weights: [0.6, 0.4]
  },
  csf_capstone: {
    skills: ["CSF Framework Knowledge", "Strategic Planning", "Executive Communication"],
    weights: [0.35, 0.35, 0.3]
  },
};

const MODULE_DISPLAY: Record<string, { chapter: string; title: string }> = {
  csf_functions: { chapter: "Ch 1", title: "CSF Functions in Action" },
  asset_classification: { chapter: "Ch 2", title: "Asset Classification" },
  identify_wrapup: { chapter: "Ch 2", title: "Identify Wrap-Up" },
  access_control: { chapter: "Ch 3", title: "Access Control Audit" },
  protect_wrapup: { chapter: "Ch 3", title: "Protect Wrap-Up" },
  incident_response: { chapter: "Ch 4", title: "Incident Response" },
  drr_wrapup: { chapter: "Ch 4", title: "DRR Wrap-Up" },
  implementation_plan: { chapter: "Ch 5", title: "Implementation Roadmap" },
  csf_capstone: { chapter: "Capstone", title: "Course Capstone" },
};

const CSF_MODULE_ORDER = [
  'csf_functions', 'asset_classification', 'identify_wrapup',
  'access_control', 'protect_wrapup', 'incident_response',
  'drr_wrapup', 'implementation_plan', 'csf_capstone'
];

interface SkillGainSummaryProps {
  collatedResponse?: string;
  sessionId?: string;
}

interface BestScoreData {
  score: number;
  userResponse: string;
  feedback: string;
  partScores?: Record<number, number>;
}

const MULTI_PART_MODULES: Record<string, number> = {
  identify_wrapup: 2,
  protect_wrapup: 2,
  drr_wrapup: 2,
  implementation_plan: 2,
  csf_capstone: 3,
};

interface SkillBuilderResult {
  moduleId: string;
  chapter: string;
  title: string;
  score: number;
  maxScore: number;
  collatedResponse: string;
  partScores?: Record<number, number>;
  totalParts: number;
}

function computeSkillGains(bestScores: Record<string, BestScoreData>) {
  const skillTotals: Record<string, { weightedScore: number; totalWeight: number }> = {};

  for (const [moduleId, mapping] of Object.entries(SKILL_MAP)) {
    const scoreData = bestScores[moduleId];
    if (!scoreData) continue;

    for (let i = 0; i < mapping.skills.length; i++) {
      const skill = mapping.skills[i];
      const weight = mapping.weights[i];
      if (!skillTotals[skill]) {
        skillTotals[skill] = { weightedScore: 0, totalWeight: 0 };
      }
      skillTotals[skill].weightedScore += weight * scoreData.score * 20;
      skillTotals[skill].totalWeight += weight;
    }
  }

  return Object.entries(skillTotals)
    .map(([skill, data]) => ({
      skill,
      value: Math.round(data.weightedScore / data.totalWeight),
      color: SKILL_COLORS[skill] || "#6b7280",
    }))
    .sort((a, b) => b.value - a.value);
}

const DEMO_RESPONSES: Record<string, string> = {
  csf_functions: "The six CSF functions work together as a continuous cycle. Identify helps us understand what assets we have and where our risks are. Protect puts safeguards in place like access controls and training. Detect monitors for anomalies and threats. Respond activates our incident response plan when something happens. Recover restores operations and learns from the incident. Govern ties it all together with leadership oversight, policy, and strategy. For Brisbane Hospital, I'd prioritize Identify first to map all patient data systems, then Protect to ensure HIPAA-compliant access controls are in place.",
  asset_classification: "Critical: Electronic Health Records (EHR) system — contains protected patient data, any breach triggers regulatory penalties and patient safety risks. High: Network infrastructure and domain controllers — compromise enables lateral movement across all systems. Medium: Employee workstations — important for daily operations but individually replaceable. Low: Public-facing informational website — contains no sensitive data and can be restored quickly from backups. The classification drives our protection priorities and incident response playbooks.",
  identify_wrapup: "After completing the Identify assessment, three key gaps stand out: (1) We lack a complete asset inventory — shadow IT devices and cloud services aren't tracked, creating blind spots. (2) Our risk assessment hasn't been updated in 18 months, missing new threats like AI-powered phishing. (3) Supply chain risk management is minimal — we don't assess third-party vendor security postures. My recommendation is to start with an automated asset discovery scan, then conduct a fresh risk assessment using the CSF's risk categories, and finally implement a vendor security questionnaire process.",
  access_control: "The audit findings reveal serious access control gaps: (1) Shared admin accounts violate least-privilege and make incident attribution impossible — remediation: implement individual named accounts with role-based access. (2) No MFA on critical systems — remediation: deploy MFA for all admin access within 30 days, then expand to all users. (3) Former employees still have active accounts — remediation: automate de-provisioning tied to HR offboarding workflow. (4) Excessive permissions — remediation: conduct quarterly access reviews and implement just-in-time privilege escalation. Priority order: disable former employee accounts immediately, then MFA, then RBAC migration.",
  protect_wrapup: "For the law firm's security review, I'd prioritize these Protect improvements: First, encrypt all client data at rest and in transit — litigation documents and financial records require strong protection given attorney-client privilege obligations. Second, implement security awareness training focused on phishing and social engineering, since employees handling sensitive documents are prime targets. Third, deploy endpoint detection and response (EDR) on all workstations to catch threats that bypass email filters. The business case for leadership: a single data breach exposing client files could result in malpractice liability, regulatory fines, and devastating reputational damage that far exceeds the cost of these controls.",
  incident_response: "Immediate actions (first 60 minutes): Isolate the compromised server from the network without powering it off to preserve forensic evidence. Activate the incident response team and notify the CISO. Block the external IP at the firewall. Begin forensic imaging of the server. Short-term (24-48 hours): Determine scope — what customer records were on that server, how many are affected. Engage legal counsel for breach notification obligations. Check other servers for similar indicators of compromise. Communication: Brief executive leadership with facts, not speculation. Prepare customer notification draft. Document everything in the incident log. Post-incident: Conduct root cause analysis, update detection rules, and run a tabletop exercise to practice the improved response plan.",
  drr_wrapup: "Lessons learned from the ransomware incident: Detection gap — 4 days to discover means we need better monitoring. I'd implement 24/7 SIEM monitoring with alerts for anomalous file encryption patterns, which could reduce detection to under 1 hour. Response improvement — the 2-week response indicates unclear playbooks. I'd create a ransomware-specific runbook with pre-authorized containment actions so the team can act immediately without waiting for approvals. Recovery acceleration — one week to restore from backups suggests untested backup processes. I'd implement daily automated backup verification, maintain offline copies, and conduct quarterly recovery drills with a target RTO of 24 hours. For leadership: frame this as risk reduction — each day of downtime cost approximately $X in lost revenue, so investing in detection and recovery capabilities has clear ROI.",
  implementation_plan: "Phase 1 (Months 1-2) — Foundation: Complete asset inventory and data classification. Conduct risk assessment to identify top 10 vulnerabilities. Implement MFA and basic endpoint protection as quick wins. Phase 2 (Months 3-4) — Core Protections: Deploy SIEM for continuous monitoring. Establish incident response team and playbooks. Launch security awareness training program. Phase 3 (Months 5-6) — Maturity: Develop CSF profiles mapping current vs. target state. Create metrics dashboard for board reporting. Establish vendor risk management process. Success metrics: reduce mean-time-to-detect from days to hours, achieve 100% MFA adoption, complete security training for all employees. Budget justification: present to leadership in terms of risk reduction and regulatory compliance rather than technical specifications.",
  csf_capstone: "Bringing together all six CSF functions for the healthcare startup: Govern — establish a security steering committee with the CEO and department heads; create a cybersecurity policy framework aligned with HIPAA requirements. Identify — complete asset inventory including all cloud services and medical devices; conduct risk assessment prioritizing patient data systems. Protect — implement role-based access controls, encrypt PHI at rest and in transit, deploy endpoint protection, launch quarterly security awareness training. Detect — deploy SIEM with healthcare-specific detection rules, implement network monitoring for medical device segments, establish 24/7 alert triage. Respond — create incident response playbooks for top 5 scenarios (ransomware, data breach, insider threat, device compromise, vendor breach), conduct quarterly tabletop exercises. Recover — implement automated backups with daily verification, establish communication templates for patients and regulators, document recovery procedures with 24-hour RTO target. The phased approach starts with Govern and Identify (foundation), then Protect and Detect (core defenses), then Respond and Recover (resilience) — crawl, walk, run."
};

export function generateDemoScores(): Record<string, BestScoreData> {
  const demoScores: Record<string, BestScoreData> = {};
  const scorePool = [2, 3, 3, 4, 4, 4, 5, 5, 5];
  const shuffled = [...scorePool].sort(() => Math.random() - 0.5);
  CSF_MODULE_ORDER.forEach((moduleId, i) => {
    const totalParts = MULTI_PART_MODULES[moduleId] || 1;
    const baseScore = shuffled[i % shuffled.length];
    let partScores: Record<number, number> | undefined;
    if (totalParts > 1) {
      partScores = {};
      for (let p = 1; p <= totalParts; p++) {
        partScores[p] = Math.max(1, Math.min(5, baseScore + Math.floor(Math.random() * 3) - 1));
      }
    }
    demoScores[moduleId] = {
      score: baseScore,
      userResponse: DEMO_RESPONSES[moduleId] || "Demo response — complete this Skill Builder to see your real answer here.",
      feedback: "Demo feedback",
      partScores,
    };
  });
  return demoScores;
}

export function mergeDemoWithReal(demoScores: Record<string, BestScoreData>, realScores: Record<string, BestScoreData>): Record<string, BestScoreData> {
  const merged = { ...demoScores };
  for (const [moduleId, realData] of Object.entries(realScores)) {
    merged[moduleId] = realData;
  }
  return merged;
}

export function SkillGainSummary({ collatedResponse, sessionId }: SkillGainSummaryProps) {
  const [selectedResult, setSelectedResult] = useState<SkillBuilderResult | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [realScores, setRealScores] = useState<Record<string, BestScoreData>>({});
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const demoScores = useMemo(() => generateDemoScores(), []);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    
    fetch(`/api/attempts/session/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setRealScores(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const bestScores = demoMode ? mergeDemoWithReal(demoScores, realScores) : realScores;

  const results: SkillBuilderResult[] = CSF_MODULE_ORDER
    .filter(moduleId => bestScores[moduleId])
    .map(moduleId => {
      const display = MODULE_DISPLAY[moduleId];
      const scoreData = bestScores[moduleId];
      return {
        moduleId,
        chapter: display?.chapter || "",
        title: display?.title || moduleId,
        score: scoreData.score,
        maxScore: 5,
        collatedResponse: scoreData.userResponse || "",
        partScores: scoreData.partScores,
        totalParts: MULTI_PART_MODULES[moduleId] || 1,
      };
    });

  const skillGainsData = computeSkillGains(bestScores);

  const totalScore = results.reduce((sum, r) => {
    if (r.partScores) {
      return sum + Object.values(r.partScores).reduce((ps, s) => ps + s, 0);
    }
    return sum + r.score;
  }, 0);
  const maxTotalScore = CSF_MODULE_ORDER.reduce((sum, moduleId) => {
    const parts = MULTI_PART_MODULES[moduleId] || 1;
    return sum + (5 * parts);
  }, 0);
  const overallPercentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
  const completedCount = results.length;
  const totalModules = CSF_MODULE_ORDER.length;

  const handleShare = (option: string) => {
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-5 px-6 pb-32 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a66c2] mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading your skill data...</p>
        </div>
      </div>
    );
  }

  const hasData = results.length > 0;

  return (
    <div className="max-w-5xl mx-auto py-5 px-6 pb-32">
      <div className="bg-gradient-to-br from-[#0a66c2] to-[#004182] rounded-2xl p-6 mb-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div>
              <RefBadge num="400" />
              <h1 className="text-2xl font-bold text-white mb-1" data-testid="text-skill-gains-title">Skill Gains Summary</h1>
              <p className="text-white/60 text-sm">NIST CSF 2.0</p>
            </div>
            <div className="flex items-center gap-2">
              <LearningTakeawaysButton
                sessionId={sessionId}
                bestScores={realScores}
                demoBestScores={mergeDemoWithReal(demoScores, realScores)}
                completedCount={completedCount}
                totalModules={totalModules}
              />
              <div className="relative">
                <RefBadge num="407" />
                <Button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 text-sm backdrop-blur-sm"
                  data-testid="button-share-skill-gains"
                >
                  <Share2 className="w-4 h-4" />
                  Share my Skill Gains
                  <ChevronDown className={`w-4 h-4 transition-transform ${showShareMenu ? 'rotate-180' : ''}`} />
                </Button>
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => handleShare('LinkedIn Learning profile')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      data-testid="button-share-linkedin"
                    >
                      <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                      Add to my LinkedIn Learning skill profile
                    </button>
                    <button
                      onClick={() => handleShare('others')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      data-testid="button-share-others"
                    >
                      <Users className="w-5 h-5 text-gray-500" />
                      Share with others
                    </button>
                    <button
                      onClick={() => handleShare('my manager')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      data-testid="button-share-manager"
                    >
                      <UserCircle className="w-5 h-5 text-gray-500" />
                      Share with my manager <span className="text-xs text-gray-400">(enterprise-only)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <RefBadge num="401" />
          {hasData ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-white/60 mb-1">Overall Score</p>
                <p className="text-4xl font-bold" data-testid="text-overall-percentage">{overallPercentage}%</p>
                <p className="text-xs text-white/50 mt-1" data-testid="text-points-earned">{totalScore} / {maxTotalScore} points</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <RefBadge num="402" />
                <p className="text-xs text-white/60 mb-1">Progress</p>
                <p className="text-4xl font-bold" data-testid="text-completed-count">{completedCount}<span className="text-lg font-normal text-white/50"> / {totalModules}</span></p>
                <p className="text-xs text-white/50 mt-1">Skill Builders completed</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-white/60 mb-1">Skills Developing</p>
                <p className="text-4xl font-bold">{skillGainsData.length}</p>
                <p className="text-xs text-white/50 mt-1">core competencies</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm text-center">
              <p className="text-lg font-semibold">No data yet</p>
              <p className="text-sm text-white/60 mt-1">Complete Skill Builders to see your achievement summary</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <span className={`text-sm font-semibold whitespace-nowrap transition-colors ${!demoMode ? 'text-[#0a66c2]' : 'text-gray-400'}`}>
          Real-Time Data
        </span>
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300 ${
            demoMode ? 'bg-[#d97706]' : 'bg-[#0a66c2]'
          }`}
          data-testid="toggle-data-mode"
          aria-label={demoMode ? "Switch to real-time data" : "Switch to demo data"}
        >
          <div
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
              demoMode ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </button>
        <span className={`text-sm font-semibold whitespace-nowrap transition-colors ${demoMode ? 'text-[#d97706]' : 'text-gray-400'}`}>
          Demo Data
        </span>
        {demoMode && (
          <span className="text-[11px] text-amber-600 ml-1">(simulated scores)</span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3 relative">
        <RefBadge num="403" />
        <h2 className="text-base font-semibold text-gray-900 mb-1.5">Skill Builder Scores</h2>
        {hasData ? (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 px-2 pb-1 border-b border-gray-100">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Skill Builder</span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-center">Score</span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-right">Skills</span>
            </div>
            {results.map((result) => {
              const mapping = SKILL_MAP[result.moduleId];
              return (
                <div 
                  key={result.moduleId}
                  className="grid grid-cols-[1fr_auto_1fr] gap-x-3 items-center py-1.5 px-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  data-testid={`row-sb-score-${result.moduleId}`}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      <span className="text-gray-400 text-xs">{result.chapter}:</span> {result.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    {result.totalParts > 1 ? (
                      <span className="text-xs font-bold whitespace-nowrap">
                        {result.partScores ? (
                          Array.from({ length: result.totalParts }, (_, i) => {
                            const partNum = i + 1;
                            const partScore = result.partScores?.[partNum];
                            if (partScore == null) return null;
                            const colorClass = partScore >= 4 ? 'text-emerald-700' : partScore >= 3 ? 'text-blue-800' : 'text-amber-700';
                            return (
                              <span key={partNum}>
                                {partNum > 1 && <span className="text-gray-400">, </span>}
                                <span className="text-gray-400 font-normal">P{partNum}: </span>
                                <span className={colorClass}>{partScore}/5</span>
                              </span>
                            );
                          })
                        ) : (
                          <span className={result.score >= 4 ? 'text-emerald-700' : result.score >= 3 ? 'text-blue-800' : 'text-amber-700'}>
                            {result.score}/{result.maxScore}
                          </span>
                        )}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold whitespace-nowrap ${
                          result.score >= 4 ? 'text-emerald-700' : 
                          result.score >= 3 ? 'text-blue-800' : 'text-amber-700'
                        }`}>
                          {result.score}/{result.maxScore} {getSkillLabel(result.score)}
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              result.score >= 4 ? 'bg-emerald-500' : 
                              result.score >= 3 ? 'bg-[#0a66c2]' : 'bg-amber-500'
                            }`}
                            style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedResult(result)}
                      className="text-[#0a66c2] hover:text-[#004182] text-xs flex items-center gap-1 hover:underline ml-1"
                      data-testid={`link-view-response-${result.moduleId}`}
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {mapping?.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium text-white"
                        style={{ backgroundColor: SKILL_COLORS[skill] || '#6b7280' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            {completedCount < totalModules && (
              <div className="py-2 px-2 text-center">
                <p className="text-xs text-gray-400">{totalModules - completedCount} Skill Builder{totalModules - completedCount > 1 ? 's' : ''} remaining</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-gray-400 text-sm">Complete Skill Builders in the course to see your scores here.</p>
            <p className="text-gray-300 text-xs mt-1">Your best score from each Skill Builder will appear automatically.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 mt-6 relative">
        <RefBadge num="404" />
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills Gained</h2>
        {skillGainsData.length > 0 ? (
          <div className="flex gap-6">
            <div className="w-[45%] h-80 relative">
              <RefBadge num="405" />
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGainsData} layout="vertical" margin={{ left: 20, right: 10, top: 10, bottom: 10 }}>
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 14 }} />
                  <YAxis type="category" dataKey="skill" width={160} tick={{ fontSize: 12 }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={26}>
                    {skillGainsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[55%] h-80 relative">
              <RefBadge num="406" />
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="78%" data={skillGainsData}>
                  <defs>
                    <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0a66c2" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#5f4bb6" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    tick={{ fontSize: 11, fill: '#4b5563' }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 13 }}
                    tickCount={5}
                  />
                  <Radar
                    name="Skill Level"
                    dataKey="value"
                    stroke="#0a66c2"
                    fill="url(#radarGradient)"
                    strokeWidth={3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-sm">Complete Skill Builders to see your skill profile develop.</p>
            <p className="text-gray-300 text-xs mt-1">Each Skill Builder contributes to 1-3 core cybersecurity skills.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 relative">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Final Score Composition</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-40">
              <div className="w-5 h-5 rounded-full bg-[#0a66c2] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Videos / Articles</span>
            </div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#0a66c2] flex items-center justify-center" style={{ width: '65%' }}>
                <span className="text-white text-xs font-medium">Videos</span>
              </div>
              <div className="h-full bg-[#5b9bd5] flex items-center justify-center" style={{ width: '35%' }}>
                <span className="text-white text-xs font-medium">Articles</span>
              </div>
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">9 pts</span>
            <span className="text-sm font-semibold text-[#0a66c2] w-12">43%</span>
            <span className="text-xs text-gray-400 w-20 text-right">21/25 100%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-40">
              <div className="w-5 h-5 rounded-full bg-[#057642] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Hands-On Practice</span>
            </div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#057642] flex items-center justify-center" style={{ width: '60%' }}>
                <span className="text-white text-xs font-medium">Skill Builders</span>
              </div>
              <div className="h-full bg-[#f59e0b] flex items-center justify-center" style={{ width: '20%' }}>
                <span className="text-white text-xs font-medium">Role Plays</span>
              </div>
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">8 pts</span>
            <span className="text-sm font-semibold text-[#057642] w-12">38%</span>
            <span className="text-xs text-gray-400 w-20 text-right">21/25 100%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-40">
              <div className="w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Assessments</span>
            </div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#f59e0b] flex items-center justify-center" style={{ width: '55%' }}>
                <span className="text-white text-xs font-medium">Chapter Quizzes</span>
              </div>
              <div className="h-full bg-[#ed8936] flex items-center justify-center" style={{ width: '25%' }}>
                <span className="text-white text-xs font-medium">Course Exam</span>
              </div>
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">4 pts</span>
            <span className="text-sm font-semibold text-[#f59e0b] w-12">19%</span>
            <span className="text-xs text-gray-400 w-20 text-right">21/25 100%</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded bg-[#057642] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <span className="text-gray-700">Hands-On is strongest contributor</span>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedResult?.title}
              <span className="text-sm font-normal text-gray-500 ml-2">
                {selectedResult?.chapter}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">Score:</span>
              <div className="flex gap-0.5">
                {selectedResult && [...Array(selectedResult.maxScore)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < selectedResult.score ? 'bg-[#0a66c2]' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{selectedResult?.score}/{selectedResult?.maxScore}</span>
              {selectedResult && (
                <span className={`text-xs ml-2 px-2 py-0.5 rounded-full font-medium ${
                  selectedResult.score >= 4 ? 'bg-emerald-100 text-emerald-700' : 
                  selectedResult.score >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {getSkillLabel(selectedResult.score)}
                </span>
              )}
            </div>
            {selectedResult && SKILL_MAP[selectedResult.moduleId] && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Skills developed:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_MAP[selectedResult.moduleId].skills.map((skill, i) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: SKILL_COLORS[skill] || '#6b7280' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Your Best Response:</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {selectedResult?.collatedResponse || "No response recorded for this Skill Builder."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
