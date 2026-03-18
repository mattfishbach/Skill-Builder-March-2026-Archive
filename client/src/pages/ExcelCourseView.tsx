import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { ExcelCourseSidebar } from '@/components/ExcelCourseSidebar';
import { CoursePlayer } from '@/components/CoursePlayer';
import { VideoDetails } from '@/components/VideoDetails';
import { SkillBuilderInline, MODULE_CONFIGS } from '@/components/SkillBuilderInline';
import { Button } from '@/components/ui/button';
import { Share2, Bookmark, Download, Menu, Lightbulb, ChevronDown, Copy } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import excelInstructorImg from '@assets/image_1771387215567.png';
import { excelTranscripts } from '@/data/excelTranscripts';
import { EXCEL_MODULE_CONFIGS } from '@/data/excelSkillBuilders';

interface DemoTipPartConfig {
  sampleResponses: { label: string; text: string }[];
  idealAnswer: string;
  erroneousResponse?: { label: string; text: string };
}

interface DemoTipConfig {
  title: string;
  sampleResponses: { label: string; text: string }[];
  idealAnswer: string;
  erroneousResponse?: { label: string; text: string };
  part2?: DemoTipPartConfig;
  part3?: DemoTipPartConfig;
}

const EXCEL_DEMO_TIPS_CONFIG: Record<string, DemoTipConfig> = {
  excel_tables_arrays: {
    title: "Demo Shortcuts - Tables & Arrays",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Tables auto-expand formulas. That's the main benefit."
      },
      {
        label: "Sample Response 2 (→ Level 5)",
        text: "Two key benefits: (1) Structured references auto-expand — formulas automatically include new rows without manual updates. (2) Calculated columns auto-fill new formulas down the entire column, plus headers stay visible when scrolling."
      }
    ],
    idealAnswer: EXCEL_MODULE_CONFIGS.excel_tables_arrays?.idealAnswer || "",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "The absolute references get replaced with column names."
        },
        {
          label: "Sample Response 2 (→ Level 5)",
          text: "Absolute references like $A$2:$A$500 become structured references like [Sales]. The formula =SUM($B$2:$B$500) becomes =SUM(Table1[Sales]). These are self-documenting and auto-expanding — no manual range updates."
        }
      ],
      idealAnswer: EXCEL_MODULE_CONFIGS.excel_tables_arrays?.part2?.idealAnswer || ""
    }
  },
  excel_dynamic_intro: {
    title: "Demo Shortcuts - Dynamic Arrays Intro",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Spilling is when a formula returns multiple results. It's different from the old way."
      },
      {
        label: "Sample Response 2 (→ Level 5)",
        text: "Spilling means a single formula in one cell returns multiple results that automatically fill into adjacent cells. The spill range adjusts dynamically. Legacy CSE arrays required selecting the exact output range first and pressing Ctrl+Shift+Enter — they couldn't resize."
      }
    ],
    idealAnswer: EXCEL_MODULE_CONFIGS.excel_dynamic_intro?.idealAnswer || ""
  },
  excel_conditionals: {
    title: "Demo Shortcuts - Conditionals",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Use IF to check the score and show Certified or Needs Retake."
      },
      {
        label: "Sample Response 2 (→ Level 5)",
        text: "Use IF with AND: =IF(AND(Score>=80, Status=\"Pass\"), \"Certified\", \"Needs Retake\"). AND is needed because both conditions must be true simultaneously."
      }
    ],
    idealAnswer: EXCEL_MODULE_CONFIGS.excel_conditionals?.idealAnswer || "",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "Use MAX to find the highest score in Engineering."
        },
        {
          label: "Sample Response 2 (→ Level 5)",
          text: "MAXIFS — returns the max from a range meeting criteria: =MAXIFS(ScoreRange, DeptRange, \"Engineering\"). Unlike MAX, MAXIFS filters by department first."
        }
      ],
      idealAnswer: EXCEL_MODULE_CONFIGS.excel_conditionals?.part2?.idealAnswer || ""
    }
  },
  excel_lookup_basics: {
    title: "Demo Shortcuts - Lookup Basics",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "VLOOKUP can do this. The lookup value has to be in the first column."
      },
      {
        label: "Sample Response 2 (→ Level 5)",
        text: "Yes, VLOOKUP works, but the lookup value (Product ID) must be in the leftmost column. The fragile part is the column index number — if someone inserts a column, the indexes break. Also, it defaults to approximate match, so you must set FALSE for exact match."
      }
    ],
    idealAnswer: EXCEL_MODULE_CONFIGS.excel_lookup_basics?.idealAnswer || "",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "XLOOKUP is newer and doesn't need the lookup column to be first."
        },
        {
          label: "Sample Response 2 (→ Level 5)",
          text: "XLOOKUP separates lookup and return arrays, so column position doesn't matter. It defaults to exact match. Recommendation: XLOOKUP — no column index to maintain, no leftmost restriction. Only use VLOOKUP for backward compatibility with pre-Office 365."
        }
      ],
      idealAnswer: EXCEL_MODULE_CONFIGS.excel_lookup_basics?.part2?.idealAnswer || ""
    }
  },
  excel_formula_strategy: {
    title: "Demo Shortcuts - Formula Strategy",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "The formula is too long and hard to read."
      },
      {
        label: "Sample Response 2 (→ Level 5)",
        text: "The biggest problem: the same VLOOKUP(A2,Sheet2!A:D,4,FALSE) appears 4 times. Each recalculates separately. Fix with LET: =LET(salary, VLOOKUP(...), status, VLOOKUP(...), IF(AND(status=\"Active\", salary>50000), salary*0.1, IF(salary>30000, salary*0.05, 0)))"
      }
    ],
    idealAnswer: EXCEL_MODULE_CONFIGS.excel_formula_strategy?.idealAnswer || ""
  },
  excel_formula_design: {
    title: "Demo Shortcuts - Formula Design",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "I would use nested IFs to check each condition."
      },
      {
        label: "Sample Response 2 (→ Level 5)",
        text: "Step-by-step: (1) Start from the most restrictive condition (Star Performer), (2) Use IFS or nested IF with AND for multi-criteria checks, (3) Test each tier independently, (4) Add error handling with IFERROR. Could also use LET to name the variables first."
      }
    ],
    idealAnswer: EXCEL_MODULE_CONFIGS.excel_formula_design?.idealAnswer || ""
  },
};

