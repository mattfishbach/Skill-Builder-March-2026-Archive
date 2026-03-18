import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { X, ExternalLink, Share2, Users, UserCircle, Linkedin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EQLearningTakeawaysButton } from './EQLearningTakeawaysReport';

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

const EQ_SKILL_COLORS: Record<string, string> = {
  "Self-Awareness": "#0a66c2",
  "Self-Management": "#057642",
  "Social Awareness": "#0891b2",
  "Relationship Management": "#5f4bb6",
};

interface SkillMapping {
  skills: string[];
  weights: number[];
}

const EQ_SKILL_MAP: Record<string, SkillMapping> = {
  eq_emotional_chain: { skills: ["Self-Awareness"], weights: [1.0] },
  eq_ch1_wrapup: { skills: ["Self-Awareness", "Self-Management"], weights: [0.6, 0.4] },
  eq_cognitive_hijack: { skills: ["Self-Awareness", "Self-Management"], weights: [0.7, 0.3] },
  eq_self_awareness_wrapup: { skills: ["Self-Awareness", "Self-Management"], weights: [0.5, 0.5] },
  eq_stress_response_review: { skills: ["Self-Management"], weights: [1.0] },
  eq_abcde_model: { skills: ["Self-Management", "Self-Awareness"], weights: [0.7, 0.3] },
  eq_social_awareness_wrapup: { skills: ["Social Awareness", "Self-Awareness"], weights: [0.7, 0.3] },
  eq_empathy_mistakes: { skills: ["Social Awareness", "Relationship Management"], weights: [0.6, 0.4] },
  eq_feedback_loop: { skills: ["Relationship Management", "Self-Awareness"], weights: [0.7, 0.3] },
  eq_capstone: { skills: ["Self-Awareness", "Self-Management", "Social Awareness", "Relationship Management"], weights: [0.2, 0.2, 0.3, 0.3] },
};

const EQ_MODULE_DISPLAY: Record<string, { chapter: string; title: string }> = {
  eq_emotional_chain: { chapter: "Ch 1", title: "Emotional Chain" },
  eq_ch1_wrapup: { chapter: "Ch 1", title: "EQ Foundations Wrap-Up" },
  eq_cognitive_hijack: { chapter: "Ch 2", title: "Cognitive Hijack" },
  eq_self_awareness_wrapup: { chapter: "Ch 2", title: "Self-Awareness Wrap-Up" },
  eq_stress_response_review: { chapter: "Ch 3", title: "Stress Response Review" },
  eq_abcde_model: { chapter: "Ch 3", title: "ABCDE Reframing" },
  eq_social_awareness_wrapup: { chapter: "Ch 4", title: "Social Awareness Wrap-Up" },
  eq_empathy_mistakes: { chapter: "Ch 4", title: "Empathy Mistakes" },
  eq_feedback_loop: { chapter: "Ch 5", title: "Feedback Loop" },
  eq_capstone: { chapter: "Capstone", title: "Course Capstone" },
};

const EQ_MODULE_ORDER = [
  'eq_emotional_chain', 'eq_ch1_wrapup', 'eq_cognitive_hijack', 'eq_self_awareness_wrapup',
  'eq_stress_response_review', 'eq_abcde_model', 'eq_social_awareness_wrapup',
  'eq_empathy_mistakes', 'eq_feedback_loop', 'eq_capstone'
];

interface EQSkillGainSummaryProps {
  collatedResponse?: string;
  sessionId?: string;
}

interface BestScoreData {
  score: number;
  userResponse: string;
  feedback: string;
  partScores?: Record<number, number>;
}

const EQ_MULTI_PART_MODULES: Record<string, number> = {
  eq_ch1_wrapup: 2,
  eq_self_awareness_wrapup: 2,
  eq_social_awareness_wrapup: 2,
  eq_capstone: 2,
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

function computeEQSkillGains(bestScores: Record<string, BestScoreData>) {
  const skillTotals: Record<string, { weightedScore: number; totalWeight: number }> = {};

  for (const [moduleId, mapping] of Object.entries(EQ_SKILL_MAP)) {
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
      color: EQ_SKILL_COLORS[skill] || "#6b7280",
    }))
    .sort((a, b) => b.value - a.value);
}

const EQ_DEMO_RESPONSES: Record<string, string> = {
  eq_emotional_chain: "I recognize that I tend to feel anxious in high-stakes meetings, and my body signals this through tension in my shoulders and rapid breathing.",
  eq_ch1_wrapup: "Analyzing Aisha's situation showed me how the Event → Thoughts → Behavior chain plays out in real time, and why timing matters when emotions are high.",
  eq_cognitive_hijack: "My primary trigger is feeling dismissed during team discussions, which activates a defensive response that I now recognize before it escalates.",
  eq_self_awareness_wrapup: "Reflecting on my emotional patterns, I see that stress manifests as irritability and I can now pause to acknowledge it before reacting.",
  eq_stress_response_review: "My self-management plan includes a 10-second pause technique and reframing negative self-talk when I feel overwhelmed by deadlines.",
  eq_abcde_model: "Using the ABCDE model, I reframed my belief that 'criticism means failure' to 'feedback is an opportunity to grow and improve my work.'",
  eq_social_awareness_wrapup: "I've learned to read nonverbal cues more effectively, noticing when colleagues disengage and adjusting my communication approach accordingly.",
  eq_empathy_mistakes: "When my teammate shared their frustration, I used reflective listening to validate their feelings before offering solutions, which strengthened our rapport.",
  eq_feedback_loop: "I practiced delivering constructive feedback using the SBI model, focusing on specific situations, behaviors, and their impact on the team.",
  eq_capstone: "Integrating all four EQ domains, I developed a personal growth plan that addresses my awareness gaps and leverages my relationship strengths.",
};

