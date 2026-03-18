import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { EQCourseSidebar } from '@/components/EQCourseSidebar';
import { CoursePlayer } from '@/components/CoursePlayer';
import { VideoDetails } from '@/components/VideoDetails';
import { SkillBuilderInline, MODULE_CONFIGS } from '@/components/SkillBuilderInline';
import { EQSkillGainSummary, generateEQDemoScores, mergeEQDemoWithReal } from '@/components/EQSkillGainSummary';
import { EQLearningTakeawaysModal } from '@/components/EQLearningTakeawaysReport';
import { eqTranscripts } from '@/data/eqTranscripts';
import { Button } from '@/components/ui/button';
import { Share2, Bookmark, Download, Menu, Lightbulb, ChevronDown, Copy } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
}

const EQ_DEMO_TIPS_CONFIG: Record<string, DemoTipConfig> = {
  eq_emotional_chain: {
    title: "Demo Shortcuts - Emotional Chain",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "The event was Marcus getting the email about the timeline cut. His behavior was sending an angry reply and venting to the team."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "His thoughts and emotions were anger and feeling disrespected—he assumed leadership doesn't care about quality. He could have paused before replying."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "At the thoughts stage, Marcus could have challenged his assumption by considering WHY the timeline was cut—maybe there was a business reason. He could have replied with questions about priorities to cut or proposed a revised scope instead."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (validates outburst → capped at Level 3)",
      text: "Event: email about timeline cut. Behavior: angry reply. Marcus was right to be upset—3 weeks is unreasonable and leadership should hear how the team feels."
    },
    idealAnswer: MODULE_CONFIGS.eq_emotional_chain?.idealAnswer || ""
  },
  eq_ch1_wrapup: {
    title: "Demo Shortcuts - EQ Foundations Wrap-Up",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Aisha is frustrated and angry because her work was reassigned. She sent a Slack message because she's upset. She might do something rash on a Friday afternoon."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Event: learning the presentation was reassigned without being told. Thoughts: 'They don't value my work' and 'Nobody respects me enough to communicate.' Behavior: reaching out impulsively via Slack. The risk is that acting at 5 PM Friday means no chance for resolution, so emotions will stew all weekend."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Aisha is feeling frustrated, disrespected, and possibly betrayed—because her two weeks of effort was reassigned without any communication. Chain: Event = finding out via Marcus, not her manager. Thoughts = 'My work isn't valued, nobody respects me enough to tell me.' Behavior = impulsive Slack message while emotional. The Friday 5 PM timing is critical—there's no opportunity for immediate resolution, so she might send an angry email she'll regret, similar to Marcus's mistake in the Emotional Chain exercise."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (encourages immediate action → capped at Level 3)",
      text: "Aisha is angry and she has every right to be. She should go talk to her manager right now and demand an explanation. The chain is: event happened, she's upset, she should act on it."
    },
    idealAnswer: MODULE_CONFIGS.eq_ch1_wrapup?.idealAnswer || "",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "Tell your manager how you feel. Be honest about being frustrated. Ask why the decision was made."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "1) Start by saying you want to understand, not accuse. 2) Acknowledge the reassignment as a fact and ask about the reasoning. 3) If you feel yourself getting upset, take a pause before responding."
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "1) Lead with your intent: 'I want to understand the decision so I can learn from it' instead of 'Why wasn't I told?' 2) Separate the event from your interpretation—the reassignment happened (fact), but the assumption that your work isn't valued might be wrong, like Tanya's assumption about Alex. 3) Prepare a pause strategy—if frustration rises, say 'Let me think about that for a moment' rather than reacting defensively."
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (passive avoidance → capped at Level 3)",
        text: "Just let it go. These things happen in corporate environments and there's no point making a fuss about it."
      },
      idealAnswer: MODULE_CONFIGS.eq_ch1_wrapup?.part2?.idealAnswer || ""
    }
  },
  eq_cognitive_hijack: {
    title: "Demo Shortcuts - Cognitive Hijack",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Tanya's trigger was seeing Alex present her idea. The physiological symptoms were her face getting hot and hands shaking."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "The cognitive hijack was that her automatic assumption—Alex stole her idea—bypassed rational thinking and led to an impulsive public confrontation."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "The assumption that drove everything was that Alex deliberately stole her work. In reality, the manager assigned it. She acted on an untested assumption in the heat of the moment, which is exactly what a cognitive hijack looks like."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (defends confrontation → capped at Level 3)",
      text: "Tanya's trigger was Alex presenting her idea. Her symptoms were face getting hot and hands shaking. She was right to speak up—you should always defend your work when someone takes credit for it."
    },
    idealAnswer: MODULE_CONFIGS.eq_cognitive_hijack?.idealAnswer || ""
  },
  eq_self_awareness_wrapup: {
    title: "Demo Shortcuts - Self-Awareness Wrap-Up",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Sam's trigger is receiving feedback. The pattern is that Sam gets defensive and justifies everything. Sam should try to be less defensive."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "The pattern includes physiological signs—racing heart, crossed arms—followed by defensive verbal responses like justifying the work instead of listening. Sam could prepare a pre-planned response like 'Thank you, let me think about that.'"
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Sam interprets feedback as personal criticism, which triggers the full chain: racing heart → crossed arms → defensive justification → regret. Sam could identify 'feedback' as a known trigger and practice the pause technique—waiting 60 seconds before responding, reframing the feedback as being about the work, not the person."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (non-actionable advice → capped at Level 3)",
      text: "Sam's trigger is feedback and Sam gets defensive. Sam should just try not to get so defensive and learn to relax when the manager is talking."
    },
    idealAnswer: MODULE_CONFIGS.eq_self_awareness_wrapup?.idealAnswer || "",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "Sam should try to find time for activities that create flow, like presentations and design work."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "Sam should schedule dedicated time for presentations and campaign design, protecting those blocks from interruptions. Sam could also look at whether other tasks are crowding out the activities that used to energize them."
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "Flow activities build confidence and positive emotional experiences, which counteracts the stress/defensiveness cycle. When Sam feels confident from doing great design work, feedback is less likely to trigger a defensive reaction—the emotional baseline is stronger."
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (push through → capped at Level 3)",
        text: "Sam just needs to push through the burnout. Everyone feels tired sometimes—Sam should try harder and the motivation will come back."
      },
      idealAnswer: MODULE_CONFIGS.eq_self_awareness_wrapup?.part2?.idealAnswer || ""
    }
  },
  eq_abcde_model: {
    title: "Demo Shortcuts - ABCDE Model",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "A = Casey was promoted instead of Jordan. B = Jordan thinks they don't value experience. C = Jordan feels resentful and may stop trying."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "D = Maybe there are skills Casey demonstrated that Jordan hasn't focused on yet. What did the decision-makers see? E = Jordan feels less resentful and can have a constructive conversation with their manager."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "The D genuinely challenges the beliefs—instead of 'it's politics,' Jordan considers 'what can I learn from this?' The E shows concrete change: Jordan channels energy into development, has a career growth conversation with their manager, and becomes curious rather than bitter."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (reinforces beliefs → capped at Level 3)",
      text: "A = Casey promoted. B = It's unfair and political. C = Jordan is demotivated. D = Jordan should go to management and demand an explanation for why experience wasn't valued. E = Jordan gets clarity."
    },
    idealAnswer: MODULE_CONFIGS.eq_abcde_model?.idealAnswer || ""
  },
  eq_stress_response_review: {
    title: "Demo Shortcuts - Stress Response Review",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Riley failed to identify the emotional reaction and remove themselves. They jumped straight to calling a meeting while angry instead of taking 60 seconds to breathe. They also made an unrealistic promise to the client."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Step 3 (Recover): Riley never calmed down—went from the team meeting straight to the client call. Step 4 (Challenge): Riley never questioned whether public criticism was productive. They should have considered other approaches."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Step 5 (Choose): Riley made an unrealistic promise while still emotional. Should have waited until calm, consulted the team on a realistic timeline, then called the client with an informed plan. Riley failed at literally every step—acting impulsively throughout instead of slowing down."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (endorses actions → capped at Level 3)",
      text: "Riley was right to call an emergency meeting—that shows decisive leadership. The team needed to know the deadline was missed. Riley should have just been calmer on the client call."
    },
    idealAnswer: MODULE_CONFIGS.eq_stress_response_review?.idealAnswer || ""
  },
  eq_empathy_mistakes: {
    title: "Demo Shortcuts - Empathy Mistakes",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Morgan made it about themselves by constantly sharing their own experience. Morgan also gave unsolicited advice instead of listening."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Morgan assumed they knew how Taylor felt and used definitive language ('you just need to stay positive'). Should have used tentative language like 'I imagine that could make you feel...' Morgan also didn't ask a single question."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "The third mistake is that Morgan dismissed Taylor's emotions with 'just stay positive' rather than validating them. Morgan should have asked questions like 'What do you think happened?' or 'How are you feeling about next steps?' to understand Taylor's perspective before offering anything."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (endorses Morgan → capped at Level 3)",
      text: "Morgan was trying to help by sharing their experience, which is a good empathy technique. The only mistake was being too direct with advice."
    },
    idealAnswer: MODULE_CONFIGS.eq_empathy_mistakes?.idealAnswer || ""
  },
  eq_social_awareness_wrapup: {
    title: "Demo Shortcuts - Social Awareness Wrap-Up",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Lisa seems stressed—the phone checking and pen tapping are unusual for her. Kai and Aisha seem to have tension between them based on avoiding eye contact and sitting apart."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "The Q3 deadline topic caused collective silence and shifting—the team is probably behind schedule or worried about feasibility. Dev keeps self-censoring, which suggests he doesn't feel psychologically safe as the newest member."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Key social cues: Lisa's uncharacteristic fidgeting signals anxiety; Kai and Aisha's deliberate physical distancing signals interpersonal friction; collective body language change when Q3 comes up signals shared anxiety; Dev's repeated self-censoring suggests lack of psychological safety. These are hypotheses, not certainties—social awareness means reading cues and forming testable interpretations."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (makes definitive statements → flag gently)",
      text: "Lisa IS stressed about something at home. Kai and Aisha ARE fighting. The team IS going to miss the Q3 deadline. Dev IS too shy to speak up and needs to be more assertive."
    },
    idealAnswer: MODULE_CONFIGS.eq_social_awareness_wrapup?.idealAnswer || "",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "Hey Dev, I noticed you seemed like you wanted to say something in the meeting. You should speak up more—your ideas matter."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "Hey Dev, I noticed in the meeting today it seemed like you had some ideas you wanted to share. I'd really like to hear your thoughts on the Q3 plan."
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "Hey Dev, I noticed in the meeting today it seemed like you had some ideas you wanted to share. I'd really like to hear your thoughts—your perspective is valuable. What were you thinking when the deadline discussion came up? [Then LISTEN to Dev's response and follow up based on what he says.]"
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (lectures Dev → capped at Level 3)",
        text: "Dev, you need to speak up more in meetings. In your career, nobody will hand you opportunities—you have to make yourself heard. Here's what I suggest you do next time..."
      },
      idealAnswer: MODULE_CONFIGS.eq_social_awareness_wrapup?.part2?.idealAnswer || ""
    }
  },
  eq_feedback_loop: {
    title: "Demo Shortcuts - Feedback Loop",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Questions for a colleague: 'How do I come across when projects hit problems?' and 'Do I seem approachable when things go wrong?' Question for Dana: 'When we hit a snag, what do you think happens between us?' Refine adjustment: I should try to communicate better."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Questions for a colleague: 'How do I generally come across when a project hits a problem? Do I seem approachable or do I shut down?' and 'Have you noticed patterns in how I communicate when things go wrong?' Question for Dana: 'When we hit a snag on a project, I've noticed we tend to go quiet. What do you think happens, and what would work better for you?' Refine: Reach out to Dana within the first hour when a problem arises."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Questions for a colleague: 'How do I generally come across when a project hits a problem? Do I seem approachable or do I shut down?' and 'Have you noticed any patterns in how I communicate when things go wrong—do I withdraw, get tense, or something else?' Question for Dana: 'When we hit a snag on a project, I've noticed we tend to go quiet. I'd like to understand your perspective—what do you think happens, and what would work better for you?' Refine adjustment: When a project hits a problem, instead of going quiet, proactively reach out to Dana within the first hour with a brief message: 'I've noticed X issue—can we spend 10 minutes talking through options?' This small step breaks the silence pattern."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (confrontational questions → flag)",
      text: "Questions for colleague: 'Why does Dana always shut down on me?' Question for Dana: 'Why do you always go quiet when there's a problem? It's frustrating.' Refine: Dana needs to stop being so passive and actually communicate."
    },
    idealAnswer: MODULE_CONFIGS.eq_feedback_loop?.idealAnswer || ""
  },
  eq_capstone: {
    title: "Demo Shortcuts - EQ Capstone",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Amir seems uncomfortable with status updates—maybe give him more space. Priya and Luis had a conflict—address it privately. Kenji is afraid to share ideas—encourage him."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Amir: His reaction to status updates is likely a trigger response from being micromanaged. I'd use empathy and ask how he prefers to share progress. Priya/Luis: I'd talk to each separately first, then establish team norms for disagreements. Kenji: He doesn't feel psychologically safe—I'd create a private channel for suggestions."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Amir: This is a trigger response—his previous manager created an association between status updates and micromanagement. Using empathy and tentative language: 'I notice status updates might feel uncomfortable—I'd like to find a format that works for both of us.' Priya/Luis: Social awareness tells me the whole team was uncomfortable. Address separately—with Priya, use intent vs impact. With Luis, create safe space. Then establish team norms for healthy disagreement. Kenji: Social awareness tells me he feels psychologically unsafe. Use empathy: 'I'd love to hear your ideas. What changes do you think would help?' Validate his concern about 'stepping on toes.'"
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (authoritative → flag)",
      text: "Amir: Tell him he needs to give proper status updates—that's part of the job. Priya/Luis: Tell them to stop arguing in meetings and be professional. Kenji: Tell him to speak up—he needs to be more assertive if he wants to succeed."
    },
    idealAnswer: MODULE_CONFIGS.eq_capstone?.idealAnswer || "",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "Priya, I need to talk to you about the meeting. You raised your voice and it made people uncomfortable. You need to control your temper."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "Priya, your commitment to getting priorities right is a real strength. But in the meeting, when you raised your voice, Luis shut down and the team felt caught in the middle. What if we found a way to channel that energy differently?"
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "Priya, I want to start by saying your commitment to getting priorities right is one of your biggest strengths—the team benefits from your drive. I know from my own experience that when you care deeply about something, it can be hard to manage how that comes across in the moment. In last week's meeting, I think your intent was to make sure we made the right decision, but the impact was that Luis shut down and the rest of the team felt caught in the middle. What if we tried the pause technique before responding in heated discussions—even 60 seconds can help you choose how to channel that energy so your great ideas actually land?"
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (harsh/critical → flag)",
        text: "Priya, your behavior in the meeting was unacceptable. You made everyone uncomfortable and Luis won't even look at you now. You need to learn to control yourself."
      },
      idealAnswer: MODULE_CONFIGS.eq_capstone?.part2?.idealAnswer || ""
    }
  },
};

