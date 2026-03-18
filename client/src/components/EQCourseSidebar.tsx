import { CheckCircle2, Circle, PlayCircle, HelpCircle, FileText, X, ChevronDown, Bookmark, Zap, Award, FileBarChart } from 'lucide-react';
import { useState } from 'react';

interface EQSidebarProps {
  onClose?: () => void;
  onVideoClick?: (title: string) => void;
  onTextItemClick?: (title: string) => void;
  onSkillBuilderClick?: (moduleId: string) => void;
  onSkillGainSummaryClick?: () => void;
  onLearningTakeawaysClick?: () => void;
  activeItem?: string | null;
  activeModuleId?: string;
  passedModuleIds?: Set<string>;
}

export function EQCourseSidebar({ onClose, onVideoClick, onTextItemClick, onSkillBuilderClick, onSkillGainSummaryClick, onLearningTakeawaysClick, activeItem, activeModuleId, passedModuleIds = new Set() }: EQSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2, 3, 4, 5]);

  const sections = [
    {
      title: "Introduction",
      items: [
        { type: 'video', title: "What are the benefits of emotional intelligence?", duration: "2m 48s", status: "available" },
        { type: 'text', title: "Note to learner", duration: "1m text", status: "available" },
      ]
    },
    {
      title: "1. Understanding Emotional Intelligence",
      items: [
        { type: 'video', title: "What is emotional intelligence?", duration: "5m 24s", status: "available" },
        { type: 'video', title: "The emotions in EQ", duration: "6m 6s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Emotional Chain", duration: "2-3m interactive", status: "available", moduleId: "eq_emotional_chain" },
        { type: 'video', title: "Managing emotional reactions", duration: "5m 57s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – EQ Foundations Wrap-Up", duration: "4-5m interactive", status: "available", moduleId: "eq_ch1_wrapup" },
      ]
    },
    {
      title: "2. Being Self-Aware",
      items: [
        { type: 'video', title: "Understanding your personal EQ", duration: "4m 14s", status: "available" },
        { type: 'video', title: "Managing your mindset", duration: "4m 44s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Cognitive Hijack", duration: "2-3m interactive", status: "available", moduleId: "eq_cognitive_hijack" },
        { type: 'video', title: "Finding your flow", duration: "4m 27s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Self-Awareness Wrap-Up", duration: "4-5m interactive", status: "available", moduleId: "eq_self_awareness_wrapup" },
      ]
    },
    {
      title: "3. Managing Yourself",
      items: [
        { type: 'video', title: "Thoughts and emotional intelligence", duration: "6m 20s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – ABCDE Model", duration: "3-4m interactive", status: "available", moduleId: "eq_abcde_model" },
        { type: 'video', title: "Dealing with stressful situations", duration: "4m 13s", status: "available" },
        { type: 'video', title: "Shift perspective to shape behavior", duration: "4m 43s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Stress Response Review", duration: "3-4m interactive", status: "available", moduleId: "eq_stress_response_review" },
      ]
    },
    {
      title: "4. Social Awareness",
      items: [
        { type: 'video', title: "Developing social awareness", duration: "4m 37s", status: "available" },
        { type: 'video', title: "Connecting with empathy", duration: "5m 8s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Empathy Mistakes", duration: "3-4m interactive", status: "available", moduleId: "eq_empathy_mistakes" },
        { type: 'video', title: "Communication and social awareness", duration: "4m 56s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Social Awareness Wrap-Up", duration: "4-5m interactive", status: "available", moduleId: "eq_social_awareness_wrapup" },
      ]
    },
    {
      title: "5. Managing Relationships",
      items: [
        { type: 'video', title: "Play to your personal strengths", duration: "3m 50s", status: "available" },
        { type: 'video', title: "Collect feedback to build connection", duration: "6m 8s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Feedback Loop", duration: "3-4m interactive", status: "available", moduleId: "eq_feedback_loop" },
        { type: 'video', title: "Communicate intention and impact", duration: "4m 31s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder Capstone", duration: "5-6m interactive", status: "available", moduleId: "eq_capstone" },
      ]
    },
  ];

  const toggleSection = (idx: number) => {
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-[#1b1f23]">
      <div className="sticky top-0 z-10 bg-[#1b1f23] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-white/60" />
          <span className="text-white font-medium text-sm">Contents</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white" data-testid="button-close-eq-sidebar">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="py-1">
        {sections.map((section, sectionIdx) => {
          const isExpanded = expandedSections.includes(sectionIdx);
          return (
            <div key={sectionIdx}>
              <button
                onClick={() => toggleSection(sectionIdx)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors"
                data-testid={`button-toggle-section-${sectionIdx}`}
              >
                <span className="text-white font-semibold text-sm text-left">{section.title}</span>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
              </button>

              {isExpanded && (
                <div className="pb-1">
                  {section.items.map((item, itemIdx) => (
                    item.type === 'skill-builder' ? (
                      <div
                        key={itemIdx}
                        onClick={() => onSkillBuilderClick?.((item as any).moduleId || '')}
                        className={`w-full flex items-start gap-3 px-3 py-1.5 transition-all relative ${
                          activeModuleId === (item as any).moduleId
                            ? 'bg-[#0a66c2]/30 cursor-pointer border-y border-[#0a66c2]'
                            : 'hover:bg-[#0a66c2]/20 cursor-pointer'
                        }`}
                        data-testid={`button-skill-builder-${(item as any).moduleId}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {passedModuleIds.has((item as any).moduleId) ? (
                            <div className="flex items-center justify-center w-[18px] h-[18px]">
                              <svg width="16" height="16" viewBox="0 0 512 512">
                                <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" fill="#8ecdf0"/>
                              </svg>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-[18px] h-[18px]">
                              <Zap className="w-[15px] h-[15px] text-[#8ecdf0]" strokeWidth={2} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${activeModuleId === (item as any).moduleId ? 'text-[#70bce8]' : 'text-[#8ecdf0]'}`}>{item.title}</p>
                          <span className="text-xs text-white/40 mt-0.5 block">{item.duration}</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={itemIdx}
                        onClick={() => {
                          if (item.type === 'video') onVideoClick?.(item.title);
                          else if (item.type === 'text') onTextItemClick?.(item.title);
                        }}
                        className={`
                          flex items-start gap-3 px-4 py-2 cursor-pointer transition-colors group
                          ${activeItem === item.title ? 'bg-white/10 border-l-2 border-[#0a66c2]' : 'hover:bg-white/5'}
                        `}
                        data-testid={`item-eq-${sectionIdx}-${itemIdx}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {activeItem === item.title ? (
                            <PlayCircle className="w-4 h-4 text-[#0a66c2]" />
                          ) : (
                            <Circle className="w-4 h-4 text-white/40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${activeItem === item.title ? 'text-white' : 'text-white/70 group-hover:text-white/90'}`}>
                            {item.title}
                          </p>
                          <span className="text-xs text-white/40 mt-0.5 block">
                            {item.duration}{item.type === 'video' ? ' video' : ''}
                          </span>
                        </div>
                        <Bookmark className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="border-t border-white/10 mt-2 pt-2 pb-4">
          <div
            onClick={onSkillGainSummaryClick}
            className={`w-full flex items-center gap-3 px-3 py-2 transition-all cursor-pointer ${
              activeItem === 'Skill Gains Summary'
                ? 'bg-[#057642]/30 border-y border-yellow-600'
                : 'bg-gradient-to-r from-[#057642]/20 to-[#057642]/10 hover:from-[#057642]/30 hover:to-[#057642]/15'
            }`}
            data-testid="button-eq-skill-gain-summary"
          >
            <div className="p-1.5 rounded flex-shrink-0 bg-[#057642]">
              <Award className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className={`text-sm font-medium ${activeItem === 'Skill Gains Summary' ? 'text-white' : 'text-white/70'}`}>Skill Gains Summary</p>
              <span className="text-xs text-gray-400">Review your gains</span>
            </div>
          </div>

          <div
            onClick={onLearningTakeawaysClick}
            className={`w-full flex items-center gap-3 px-3 py-2 mt-1 transition-all cursor-pointer ${
              activeItem === 'Learning Takeaways'
                ? 'bg-amber-600/30 border-y border-amber-500'
                : 'bg-gradient-to-r from-amber-600/20 to-amber-600/10 hover:from-amber-600/30 hover:to-amber-600/15'
            }`}
            data-testid="button-eq-learning-takeaways"
          >
            <div className="p-1.5 rounded flex-shrink-0 bg-amber-600">
              <FileBarChart className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className={`text-sm font-medium ${activeItem === 'Learning Takeaways' ? 'text-white' : 'text-white/70'}`}>Learning Takeaways Report</p>
              <span className="text-xs text-gray-400">Full course summary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