export function generateEQDemoScores(): Record<string, BestScoreData> {
  const demoScores: Record<string, BestScoreData> = {};
  const scorePool = [2, 3, 3, 4, 4, 4, 5, 5, 5, 4];
  const shuffled = [...scorePool].sort(() => Math.random() - 0.5);
  EQ_MODULE_ORDER.forEach((moduleId, i) => {
    const totalParts = EQ_MULTI_PART_MODULES[moduleId] || 1;
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
      userResponse: EQ_DEMO_RESPONSES[moduleId] || "Demo response — complete this Skill Builder to see your real answer here.",
      feedback: "Demo feedback",
      partScores,
    };
  });
  return demoScores;
}

export function mergeEQDemoWithReal(demoScores: Record<string, BestScoreData>, realScores: Record<string, BestScoreData>): Record<string, BestScoreData> {
  const merged = { ...demoScores };
  for (const [moduleId, realData] of Object.entries(realScores)) {
    merged[moduleId] = realData;
  }
  return merged;
}

export function EQSkillGainSummary({ collatedResponse, sessionId }: EQSkillGainSummaryProps) {
  const [selectedResult, setSelectedResult] = useState<SkillBuilderResult | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [realScores, setRealScores] = useState<Record<string, BestScoreData>>({});
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const demoScores = useMemo(() => generateEQDemoScores(), []);

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

  const bestScores = demoMode ? mergeEQDemoWithReal(demoScores, realScores) : realScores;

  const results: SkillBuilderResult[] = EQ_MODULE_ORDER
    .filter(moduleId => bestScores[moduleId])
    .map(moduleId => {
      const display = EQ_MODULE_DISPLAY[moduleId];
      const scoreData = bestScores[moduleId];
      return {
        moduleId,
        chapter: display?.chapter || "",
        title: display?.title || moduleId,
        score: scoreData.score,
        maxScore: 5,
        collatedResponse: scoreData.userResponse || "",
        partScores: scoreData.partScores,
        totalParts: EQ_MULTI_PART_MODULES[moduleId] || 1,
      };
    });

  const skillGainsData = computeEQSkillGains(bestScores);

  const totalScore = results.reduce((sum, r) => {
    if (r.partScores) {
      return sum + Object.values(r.partScores).reduce((ps, s) => ps + s, 0);
    }
    return sum + r.score;
  }, 0);
  const maxTotalScore = EQ_MODULE_ORDER.reduce((sum, moduleId) => {
    const parts = EQ_MULTI_PART_MODULES[moduleId] || 1;
    return sum + (5 * parts);
  }, 0);
  const overallPercentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
  const completedCount = results.length;
  const totalModules = EQ_MODULE_ORDER.length;

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
              <h1 className="text-2xl font-bold text-white mb-1" data-testid="text-eq-skill-gains-title">Skill Gains Summary</h1>
              <p className="text-white/60 text-sm">Developing Your Emotional Intelligence</p>
            </div>
            <div className="flex items-center gap-2">
              <EQLearningTakeawaysButton
                sessionId={sessionId}
                bestScores={realScores}
                demoBestScores={mergeEQDemoWithReal(demoScores, realScores)}
                completedCount={completedCount}
                totalModules={totalModules}
              />
              <div className="relative">
                <RefBadge num="407" />
                <Button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 text-sm backdrop-blur-sm"
                  data-testid="button-share-eq-skill-gains"
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
                      data-testid="button-eq-share-linkedin"
                    >
                      <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                      Add to my LinkedIn Learning skill profile
                    </button>
                    <button
                      onClick={() => handleShare('others')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      data-testid="button-eq-share-others"
                    >
                      <Users className="w-5 h-5 text-gray-500" />
                      Share with others
                    </button>
                    <button
                      onClick={() => handleShare('my manager')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      data-testid="button-eq-share-manager"
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
                <p className="text-4xl font-bold" data-testid="text-eq-overall-percentage">{overallPercentage}%</p>
                <p className="text-xs text-white/50 mt-1" data-testid="text-eq-points-earned">{totalScore} / {maxTotalScore} points</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <RefBadge num="402" />
                <p className="text-xs text-white/60 mb-1">Progress</p>
                <p className="text-4xl font-bold" data-testid="text-eq-completed-count">{completedCount}<span className="text-lg font-normal text-white/50"> / {totalModules}</span></p>
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
          data-testid="toggle-eq-data-mode"
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
              const mapping = EQ_SKILL_MAP[result.moduleId];
              return (
                <div 
                  key={result.moduleId}
                  className="grid grid-cols-[1fr_auto_1fr] gap-x-3 items-center py-1.5 px-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  data-testid={`row-eq-sb-score-${result.moduleId}`}
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
                      data-testid={`link-eq-view-response-${result.moduleId}`}
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
                        style={{ backgroundColor: EQ_SKILL_COLORS[skill] || '#6b7280' }}
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
                    <linearGradient id="radarGradientEQ" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#radarGradientEQ)"
                    strokeWidth={3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-sm">Complete Skill Builders to see your skill profile develop.</p>
            <p className="text-gray-300 text-xs mt-1">Each Skill Builder contributes to 1-3 emotional intelligence skills.</p>
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
            {selectedResult && EQ_SKILL_MAP[selectedResult.moduleId] && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Skills developed:</p>
                <div className="flex flex-wrap gap-1.5">
                  {EQ_SKILL_MAP[selectedResult.moduleId].skills.map((skill, i) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: EQ_SKILL_COLORS[skill] || '#6b7280' }}
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
