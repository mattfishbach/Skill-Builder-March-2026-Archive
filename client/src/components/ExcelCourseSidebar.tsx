import { Circle, PlayCircle, FileText, X, ChevronDown, Bookmark, Zap } from 'lucide-react';
import { useState } from 'react';

interface ExcelSidebarProps {
  onClose?: () => void;
  onVideoClick?: (title: string) => void;
  onSkillBuilderClick?: (moduleId: string) => void;
  activeItem?: string | null;
  activeModuleId?: string | null;
}

export function ExcelCourseSidebar({ onClose, onVideoClick, onSkillBuilderClick, activeItem, activeModuleId }: ExcelSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);

  const sections = [
    {
      title: "Introduction",
      items: [
        { type: 'video' as const, title: "Learning advanced formulas and functions using Excel", duration: "48s" },
        { type: 'video' as const, title: "Developing your own style with formulas and functions", duration: "2m 26s" },
        { type: 'video' as const, title: "Challenges", duration: "1m 11s" },
      ]
    },
    {
      title: "1. Using Tables and Dynamic Arrays for Data Integrity and Consistency",
      items: [
        { type: 'video' as const, title: "Tables", duration: "8m 22s" },
        { type: 'video' as const, title: "Tables and absolute cell references", duration: "4m 22s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Tables & Dynamic Arrays", duration: "2-3m interactive", moduleId: "excel_tables_arrays" },
        { type: 'video' as const, title: "Dynamic arrays introduction", duration: "5m 8s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Dynamic Array Basics", duration: "2-3m interactive", moduleId: "excel_dynamic_intro" },
      ]
    },
    {
      title: "2. The World of IF Statements and Conditions",
      items: [
        { type: 'video' as const, title: "IF function", duration: "4m 53s" },
        { type: 'video' as const, title: "SUMIFS and COUNTIFS", duration: "13m 35s" },
        { type: 'skill-builder' as const, title: "Skill Builder – SUMIFS & COUNTIFS Practice", duration: "2-3m interactive", moduleId: "excel_sumifs_practice" },
        { type: 'video' as const, title: "MAXIFS, MINIFS, and AVERAGEIFS", duration: "6m 9s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Conditional Functions", duration: "2-3m interactive", moduleId: "excel_conditionals" },
      ]
    },
    {
      title: "3. Looking Up, Down, and All Around: Comparing and Combining with Lookups",
      items: [
        { type: 'video' as const, title: "VLOOKUP", duration: "8m 22s" },
        { type: 'video' as const, title: "XLOOKUP", duration: "9m 47s" },
        { type: 'skill-builder' as const, title: "Skill Builder – VLOOKUP vs. XLOOKUP", duration: "2-3m interactive", moduleId: "excel_lookup_basics" },
        { type: 'video' as const, title: "VLOOKUP and XLOOKUP comparison", duration: "2m 28s" },
        { type: 'video' as const, title: "INDEX/MATCH", duration: "4m 12s" },
        { type: 'video' as const, title: "The INDEX/MATCH vs. VLOOKUP controversy", duration: "1m 16s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Choosing Lookups", duration: "2-3m interactive", moduleId: "excel_choosing_lookups" },
        { type: 'video' as const, title: "Two-way lookups", duration: "6m 8s" },
        { type: 'video' as const, title: "Approximate and tiered matches", duration: "8m 4s" },
        { type: 'video' as const, title: "INDIRECT", duration: "7m 43s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Lookups Wrap-Up", duration: "4-5m interactive", moduleId: "excel_ch3_wrapup" },
      ]
    },
    {
      title: "4. Formula Tips and Strategies",
      items: [
        { type: 'video' as const, title: "Use Alt+Enter to make formulas more readable", duration: "4m 35s" },
        { type: 'video' as const, title: "Formula vs. lookup table", duration: "4m 38s" },
        { type: 'video' as const, title: "Formula vs. helper columns", duration: "8m 31s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Formula Strategy", duration: "2-3m interactive", moduleId: "excel_formula_strategy" },
        { type: 'video' as const, title: "Build complex formulas in steps", duration: "6m 12s" },
        { type: 'video' as const, title: 'Writing formulas for "future you"', duration: "1m 52s" },
        { type: 'video' as const, title: "Compatibility functions", duration: "8m 21s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Formula Design", duration: "2-3m interactive", moduleId: "excel_formula_design" },
        { type: 'video' as const, title: "Writing 3D formulas", duration: "3m 56s" },
        { type: 'video' as const, title: "Volatile functions", duration: "5m 8s" },
        { type: 'video' as const, title: "LET function overview", duration: "11m 4s" },
        { type: 'video' as const, title: "Error handling: IFNA and IFERROR", duration: "4m 11s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Formula Tips Wrap-Up", duration: "3-4m interactive", moduleId: "excel_ch4_wrapup" },
      ]
    },
    {
      title: "5. Mid-Term Challenges",
      items: [
        { type: 'video' as const, title: "Challenge 1: Course completions", duration: "5m 18s" },
        { type: 'video' as const, title: "Challenge 2: Two-way lookup", duration: "2m 2s" },
        { type: 'video' as const, title: "Challenge 3: Guitars", duration: "3m 45s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Mid-Course Check", duration: "2-3m interactive", moduleId: "excel_midterm" },
      ]
    },
    {
      title: "6. Date and Time Functions",
      items: [
        { type: 'video' as const, title: "Time, rounding, and converting to decimals", duration: "4m 45s" },
        { type: 'video' as const, title: "EOMONTH", duration: "2m 6s" },
        { type: 'video' as const, title: "YEARFRAC", duration: "2m 59s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Date & Time Functions", duration: "2-3m interactive", moduleId: "excel_datetime" },
      ]
    },
    {
      title: "7. Working with Text and Arrays",
      items: [
        { type: 'video' as const, title: "LEFT, RIGHT, and MID", duration: "14m 11s" },
        { type: 'video' as const, title: "UPPER, LOWER, and PROPER", duration: "4m 1s" },
        { type: 'video' as const, title: "TEXTJOIN", duration: "6m 41s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Text Functions", duration: "2-3m interactive", moduleId: "excel_text_functions" },
        { type: 'video' as const, title: "FILTER", duration: "5m 10s" },
        { type: 'video' as const, title: "UNIQUE", duration: "5m 57s" },
        { type: 'video' as const, title: "TOCOL", duration: "2m 55s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Dynamic Arrays", duration: "2-3m interactive", moduleId: "excel_dynamic_arrays_practice" },
        { type: 'video' as const, title: "TEXTBEFORE and TEXTAFTER", duration: "5m 12s" },
        { type: 'video' as const, title: "RANDARRAY", duration: "8m 22s" },
        { type: 'skill-builder' as const, title: "Skill Builder – Text & Arrays Wrap-Up", duration: "3-4m interactive", moduleId: "excel_ch7_wrapup" },
      ]
    },
    {
      title: "Course Capstone",
      items: [
        { type: 'skill-builder' as const, title: "Skill Builder Capstone", duration: "6-8m interactive", moduleId: "excel_capstone" },
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
          <button onClick={onClose} className="text-white/60 hover:text-white" data-testid="button-close-excel-sidebar">
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
                data-testid={`button-toggle-excel-section-${sectionIdx}`}
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
                        onClick={() => onSkillBuilderClick?.(item.moduleId)}
                        className={`
                          flex items-start gap-3 px-4 py-2 cursor-pointer transition-colors group
                          ${activeModuleId === item.moduleId ? 'bg-[#0a66c2]/30 border-y border-[#0a66c2]' : 'hover:bg-[#0a66c2]/20'}
                        `}
                        data-testid={`button-skill-builder-${item.moduleId}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <div className="flex items-center justify-center w-[18px] h-[18px]">
                            <Zap className={`w-[15px] h-[15px] ${activeModuleId === item.moduleId ? 'text-[#70bce8]' : 'text-[#8ecdf0]'}`} strokeWidth={2} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${activeModuleId === item.moduleId ? 'text-[#70bce8]' : 'text-[#8ecdf0]'}`}>
                            {item.title}
                          </p>
                          <span className="text-xs text-white/40 mt-0.5 block">
                            {item.duration}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={itemIdx}
                        onClick={() => onVideoClick?.(item.title)}
                        className={`
                          flex items-start gap-3 px-4 py-2 cursor-pointer transition-colors group
                          ${activeItem === item.title ? 'bg-white/10 border-l-2 border-[#0a66c2]' : 'hover:bg-white/5'}
                        `}
                        data-testid={`item-excel-${sectionIdx}-${itemIdx}`}
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
                            {item.duration} video
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
      </div>
    </div>
  );
}