const EQ_VIDEO_URLS: Record<string, string> = {
  "What are the benefits of emotional intelligence?": "/videos/Emotional/3272143_en_US_00_01_WL30.mp4",
  "What is emotional intelligence?": "/videos/Emotional/3272143_en_US_01_01_MM30.mp4",
  "The emotions in EQ": "/videos/Emotional/3272143_en_US_01_02_MM30.mp4",
  "Managing emotional reactions": "/videos/Emotional/3272143_en_US_01_03_MM30.mp4",
  "Understanding your personal EQ": "/videos/Emotional/3272143_en_US_02_01_MM30.mp4",
  "Managing your mindset": "/videos/Emotional/3272143_en_US_02_02_MM30.mp4",
  "Finding your flow": "/videos/Emotional/3272143_en_US_02_03_MM30.mp4",
  "Thoughts and emotional intelligence": "/videos/Emotional/3272143_en_US_03_01_MM30.mp4",
  "Dealing with stressful situations": "/videos/Emotional/3272143_en_US_03_02_MM30.mp4",
  "Shift perspective to shape behavior": "/videos/Emotional/3272143_en_US_03_03_MM30.mp4",
  "Developing social awareness": "/videos/Emotional/3272143_en_US_04_01_MM30.mp4",
  "Connecting with empathy": "/videos/Emotional/3272143_en_US_04_02_MM30.mp4",
  "Communication and social awareness": "/videos/Emotional/3272143_en_US_04_03_MM30.mp4",
  "Play to your personal strengths": "/videos/Emotional/3272143_en_US_05_01_MM30.mp4",
  "Collect feedback to build connection": "/videos/Emotional/3272143_en_US_05_02_MM30.mp4",
  "Communicate intention and impact": "/videos/Emotional/3272143_en_US_05_03_MM30.mp4",
};

