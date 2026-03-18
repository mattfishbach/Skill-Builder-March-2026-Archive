import { Check, CheckCircle2, Circle, Lock, PlayCircle, FileText, ClipboardList, X, ChevronDown, Bookmark, Sparkles, HelpCircle, Award, Zap } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  onClose?: () => void;
  onSkillBuilderClick?: (moduleId: string) => void;
  onVideoClick?: (title: string) => void;
  onSkillGainSummaryClick?: () => void;
  onLearningTakeawaysClick?: () => void;
  activeItem?: string | null;
  activeModuleId?: string | null;
  skillBuilderCompleted?: boolean;
  showRefNumbers?: boolean;
  passedModuleIds?: Set<string>;
}

export function CourseSidebar({ onClose, onSkillBuilderClick, onVideoClick, onSkillGainSummaryClick, onLearningTakeawaysClick, activeItem, activeModuleId, skillBuilderCompleted, showRefNumbers, passedModuleIds = new Set() }: SidebarProps) {
  
  const RefBadge = ({ num }: { num: string }) => showRefNumbers ? (
    <span className="absolute -top-1 left-[3px] bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 rounded z-[300] leading-none">{num}</span>
  ) : null;
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const sections = [
    {
      title: "Introduction",
      items: [
        { type: 'video', title: "Empower your organization", duration: "42s", status: "completed" },
      ]
    },
    {
      title: "1. Intro to NIST CSF 2.1",
      items: [
        { type: 'video', title: "Core functions of the NIST Cybersecurity Framework (CSF)", duration: "2m 50s", status: "available" },
        { type: 'video', title: "Key framework updates", duration: "2m 23s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – CSF Functions in Action", duration: "2-3m interactive", status: "available", moduleId: "csf_functions" },
      ]
    },
    {
      title: "2. Deep Dive into Identify",
      items: [
        { type: 'video', title: "Asset management", duration: "3m 43s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Asset Classification", duration: "3-4m interactive", status: "available", moduleId: "asset_classification" },
        { type: 'video', title: "Risk assessment and risk strategy", duration: "3m 38s", status: "available" },
        { type: 'video', title: "Governance and risk management", duration: "3m 16s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Identify Wrap-Up", duration: "4-5m interactive", status: "available", moduleId: "identify_wrapup" },
      ]
    },
    {
      title: "3. Strengthening the Protect Function",
      items: [
        { type: 'video', title: "Identity and access management", duration: "4m 25s", status: "available" },
        { type: 'video', title: "Data security", duration: "2m 48s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Access Control Audit", duration: "3-4m interactive", status: "available", moduleId: "access_control" },
        { type: 'video', title: "Security awareness and culture", duration: "2m 19s", status: "available" },
        { type: 'video', title: "Protective tech", duration: "3m 45s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Protect Wrap-Up", duration: "4-5m interactive", status: "available", moduleId: "protect_wrapup" },
      ]
    },
    {
      title: "4. Detect, Respond, and Recover Functions",
      items: [
        { type: 'video', title: "Detecting threats and anomalies", duration: "3m 7s", status: "available" },
        { type: 'video', title: "Incident response", duration: "2m 54s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Incident Response", duration: "3-4m interactive", status: "available", moduleId: "incident_response" },
        { type: 'video', title: "Recovery from incidents", duration: "2m 48s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – DRR Wrap-Up", duration: "4-5m interactive", status: "available", moduleId: "drr_wrapup" },
      ]
    },
    {
      title: "5. Implementing the Framework",
      items: [
        { type: 'video', title: "Customizing for your organization", duration: "2m 33s", status: "available" },
        { type: 'video', title: "Measuring success and sustaining efforts", duration: "1m 56s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder – Implementation Roadmap", duration: "4-5m interactive", status: "available", moduleId: "implementation_plan" },
      ]
    },
    {
      title: "Conclusion",
      items: [
        { type: 'video', title: "Cybersecurity is a continuous journey", duration: "1m 14s", status: "available" },
        { type: 'skill-builder', title: "Skill Builder Capstone", duration: "6-8m interactive", status: "available", moduleId: "csf_capstone" },
        { type: 'skill-gain-summary', title: "Skill Gains Summary", duration: "Review", status: "available" },
        { type: 'learning-takeaways', title: "Learning Takeaways Report", duration: "Generate", status: "available" },
      ]
    },
    {
      title: "Original Demo Skill Builders",
      items: [
        { type: 'skill-builder', title: "Skill Builder – Identify Stakeholders", duration: "2-3m interactive", status: "available", moduleId: "project_stakeholders" },
        { type: 'skill-builder', title: "Skill Builder – Work Breakdown Structure", duration: "2-3m interactive", status: "available", moduleId: "scope_wbs_reflection" },
        { type: 'skill-builder', title: "Skill Builder – AI Prompt for KPIs", duration: "3-4m interactive", status: "available", moduleId: "ai_kpi_prompt" },
      ]
    }
  ];

  const toggleSection = (idx: number) => {
    setExpandedSections(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="min-h-full h-full flex flex-col bg-[#1b1f23] text-white">
      <div className="px-3 py-2 flex items-center justify-between border-b border-white/10 relative">
        <RefBadge num="201" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Contents</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            data-testid="button-close-sidebar"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        )}
      </div>
      
      <div className="flex-1 bg-[#1b1f23]">
        <div className="py-1">
          {sections.map((section, idx) => (
            <div key={idx} className="border-b border-white/5 last:border-b-0">
              <button 
                onClick={() => toggleSection(idx)}
                className="w-full px-3 py-2 flex items-center justify-start hover:bg-white/5 transition-colors relative"
                data-testid={`button-section-${idx}`}
              >
                <RefBadge num={`21${idx}`} />
                <span className="text-sm font-medium text-white/90 flex-1 text-left">{section.title}</span>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ml-auto ${expandedSections.includes(idx) ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedSections.includes(idx) && (
                <div className="pb-1">
                  {section.items.map((item, itemIdx) => (
                    item.type === 'skill-builder' ? (
                      <div
                        key={itemIdx}
                        onClick={() => item.status !== 'locked' && onSkillBuilderClick?.((item as any).moduleId || '')}
                        className={`w-full flex items-start gap-3 px-3 py-1.5 transition-all relative ${
                          item.status === 'locked' 
                            ? 'cursor-default' 
                            : activeModuleId === (item as any).moduleId
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
                              <Zap className={`w-[15px] h-[15px] ${item.status === 'locked' ? 'text-white/30' : 'text-[#8ecdf0]'}`} strokeWidth={2} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${item.status === 'locked' ? 'text-white/40' : activeModuleId === (item as any).moduleId ? 'text-[#70bce8]' : 'text-[#8ecdf0]'}`}>{item.title}</p>
                          <span className="text-xs text-white/40 mt-0.5 block">{item.duration}</span>
                        </div>
                      </div>
                    ) : item.type === 'skill-gain-summary' ? (
                      <div
                        key={itemIdx}
                        onClick={item.status !== 'locked' ? onSkillGainSummaryClick : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-1.5 transition-all relative ${
                          item.status === 'locked' 
                            ? 'cursor-default' 
                            : activeItem === 'Skill Gains Summary'
                              ? 'bg-[#057642]/30 cursor-pointer border-y border-yellow-600'
                              : 'bg-gradient-to-r from-[#057642]/20 to-[#057642]/10 hover:from-[#057642]/30 hover:to-[#057642]/15 cursor-pointer'
                        }`}
                        data-testid="button-skill-gain-summary-sidebar"
                      >
                        <div className={`p-1.5 rounded flex-shrink-0 ${item.status === 'locked' ? 'bg-white/20' : 'bg-[#057642]'}`}>
                          <Award className={`w-[18px] h-[18px] ${item.status === 'locked' ? 'text-white/40' : 'text-white'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${item.status === 'locked' ? 'text-white/40' : activeItem === 'Skill Gains Summary' ? 'text-white' : 'text-white/70'}`}>Skill Gains Summary</p>
                          <span className={`text-xs ${item.status === 'locked' ? 'text-white/30' : 'text-gray-400'}`}>Review your gains</span>
                        </div>
                      </div>
                    ) : item.type === 'learning-takeaways' ? (
                      <div
                        key={itemIdx}
                        onClick={onLearningTakeawaysClick}
                        className="w-full flex items-center gap-3 px-3 py-1.5 transition-all relative bg-gradient-to-r from-[#d97706]/20 to-[#d97706]/10 hover:from-[#d97706]/30 hover:to-[#d97706]/15 cursor-pointer"
                        data-testid="button-learning-takeaways-sidebar"
                      >
                        <div className="p-1.5 rounded flex-shrink-0 bg-[#d97706]">
                          <ClipboardList className="w-[18px] h-[18px] text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-white/70">Learning Takeaways Report</p>
                          <span className="text-xs text-gray-400">Generate your report</span>
                        </div>
                      </div>
                    ) : (
                      <div 
                        key={itemIdx}
                        onClick={() => item.type === 'video' && item.status !== 'locked' && onVideoClick?.(item.title)}
                        className={`
                          flex items-start gap-3 px-3 py-1.5 cursor-pointer transition-colors group
                          ${activeItem === item.title ? 'bg-white/10 border-y border-yellow-600' : 'hover:bg-white/5'}
                        `}
                        data-testid={`item-${section.title}-${itemIdx}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-[#0a66c2]" />
                          ) : item.status === 'locked' ? (
                            <Circle className="w-4 h-4 text-white/30" />
                          ) : (
                            <Circle className="w-4 h-4 text-white/50" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${activeItem === item.title ? 'text-white font-medium' : 'text-white/70'}`}>
                            {item.title}
                          </p>
                          <span className="text-xs text-white/40 mt-0.5 block">
                            {item.duration} {item.type === 'video' ? 'video' : ''}
                          </span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded">
                          <Bookmark className="w-3.5 h-3.5 text-white/50" />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