export default function ExcelCourseView() {
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>("Learning advanced formulas and functions using Excel");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const contentPanelRef = useRef<HTMLDivElement>(null);
  const [showDemoTips, setShowDemoTips] = useState(false);
  const [tipText, setTipText] = useState('');
  const [aiHelpfulness, setAiHelpfulness] = useState(3);
  const [currentSkillBuilderPart, setCurrentSkillBuilderPart] = useState<1 | 2 | 3>(1);
  const demoPanelRef = useRef<HTMLDivElement>(null);

  const isSkillBuilderActive = !!activeModuleId;

  const currentTranscript = selectedVideo ? excelTranscripts[selectedVideo] : undefined;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      if ((e.key === 'm' || e.key === 'M') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigate('/courses');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    if (contentPanelRef.current) {
      contentPanelRef.current.scrollTop = 0;
    }
  }, [selectedVideo, activeModuleId]);

  useEffect(() => {
    if (!showDemoTips) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (demoPanelRef.current && !demoPanelRef.current.contains(event.target as Node)) {
        setShowDemoTips(false);
      }
    };
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
    }, 100);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showDemoTips]);

  const handleVideoClick = (title: string) => {
    setSelectedVideo(title);
    setActiveModuleId(null);
  };

  const handleSkillBuilderClick = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setSelectedVideo(null);
  };

  const handleCopyTip = (text: string) => {
    setTipText(text);
    setShowDemoTips(false);
  };

  return (
    <div className="h-screen bg-white flex flex-col font-sans overflow-hidden">
      <header className="h-14 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#0a66c2] font-bold text-xl">in</span>
            <span className="font-semibold text-[#0a66c2]">Learning</span>
          </div>
        </div>

        <div className="flex-1" />

        <div className="relative mr-4" ref={demoPanelRef}>
          <button
            onClick={() => setShowDemoTips(!showDemoTips)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 rounded-lg transition-colors"
            data-testid="button-excel-demo-tips"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">Demo Shortcuts</span>
            <ChevronDown className={`w-3 h-3 text-gray-300 transition-transform ${showDemoTips ? 'rotate-180' : ''}`} />
          </button>

          {showDemoTips && (() => {
            const currentTipsConfig = EXCEL_DEMO_TIPS_CONFIG[activeModuleId || ''] || EXCEL_DEMO_TIPS_CONFIG.excel_tables_arrays;
            return (
              <div className="absolute top-full right-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
                <div className="pl-5 pr-10 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate('/courses')}
                      className="bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 text-sm font-semibold gap-1.5 rounded-full"
                      data-testid="button-excel-course-menu-demo"
                    >
                      Back to Course Menu
                    </Button>
                  </div>

                  <div className="border-t border-gray-200" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800">AI Helpfulness</p>
                      <span className="text-sm font-semibold text-[#0a66c2]">{aiHelpfulness}/5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={aiHelpfulness}
                      onChange={(e) => setAiHelpfulness(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0a66c2]"
                      data-testid="slider-excel-ai-helpfulness"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Socratic questions</span>
                      <span>Direct hints</span>
                    </div>
                    <p className="text-xs text-gray-500 italic text-center">
                      {aiHelpfulness === 1 ? "Pure Socratic - questions only" :
                       aiHelpfulness === 2 ? "Mostly questions with subtle nudges" :
                       aiHelpfulness === 3 ? "Balanced guidance with some hints" :
                       aiHelpfulness === 4 ? "More direct hints about gaps" :
                       "Clear, specific guidance about gaps"}
                    </p>
                  </div>

                  {isSkillBuilderActive && (() => {
                    const getActivePartConfig = () => {
                      if (currentSkillBuilderPart === 3 && currentTipsConfig.part3) return currentTipsConfig.part3;
                      if (currentSkillBuilderPart === 2 && currentTipsConfig.part2) return currentTipsConfig.part2;
                      return null;
                    };
                    const activePartConfig = getActivePartConfig();
                    const activeSamples = activePartConfig?.sampleResponses || currentTipsConfig.sampleResponses;
                    const activeIdeal = activePartConfig?.idealAnswer || currentTipsConfig.idealAnswer;
                    const partLabel = (currentTipsConfig.part2 || currentTipsConfig.part3)
                      ? ` (Part ${currentSkillBuilderPart})`
                      : '';
                    return (
                      <>
                        <div className="border-t border-gray-200" />

                        {(currentTipsConfig.part2 || currentTipsConfig.part3) && (
                          <p className="text-xs font-semibold text-[#0a66c2]">Showing Part {currentSkillBuilderPart} responses</p>
                        )}

                        <div className="space-y-3">
                          {activeSamples.map((response, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 mb-1">{response.label}</p>
                                  <p className="text-xs text-gray-600 italic">{response.text}</p>
                                </div>
                                <button
                                  onClick={() => handleCopyTip(response.text)}
                                  className="p-1 hover:bg-gray-200 rounded shrink-0 group flex items-center gap-0.5"
                                  title="Copy to response"
                                  data-testid={`button-excel-copy-tip-${idx + 1}`}
                                >
                                  <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700" />
                                  <span className="text-[10px] text-gray-500 group-hover:text-gray-700">TypeIt</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200" />

                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-emerald-800 mb-1">Ideal Answer{partLabel}</p>
                              <p className="text-xs text-emerald-700 italic whitespace-pre-line">{activeIdeal}</p>
                            </div>
                            <button
                              onClick={() => handleCopyTip(activeIdeal)}
                              className="p-1 hover:bg-emerald-100 rounded shrink-0 group flex items-center gap-0.5"
                              title="Copy to response"
                              data-testid="button-excel-copy-ideal"
                            >
                              <Copy className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-800" />
                              <span className="text-[10px] text-emerald-600 group-hover:text-emerald-800">TypeIt</span>
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            );
          })()}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Download className="w-4 h-4" />
            <span>2,341</span>
            <Bookmark className="w-4 h-4 ml-2" />
            <span>28,107</span>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600">+</Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Share2 className="w-4 h-4" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-orange-200 text-orange-700 text-sm font-semibold">MF</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden h-[calc(100vh-3.5rem)]">
        {sidebarOpen && (
          <div className="w-[360px] hidden lg:block h-full flex-shrink-0 bg-[#1b1f23]">
            <ExcelCourseSidebar
              onVideoClick={handleVideoClick}
              onSkillBuilderClick={handleSkillBuilderClick}
              activeItem={selectedVideo}
              activeModuleId={activeModuleId}
            />
          </div>
        )}

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-[#1b1f23] text-white text-sm hover:bg-[#2d3339] transition-colors h-fit"
            data-testid="button-open-excel-sidebar"
          >
            <Menu className="w-4 h-4" />
            Contents
          </button>
        )}

        <div ref={contentPanelRef} className="flex-1 overflow-y-auto bg-gray-50">
          {activeModuleId && MODULE_CONFIGS[activeModuleId] ? (
            <div className="min-h-full bg-white">
              <SkillBuilderInline
                key={activeModuleId}
                moduleId={activeModuleId}
                onClose={() => {
                  setActiveModuleId(null);
                  setSelectedVideo("Learning advanced formulas and functions using Excel");
                }}
                sidebarOpen={sidebarOpen}
                prefillText={tipText}
                onPrefillComplete={() => setTipText('')}
                aiHelpfulness={aiHelpfulness}
                onPartChange={(part) => setCurrentSkillBuilderPart(part)}
              />
            </div>
          ) : selectedVideo ? (
            <>
              <CoursePlayer
                title={selectedVideo}
                courseTitle="Excel: Advanced Formulas and Functions (2023)"
                transcript={currentTranscript}
              />
              <VideoDetails
                instructorName="Oz du Soleil"
                instructorTitle="Excel MVP, Author, and Trainer"
                instructorImage={excelInstructorImg}
                courseDuration="5h 10m"
                courseLevel="Advanced"
                releaseDate="3/23/2023"
                rating={4.8}
                ratingCount={5577}
                transcript={currentTranscript}
              />
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