type TocItem = { type: 'video' | 'text'; title: string } | { type: 'skill-builder'; moduleId: string };

const EQ_TOC_ORDER: TocItem[] = [
  { type: 'video', title: "What are the benefits of emotional intelligence?" },
  { type: 'text', title: "Note to learner" },
  { type: 'video', title: "What is emotional intelligence?" },
  { type: 'video', title: "The emotions in EQ" },
  { type: 'skill-builder', moduleId: "eq_emotional_chain" },
  { type: 'video', title: "Managing emotional reactions" },
  { type: 'skill-builder', moduleId: "eq_ch1_wrapup" },
  { type: 'video', title: "Understanding your personal EQ" },
  { type: 'video', title: "Managing your mindset" },
  { type: 'skill-builder', moduleId: "eq_cognitive_hijack" },
  { type: 'video', title: "Finding your flow" },
  { type: 'skill-builder', moduleId: "eq_self_awareness_wrapup" },
  { type: 'video', title: "Thoughts and emotional intelligence" },
  { type: 'skill-builder', moduleId: "eq_abcde_model" },
  { type: 'video', title: "Dealing with stressful situations" },
  { type: 'video', title: "Shift perspective to shape behavior" },
  { type: 'skill-builder', moduleId: "eq_stress_response_review" },
  { type: 'video', title: "Developing social awareness" },
  { type: 'video', title: "Connecting with empathy" },
  { type: 'skill-builder', moduleId: "eq_empathy_mistakes" },
  { type: 'video', title: "Communication and social awareness" },
  { type: 'skill-builder', moduleId: "eq_social_awareness_wrapup" },
  { type: 'video', title: "Play to your personal strengths" },
  { type: 'video', title: "Collect feedback to build connection" },
  { type: 'skill-builder', moduleId: "eq_feedback_loop" },
  { type: 'video', title: "Communicate intention and impact" },
  { type: 'skill-builder', moduleId: "eq_capstone" },
];

export default function EQCourseView() {
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>("What are the benefits of emotional intelligence?");
  const [isNoteToLearnerActive, setIsNoteToLearnerActive] = useState(false);
  const [isSkillBuilderActive, setIsSkillBuilderActive] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string>('');
  const [passedModuleIds, setPassedModuleIds] = useState<Set<string>>(new Set());
  const [sessionId] = useState(() => `eq_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [showDemoTips, setShowDemoTips] = useState(false);
  const [tipText, setTipText] = useState('');
  const [aiHelpfulness, setAiHelpfulness] = useState(3);
  const [currentSkillBuilderPart, setCurrentSkillBuilderPart] = useState<1 | 2 | 3>(1);
  const [isSkillGainSummaryActive, setIsSkillGainSummaryActive] = useState(false);
  const [showLearningTakeawaysModal, setShowLearningTakeawaysModal] = useState(false);
  const [takeawaysScores, setTakeawaysScores] = useState<Record<string, { score: number; userResponse: string; feedback: string; partScores?: Record<number, number> }>>({});
  const [takeawaysDemoScores] = useState(() => generateEQDemoScores());
  const demoPanelRef = useRef<HTMLDivElement>(null);
  const contentPanelRef = useRef<HTMLDivElement>(null);

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
  }, [selectedVideo, activeModuleId, isNoteToLearnerActive]);

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

  const currentTranscript = selectedVideo ? eqTranscripts[selectedVideo] : undefined;

  const getCurrentTocIndex = (): number => {
    if (isNoteToLearnerActive) {
      return EQ_TOC_ORDER.findIndex(item => item.type === 'text' && item.title === 'Note to learner');
    }
    if (isSkillBuilderActive && activeModuleId) {
      return EQ_TOC_ORDER.findIndex(item => item.type === 'skill-builder' && item.moduleId === activeModuleId);
    }
    if (selectedVideo) {
      return EQ_TOC_ORDER.findIndex(item => (item.type === 'video' || item.type === 'text') && item.title === selectedVideo);
    }
    return -1;
  };

  const navigateToTocItem = (item: TocItem) => {
    setIsSkillBuilderActive(false);
    setActiveModuleId('');
    setSelectedVideo(null);
    setIsNoteToLearnerActive(false);
    setIsSkillGainSummaryActive(false);

    if (item.type === 'video') {
      setSelectedVideo(item.title);
    } else if (item.type === 'text') {
      setIsNoteToLearnerActive(true);
    } else if (item.type === 'skill-builder') {
      setIsSkillBuilderActive(true);
      setActiveModuleId(item.moduleId);
      setCurrentSkillBuilderPart(1);
    }
  };

  const handleTocPrevious = () => {
    const idx = getCurrentTocIndex();
    if (idx > 0) navigateToTocItem(EQ_TOC_ORDER[idx - 1]);
  };

  const handleTocNext = () => {
    const idx = getCurrentTocIndex();
    if (idx >= 0 && idx < EQ_TOC_ORDER.length - 1) navigateToTocItem(EQ_TOC_ORDER[idx + 1]);
  };

  const handleTextItemClick = (title: string) => {
    setIsSkillBuilderActive(false);
    setActiveModuleId('');
    setSelectedVideo(null);
    setIsSkillGainSummaryActive(false);
    setIsNoteToLearnerActive(true);
  };

  const handleSkillBuilderClick = (moduleId: string) => {
    setIsSkillBuilderActive(true);
    setActiveModuleId(moduleId);
    setSelectedVideo(null);
    setIsNoteToLearnerActive(false);
    setIsSkillGainSummaryActive(false);
    setCurrentSkillBuilderPart(1);
  };

  const handleSkillBuilderClose = () => {
    setIsSkillBuilderActive(false);
    setActiveModuleId('');
  };

  const handleContinueWithCourse = () => {
    setIsSkillBuilderActive(false);
    setActiveModuleId('');
    setIsNoteToLearnerActive(false);
    setSelectedVideo("What are the benefits of emotional intelligence?");
  };

  const handleSkillGainSummaryClick = () => {
    setIsSkillBuilderActive(false);
    setActiveModuleId('');
    setSelectedVideo(null);
    setIsNoteToLearnerActive(false);
    setIsSkillGainSummaryActive(true);
  };

  const handleLearningTakeawaysClick = () => {
    fetch(`/api/attempts/session/${sessionId}`)
      .then(res => res.json())
      .then(data => setTakeawaysScores(data))
      .catch(() => {});
    setShowLearningTakeawaysModal(true);
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
            data-testid="button-eq-demo-tips"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">Demo Shortcuts</span>
            <ChevronDown className={`w-3 h-3 text-gray-300 transition-transform ${showDemoTips ? 'rotate-180' : ''}`} />
          </button>

          {showDemoTips && (() => {
            const currentTipsConfig = EQ_DEMO_TIPS_CONFIG[activeModuleId] || EQ_DEMO_TIPS_CONFIG.eq_emotional_chain;
            return (
              <div className="absolute top-full right-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
                <div className="pl-5 pr-10 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate('/courses')}
                      className="bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 text-sm font-semibold gap-1.5 rounded-full"
                      data-testid="button-eq-course-menu-demo"
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
                      data-testid="slider-eq-ai-helpfulness"
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
                      if (currentSkillBuilderPart === 2 && currentTipsConfig.part2) return currentTipsConfig.part2;
                      return null;
                    };
                    const activePartConfig = getActivePartConfig();
                    const activeSamples = activePartConfig?.sampleResponses || currentTipsConfig.sampleResponses;
                    const activeIdeal = activePartConfig?.idealAnswer || currentTipsConfig.idealAnswer;
                    const partLabel = currentTipsConfig.part2
                      ? ` (Part ${currentSkillBuilderPart})`
                      : '';
                    return (
                      <>
                        <div className="border-t border-gray-200" />

                        {currentTipsConfig.part2 && (
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
                                  data-testid={`button-eq-copy-tip-${idx + 1}`}
                                >
                                  <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700" />
                                  <span className="text-[10px] text-gray-500 group-hover:text-gray-700">TypeIt</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {(() => {
                          const activeErroneous = activePartConfig?.erroneousResponse || currentTipsConfig.erroneousResponse;
                          if (!activeErroneous) return null;
                          return (
                            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-red-800 mb-1">{activeErroneous.label}</p>
                                  <p className="text-xs text-red-700 italic">{activeErroneous.text}</p>
                                </div>
                                <button
                                  onClick={() => handleCopyTip(activeErroneous.text)}
                                  className="p-1 hover:bg-red-100 rounded shrink-0 group flex items-center gap-0.5"
                                  title="Copy to response"
                                  data-testid="button-eq-copy-tip-erroneous"
                                >
                                  <Copy className="w-3.5 h-3.5 text-red-500 group-hover:text-red-700" />
                                  <span className="text-[10px] text-red-500 group-hover:text-red-700">TypeIt</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 mb-1">Ideal Answer{partLabel} <span className="text-xs font-normal text-gray-500">(created by instructor or AI)</span></p>
                              <p className="text-xs text-gray-600 italic whitespace-pre-line">{activeIdeal}</p>
                            </div>
                            <button
                              onClick={() => handleCopyTip(activeIdeal)}
                              className="p-1 hover:bg-blue-100 rounded shrink-0 group flex items-center gap-0.5"
                              title="Copy to response"
                              data-testid="button-eq-copy-tip-ideal"
                            >
                              <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700" />
                              <span className="text-[10px] text-gray-500 group-hover:text-gray-700">TypeIt</span>
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
            <span>892</span>
            <Bookmark className="w-4 h-4 ml-2" />
            <span>15,204</span>
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
            <EQCourseSidebar
              onVideoClick={(title) => {
                setIsSkillBuilderActive(false);
                setActiveModuleId('');
                setIsSkillGainSummaryActive(false);
                setIsNoteToLearnerActive(false);
                setSelectedVideo(title);
              }}
              onTextItemClick={handleTextItemClick}
              onSkillBuilderClick={handleSkillBuilderClick}
              onSkillGainSummaryClick={handleSkillGainSummaryClick}
              onLearningTakeawaysClick={handleLearningTakeawaysClick}
              activeItem={isSkillGainSummaryActive ? 'Skill Gains Summary' : isNoteToLearnerActive ? 'Note to learner' : isSkillBuilderActive ? 'Skill Builder' : selectedVideo}
              activeModuleId={activeModuleId}
              passedModuleIds={passedModuleIds}
            />
          </div>
        )}

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-[#1b1f23] text-white text-sm hover:bg-[#2d3339] transition-colors h-fit"
            data-testid="button-open-eq-sidebar"
          >
            <Menu className="w-4 h-4" />
            Contents
          </button>
        )}

        <div ref={contentPanelRef} className="flex-1 overflow-y-auto bg-gray-50">
          {selectedVideo && !isSkillBuilderActive && !isNoteToLearnerActive && (
            <>
              <CoursePlayer
                title={selectedVideo}
                courseTitle="Developing Your Emotional Intelligence"
                videoUrl={EQ_VIDEO_URLS[selectedVideo] || undefined}
                transcript={currentTranscript}
              />
              <VideoDetails
                instructorName="Gemma Leigh Roberts"
                instructorTitle="Psychologist, Speaker, and Author"
                courseDuration="1h 25m"
                courseLevel="Beginner + Intermediate"
                releaseDate="03/15/2024"
                rating={4.7}
                ratingCount={1842}
                transcript={currentTranscript}
              />
            </>
          )}

          {isNoteToLearnerActive && (
            <div className="bg-white min-h-[60vh] flex flex-col items-center pt-16 px-8" data-testid="note-to-learner">
              <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-12">
                  <div className="flex-1 h-[2px] bg-[#0a66c2]" />
                  <svg className="w-10 h-10 text-[#0a66c2] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <div className="flex-1 h-[2px] bg-[#0a66c2]" />
                </div>

                <p className="text-gray-800 text-base leading-relaxed mb-16">
                  Note: This course includes audio descriptions (AD). To view a version of this course without AD, see <span className="italic">Developing Your Emotional Intelligence</span>.
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleTocPrevious}
                    className="px-6 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 transition-colors text-sm font-medium"
                    data-testid="button-note-previous"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleTocNext}
                    className="px-6 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 transition-colors text-sm font-medium"
                    data-testid="button-note-next"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {isSkillBuilderActive && (
            <div className="bg-white p-0 relative w-full">
              <SkillBuilderInline
                key={activeModuleId}
                moduleId={activeModuleId}
                sessionId={sessionId}
                onClose={handleSkillBuilderClose}
                onContinue={handleContinueWithCourse}
                onComplete={(_response?: string, score?: number, completedModuleId?: string) => {
                  if (score && score >= 3 && completedModuleId) {
                    setPassedModuleIds(prev => {
                      const next = new Set(Array.from(prev));
                      next.add(completedModuleId);
                      return next;
                    });
                  }
                }}
                prefillText={tipText}
                onPrefillComplete={() => setTipText('')}
                aiHelpfulness={aiHelpfulness}
                onAiHelpfulnessChange={setAiHelpfulness}
                onViewSummary={() => {
                  setIsSkillBuilderActive(false);
                  setIsSkillGainSummaryActive(true);
                }}
                onPartChange={(part) => setCurrentSkillBuilderPart(part)}
                sidebarOpen={sidebarOpen}
              />
            </div>
          )}

          {isSkillGainSummaryActive && (
            <EQSkillGainSummary sessionId={sessionId} />
          )}
        </div>
      </main>

      <EQLearningTakeawaysModal
        open={showLearningTakeawaysModal}
        onOpenChange={setShowLearningTakeawaysModal}
        bestScores={takeawaysScores}
        demoBestScores={mergeEQDemoWithReal(takeawaysDemoScores, takeawaysScores)}
        completedCount={Object.keys(takeawaysScores).length}
        totalModules={10}
      />
    </div>
  );
}
