import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mic, MicOff, Save, FileText, FileSpreadsheet, ArrowUp, Settings, X, CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { BadgeUnlockNotification } from './Badge';
import type { Badge } from '@shared/schema';
import { EXCEL_MODULE_CONFIGS, EXCEL_MODULE_SUBTITLES, type ExcelModuleConfig } from '@/data/excelSkillBuilders';
import { FileUploadZone } from './FileUploadZone';

let hasShownWelcome = false;

interface SkillBuilderInlineProps {
  onClose: () => void;
  onContinue?: () => void;
  onComplete?: (collatedResponse?: string, score?: number, moduleId?: string) => void;
  onTakeaways?: () => void;
  onViewSummary?: () => void;
  prefillText?: string;
  onPrefillComplete?: () => void;
  aiHelpfulness?: number;
  onAiHelpfulnessChange?: (level: number) => void;
  moduleId?: string;
  showRefNumbers?: boolean;
  onJumpToWrapUp?: () => void;
  onPartChange?: (part: 1 | 2 | 3) => void;
  sidebarOpen?: boolean;
  sessionId?: string;
  onScoreUpdate?: (score: number, moduleId: string) => void;
}

interface FeedbackData {
  score: number;
  message: string;
  strengths: string[];
  improvements: string[];
}

interface AttemptRecord {
  input: string;
  feedback: FeedbackData;
}

interface ConversationMessage {
  role: 'ai' | 'user';
  content: string;
  score?: number;
  isCombinedResponse?: boolean;
  isPartQuestion?: boolean;
  strengths?: string[];
  improvements?: string[];
}

interface PartConfig {
  question: string;
  idealAnswer: string;
  scoringCriteria: string;
}

interface ModuleConfig {
  id: string;
  initialQuestion: string;
  idealAnswer: string;
  scoringCriteria: string;
  goalText: string;
  durationText?: string;
  prepareItems: string[];
  part2?: PartConfig;
  part3?: PartConfig;
}

// Ta-da Text Component for streak encouragement
function SlotMachineText({ phrases }: { phrases: string[] }) {
  const selectedPhrase = useMemo(() => phrases[Math.floor(Math.random() * phrases.length)], [phrases]);
  
  return (
    <motion.div 
      className="flex-1 flex justify-center items-center"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: 0.3,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 12
      }}
    >
      <motion.span
        className="text-sm font-semibold text-purple-600 italic inline-flex items-center gap-2"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          ✨
        </motion.span>
        {selectedPhrase}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          ✨
        </motion.span>
      </motion.span>
    </motion.div>
  );
}

export const MODULE_CONFIGS: Record<string, ModuleConfig> = {
  ...EXCEL_MODULE_CONFIGS as Record<string, ModuleConfig>,
  project_stakeholders: {
    id: 'project_stakeholders',
    initialQuestion: `Consider this scenario. As the lead project manager at Brisbane Hospital, you need the authority and support from the sponsor to work with project stakeholders to deliver this objective from the scope statement:

<strong>Decrease rescheduling procedures by 75%</strong>

Which stakeholders can help you accomplish this objective? Name 2-3 and briefly explain why each is critical.`,
    idealAnswer: `To ensure rescheduling procedures are decreased, facilities must be available to meet patient demand. This may require changing the available hours for procedure rooms and ensuring they are appropriately staffed during those hours.

Nicholas Anderson (VP General Services) and David Moore (Facilities) are the owners of the procedure rooms, so they will need to be consulted about availability, facility capacity, and the equipment used during procedures.

If staffing shortages cause reschedules, Dr. Samuel Tan (Physician Services) and Christina Garcia (Director of Nursing) would be needed to ensure the technicians, doctors, and nurses are available to reduce the rescheduling times and meet this project objective.`,
    scoringCriteria: `SCORING CRITERIA - Score ONLY against the ideal answer above, do NOT require anything beyond it:
- 5 (Expert): Covers ALL 4 key stakeholders from the ideal answer (Nicholas Anderson, David Moore, Dr. Samuel Tan, AND Christina Garcia) with reasoning about BOTH facility availability/hours AND staffing needs. Shows understanding of why each stakeholder is critical to the specific objective.
- 4 (Proficient): Covers 3 of the 4 key stakeholders with reasoning that addresses either facility or staffing needs (or both).
- 3 (Competent): Covers 2-3 key stakeholders with some reasoning for each.
- 2 (Basic): Covers only 1 key stakeholder, or mentions stakeholders but with minimal reasoning, or includes incorrect stakeholders (e.g., CEO for day-to-day scheduling decisions).
- 1 (Novice): Missing most key points or off-topic.
IMPORTANT: Naming 2-3 correct stakeholders with brief reasoning is Level 3-4, not Level 5. Level 5 requires covering all 4 key stakeholders with reasoning about both facility AND staffing dimensions.

SCORING DECISION TREE:
1. Does the combined response cover 3+ correct stakeholders with reasoning addressing facility or staffing needs? → If NO, max Level 3.
2. If YES: Are there uncorrected errors (e.g., incorrect stakeholders like CEO for day-to-day scheduling)? → If YES, score Level 3 and flag error first.
3. If YES (3+ stakeholders with reasoning) AND NO errors: Score Level 4.
4. Does it cover ALL 4 key stakeholders with reasoning about BOTH facility availability AND staffing needs? → Score Level 5.

ERROR HANDLING: If the response includes an incorrect stakeholder (e.g., suggesting the hospital CEO for day-to-day scheduling decisions), flag this error FIRST in the improvements feedback. The presence of uncorrected incorrect stakeholders in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Use the background scope statement and organizational chart to identify the right stakeholders for a particular scope objective.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>Creating a Project Charter</em> and <em>Identifying Project Stakeholders</em>',
      'Review the <a href="/attached_assets/Scope_Solution_1768351854988.pdf" target="_blank" class="text-[#0a66c2] hover:underline">Project Scope Statement</a> <span class="text-xs text-gray-500">(new tab)</span>',
      'Review the <a href="/attached_assets/Org_Chart_1768351939716.pdf" target="_blank" class="text-[#0a66c2] hover:underline">Brisbane Hospital Organization Chart</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ]
  },
  scope_wbs_reflection: {
    id: 'scope_wbs_reflection',
    initialQuestion: `I've reviewed the draft Work Breakdown Structure for the Brisbane Hospital Patient Scheduling Improvement Project. There are several issues with this WBS that need to be addressed before it can be approved.

Looking at the WBS document, what problems do you see? Identify 3-5 specific issues that need to be fixed.`,
    idealAnswer: `The WBS has the following issues:
(1) Vague work packages - Items like "Do planning stuff" and "Reduce wait times somehow" are too vague to be estimated or assigned.
(2) Activity-focused instead of deliverable-focused - Items like "Hold kickoff meeting" describe actions, not deliverables.
(3) Catch-all "Other Tasks" category - "Miscellaneous items" and "TBD" violate WBS best practices.
(4) Violates the 100% Rule - Missing key deliverables like project documentation and project closure.
(5) Inconsistent decomposition - Testing has 8 sub-items while Training has only 2.`,
    scoringCriteria: `SCORING CRITERIA - The learner is reviewing a problematic WBS and identifying issues:
- 5 (Expert): Identifies 4-5 distinct issues from the ideal answer with clear explanations.
- 4 (Proficient): Identifies 3 issues with reasonable explanations.
- 3 (Competent): Identifies 2 issues with some explanation.
- 2 (Basic): Identifies 1 issue or shows general awareness that something is wrong.
- 1 (Novice): Does not identify specific issues or response is off-topic.

Key issues include: vague work packages, activity-focused items, catch-all categories, 100% rule violation, inconsistent decomposition.

SCORING DECISION TREE:
1. Does the combined response identify 3+ distinct WBS issues with reasonable explanations? → If NO, max Level 3.
2. If YES: Are there uncorrected factual errors about WBS best practices? → If YES, score Level 3 and flag error first.
3. If YES (3+ issues) AND NO errors: Score Level 4.
4. Does it identify 4-5 issues with clear, detailed explanations? → Score Level 5.

ERROR HANDLING: If the response includes factually incorrect claims about WBS best practices (e.g., claiming testing should not be included in a WBS), flag this error FIRST in the improvements feedback. The presence of uncorrected factual errors in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Review the draft WBS document and identify issues that need to be fixed. This exercise helps you apply WBS best practices to real-world documents.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Finish watching <em>Defining Scope</em> and <em>Work Breakdown Structure</em>',
      'Review the <a href="/wbs-review-exercise.html" target="_blank" class="text-[#0a66c2] hover:underline">Draft WBS Document</a> <span class="text-xs text-gray-500">(opens in new tab)</span>'
    ]
  },
  csf_functions: {
    id: 'csf_functions',
    initialQuestion: `Your company just experienced a security incident. An employee clicked on a phishing email, which led to attackers accessing your customer database. The breach wasn't discovered for 3 weeks. Now leadership is asking how to prevent this from happening again.

Using what you learned about the six CSF functions (Identify, Protect, Detect, Respond, Recover, and Govern), which 2-3 functions were most likely weak in this scenario? Give 1 sentence of reasoning for each.`,
    idealAnswer: `Multiple CSF functions were likely weak:

DETECT was clearly weak—the breach wasn't discovered for 3 weeks, meaning monitoring and alerting capabilities were inadequate.

PROTECT was weak—the phishing email succeeded without safeguards like MFA or email filtering to prevent or limit the compromise.

GOVERN was likely weak—there may not have been clear policies or leadership oversight ensuring cybersecurity was integrated into operations.

IDENTIFY may have been weak—if the customer database wasn't recognized as a critical asset, it may not have received stronger protections.`,
    scoringCriteria: `SCORING CRITERIA - The learner is analyzing which CSF functions were weak:
- 5 (Expert): Identifies ALL 4 relevant functions (DETECT, PROTECT, GOVERN, and IDENTIFY) with reasoning for each that connects to the scenario. The IDENTIFY insight (recognizing the database as a critical asset would have triggered stronger protections) is what distinguishes Level 5 from Level 4.
- 4 (Proficient): Identifies 3 correct functions including DETECT, PROTECT, and GOVERN—even with brief reasoning for some. Having GOVERN shows analytical thinking beyond the obvious. Does NOT yet identify IDENTIFY as a weakness.
- 3 (Competent): Identifies 2-3 functions including at least DETECT or PROTECT, AND adds meaningful analysis beyond simply restating what the scenario says. OR: identifies 3+ correct functions but has uncorrected errors (see ERROR HANDLING).
- 2 (Basic): Identifies only the 2 most obvious functions (DETECT and PROTECT) with reasoning that mostly restates scenario facts (e.g., "breach wasn't found for 3 weeks" and "phishing got through") without deeper analysis of WHY or WHAT was missing.
- 1 (Novice): Does not correctly identify relevant functions or response is off-topic.

IMPORTANT: A response that ONLY names DETECT and PROTECT with brief scenario-restating reasoning is Level 2. To reach Level 3, the response must either add a third function OR provide deeper analysis of the two. Level 4 requires GOVERN. Level 5 requires all four including IDENTIFY.

SCORING DECISION TREE:
1. Does the combined response include DETECT + PROTECT + GOVERN? → If NO, max Level 3.
2. If YES: Are there uncorrected errors (e.g., conflating Recover with Detect)? → If YES, score Level 3 and flag error first.
3. If YES functions AND NO errors: Score Level 4.
4. Does it also include IDENTIFY with reasoning? → Score Level 5.

ERROR HANDLING: If the response confuses CSF function definitions (e.g., conflating Recover with Detect), flag this error FIRST in the improvements feedback. The presence of uncorrected definitional errors in the combined responses caps the score at Level 3 maximum, even if other content is strong. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Analyze a security incident scenario and identify which NIST CSF 2.0 functions were weak, demonstrating your understanding of how the functions work together.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>Core functions of the NIST Cybersecurity Framework</em>',
      'Finish watching <em>Key framework updates</em>'
    ]
  },
  asset_classification: {
    id: 'asset_classification',
    initialQuestion: `You're the new IT security lead at a mid-size healthcare company. Your first task is to classify the following assets by criticality level (Critical, High, Medium, or Low). For each, state the level and give a brief reason why.

<strong>1.</strong> Patient medical records database
<strong>2.</strong> Employee break room smart coffee machine (connected to WiFi)
<strong>3.</strong> Billing and payment processing system
<strong>4.</strong> Company marketing website
<strong>5.</strong> Email server used by all staff
<strong>6.</strong> A test server a developer set up 2 years ago for a project (still running)`,
    idealAnswer: `1. Patient medical records database - CRITICAL. Contains PHI regulated by HIPAA; a breach means fines, lawsuits, and lost trust.

2. Break room coffee machine - LOW. No sensitive data, but should still be inventoried as a potential network entry point.

3. Billing and payment processing system - CRITICAL. Handles payment card data (PCI-DSS); compromise leads to fraud and regulatory penalties.

4. Company marketing website - MEDIUM. Public-facing but no sensitive data; defacement is embarrassing, not catastrophic.

5. Email server - HIGH to CRITICAL. Contains sensitive communications and credentials; a common attack vector for phishing and data leaks.

6. Forgotten test server - HIGH (risk). Classic shadow IT—likely unpatched, unmonitored, and a prime target for attackers.`,
    scoringCriteria: `SCORING CRITERIA - The learner is classifying assets by criticality:
- 5 (Expert): Correctly classifies all 6 assets with solid reasoning. Identifies patient records and billing as Critical, email as High/Critical, and correctly flags the forgotten test server as a significant risk.
- 4 (Proficient): Correctly classifies 4-5 assets with reasonable explanations. May miss nuances like the test server risk.
- 3 (Competent): Correctly classifies 3-4 assets. Shows basic understanding of criticality but may misrank some items.
- 2 (Basic): Classifies 1-2 assets correctly or shows general awareness of asset classification without specifics.
- 1 (Novice): Classifications are mostly incorrect or no reasoning provided.

Key insights: Patient records and billing are crown jewels. The forgotten test server is a shadow IT security risk. Coffee machine is low but still needs inventory.

SCORING DECISION TREE:
1. Does the combined response correctly classify 4+ assets with risk reasoning? → If NO, max Level 3.
2. If YES: Are there uncorrected misclassifications (e.g., marketing website rated Critical)? → If YES, score Level 3 and flag error first.
3. If YES (4+ correct) AND NO errors: Score Level 4.
4. Does it correctly classify all 6 assets with solid reasoning, including flagging the forgotten test server as a shadow IT risk? → Score Level 5.

ERROR HANDLING: If the response includes incorrect classifications (e.g., rating the marketing website as Critical when it has no sensitive data), flag this error FIRST in the improvements feedback. The presence of uncorrected misclassifications in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Classify organizational assets by criticality level, demonstrating your understanding of what makes certain assets 'crown jewels' versus lower-priority items.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Finish watching <em>Asset management</em>',
      'Review the <a href="/asset-classification-guide.html" target="_blank" class="text-[#0a66c2] hover:underline">Asset Classification Quick Reference</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ]
  },
  risk_communication: {
    id: 'risk_communication',
    initialQuestion: `Your security team just completed a vulnerability scan and found this issue:

<em>"CVE-2024-1234: Critical RCE vulnerability in Apache Struts 2.5.30. CVSS score 9.8. Unpatched on 3 production web servers. Exploit code publicly available."</em>

You need to communicate this risk to the executive leadership team (CEO, CFO, COO) who are not technical. They need to understand the urgency and approve an emergency patching window.

Write a 2-3 sentence summary that translates this technical risk into business terms they can understand and act on.`,
    idealAnswer: `A strong executive summary might read:

"We've found a critical security flaw in three customer-facing systems that hackers are actively exploiting at other companies. If we don't patch within 48 hours, attackers could access customer data, costing us millions in fines and reputation damage. We need to approve an emergency maintenance window this week."

Key elements: (1) States the business impact, (2) Creates urgency, (3) Proposes clear action, (4) Quantifies risk in business terms.`,
    scoringCriteria: `SCORING CRITERIA - The learner is translating technical risk to business language:
- 5 (Expert): Summary is clear, non-technical, covers business impact, urgency, proposed action, and potential cost. Executives would understand and act.
- 4 (Proficient): Summary covers 3 of 4 key elements. Minor technical jargon may remain but overall message is clear.
- 3 (Competent): Summary attempts translation but still contains significant jargon or misses key elements like business impact or urgency.
- 2 (Basic): Summary is too technical or too vague. Doesn't give executives clear understanding or action items.
- 1 (Novice): Summary is essentially the same technical language or completely misses the point.

Key insight: Avoid terms like CVE, RCE, CVSS, Apache Struts. Focus on: what could happen, how likely, what it costs, what to do.

SCORING DECISION TREE:
1. Does the combined response cover 3 of 4 key elements (business impact, urgency, proposed action, potential cost) in non-technical language? → If NO, max Level 3.
2. If YES: Are there uncorrected dangerous recommendations (e.g., delaying action) or significant technical jargon? → If YES, score Level 3 and flag error first.
3. If YES (3+ elements) AND NO errors/jargon: Score Level 4.
4. Does it cover all 4 elements (business impact, urgency, proposed action, AND quantified cost) clearly enough that executives would understand and act? → Score Level 5.

ERROR HANDLING: If the response suggests delaying action on a critical, actively-exploited vulnerability (e.g., waiting for a scheduled maintenance window), flag this error FIRST in the improvements feedback—this is dangerous advice. Also flag any remaining technical jargon. The presence of uncorrected dangerous recommendations or significant jargon in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Translate a technical security vulnerability into business terms that executives can understand and act upon.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>Risk assessment and risk strategy</em>',
      'Review the <a href="/risk-communication-template.html" target="_blank" class="text-[#0a66c2] hover:underline">Executive Risk Communication Template</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ]
  },
  identify_wrapup: {
    id: 'identify_wrapup',
    initialQuestion: `You've been hired as a cybersecurity consultant for a growing e-commerce startup (50 employees, $10M annual revenue). After your initial assessment, you've identified these issues:

• No complete inventory of IT assets exists
• The CTO handles all security decisions alone, with no formal policies
• Risk discussions happen only after incidents occur
• Several employees have admin access "just in case"

<strong>Part 1:</strong> Write 2-3 prioritized recommendations. For each, name which Identify pillar it addresses (Asset Management, Risk Assessment, or Governance) and explain why in 1 sentence.`,
    idealAnswer: `1. ASSET INVENTORY (Asset Management) - Conduct a complete inventory of all hardware, software, and data—you can't protect what you don't know you have.

2. ESTABLISH GOVERNANCE (Governance) - Move security decisions from the CTO alone to a formal structure with policies, roles, and executive oversight.

3. PROACTIVE RISK ASSESSMENT (Risk Assessment) - Shift from reactive to proactive by establishing regular risk assessments to prioritize threats before incidents occur.`,
    scoringCriteria: `SCORING CRITERIA - The learner is creating an action plan for the Identify function:
- 5 (Expert): Provides 2-3 clear recommendations covering all 3 Identify pillars (Asset Management, Risk Assessment, Governance) with specific reasoning tied to the scenario issues.
- 4 (Proficient): Covers at least 2 pillars well with good reasoning connected to the scenario.
- 3 (Competent): Provides 1-2 recommendations with some reasoning. Shows basic understanding of Identify pillars.
- 2 (Basic): Recommendations are vague or don't connect to the specific issues found.
- 1 (Novice): Recommendations are off-topic or don't address the identified issues.

Key insight: Best responses map each recommendation to a specific Identify pillar and connect to the scenario's issues.

SCORING DECISION TREE:
1. Does the combined response cover at least 2 Identify pillars with good reasoning connected to the scenario? → If NO, max Level 3.
2. If YES: Are there uncorrected off-scope recommendations (e.g., SIEM or endpoint detection from the Detect function)? → If YES, score Level 3 and flag error first.
3. If YES (2+ pillars with reasoning) AND NO errors: Score Level 4.
4. Does it cover all 3 Identify pillars (Asset Management, Risk Assessment, AND Governance) with specific reasoning tied to the scenario issues? → Score Level 5.

ERROR HANDLING: If the response recommends tools from other CSF functions (e.g., SIEM or endpoint detection, which belong to Detect) instead of Identify pillars, flag this error FIRST in the improvements feedback—the task is specifically about the Identify function. The presence of uncorrected off-scope recommendations in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Create a prioritized action plan applying the Identify pillars, then translate the top risk into business language for leadership.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "4-5 minutes",
    prepareItems: [
      'Finish watching all Chapter 2 videos (Asset management, Risk assessment, Governance)',
      'Review the <a href="/identify-function-checklist.html" target="_blank" class="text-[#0a66c2] hover:underline">Identify Function Checklist</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ],
    part2: {
      question: `Great work on your action plan! Now for Part 2:

The CEO asks: "Why should we spend money on this? We haven't been hacked."

Write 2 sentences translating your top risk into business terms she can understand. No jargon—focus on revenue, customers, and cost.

Handout: <a href="/risk-communication-template.html" target="_blank" class="text-[#0a66c2] hover:underline font-semibold">Executive Risk Communication Template</a> <span class="text-xs text-gray-500">(opens in new tab)</span>`,
      idealAnswer: `"Right now, we don't know who can access our customer data—and with $10M in revenue, we're a target. A breach could cost millions in fines, drive away customers, and damage the reputation we've built—far more than the cost of getting ahead of it now."`,
      scoringCriteria: `SCORING CRITERIA - The learner is translating cybersecurity risk into business language for a CEO:
- 5 (Expert): Clear, jargon-free business language covering revenue impact, customer trust, reputation risk, and cost comparison. CEO would understand and act.
- 4 (Proficient): Good business translation with 3 of 4 elements (revenue, customers, reputation, cost). Minor jargon may remain.
- 3 (Competent): Attempts business translation but still includes some technical language or misses key business impacts.
- 2 (Basic): Too technical or too vague. Doesn't give the CEO clear understanding of business risk.
- 1 (Novice): Response is mostly technical jargon or doesn't address the CEO's question.

Key insight: No jargon. Focus on: what could happen to the business, how much it could cost, why acting now is cheaper than reacting later.

SCORING DECISION TREE:
1. Does the combined response cover 3 of 4 business elements (revenue impact, customer trust, reputation risk, cost comparison) in jargon-free language? → If NO, max Level 3.
2. If YES: Are there uncorrected uses of technical jargon (e.g., MFA, endpoint detection, SIEM)? → If YES, score Level 3 and flag error first.
3. If YES (3+ elements) AND NO jargon: Score Level 4.
4. Does it cover all 4 elements (revenue, customers, reputation, AND cost comparison) so clearly that the CEO would understand and act? → Score Level 5.

ERROR HANDLING: If the response uses technical jargon (e.g., MFA, endpoint detection, SIEM) when speaking to a non-technical CEO, flag this error FIRST in the improvements feedback—the entire point is jargon-free business communication. The presence of uncorrected jargon in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`
    }
  },
  access_control: {
    id: 'access_control',
    initialQuestion: `You're reviewing access controls at a financial services company. During your audit, you discover:

<strong>1.</strong> The CEO's executive assistant has admin access to the payroll system "in case the CEO needs something quickly"
<strong>2.</strong> A former contractor's VPN account is still active 6 months after their project ended
<strong>3.</strong> The IT help desk uses a shared "admin" account with the password written on a sticky note
<strong>4.</strong> Employees can access the customer database from any device, including personal phones

Pick the 2-3 issues you consider most critical. For each, briefly explain the risk and what fix you'd recommend.`,
    idealAnswer: `1. Former Contractor's Active VPN Account
RISK: Classic "zombie account"—the Colonial Pipeline breach started with exactly this. Attackers can discover and exploit forgotten accounts.
FIX: Deprovision accounts immediately when access ends; conduct quarterly access reviews.

2. Shared Admin Account with Sticky Note Password
RISK: No individual accountability, no MFA possible, and the password is visible to anyone in the office.
FIX: Eliminate shared accounts; give each admin individual credentials with MFA.

3. Executive Assistant with Payroll Admin Access
RISK: Violates least privilege—unnecessary admin access creates risk of accidental changes or compromise.
FIX: Remove admin access; create a read-only view or formal approval process instead.

4. Uncontrolled Device Access to Customer Database
RISK: Personal phones are unmanaged—no encryption, no remote wipe, no patch control. A lost phone with cached customer data is a breach waiting to happen.
FIX: Require managed devices or a Zero Trust access model (e.g., VDI or containerized app) for accessing sensitive data.`,
    scoringCriteria: `SCORING CRITERIA - The learner is identifying access control risks and fixes:
- 5 (Expert): Correctly identifies risks and fixes for 3+ issues. References key concepts like least privilege, account lifecycle, MFA, and device management. Shows deeper security thinking.
- 4 (Proficient): Correctly identifies 3 issues with risk reasoning—fixes can be brief or implied (e.g., "violates least privilege" implies the fix is removing excess access). No errors or risk dismissals present.
- 3 (Competent): Addresses 2-3 issues correctly but with limited depth. OR: addresses 3+ issues but has uncorrected errors (see ERROR HANDLING).
- 2 (Basic): Addresses 1 issue or provides vague responses without specific fixes.
- 1 (Novice): Doesn't identify real risks or provides irrelevant suggestions.

Key concepts: Least privilege, account lifecycle management, MFA, individual accountability, device management, Zero Trust principles.

ISSUE COUNTING: The scenario has 4 issues: (1) shared admin account/sticky note, (2) contractor's active VPN, (3) exec assistant's admin access, (4) personal device access. Count how many the combined responses address—even briefly mentioning the risk counts.

SCORING DECISION TREE (follow strictly):
1. Count distinct issues addressed in combined responses. 3+ issues? → If NO, max Level 3.
2. If YES (3+): Does the combined response dismiss a genuine risk (e.g., "personal phones are fine with passwords")? → If YES, score Level 3, flag error first.
3. If 3+ issues AND NO dismissals/errors: Score Level 4.
4. References advanced concepts (least privilege, MFA, Zero Trust, lifecycle management) across most issues? → Score Level 5.

ERROR HANDLING: If the response dismisses a genuine security risk (e.g., claiming personal device access is fine with just strong passwords), flag this error FIRST in the improvements feedback—unmanaged devices are a significant risk. The presence of uncorrected risk dismissals in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Identify access control vulnerabilities and recommend specific security controls to address each risk.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Finish watching <em>Identity and access management</em>',
      'Finish watching <em>Data security</em>',
      'Review the <a href="/access-control-checklist.html" target="_blank" class="text-[#0a66c2] hover:underline">Access Control Best Practices</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ]
  },
  protect_wrapup: {
    id: 'protect_wrapup',
    initialQuestion: `A mid-size law firm (75 employees) has asked you to review their security. They handle sensitive client data including contracts, litigation documents, and financial records. You've found that:

• They have a basic firewall but no endpoint protection
• Employees receive one annual security training video
• There's no data classification—everything is treated the same
• Several attorneys access client files from personal laptops at home

<strong>Part 1:</strong> Give 2-3 prioritized "Protect" recommendations. For each, name the Protect concept it addresses (Identity/Access, Data Security, Awareness/Culture, or Technology) and explain why in 1 sentence.`,
    idealAnswer: `1. ENDPOINT PROTECTION (Technology) - Deploy EDR on all devices—law firms are high-value ransomware targets and a basic firewall alone can't protect against modern threats.

2. DATA CLASSIFICATION (Data Security) - Classify data by sensitivity so privileged communications get stronger protection than general files—this is an ethical obligation for law firms.

3. DEVICE MANAGEMENT (Identity/Access) - Require managed devices for remote access—a lost personal laptop with unencrypted client files creates malpractice liability.`,
    scoringCriteria: `SCORING CRITERIA - The learner is designing a Protect improvement plan:
- 5 (Expert): Provides 3 clear recommendations covering at least 2 of 4 Protect areas (Identity/Access, Data Security, Awareness, Technology). Each recommendation is specific to law firm context with strong reasoning.
- 4 (Proficient): Provides 2-3 recommendations covering at least 2 Protect areas with good reasoning tied to the scenario.
- 3 (Competent): Provides 2 recommendations with some reasoning. Shows basic understanding of Protect concepts.
- 2 (Basic): Provides 1-2 vague recommendations that don't address the specific issues found.
- 1 (Novice): Recommendations are off-topic or don't relate to Protect function.

Key insight: Law firms have special confidentiality obligations. Best answers show awareness of industry-specific risks.

SCORING DECISION TREE:
1. Does the combined response provide 2-3 recommendations covering at least 2 Protect areas with good reasoning tied to the scenario? → If NO, max Level 3.
2. If YES: Are there uncorrected endorsements of inadequate practices (e.g., claiming annual training video is sufficient)? → If YES, score Level 3 and flag error first.
3. If YES (2+ Protect areas with reasoning) AND NO errors: Score Level 4.
4. Does it provide 3 clear recommendations specific to the law firm context with strong reasoning referencing industry-specific confidentiality obligations? → Score Level 5.

ERROR HANDLING: If the response endorses an inadequate practice as sufficient (e.g., claiming the annual training video is a good foundation when the scenario flags it as a problem), flag this error FIRST in the improvements feedback. The presence of uncorrected endorsements of inadequate practices in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Design a protection improvement plan for a law firm, then communicate the top risks to the senior partner in plain language.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "4-5 minutes",
    prepareItems: [
      'Finish watching all Chapter 3 videos',
      'Review the <a href="/protect-function-guide.html" target="_blank" class="text-[#0a66c2] hover:underline">Protect Function Quick Guide</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ],
    part2: {
      question: `Great work on your protection plan! Now for Part 2:

The firm's senior partner says: "Our biggest concern is client data exposure—it could end careers and destroy the firm. Can you tell me in plain language what our top 2 risks are right now and how your plan addresses them?"

Write 2-3 sentences connecting your recommendations to protecting client confidentiality. Avoid technical jargon—think liability and client trust.

Handout: <a href="/risk-communication-template.html" target="_blank" class="text-[#0a66c2] hover:underline font-semibold">Executive Risk Communication Template</a> <span class="text-xs text-gray-500">(opens in new tab)</span>`,
      idealAnswer: `"Right now you have two urgent risks. First, any attorney's personal laptop could be lost or stolen with unencrypted client files—that's a malpractice claim and bar complaint. Second, your only defense is a basic firewall, which won't stop modern ransomware—one attack could lock every case file and shut down the firm for weeks. Our plan fixes both: managed devices so client data never sits unprotected on personal hardware, endpoint detection to catch threats before they spread, and data classification so privileged communications get the strongest protection."`,
      scoringCriteria: `SCORING CRITERIA - The learner is communicating protection risks to a law firm's senior partner:
- 5 (Expert): Clear, jargon-free language covering 2 specific risks with direct connection to recommendations. Frames in terms of liability, client trust, and professional obligation. Partner would understand and act.
- 4 (Proficient): Covers 2 risks with reasonable business framing. Minor jargon may remain but overall message is clear.
- 3 (Competent): Identifies risks but doesn't clearly connect to recommendations, or still uses too much technical language.
- 2 (Basic): Too technical or too vague. Doesn't address the partner's specific concern about client data exposure.
- 1 (Novice): Response is mostly technical jargon or doesn't address the question.

Key insight: Law firm partners care about professional liability, bar complaints, and client trust. Connect risks to these concerns, not technical metrics.

SCORING DECISION TREE:
1. Does the combined response cover 2 risks with reasonable business framing connected to client data exposure? → If NO, max Level 3.
2. If YES: Are there uncorrected uses of technical jargon (e.g., EDR, XDR, Zero Trust, SASE)? → If YES, score Level 3 and flag error first.
3. If YES (2 risks with business framing) AND NO jargon: Score Level 4.
4. Does it cover 2 specific risks with direct connection to recommendations, framed in terms of liability, client trust, and professional obligation? → Score Level 5.

ERROR HANDLING: If the response uses technical jargon (e.g., EDR, XDR, Zero Trust, SASE) when speaking to a non-technical senior partner, flag this error FIRST in the improvements feedback—the entire point is plain-language communication. The presence of uncorrected jargon in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`
    }
  },
  incident_response: {
    id: 'incident_response',
    initialQuestion: `It's 2:30 PM on a Friday. Your security team receives an alert: unusual data transfer activity from a server containing customer records. Initial investigation shows 50GB of data was copied to an external IP address over the past hour. The server is still online.

You're leading the incident response. Briefly describe your first 3 actions to contain the situation and who you'd notify in the first 30 minutes.`,
    idealAnswer: `FIRST ACTIONS:
1. Isolate the server from the network (don't power off—preserve evidence) and block the external IP at the firewall.
2. Preserve logs before they rotate and document everything with timestamps.
3. Check whether other systems are affected—don't assume it's contained.

NOTIFICATIONS (within 30 minutes):
• CISO/executive sponsor—this is a potential data breach
• Legal counsel—regulatory and liability implications
• IR team lead and key technical staff
• Don't wait until Monday—this is a Friday attack for a reason`,
    scoringCriteria: `SCORING CRITERIA - The learner is leading an incident response:
- 5 (Expert): Covers containment (with evidence preservation) and notifications with specific, practical actions. Shows awareness of the Friday timing and communication considerations.
- 4 (Proficient): Covers containment and notifications with practical steps. May miss evidence preservation nuance.
- 3 (Competent): Covers containment or notifications with reasonable actions. Shows basic understanding of incident response.
- 2 (Basic): Provides vague response. May suggest harmful actions like immediately wiping the server.
- 1 (Novice): Response shows no understanding of incident response process.

Key insight: Evidence preservation is critical. Acting too fast (wiping systems) or too slow (waiting until Monday) are both problematic.

SCORING DECISION TREE:
1. Does the combined response cover both containment actions AND notifications with practical steps? → If NO, max Level 3.
2. If YES: Are there uncorrected harmful recommendations (e.g., shutting down or wiping systems, destroying forensic evidence)? → If YES, score Level 3 and flag error first.
3. If YES (containment + notifications) AND NO harmful recommendations: Score Level 4.
4. Does it also include evidence preservation awareness and recognition of the Friday timing significance? → Score Level 5.

ERROR HANDLING: If the response suggests harmful actions like shutting down or wiping systems (which destroys forensic evidence), flag this error FIRST in the improvements feedback. The presence of uncorrected harmful recommendations in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Lead the first 30 minutes of an incident response, demonstrating practical knowledge of containment and communication.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Finish watching <em>Detecting threats and anomalies</em>',
      'Finish watching <em>Incident response</em>',
      'Review the <a href="/incident-response-checklist.html" target="_blank" class="text-[#0a66c2] hover:underline">Incident Response Checklist</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ]
  },
  drr_wrapup: {
    id: 'drr_wrapup',
    initialQuestion: `Your company just recovered from a ransomware attack. The attack was detected after 4 days when employees couldn't access files. The response took 2 weeks, and recovery (restoring from backups) took another week. Leadership wants to know: "How do we make sure this doesn't happen again?"

<strong>Part 1:</strong> Give 1 specific recommendation for each function:
• <strong>Detect:</strong> How could we have caught this faster?
• <strong>Respond:</strong> How could we have contained it quicker?
• <strong>Recover:</strong> How can we restore operations faster next time?`,
    idealAnswer: `DETECT: Deploy endpoint detection (EDR)—ransomware shows suspicious behavior before encrypting files, and EDR could have flagged it in hours instead of 4 days.

RESPOND: Document and practice an incident response plan—the 2-week response suggests confusion about roles. Regular tabletop exercises help the team act faster.

RECOVER: Test backup restoration quarterly—a week to restore means backups weren't tested. Define a recovery priority order for critical systems.`,
    scoringCriteria: `SCORING CRITERIA - The learner is creating a post-incident improvement plan:
- 5 (Expert): Provides specific, actionable recommendations for all 3 functions that directly reference the scenario's timeline (4-day detection, 2-week response, 1-week recovery) with concrete solutions (e.g., EDR, tabletop exercises, quarterly backup testing) and measurable improvement targets.
- 4 (Proficient): Provides specific recommendations for all 3 functions with concrete solutions tied to the scenario problems. Goes beyond generic advice to name specific tools or practices.
- 3 (Competent): Addresses all 3 functions with some specificity—recommendations reference the scenario but may not name concrete solutions or tools.
- 2 (Basic): Addresses all 3 functions but with only vague or generic advice (e.g., "better monitoring tools" or "have a plan"), OR only addresses 1-2 functions with some detail.
- 1 (Novice): Doesn't provide meaningful recommendations for the Detect/Respond/Recover functions.

IMPORTANT: Covering all 3 functions with generic one-liners like "better monitoring" or "test backups" is Level 2, NOT Level 3. Level 3+ requires specificity tied to the scenario's actual problems.
Key insight: Each delay in the scenario points to specific gaps. Best answers connect recommendations to the actual problems with concrete solutions.

SCORING DECISION TREE:
1. Does the combined response provide specific recommendations for all 3 functions (Detect, Respond, Recover) with concrete solutions tied to scenario problems? → If NO, max Level 3.
2. If YES: Are there uncorrected harmful recommendations (e.g., shutting down all systems)? → If YES, score Level 3 and flag error first.
3. If YES (all 3 functions with concrete solutions) AND NO errors: Score Level 4.
4. Does it also reference the scenario's specific timeline (4-day detection, 2-week response, 1-week recovery) with measurable improvement targets? → Score Level 5.

ERROR HANDLING: If the response suggests harmful actions like shutting down all systems (which destroys evidence and causes additional damage), flag this error FIRST in the improvements feedback. The presence of uncorrected harmful recommendations in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Create a post-incident improvement plan for Detect, Respond, and Recover, then summarize the changes for the board in plain language.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "4-5 minutes",
    prepareItems: [
      'Finish watching all Chapter 4 videos',
      'Review the <a href="/drr-improvement-guide.html" target="_blank" class="text-[#0a66c2] hover:underline">Detect-Respond-Recover Improvement Guide</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ],
    part2: {
      question: `Great work on your improvement plan! Now for Part 2:

The CEO needs to brief the board next week. She asks: "Give me a short summary I can present—what went wrong, what we're fixing, and how we'll know it's working."

Write 2-3 sentences covering: what went wrong, what you're fixing, and 1 metric to track progress. No jargon—board members need to understand.

Handout: <a href="/drr-improvement-guide.html" target="_blank" class="text-[#0a66c2] hover:underline font-semibold">Detect-Respond-Recover Improvement Guide</a> <span class="text-xs text-gray-500">(opens in new tab)</span>`,
      idealAnswer: `"This attack went undetected for 4 days and took 3 weeks to fully recover because we lacked real-time monitoring and a practiced response plan. We're deploying detection tools, running quarterly drills, and testing our backups so we can catch and recover from threats in hours, not weeks. We'll track detection time with a target of under 4 hours."`,
      scoringCriteria: `SCORING CRITERIA - The learner is creating a board-ready executive summary:
- 5 (Expert): Concise, jargon-free summary covering all 3 elements: what went wrong, top changes, and measurable metrics. Board members would understand and approve budget.
- 4 (Proficient): Covers 2 of 3 elements well (root causes, changes, or metrics). Minor jargon may remain but overall message is clear.
- 3 (Competent): Attempts board-level language but still includes technical terms or misses key elements like metrics.
- 2 (Basic): Too technical or doesn't connect recommendations to measurable outcomes. Board wouldn't understand.
- 1 (Novice): Response is mostly technical jargon or doesn't address the CEO's request for a board summary.

Key insight: Board members want three things: what happened, what you're doing about it, and how they'll know it's working. Use time and money, not technical metrics.

SCORING DECISION TREE:
1. Does the combined response cover 2 of 3 elements (what went wrong, top changes, measurable metrics) in non-technical language? → If NO, max Level 3.
2. If YES: Are there uncorrected uses of technical jargon (e.g., SIEM metrics, EDR deployment timeline)? → If YES, score Level 3 and flag error first.
3. If YES (2+ elements) AND NO jargon: Score Level 4.
4. Does it cover all 3 elements (what went wrong, what you're fixing, AND measurable metrics) concisely enough that board members would understand and approve budget? → Score Level 5.

ERROR HANDLING: If the response uses technical jargon (e.g., SIEM metrics, EDR deployment timeline) when communicating with a non-technical board, flag this error FIRST in the improvements feedback—the entire point is plain-language communication. The presence of uncorrected jargon in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`
    }
  },
  implementation_plan: {
    id: 'implementation_plan',
    initialQuestion: `You've been hired to help a growing healthcare technology startup (100 employees, Series B funded) implement NIST CSF 2.0. They have no formal cybersecurity program yet—just basic IT practices. Leadership has given you 6 months and a limited budget.

<strong>Part 1:</strong> Create a phased implementation roadmap. For each phase, name the CSF function(s) you'd focus on and list 1-2 key actions:
• Phase 1 (Months 1-2): Where do you start?
• Phase 2 (Months 3-4): What comes next?
• Phase 3 (Months 5-6): How do you build maturity?`,
    idealAnswer: `PHASE 1: FOUNDATION (Months 1-2) — Focus: Identify
• Conduct asset inventory and initial risk assessment (especially PHI/HIPAA threats)
• Establish basic governance—assign security roles, get executive sponsor

PHASE 2: CORE PROTECTIONS (Months 3-4) — Focus: Protect + Detect
• Deploy endpoint protection (EDR) and basic monitoring/alerting
• Data classification for PHI; security awareness training

PHASE 3: MATURITY (Months 5-6) — Focus: Respond + Recover
• Document IR plan and run a tabletop exercise; test backup restoration
• Plan next 12-month roadmap based on learnings`,
    scoringCriteria: `SCORING CRITERIA - The learner is creating a CSF implementation roadmap:
- 5 (Expert): Provides logical phased approach covering multiple CSF functions. Phase 1 starts with Identify (you can't protect what you don't know). Each phase has 2-3 specific actions and identifies relevant CSF functions. Shows healthcare/HIPAA awareness.
- 4 (Proficient): Provides reasonable phased approach covering 3+ CSF functions with logical sequencing and specific actions.
- 3 (Competent): Provides phased plan with some actions but may skip foundations or sequence incorrectly (e.g., jumping to advanced tools before basics).
- 2 (Basic): Provides vague or unrealistic plan without clear actions or CSF function mapping.
- 1 (Novice): Plan doesn't reflect CSF structure or realistic implementation approach.

Key insight: Start with Identify (asset inventory, risk assessment) before jumping to tools. Healthcare context means HIPAA awareness.

SCORING DECISION TREE:
1. Does the combined response provide a reasonable phased approach covering 3+ CSF functions with logical sequencing and specific actions? → If NO, max Level 3.
2. If YES: Are there uncorrected sequencing errors (e.g., jumping to deploying tools before Identify foundations)? → If YES, score Level 3 and flag error first.
3. If YES (3+ functions with logical sequencing) AND NO errors: Score Level 4.
4. Does Phase 1 start with Identify, each phase has 2-3 specific actions with CSF function mapping, and shows healthcare/HIPAA awareness? → Score Level 5.

ERROR HANDLING: If the response skips the Identify foundation and jumps straight to buying/deploying tools (e.g., EDR, SIEM) in Phase 1, flag this error FIRST in the improvements feedback—you can't protect what you don't know you have. The presence of uncorrected sequencing errors in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Create a phased CSF implementation roadmap for a healthcare startup, then build a measurement and leadership communication plan.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "4-5 minutes",
    prepareItems: [
      'Finish watching <em>Customizing for your organization</em>',
      'Finish watching <em>Measuring success and sustaining efforts</em>',
      'Review the <a href="/implementation-roadmap-template.html" target="_blank" class="text-[#0a66c2] hover:underline">CSF Implementation Roadmap Template</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ],
    part2: {
      question: `Great work on your roadmap! Now for Part 2:

The CEO says: "How will we know this is working? Give me 2-3 key metrics and a quick plan for keeping me and the board informed."

List 2-3 specific metrics tied to your roadmap and briefly describe how you'd keep leadership updated.

Handout: <a href="/implementation-roadmap-template.html" target="_blank" class="text-[#0a66c2] hover:underline font-semibold">CSF Implementation Roadmap Template</a> <span class="text-xs text-gray-500">(opens in new tab)</span>`,
      idealAnswer: `METRICS:
1. Asset inventory completion % (target: 100% of critical assets by Month 2)
2. MFA adoption rate (target: 100% of employees)
3. Mean time to detect threats (establish baseline, then reduce by 50%)
4. HIPAA compliance gap closure (target: all PHI-containing systems classified and encrypted by Month 4)

COMMUNICATION: Monthly 1-page progress report to the CEO; quarterly board update framing security in business terms (e.g., "we can detect threats in hours instead of days"). Each report ties progress back to patient data protection and regulatory compliance.`,
      scoringCriteria: `SCORING CRITERIA - The learner is creating a measurement and leadership communication plan:
- 5 (Expert): Provides 3-4 specific, measurable metrics tied to roadmap phases. Includes a practical communication cadence and frames security in business terms the board would understand. Shows healthcare/HIPAA awareness.
- 4 (Proficient): Provides 3+ metrics with reasonable specificity. Communication plan is present but may lack detail on framing or cadence.
- 3 (Competent): Provides some metrics but they're vague or not tied to the roadmap. Communication plan is mentioned but not developed.
- 2 (Basic): Metrics are too generic (e.g., "track security") or missing. No meaningful communication plan.
- 1 (Novice): Doesn't address metrics or leadership communication in a meaningful way.

Key insight: Board members and CEOs want metrics tied to business outcomes (risk reduction, compliance, customer trust), not technical jargon. A regular communication cadence builds confidence.

SCORING DECISION TREE:
1. Does the combined response provide 3+ metrics with reasonable specificity and a communication plan? → If NO, max Level 3.
2. If YES: Are there uncorrected technical metrics inappropriate for leadership (e.g., SIEM alert volume, vulnerability scan pass rate)? → If YES, score Level 3 and flag error first.
3. If YES (3+ metrics with communication plan) AND NO inappropriate metrics: Score Level 4.
4. Does it provide 3-4 specific, measurable metrics tied to roadmap phases, a practical communication cadence, and frame security in business terms with healthcare/HIPAA awareness? → Score Level 5.

ERROR HANDLING: If the response uses technical metrics inappropriate for leadership (e.g., SIEM alert volume, vulnerability scan pass rate), flag this error FIRST in the improvements feedback—CEOs and boards want business outcomes, not technical dashboards. The presence of uncorrected technical metrics in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`
    }
  },
  csf_capstone: {
    id: 'csf_capstone',
    initialQuestion: `Congratulations—you've made it to the Capstone! This exercise brings together the most essential ideas from the entire course.

A regional credit union (200 employees, 3 branches) is preparing for rapid growth after a merger. A recent security assessment found:

• No complete asset inventory—several "shadow IT" cloud services discovered
• Cybersecurity decisions are made ad hoc by the IT director alone
• The last security awareness training was 18 months ago
• No endpoint protection beyond basic antivirus; no intrusion detection
• An employee clicked a phishing link last month—the breach wasn't detected for 2 weeks
• No documented incident response or recovery plan exists
• Customer financial data is not classified or encrypted at rest

<strong>Part 1:</strong> Identify the 3-4 most critical gaps and map each to the CSF function it falls under (Identify, Protect, Detect, Respond, Recover, or Govern). For each, explain in 1 sentence why it's urgent.`,
    idealAnswer: `1. NO ASSET INVENTORY / SHADOW IT (Identify) — You can't protect what you don't know you have; untracked cloud services are blind spots attackers exploit.

2. NO GOVERNANCE STRUCTURE (Govern) — Ad hoc decisions by one person means no policies, no accountability, and no alignment with business strategy—especially dangerous during a merger.

3. BREACH WENT UNDETECTED FOR 2 WEEKS (Detect) — Without monitoring and alerting, attackers have free rein; early detection dramatically reduces breach costs.

4. NO INCIDENT RESPONSE OR RECOVERY PLAN (Respond/Recover) — When the next incident hits, there's no playbook—chaos instead of coordinated action, and no plan to restore operations.

Additional strong answers: unclassified/unencrypted customer data (Protect), stale security training (Protect/Culture).`,
    scoringCriteria: `SCORING CRITERIA - The learner is assessing an organization and mapping gaps to CSF functions:
- 5 (Expert): Identifies 5+ critical gaps spanning at least 5 different CSF functions (must include Protect—e.g., unclassified/unencrypted customer data). Provides clear reasoning that connects gaps to each other and shows how weaknesses cascade across functions. Shows awareness of the merger context and credit union-specific concerns.
- 4 (Proficient): Identifies 3-4 gaps correctly mapped to CSF functions spanning at least 3-4 different functions (must include at least one from Identify/Govern AND one from Detect/Respond/Recover). Reasoning connects to the specific scenario.
- 3 (Competent): Identifies 2-3 gaps with CSF function mapping. Reasoning is present but may not show how gaps relate to each other or the organization's specific context.
- 2 (Basic): Identifies 1-2 gaps with basic or missing CSF function mapping. Limited reasoning.
- 1 (Novice): Does not identify meaningful gaps or cannot connect them to CSF functions.

IMPORTANT: Identifying 3-4 gaps with correct CSF mapping is Level 4, not Level 5. Level 5 requires broader coverage (5+ gaps across 5+ functions including Protect) AND deeper analysis showing how gaps cascade and interact.
Key insight: The strongest responses show the functions work together as a system—gaps in one area (e.g., no asset inventory) cascade into weaknesses in others (e.g., can't classify data, can't detect threats on unknown systems).

SCORING DECISION TREE:
1. Does the combined response identify 3-4 gaps correctly mapped to 3-4 different CSF functions (including at least one from Identify/Govern AND one from Detect/Respond/Recover)? → If NO, max Level 3.
2. If YES: Are there uncorrected dismissals of genuine gaps (e.g., claiming stale training isn't critical)? → If YES, score Level 3 and flag error first.
3. If YES (3-4 gaps across 3-4 functions) AND NO dismissals: Score Level 4.
4. Does it identify 5+ gaps spanning 5+ different CSF functions (including Protect), with analysis showing how weaknesses cascade across functions and awareness of the merger context? → Score Level 5.

ERROR HANDLING: If the response dismisses a genuine gap (e.g., claiming stale security awareness training isn't critical because experienced employees already know the basics), flag this error FIRST in the improvements feedback—outdated training is a well-documented risk factor. The presence of uncorrected dismissals in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Assess an organization's cybersecurity gaps, build a prioritized action plan, and communicate it to leadership—bringing together the essential ideas from the entire course.<br>This Skill Builder has 3 parts.",
    durationText: "6-8 minutes",
    prepareItems: [
      'Complete all course videos',
      'Review the <a href="/identify-function-checklist.html" target="_blank" class="text-[#0a66c2] hover:underline">Identify Function Checklist</a> <span class="text-xs text-gray-500">(new tab)</span>',
      'Review the <a href="/risk-communication-template.html" target="_blank" class="text-[#0a66c2] hover:underline">Executive Risk Communication Template</a> <span class="text-xs text-gray-500">(new tab)</span>'
    ],
    part2: {
      question: `Great assessment! Now for Part 2—build the plan.

The credit union's CEO has given you 90 days and a modest budget to address these gaps. Create a prioritized 90-day action plan with 3 phases:

• <strong>Days 1-30 (Foundation):</strong> What do you tackle first and why?
• <strong>Days 31-60 (Core Defenses):</strong> What comes next?
• <strong>Days 61-90 (Maturity):</strong> How do you build resilience?

For each phase, name 1-2 specific actions and the CSF function(s) they support.

Handout: <a href="/implementation-roadmap-template.html" target="_blank" class="text-[#0a66c2] hover:underline font-semibold">CSF Implementation Roadmap Template</a> <span class="text-xs text-gray-500">(opens in new tab)</span>`,
      idealAnswer: `DAYS 1-30 — FOUNDATION (Identify + Govern):
• Conduct full asset inventory including shadow IT cloud services — you can't protect what you don't know
• Establish governance: assign security roles, create basic policies, get executive sponsor for the program

DAYS 31-60 — CORE DEFENSES (Protect + Detect):
• Deploy endpoint protection (EDR) and basic network monitoring/alerting to close the 2-week detection gap
• Classify and encrypt customer financial data; launch engaging security awareness training

DAYS 61-90 — MATURITY (Respond + Recover):
• Document incident response plan and run a tabletop exercise so the team knows the playbook
• Create recovery plan with backup testing; establish metrics and a reporting cadence for leadership`,
      scoringCriteria: `SCORING CRITERIA - The learner is building a 90-day action plan:
- 5 (Expert): Logical 3-phase plan that starts with Identify/Govern foundations, builds Protect/Detect defenses, then adds Respond/Recover maturity. Each phase has 1-2 specific actions with CSF function mapping. Shows understanding that you must know what you have before you can protect it.
- 4 (Proficient): Reasonable 3-phase plan covering 4+ CSF functions with logical sequencing and specific actions.
- 3 (Competent): Provides a phased plan but may sequence incorrectly (e.g., jumping to advanced tools before asset inventory) or miss important phases.
- 2 (Basic): Plan is vague, unrealistic, or doesn't follow a logical sequence. Missing CSF function connections.
- 1 (Novice): Plan doesn't reflect CSF structure or realistic implementation approach.

Key insight: Start with Identify (asset inventory) and Govern (policies, roles) before deploying tools. The strongest plans show a clear "crawl, walk, run" progression.

SCORING DECISION TREE:
1. Does the combined response provide a reasonable 3-phase plan covering 4+ CSF functions with logical sequencing and specific actions? → If NO, max Level 3.
2. If YES: Are there uncorrected sequencing errors (e.g., jumping to deploying tools before asset inventory)? → If YES, score Level 3 and flag error first.
3. If YES (4+ functions with logical sequencing) AND NO errors: Score Level 4.
4. Does Phase 1 start with Identify/Govern foundations, each phase has specific actions with CSF function mapping, and shows a clear "crawl, walk, run" progression? → Score Level 5.

ERROR HANDLING: If the response skips the Identify/Govern foundation and jumps straight to deploying tools (e.g., EDR, SIEM) in the first phase, flag this error FIRST in the improvements feedback—you can't protect what you don't know you have. The presence of uncorrected sequencing errors in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`
    },
    part3: {
      question: `Excellent plan! Now for Part 3—the leadership test.

The credit union's board of directors (non-technical) needs to approve your plan and budget. The board chair asks:

<em>"We just merged and have a lot on our plate. Why should cybersecurity be a priority right now? Give me the bottom line."</em>

Write a 3-4 sentence response that:
• Explains the current risk in business terms (no jargon)
• Connects your plan to protecting the credit union's members and reputation
• Describes how you'll measure success so the board can track progress

Handout: <a href="/risk-communication-template.html" target="_blank" class="text-[#0a66c2] hover:underline font-semibold">Executive Risk Communication Template</a> <span class="text-xs text-gray-500">(opens in new tab)</span>`,
      idealAnswer: `"Right now, we don't have a clear picture of all our systems, and a recent breach went unnoticed for two weeks—during a merger when member trust is everything. A single data breach could cost us millions in regulatory fines and drive members to competitors. Our 90-day plan starts by getting visibility into what we have, then adds the monitoring and response capabilities to catch and contain threats fast. I'll report monthly on three metrics: asset inventory completion, time-to-detect threats, and incident response readiness—so you'll always know exactly where we stand."

Key elements: (1) States current risk in business terms, (2) Connects to member trust and merger timing, (3) Briefly summarizes the plan's logic, (4) Offers specific, measurable progress metrics.`,
      scoringCriteria: `SCORING CRITERIA - The learner is communicating their plan to a non-technical board:
- 5 (Expert): Clear, jargon-free response covering all 3 elements: current risk in business terms, connection to members/reputation, and specific success metrics. A board member would understand and approve. Shows awareness that merger timing makes this especially urgent.
- 4 (Proficient): Covers all 3 elements with mostly clear business language. Minor jargon may remain but the message lands.
- 3 (Competent): Covers 2 of 3 elements or includes too much technical language. The board would understand parts but not the full picture.
- 2 (Basic): Too technical, too vague, or misses key elements like metrics or business impact. Board would need follow-up.
- 1 (Novice): Response is mostly jargon, doesn't address the board's question, or fails to connect to business concerns.

Key insight: Boards care about money, members, reputation, and regulatory risk—not firewalls and endpoints. The best responses frame cybersecurity as protecting what the board already cares about. Metrics should be simple and trackable.

SCORING DECISION TREE:
1. Does the combined response cover all 3 elements (current risk in business terms, connection to members/reputation, success metrics) with mostly clear business language? → If NO, max Level 3.
2. If YES: Are there uncorrected uses of technical jargon (e.g., vulnerability scan results, SIEM alert data)? → If YES, score Level 3 and flag error first.
3. If YES (all 3 elements) AND NO jargon: Score Level 4.
4. Does it cover all 3 elements jargon-free with specific measurable metrics, and show awareness that merger timing makes cybersecurity especially urgent? → Score Level 5.

ERROR HANDLING: If the response uses technical jargon (e.g., vulnerability scan results, SIEM alert data) when communicating with a non-technical board, flag this error FIRST in the improvements feedback—the entire point is plain-language business communication. The presence of uncorrected jargon in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`
    }
  },
  ai_kpi_prompt: {
    id: 'ai_kpi_prompt',
    initialQuestion: `Your organization is launching a new customer support system with the following goals:
• <strong>Improving user satisfaction</strong>
• <strong>Reducing response time</strong>
• <strong>Reducing operational costs</strong>

Your task: Write an AI prompt that will generate relevant KPIs for this project and a simple tracking plan. What prompt would you write?`,
    idealAnswer: `An effective prompt would be:

"I'm managing the launch of a new customer support system with three goals: (1) improving user satisfaction, (2) reducing response time, and (3) reducing operational costs. For each goal, suggest 2-3 specific, measurable KPIs. Focus on the vital few metrics that matter most to leadership. Then provide a tracking plan in table format with: Metric Name, Target Value, Measurement Frequency, and Owner."

Key elements: (1) States all 3 goals, (2) Requests specific KPIs per goal, (3) Asks for prioritization, (4) Requests structured tracking plan with targets/ownership.`,
    scoringCriteria: `SCORING CRITERIA - The learner is writing an AI prompt to generate project KPIs:
- 5 (Expert): Prompt includes ALL key elements: states all 3 goals, requests specific KPIs per goal, asks for tracking plan with targets/ownership, and requests prioritization or actionability.
- 4 (Proficient): Prompt includes 3-4 key elements with clear structure.
- 3 (Competent): Prompt mentions the goals and asks for KPIs but missing tracking plan structure or prioritization.
- 2 (Basic): Prompt mentions some goals but is vague or missing key elements like tracking plan.
- 1 (Novice): Prompt is too vague, doesn't mention goals, or asks for something unrelated.

SCORING DECISION TREE:
1. Does the combined prompt include 3-4 key elements (states goals, requests KPIs, includes tracking plan structure, clear structure)? → If NO, max Level 3.
2. If YES: Are there uncorrected off-scope elements (e.g., KPIs for employee happiness when goals are about customer satisfaction, response time, costs)? → If YES, score Level 3 and flag error first.
3. If YES (3-4 elements) AND NO off-scope errors: Score Level 4.
4. Does it include ALL key elements (states all 3 goals, requests specific KPIs per goal, asks for tracking plan with targets/ownership, AND requests prioritization or actionability)? → Score Level 5.

ERROR HANDLING: If the prompt includes off-scope or erroneous ideas (e.g., requesting KPIs for employee happiness/morale when the project goals are about customer satisfaction, response time, and costs), flag this error FIRST in the improvements feedback. The presence of uncorrected off-scope elements in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Write an effective AI prompt that generates meaningful project KPIs and a tracking plan for a customer support system launch.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Finish watching <em>Prompt Engineering</em>',
      'Review the <a href="/kpi-development-guide.html" target="_blank" class="text-[#0a66c2] hover:underline">Developing Project KPIs With AI</a> reference guide <span class="text-xs text-gray-500">(opens in new tab)</span>'
    ]
  },
  eq_emotional_chain: {
    id: 'eq_emotional_chain',
    initialQuestion: `Consider this scenario:

A team lead named Marcus gets an email from his director saying his project timeline is being cut by 3 weeks. Marcus immediately fires off an angry reply saying <em>"This is completely unreasonable and sets us up to fail."</em> He then storms into the team standup and vents about leadership being out of touch, demoralizing his team.

Using the <strong>Event → Thoughts/Emotions → Behavior</strong> chain, break down what happened to Marcus. Identify the <strong>Event</strong>, the <strong>Thoughts/Emotions</strong>, and the <strong>Behavioral reactions</strong>. Then suggest one thing Marcus could have done differently at the "thoughts and emotions" stage to change the outcome.`,
    idealAnswer: `Event = email about timeline cut. Thoughts/Emotions = anger, feeling disrespected, assumption that leadership doesn't care about quality. Behavioral reactions = angry email reply + venting to team.

Marcus could have paused to consider WHY the timeline was cut (maybe a business reason), challenged his assumption that leadership doesn't care, and responded more constructively—e.g., replying with questions about priorities to cut, or proposing a revised scope.`,
    scoringCriteria: `SCORING CRITERIA - The learner is analyzing a scenario using the Event → Thoughts/Emotions → Behavior chain:
- 5 (Expert): Correctly identifies all 3 chain elements (Event, Thoughts/Emotions, Behavioral reactions) AND suggests a meaningful intervention at the thoughts stage that would change the outcome.
- 4 (Proficient): Correctly identifies all 3 elements with a reasonable suggestion for intervention.
- 3 (Competent): Identifies 2-3 elements but suggestion is vague or underdeveloped.
- 2 (Basic): Identifies event + behavior but misses the thoughts/emotions middle step—the critical link in the chain.
- 1 (Novice): Off-topic or does not use the chain framework.

SCORING DECISION TREE:
1. Does the combined response correctly identify all 3 chain elements (Event, Thoughts/Emotions, Behavior) with a suggestion for intervention? → If NO, max Level 3.
2. If YES: Does the response validate Marcus's angry outburst as justified rather than recognizing the chain can be intercepted? → If YES, score Level 3 and flag error first.
3. If YES (all 3 elements with suggestion) AND NO errors: Score Level 4.
4. Does the intervention at the thoughts stage genuinely challenge Marcus's assumptions and show how a different thought pattern would lead to a different behavioral outcome? → Score Level 5.

ERROR HANDLING: If the response suggests Marcus was RIGHT to react angrily (validates the outburst as justified behavior), flag this error FIRST in the improvements feedback—the point of the exercise is recognizing that the chain can be intercepted at the thoughts/emotions stage. The presence of uncorrected validation of the outburst in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Analyze a workplace scenario using the Event → Thoughts/Emotions → Behavior chain and identify where to intervene.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Watch <em>The emotions in EQ</em>'
    ]
  },
  eq_ch1_wrapup: {
    id: 'eq_ch1_wrapup',
    initialQuestion: `You're a team lead at a marketing agency. One of your direct reports, Aisha, sends you a Slack message at 4:55 PM on Friday:

<em>"Hey, I need to talk. I just found out the client presentation I've been working on for two weeks got reassigned to Marcus. Nobody told me—I only found out because Marcus asked me for my files. I'm so frustrated I can barely think straight."</em>

Using what you've learned about emotions and emotional intelligence in Chapter 1, analyze this situation:
<strong>(1)</strong> What emotions is Aisha likely experiencing and why?
<strong>(2)</strong> Map out her probable <strong>Event → Thoughts → Behavior</strong> chain
<strong>(3)</strong> What is one risk if Aisha acts on her emotions right now (Friday at 5 PM)?`,
    idealAnswer: `(1) Emotions: frustration, feeling disrespected/undervalued, possibly hurt or betrayed. Why: her work was reassigned without communication, which signals lack of respect for her effort and time.

(2) Chain: Event = learning her presentation was reassigned without being told. Thoughts = "They don't value my work," "Nobody respects me enough to tell me," "Marcus is getting credit for my effort." Behavior = reaching out impulsively (the Slack message), likely tempted to confront Marcus or escalate to management while upset.

(3) Risk: Acting at 5 PM on Friday while emotionally charged could lead to an angry email or confrontation she'll regret over the weekend—similar to Marcus's mistake in the Emotional Chain exercise. The timing amplifies the risk because there's no opportunity for immediate resolution, so the emotions will stew.`,
    scoringCriteria: `SCORING CRITERIA - The learner is applying Chapter 1 EQ foundations to a new scenario:
- 5 (Expert): Correctly identifies emotions with reasoning, maps the full Event → Thoughts → Behavior chain, and identifies a specific risk tied to the timing/emotional state.
- 4 (Proficient): Addresses all 3 parts with reasonable analysis.
- 3 (Competent): Addresses 2 parts or gives surface-level analysis.
- 2 (Basic): Addresses 1 part or gives vague observations.
- 1 (Novice): Off-topic or does not analyze the situation.

SCORING DECISION TREE:
1. Does the combined response address all 3 parts (emotions, chain, risk)? → If NO, max Level 3.
2. If YES: Does the response suggest Aisha should immediately confront Marcus or management while upset? → If YES, score Level 3 and flag error first.
3. If YES (all 3 parts) AND NO errors: Score Level 4.
4. Does the chain analysis show clear connections between event, thoughts, and likely behavior, AND does the risk assessment reference the timing factor? → Score Level 5.

ERROR HANDLING: If the response encourages Aisha to act immediately while emotionally charged (e.g., "She should go talk to her manager right now"), flag this error FIRST—this contradicts the managing emotional reactions lesson. The presence of such advice in the combined responses caps the score at Level 3 maximum.`,
    goalText: "Apply EQ foundations to analyze emotions, map a behavioral chain, and advise on managing reactions.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "4-5 minutes",
    prepareItems: [
      'Watch all Chapter 1 videos'
    ],
    part2: {
      question: `Good analysis! Now for Part 2:

It's now Monday morning. Aisha took the weekend to cool down. She comes to you and says: <em>"I'm calmer now, but I still need to address this. How should I approach the conversation with my manager about the reassignment?"</em>

Give Aisha <strong>3 specific pieces of advice</strong> for how to have this conversation productively, drawing on what you've learned about managing emotional reactions and the Event → Thoughts → Behavior chain.`,
      idealAnswer: `(1) Start by naming her intent, not her frustration: "I want to understand the decision so I can learn from it" rather than "Why wasn't I told?" This sets a collaborative tone.

(2) Separate the event from her interpretation: acknowledge that the reassignment happened (fact), but check her assumption that it means her work isn't valued (interpretation that may be wrong—just like Tanya's assumption about Alex).

(3) Have a plan for if emotions flare up during the conversation: use the pause technique—if she feels her frustration rising, she can say "Let me think about that for a moment" rather than reacting defensively.`,
      scoringCriteria: `SCORING CRITERIA - The learner is advising on productive conversation using EQ principles:
- 5 (Expert): 3 specific, actionable pieces of advice that clearly draw on course concepts (managing reactions, separating event from interpretation, pausing before reacting).
- 4 (Proficient): 3 reasonable pieces of advice with some connection to course concepts.
- 3 (Competent): 2 pieces of advice or advice that's generic (not tied to EQ concepts).
- 2 (Basic): 1 piece of advice or very generic "just be calm" type suggestions.
- 1 (Novice): Off-topic or does not address the question.

SCORING DECISION TREE:
1. Does the combined response provide 3 pieces of advice connected to EQ concepts? → If NO, max Level 3.
2. If YES: Does any advice suggest being passive or avoiding the conversation entirely? → If YES, score Level 3 and flag error first.
3. If YES (3 pieces of advice) AND NO errors: Score Level 4.
4. Does the advice specifically reference course concepts (chain analysis, managing reactions, checking assumptions) and provide actionable steps? → Score Level 5.

ERROR HANDLING: If the response suggests Aisha should just "let it go" or avoid addressing the issue, flag this error FIRST—managing emotions doesn't mean suppressing them, it means addressing issues productively. Caps at Level 3 maximum.`
    }
  },
  eq_cognitive_hijack: {
    id: 'eq_cognitive_hijack',
    initialQuestion: `Read this account from Tanya, a marketing manager:

<em>"Last Tuesday, I had a total meltdown at work. My colleague Alex presented what I thought was MY idea in a team meeting without giving me credit. I could feel my face getting hot and my hands shaking. I interrupted Alex mid-presentation and said 'That was actually my idea, and I'd appreciate if you didn't steal my work.' The room went silent. Later I found out our manager had actually asked Alex to present the idea because I was on PTO when it was assigned. I felt terrible."</em>

Identify:
<strong>(1)</strong> What was Tanya's trigger?
<strong>(2)</strong> What cognitive hijack occurred?
<strong>(3)</strong> What were the physical/physiological symptoms?
<strong>(4)</strong> What assumption drove her irrational response?`,
    idealAnswer: `(1) Trigger: seeing someone else present what she believed was her idea without credit.

(2) Cognitive hijack: her automatic assumption (Alex stole her idea) bypassed rational thinking, leading to an impulsive public confrontation.

(3) Physiological symptoms: face getting hot, hands shaking.

(4) The assumption that Alex deliberately stole her work—when actually the manager assigned it. The key mistake was acting on an untested assumption in the heat of the moment.`,
    scoringCriteria: `SCORING CRITERIA - The learner is identifying triggers, cognitive hijacks, and untested assumptions:
- 5 (Expert): Identifies all 4 elements (trigger, cognitive hijack, physiological symptoms, driving assumption) with clear explanation of how the assumption drove the irrational response.
- 4 (Proficient): Identifies 3-4 elements clearly with reasonable explanations.
- 3 (Competent): Identifies 2-3 elements with some explanation.
- 2 (Basic): Identifies 1 element or gives vague analysis without specifics.
- 1 (Novice): Off-topic or does not analyze the scenario.

SCORING DECISION TREE:
1. Does the combined response identify 3+ elements (trigger, hijack, symptoms, assumption) with clear explanations? → If NO, max Level 3.
2. If YES: Does the response defend Tanya's public confrontation as appropriate behavior? → If YES, score Level 3 and flag error first.
3. If YES (3+ elements) AND NO errors: Score Level 4.
4. Does it identify all 4 elements with a clear explanation of how the untested assumption bypassed rational thinking and drove the irrational response? → Score Level 5.

ERROR HANDLING: If the response defends Tanya's public confrontation as appropriate behavior, flag this error FIRST in the improvements feedback—the scenario explicitly shows her reaction was based on a wrong assumption. The presence of uncorrected defense of the confrontation in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Identify triggers, cognitive hijacks, and untested assumptions in a real workplace scenario.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Watch <em>Understanding your personal EQ</em> and <em>Managing your mindset</em>',
      'Review the <a href="/eq-trigger-tracker.html" target="_blank" class="text-[#0a66c2] hover:underline">Trigger Tracker Worksheet</a>'
    ]
  },
  eq_self_awareness_wrapup: {
    id: 'eq_self_awareness_wrapup',
    initialQuestion: `Your colleague Sam keeps getting into conflicts at work. Here's what Sam told you:

<em>"Every time my manager gives me feedback in our 1-on-1s, I get defensive. I know she's trying to help, but I immediately feel like she's criticizing me as a person, not my work. My heart races, I cross my arms, and I start justifying everything I did. Last week she said 'The client presentation could use more data' and I snapped back 'I spent 20 hours on that presentation.' Afterwards I always regret it."</em>

Sam has asked you for help. Using what you know about self-awareness, identify:
<strong>(1)</strong> Sam's recurring trigger
<strong>(2)</strong> The pattern in Sam's emotional response
<strong>(3)</strong> One specific strategy Sam could use to break the cycle`,
    idealAnswer: `(1) Trigger: receiving feedback, which Sam interprets as personal criticism rather than work-related input.

(2) Pattern: feedback → feels personally attacked → physiological response (racing heart, crossed arms/defensive body language) → defensive verbal response (justifying rather than listening) → regret afterward. Sam recognizes the pattern but can't intercept it in the moment.

(3) Strategy options: practice pausing before responding (even 60 seconds), reframe feedback as being about the work not the person, use the reflection tool after each feedback session to build awareness, or identify "feedback" as a known trigger and prepare a pre-planned response like "Thank you, let me think about that."`,
    scoringCriteria: `SCORING CRITERIA - The learner is helping a colleague build self-awareness about triggers and patterns:
- 5 (Expert): Correctly identifies the trigger, full pattern (including physiological signs), and suggests a specific actionable strategy tied to course concepts.
- 4 (Proficient): Identifies trigger + pattern + a reasonable strategy for breaking the cycle.
- 3 (Competent): Identifies trigger and general pattern but strategy is vague or not actionable.
- 2 (Basic): Identifies the problem generally but misses the trigger-pattern analysis.
- 1 (Novice): Off-topic or does not analyze Sam's situation.

SCORING DECISION TREE:
1. Does the combined response identify the trigger, the emotional/behavioral pattern, and suggest a strategy? → If NO, max Level 3.
2. If YES: Does the response suggest Sam should simply "not get defensive" without any specific actionable strategy? → If YES, score Level 3 and flag error first.
3. If YES (trigger + pattern + strategy) AND NO errors: Score Level 4.
4. Does the pattern analysis include physiological signs (racing heart, crossed arms) AND is the strategy specific, actionable, and tied to course concepts? → Score Level 5.

ERROR HANDLING: If the response suggests Sam should simply "not get defensive" or "just relax" without providing any specific actionable strategy, flag this error FIRST in the improvements feedback—that's not actionable advice. The presence of non-actionable advice in the combined responses caps the score at Level 3 maximum. Level 4+ requires providing a concrete strategy. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Help a colleague build self-awareness about their triggers and reconnect with flow activities.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "4-5 minutes",
    prepareItems: [
      'Watch all Chapter 2 videos',
      'Review the <a href="/eq-trigger-tracker.html" target="_blank" class="text-[#0a66c2] hover:underline">Trigger Tracker Worksheet</a>'
    ],
    part2: {
      question: `Great work helping Sam! Now for Part 2:

Sam also says: <em>"I also feel burnt out. Everything at work feels like a grind. I used to love creating presentations and designing marketing campaigns, but now even those feel draining."</em>

Based on what you learned about <strong>flow</strong>, suggest <strong>2 things</strong> Sam could do to reconnect with activities that create a sense of flow, and explain <strong>why this would help Sam's overall emotional intelligence</strong>.`,
      idealAnswer: `Sam should (1) identify which specific activities used to create flow—presentations and design work—and find ways to do more of them or do them differently (maybe the burnout comes from other tasks crowding them out). (2) Deliberately schedule time for these flow activities, protecting them from interruptions.

Why it helps EQ: working in a state of flow builds confidence and positive emotional experiences, which counteracts the stress/defensiveness cycle. When Sam is feeling confident from flow activities, feedback is less likely to trigger a defensive reaction.`,
      scoringCriteria: `SCORING CRITERIA - The learner is applying flow concepts to help with burnout and EQ:
- 5 (Expert): 2 specific suggestions for reconnecting with flow + clear connection to how flow helps emotional intelligence and reduces triggers.
- 4 (Proficient): 2 suggestions with some connection to EQ improvement.
- 3 (Competent): 1-2 suggestions but weak or missing connection to EQ.
- 2 (Basic): Vague suggestions without connection to flow or EQ concepts.
- 1 (Novice): Off-topic or does not address the question.

SCORING DECISION TREE:
1. Does the combined response provide 2 suggestions for reconnecting with flow AND connect them to emotional intelligence? → If NO, max Level 3.
2. If YES: Does the response suggest Sam should just "push through" burnout or "try harder"? → If YES, score Level 3 and flag error first.
3. If YES (2 suggestions + EQ connection) AND NO errors: Score Level 4.
4. Does it provide 2 specific, actionable suggestions with a clear explanation of how flow activities build confidence and reduce defensive triggers? → Score Level 5.

ERROR HANDLING: If the response suggests Sam should just "push through" burnout or "try harder," flag this error FIRST in the improvements feedback—this contradicts the flow concept entirely. The presence of push-through advice in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`
    }
  },
  eq_abcde_model: {
    id: 'eq_abcde_model',
    initialQuestion: `Consider this scenario:

Jordan is a software developer who just found out that a junior colleague, Casey, has been promoted to team lead—a role Jordan had been hoping for. Jordan thinks: <em>"They promoted Casey over me because they don't value experience. Casey is less qualified and probably just got it because of office politics. There's no point trying hard anymore if this is how they make decisions."</em>

Apply the <strong>ABCDE model</strong> to Jordan's situation. Identify:
<strong>A</strong> (Activating event)
<strong>B</strong> (Beliefs)
<strong>C</strong> (Consequences of those beliefs)
<strong>D</strong> (a Disrupting thought)
<strong>E</strong> (the new Effect if Jordan adopts the disrupting thought)`,
    idealAnswer: `A = Casey (a junior colleague) was promoted to team lead instead of Jordan.

B = "They don't value experience," "Casey is less qualified," "It's just politics," "No point trying."

C = Jordan feels resentful, disengaged, and may stop putting in effort—damaging performance and relationships.

D = "Maybe there are skills Casey demonstrated that I haven't focused on yet. What can I learn from this? What did the decision-makers see that I might be missing?"

E = Jordan feels less resentful, becomes curious about what leadership values, can have a constructive conversation with their manager about career growth, and channels energy into development rather than bitterness.`,
    scoringCriteria: `SCORING CRITERIA - The learner is applying the ABCDE cognitive behavioral model:
- 5 (Expert): Correctly identifies all 5 ABCDE elements with specific detail. The D (disrupting thought) genuinely challenges the original beliefs rather than just restating them positively. The E shows a concrete behavioral/emotional change.
- 4 (Proficient): Identifies all 5 elements correctly, but D or E may lack specificity.
- 3 (Competent): Identifies 4 elements or has all 5 but some are weak/vague.
- 2 (Basic): Identifies 2-3 elements or confuses the model structure.
- 1 (Novice): Off-topic or doesn't use the ABCDE model.

SCORING DECISION TREE:
1. Does the combined response identify all 5 ABCDE elements correctly? → If NO, max Level 3.
2. If YES: Does the response validate Jordan's belief that it's "just politics" and suggest Jordan should confront management about unfairness? → If YES, score Level 3 and flag error first.
3. If YES (all 5 elements) AND NO errors: Score Level 4.
4. Does the D genuinely challenge the original beliefs (not just restate positively) AND does the E show concrete behavioral/emotional change? → Score Level 5.

ERROR HANDLING: If the response validates Jordan's belief that it's "just politics" and suggests Jordan should confront management about unfairness, flag this error FIRST in the improvements feedback—the ABCDE model asks us to challenge our beliefs, not reinforce them. The presence of uncorrected belief reinforcement in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Apply the ABCDE cognitive behavioral model to reframe a challenging workplace situation.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Watch <em>Thoughts and emotional intelligence</em>',
      'Review the <a href="/eq-abcde-worksheet.html" target="_blank" class="text-[#0a66c2] hover:underline">ABCDE Worksheet</a>'
    ]
  },
  eq_stress_response_review: {
    id: 'eq_stress_response_review',
    initialQuestion: `Read this account from a manager named Riley about how they handled a stressful situation:

<em>"A client called furious because our team missed a major deadline. Here's what I did:

1. I immediately called an emergency team meeting and told everyone how disappointed I was
2. I spent the first 10 minutes of the meeting going over everything that went wrong
3. I told the team member responsible that they'd really let everyone down, in front of the group
4. I called the client back right away while still feeling upset and promised we'd deliver by tomorrow—a deadline I hadn't checked with the team
5. After the call, I stayed at my desk fuming and kept replaying the situation for the rest of the day"</em>

Using the <strong>5-step process for slowing down reactions</strong> (identify the emotional reaction, remove yourself, give yourself time to recover, challenge your thoughts, choose how to respond), identify what Riley did wrong at each step and suggest what they should have done instead.`,
    idealAnswer: `Riley failed at essentially every step:

(1) IDENTIFY: Riley didn't pause to recognize they were reacting emotionally—they jumped straight to action while angry. Should have: noticed the anger/disappointment and recognized it as a trigger.

(2) REMOVE: Instead of stepping away, Riley immediately called a meeting while upset. Should have: taken 60 seconds to breathe and step away before taking action.

(3) RECOVER: Riley never gave themselves time to calm down—went from the team meeting straight to calling the client. Should have: let the body recover before making decisions.

(4) CHALLENGE: Riley never challenged their thoughts—assumed blame needed to be assigned publicly. Should have: considered whether public criticism was the most productive approach.

(5) CHOOSE: Riley made an unrealistic promise to the client while still emotional. Should have: waited until calm, consulted the team, then called the client with a realistic plan.`,
    scoringCriteria: `SCORING CRITERIA - The learner is reviewing a stress response against the 5-step framework:
- 5 (Expert): Addresses all 5 steps, identifying what Riley did wrong AND what they should have done at each step.
- 4 (Proficient): Addresses 4-5 steps with corrections for each.
- 3 (Competent): Addresses 3 steps with some corrections.
- 2 (Basic): Addresses 1-2 steps or gives general advice without mapping to the 5-step framework.
- 1 (Novice): Off-topic or does not use the 5-step framework.

SCORING DECISION TREE:
1. Does the combined response address 4+ steps with corrections for what Riley should have done? → If NO, max Level 3.
2. If YES: Does the response endorse any of Riley's actions as acceptable (e.g., "calling an emergency meeting was the right move")? → If YES, score Level 3 and flag error first.
3. If YES (4+ steps with corrections) AND NO errors: Score Level 4.
4. Does it address all 5 steps with specific, actionable corrections showing what Riley should have done at each stage? → Score Level 5.

ERROR HANDLING: If the response endorses Riley's actions as acceptable (e.g., "calling an emergency meeting was the right move" or "it's important to hold people accountable publicly"), flag this error FIRST in the improvements feedback—Riley acted at every stage without slowing down, which is the opposite of the 5-step process. The presence of uncorrected endorsements in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Review a manager's handling of a stressful situation and identify where they could have applied the 5-step process for slowing down reactions.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Watch <em>Dealing with stressful situations</em> and <em>Shift perspective</em>',
      'Review the <a href="/eq-5-step-guide.html" target="_blank" class="text-[#0a66c2] hover:underline">5-Step Stress Response Guide</a>'
    ]
  },
  eq_empathy_mistakes: {
    id: 'eq_empathy_mistakes',
    initialQuestion: `Read this conversation between two coworkers, Morgan and Taylor. Taylor just found out they didn't get a promotion they'd been working toward for months.

<strong>Taylor:</strong> "I'm really disappointed. I put in so much extra work this quarter and it feels like it didn't matter."

<strong>Morgan:</strong> "Oh I totally know how you feel! The same thing happened to me last year. I was devastated. But you know what? I got over it and it actually worked out better in the end. You just need to stay positive!"

<strong>Taylor:</strong> "I guess... I just feel like the criteria weren't clear."

<strong>Morgan:</strong> "Yeah, that happened to me too. What I did was go straight to my manager and demand a clear development plan. You should do exactly that. Trust me, it works."

<strong>Taylor:</strong> "..."

Identify <strong>3 specific empathy mistakes</strong> Morgan made and explain what Morgan should have done differently using the empathy principles from the course.`,
    idealAnswer: `(1) Morgan made it about themselves—instead of listening to Taylor's experience, Morgan kept bringing the conversation back to their own experience ("same thing happened to me," "what I did was..."). Should have: focused on Taylor's feelings and asked questions.

(2) Morgan assumed they knew exactly how Taylor felt and gave definitive advice ("you just need to stay positive," "you should do exactly that"). Should have: used tentative exploratory language like "I imagine that could make you feel..." or "I suppose that situation could make you think..."

(3) Morgan didn't ask any questions—they jumped straight to solutions and their own story without finding out more about Taylor's situation. Should have: asked questions like "What do you think happened?" or "How are you feeling about next steps?" to understand Taylor's perspective.

Additional: Morgan dismissed Taylor's emotions with "just stay positive" rather than validating them.`,
    scoringCriteria: `SCORING CRITERIA - The learner is identifying empathy mistakes and suggesting corrections:
- 5 (Expert): Identifies 3 distinct mistakes with specific corrections that reference course empathy principles (tentative language, asking questions, not assuming you have the answers).
- 4 (Proficient): Identifies 3 mistakes with reasonable corrections.
- 3 (Competent): Identifies 2 mistakes with some corrections.
- 2 (Basic): Identifies 1 mistake or gives general empathy advice without specifics.
- 1 (Novice): Off-topic or does not analyze the conversation.

SCORING DECISION TREE:
1. Does the combined response identify 3 distinct empathy mistakes with corrections? → If NO, max Level 3.
2. If YES: Does the response say Morgan handled the conversation well or that sharing personal experience is always helpful empathy? → If YES, score Level 3 and flag error first.
3. If YES (3 mistakes with corrections) AND NO errors: Score Level 4.
4. Do the corrections specifically reference course empathy principles (tentative language, asking questions, not assuming you have the answers)? → Score Level 5.

ERROR HANDLING: If the response says Morgan handled the conversation well or that sharing personal experience is always helpful empathy, flag this error FIRST in the improvements feedback—Morgan's approach violated all 3 empathy principles from the course. The presence of uncorrected endorsement of Morgan's approach in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Identify empathy mistakes in a conversation and suggest how to apply genuine empathy principles.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Watch <em>Connecting with empathy</em>',
      'Review the <a href="/eq-empathy-guide.html" target="_blank" class="text-[#0a66c2] hover:underline">Empathy Response Guide</a>'
    ]
  },
  eq_social_awareness_wrapup: {
    id: 'eq_social_awareness_wrapup',
    initialQuestion: `You're in a team meeting. Here are the social cues you observe:

• The project manager, <strong>Lisa</strong>, keeps glancing at her phone and tapping her pen, which is unusual for her
• Two team members, <strong>Kai</strong> and <strong>Aisha</strong>, avoid eye contact with each other and sit on opposite sides of the table
• When the topic of the <strong>Q3 deadline</strong> comes up, the whole room goes quiet and people shift in their seats
• The newest team member, <strong>Dev</strong>, keeps starting to speak but stops when others talk over him

Using your social awareness skills, interpret what you observe. For each of the 4 situations, state what you think <strong>might</strong> be going on and what social cue led you to that interpretation.`,
    idealAnswer: `(1) Lisa (phone + pen tapping) = likely stressed or anxious about something—possibly expecting bad news or has a pressing issue outside the meeting. Cue: uncharacteristic fidgeting behavior suggests distraction/anxiety.

(2) Kai and Aisha (avoiding eye contact, sitting apart) = likely have unresolved tension or conflict between them. Cue: deliberate physical distancing + avoiding eye contact signals interpersonal friction.

(3) Q3 deadline (silence, shifting) = the team is uncomfortable about the deadline—possibly behind schedule or worried about feasibility. Cue: collective body language change (silence + shifting) when a specific topic comes up signals shared anxiety.

(4) Dev (starting to speak, stopping) = feeling marginalized or intimidated as the newest member, not yet comfortable asserting himself. Cue: repeated self-censoring suggests lack of psychological safety.`,
    scoringCriteria: `SCORING CRITERIA - The learner is reading social cues and forming hypotheses:
- 5 (Expert): Interprets all 4 situations with plausible explanations AND correctly identifies the specific social cues that led to each interpretation.
- 4 (Proficient): Interprets 3-4 situations with cue identification.
- 3 (Competent): Interprets 2-3 situations with some cue identification.
- 2 (Basic): Interprets 1 situation or gives surface-level observations without reading deeper meaning.
- 1 (Novice): Off-topic or does not analyze the social cues.

SCORING DECISION TREE:
1. Does the combined response interpret 3+ situations with plausible explanations and cue identification? → If NO, max Level 3.
2. If YES: Does the response make definitive statements about what people ARE feeling rather than what they MIGHT be feeling? → If YES, score Level 3 and flag gently—social awareness involves forming hypotheses, not absolute judgments.
3. If YES (3+ situations with cues) AND uses tentative/hypothesis language: Score Level 4.
4. Does it interpret all 4 situations with plausible explanations, specific cue identification, AND appropriately tentative language? → Score Level 5.

ERROR HANDLING: If the response makes definitive statements about what people ARE feeling (rather than what they MIGHT be feeling), flag this gently FIRST in the improvements feedback—social awareness involves reading cues and forming hypotheses, not making absolute judgments. The presence of definitive judgments without tentative language in the combined responses caps the score at Level 3 maximum. Level 4+ requires using hypothesis-forming language. When combined responses meet Level 4 content requirements AND use appropriate tentative language, score Level 4.`,
    goalText: "Read social cues in a team meeting and practice two-way communication.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "4-5 minutes",
    prepareItems: [
      'Watch all Chapter 4 videos',
      'Review the <a href="/eq-empathy-guide.html" target="_blank" class="text-[#0a66c2] hover:underline">Empathy Response Guide</a>'
    ],
    part2: {
      question: `Great observations! Now for Part 2:

Based on your observations, you decide to follow up with <strong>Dev</strong> after the meeting because you noticed he was struggling to be heard.

Write <strong>3-4 sentences</strong> showing how you'd start that conversation using effective two-way communication principles: <strong>listen more than you speak</strong>, <strong>use open questions</strong>, and <strong>pay attention to what Dev says</strong> (not just what YOU want to say).`,
      idealAnswer: `Something like: "Hey Dev, I noticed in the meeting today it seemed like you had some ideas you wanted to share. I'd really like to hear your thoughts on the Q3 plan—your perspective is valuable. What were you thinking when the deadline discussion came up?" Then LISTEN to Dev's response and follow up based on what he says, not with a pre-planned agenda.

Key elements: (1) Creates safe space (non-judgmental opener). (2) Uses an open-ended question. (3) Signals genuine interest in listening. (4) Doesn't lecture or assume what Dev was thinking.`,
      scoringCriteria: `SCORING CRITERIA - The learner is practicing two-way communication:
- 5 (Expert): All 4 elements (safe space, open question, genuine listening signal, no assumptions) in a natural conversation opener.
- 4 (Proficient): 3 elements present in a reasonable conversation starter.
- 3 (Competent): 2 elements or the approach is somewhat lecture-y.
- 2 (Basic): 1 element or mostly telling Dev what to do rather than listening.
- 1 (Novice): Off-topic or does not write a conversation opener.

SCORING DECISION TREE:
1. Does the combined response include 3+ elements (safe space, open question, listening signal, no assumptions)? → If NO, max Level 3.
2. If YES: Does the response lecture Dev about speaking up or give advice without asking questions first? → If YES, score Level 3 and flag error first.
3. If YES (3+ elements) AND NO lecturing: Score Level 4.
4. Does it include all 4 elements in a natural, warm conversation opener that genuinely invites Dev's perspective? → Score Level 5.

ERROR HANDLING: If the response has the user lecturing Dev about speaking up or giving advice without asking questions first, flag this error FIRST in the improvements feedback—this contradicts the two-way communication principle of listening more than speaking. The presence of lecturing in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`
    }
  },
  eq_relationship_wrapup: {
    id: 'eq_relationship_wrapup',
    initialQuestion: `You manage a small team of 4 people. Over the past month, you've noticed:

• Team member <strong>Jamie</strong> does excellent individual work but rarely speaks up in meetings and seems uncomfortable giving opinions in group settings
• Team member <strong>Priya</strong> is highly collaborative but has received feedback that she sometimes dominates conversations without realizing it
• Team member <strong>Carlos</strong> is well-liked by everyone but avoids difficult conversations—when there's conflict, he changes the subject or makes a joke

For each team member, identify <strong>one relationship management strength</strong> they have and <strong>one area they could develop</strong>. Then suggest <strong>one specific action</strong> each person could take, drawing on the relationship management skills from the course.`,
    idealAnswer: `Jamie: Strength = strong individual performance/quality work. Development area = speaking up and contributing in group settings. Action = start small by preparing one point to share before each meeting, building confidence through practice.

Priya: Strength = highly collaborative, engages actively with others. Development area = listening more and creating space for others. Action = practice the "listen before speaking" technique—make it a habit to ask a question before sharing her own view.

Carlos: Strength = building rapport and genuine connections (well-liked). Development area = having direct/difficult conversations when needed. Action = use the Review/Refine/Repeat approach—start by asking trusted colleagues for feedback on how he handles conflict, then make small adjustments.`,
    scoringCriteria: `SCORING CRITERIA - The learner is identifying relationship management strengths and development areas:
- 5 (Expert): Correctly identifies strength + development area + specific actionable suggestion for ALL 3 team members. Suggestions reference course concepts.
- 4 (Proficient): Correctly addresses all 3 team members with reasonable suggestions.
- 3 (Competent): Addresses 2-3 team members but suggestions are generic.
- 2 (Basic): Addresses 1 team member or gives only vague advice.
- 1 (Novice): Off-topic or does not analyze the team members.

SCORING DECISION TREE:
1. Does the combined response address all 3 team members with strength, development area, and suggestion for each? → If NO, max Level 3.
2. If YES: Does the response frame any development area as a character flaw rather than a skill to develop (e.g., "Priya is selfish" or "Carlos is a coward")? → If YES, score Level 3 and flag error first.
3. If YES (all 3 team members addressed) AND NO character labeling: Score Level 4.
4. Does it provide specific actionable suggestions that reference course concepts (like Review/Refine/Repeat, listen before speaking) for all 3? → Score Level 5.

ERROR HANDLING: If the response frames any team member's development area as a character flaw rather than a skill to develop (e.g., "Priya is selfish" or "Carlos is a coward"), flag this error FIRST in the improvements feedback—EQ development is about building skills, not labeling people. The presence of character labeling in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`,
    goalText: "Identify relationship strengths and development areas for team members, then practice communicating with intent and impact.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "4-5 minutes",
    prepareItems: [
      'Watch all Chapter 5 videos',
      'Review the <a href="/eq-feedback-loop.html" target="_blank" class="text-[#0a66c2] hover:underline">Review/Refine/Repeat Guide</a>'
    ],
    part2: {
      question: `Great analysis! Now for Part 2:

Priya comes to you and says: <em>"I've been told I dominate conversations but I don't understand—I'm just trying to be helpful and share my ideas. I feel like people are telling me to be less of myself."</em>

Write <strong>3-4 sentences</strong> responding to Priya. Your intent is to help her see that adjusting her communication style isn't about being "less"—it's about being <strong>MORE effective</strong>. Focus on <strong>intent vs impact</strong>: her intent is positive (being helpful), but the impact isn't matching her intent.`,
      idealAnswer: `Something like: "I can see that your intention is genuinely to help and share valuable ideas—and that's a real strength. The challenge is that sometimes the impact doesn't match that intention. When others feel they can't get a word in, they might miss your good ideas because they're focused on not having space to contribute. What if we focused on how to make your contributions land even better by also creating room for others to build on them?"

Key elements: (1) Acknowledges her positive intent. (2) Explains the gap between intent and impact without blame. (3) Reframes adjustment as becoming MORE effective, not less. (4) Focuses on what she wants others to take away (her good ideas) and how to achieve that.`,
      scoringCriteria: `SCORING CRITERIA - The learner is practicing intent vs impact communication:
- 5 (Expert): All 4 elements (acknowledges intent, explains intent-impact gap without blame, reframes as MORE effective, focuses on achieving her goals) in a warm, non-judgmental response.
- 4 (Proficient): 3 elements present in a reasonable response.
- 3 (Competent): 2 elements or somewhat preachy/lecture-like tone.
- 2 (Basic): 1 element or dismissive of her feelings.
- 1 (Novice): Off-topic or does not respond to Priya.

SCORING DECISION TREE:
1. Does the combined response include 3+ elements (acknowledges intent, explains gap, reframes as MORE effective, focuses on her goals)? → If NO, max Level 3.
2. If YES: Is the response blunt/harsh (e.g., "You need to talk less") or dismissive of Priya's feelings? → If YES, score Level 3 and flag error first.
3. If YES (3+ elements) AND warm/non-judgmental tone: Score Level 4.
4. Does it include all 4 elements in a warm, empathetic response that Priya would genuinely find helpful? → Score Level 5.

ERROR HANDLING: If the response is blunt/harsh (e.g., "You need to talk less") or dismisses Priya's feelings ("That's just how it is"), flag this error FIRST in the improvements feedback—the point is using intent vs impact to communicate sensitively. The presence of harsh or dismissive language in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no uncorrected errors, score Level 4.`
    }
  },
  eq_feedback_loop: {
    id: 'eq_feedback_loop',
    initialQuestion: `You've decided to use the <strong>Review/Refine/Repeat</strong> process to improve your working relationship with a colleague named <strong>Dana</strong>. You and Dana work well together on routine tasks, but whenever a project hits a snag, communication breaks down—you both go quiet and work in silos instead of collaborating.

You want to start with the <strong>Review</strong> step. Write out:

<strong>(1)</strong> Two specific questions you would ask a trusted colleague (not Dana) to get feedback on how you come across when projects hit problems
<strong>(2)</strong> One question you would ask Dana directly to understand their perspective on the communication breakdown
<strong>(3)</strong> Based on what you might learn, suggest one small <strong>Refine</strong> adjustment you could make to improve how you handle project setbacks with Dana`,
    idealAnswer: `(1) Questions for a trusted colleague: "How do I generally come across when a project hits a problem? Do I seem approachable or do I shut down?" and "Have you noticed any patterns in how I communicate when things go wrong—do I withdraw, get tense, or something else?"

(2) Question for Dana: "When we hit a snag on a project, I've noticed we tend to go quiet. I'd like to understand your perspective—what do you think happens, and what would work better for you?"

(3) Refine adjustment: When a project hits a problem, instead of going quiet, proactively reach out to Dana within the first hour with a brief message: "I've noticed X issue—can we spend 10 minutes talking through options?" This small step breaks the silence pattern.`,
    scoringCriteria: `SCORING CRITERIA - The learner is applying the Review/Refine/Repeat process:
- 5 (Expert): Provides 2 thoughtful questions for a colleague + 1 question for Dana that's open-ended and non-judgmental + a specific, actionable Refine adjustment that addresses the silence pattern.
- 4 (Proficient): Provides questions and a reasonable adjustment that connects to the scenario.
- 3 (Competent): Provides some questions but the Refine adjustment is vague or generic.
- 2 (Basic): Provides generic questions without connecting to the specific situation.
- 1 (Novice): Off-topic or does not address the Review/Refine/Repeat process.

SCORING DECISION TREE:
1. Does the combined response include 2 questions for a colleague + 1 question for Dana + a Refine adjustment? → If NO, max Level 3.
2. If YES: Are any questions confrontational or accusatory toward Dana (e.g., "Why do you always go quiet?")? → If YES, score Level 3 and flag error first.
3. If YES (all 3 parts present) AND questions are non-confrontational: Score Level 4.
4. Are the colleague questions thoughtful and specific, the Dana question open-ended and non-judgmental, AND the Refine adjustment specific and actionable (addresses the silence pattern)? → Score Level 5.

ERROR HANDLING: If the response frames the questions as confrontational or accusatory toward Dana (e.g., "Why do you always go quiet?" or "What's your problem when things go wrong?"), flag this error FIRST in the improvements feedback—the Review/Refine/Repeat process is about understanding and adjusting, not confronting. The presence of confrontational or accusatory language in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no confrontational language, score Level 4.`,
    goalText: "Apply the Review/Refine/Repeat process to improve a working relationship.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Watch <em>Play to your personal strengths</em> and <em>Collect feedback</em>',
      'Review the <a href="/eq-feedback-loop.html" target="_blank" class="text-[#0a66c2] hover:underline">Review/Refine/Repeat Guide</a>'
    ]
  },
  eq_capstone: {
    id: 'eq_capstone',
    initialQuestion: `You've just been promoted to lead a cross-functional team of 6 people. In your first week, you observe the following:

• Team member <strong>Amir</strong> delivers excellent technical work but visibly tenses up and gives one-word answers whenever you ask for status updates. You later learn his previous manager micromanaged him.
• During your first team meeting, two members (<strong>Priya</strong> and <strong>Luis</strong>) got into a heated disagreement about project priorities. Priya raised her voice, Luis crossed his arms and went silent, and the rest of the team looked uncomfortable.
• After the meeting, team member <strong>Kenji</strong> approaches you privately and says: <em>"I have some ideas for improving our process, but I'm worried about stepping on toes. The last time someone suggested changes, it didn't go well."</em>

Using the emotional intelligence skills you've learned throughout this course, analyze each situation and recommend a specific approach for each person. Reference the relevant EQ concepts (self-awareness, self-management, empathy, social awareness, relationship management) in your response.`,
    idealAnswer: `Amir: This is a trigger response—Amir's previous experience with micromanagement created a trigger around status updates. Using empathy, approach with tentative language: "I notice status updates might feel uncomfortable—I'd like to find a format that works for both of us. What would be most helpful?" Use social awareness to read his body language and adjust.

Priya and Luis: This required social awareness (reading the room—everyone was uncomfortable) and relationship management. Address separately first: with Priya, use intent vs impact ("Your passion for getting priorities right is clear—let's find a way to channel that effectively"). With Luis, create safe space to hear his perspective. Then establish team norms for healthy disagreement.

Kenji: Social awareness tells you Kenji feels psychologically unsafe. Use empathy—ask open-ended questions: "I'd love to hear your ideas. What changes do you think would help?" Signal that you value input and create a safe channel for suggestions. Don't dismiss his concern about "stepping on toes"—validate it.`,
    scoringCriteria: `SCORING CRITERIA - The learner is applying multiple EQ skills to team leadership challenges:
- 5 (Expert): Analyzes all 3 situations with specific EQ-concept-backed approaches, references relevant concepts by name (triggers, empathy, social awareness, intent vs impact, relationship management).
- 4 (Proficient): Addresses all 3 situations with reasonable EQ-informed approaches.
- 3 (Competent): Addresses 2-3 situations but doesn't clearly connect to EQ concepts.
- 2 (Basic): Addresses 1 situation or gives generic leadership advice.
- 1 (Novice): Off-topic or does not analyze the situations.

SCORING DECISION TREE:
1. Does the combined response address all 3 situations (Amir, Priya/Luis, Kenji) with specific approaches? → If NO, max Level 3.
2. If YES: Does the response suggest commanding/authoritative approaches (e.g., "Tell Amir he needs to give proper updates" or "Tell Priya and Luis to stop arguing")? → If YES, score Level 3 and flag error first.
3. If YES (all 3 addressed) AND no commanding approaches: Score Level 4.
4. Does it reference specific EQ concepts by name (triggers, empathy, social awareness, intent vs impact, relationship management) for each situation? → Score Level 5.

ERROR HANDLING: If the response suggests commanding or authoritative approaches (e.g., "Tell Amir he needs to give proper updates" or "Tell Priya and Luis to stop arguing"), flag this error FIRST in the improvements feedback—this contradicts every EQ principle in the course. The presence of commanding/authoritative approaches in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no commanding approaches, score Level 4.`,
    goalText: "Apply multiple EQ skills to real team leadership challenges, then practice giving feedback using intent vs impact.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "5-6 minutes",
    prepareItems: [
      'Review all course chapters',
      'Review the <a href="/eq-feedback-loop.html" target="_blank" class="text-[#0a66c2] hover:underline">Review/Refine/Repeat Guide</a>'
    ],
    part2: {
      question: `Great analysis! Now for Part 2:

Two weeks later, you need to give <strong>Priya</strong> feedback about the meeting incident. She's a strong contributor who genuinely cares about the team's success, but her communication style in heated moments is creating friction.

Write <strong>4-5 sentences</strong> of what you would say to Priya. Your response should demonstrate:
<strong>(1)</strong> Empathy — acknowledge her positive intent
<strong>(2)</strong> Self-awareness — share your own experience with managing reactions (briefly)
<strong>(3)</strong> Intent vs Impact — help her see the gap
<strong>(4)</strong> A forward-looking suggestion using a specific technique from the course`,
      idealAnswer: `Something like: "Priya, I want to start by saying that your commitment to getting priorities right is one of your biggest strengths—the team benefits from your drive and your ideas. I know from my own experience that when you care deeply about something, it can be hard to manage how that comes across in the moment. In last week's meeting, I think your intent was to make sure we made the right decision, but the impact was that Luis shut down and the rest of the team felt caught in the middle. What if we tried the pause technique before responding in heated discussions—even 60 seconds can help you choose how to channel that energy so your great ideas actually land? I'd love to support you in this because I think it could make your contributions even more effective."

Key elements: (1) Empathy—acknowledges positive intent without being patronizing. (2) Self-awareness—brief self-disclosure that normalizes the challenge. (3) Intent vs Impact—specifically names the gap. (4) Specific technique from the course (pause technique, ABCDE model, 5-step process, etc.).`,
      scoringCriteria: `SCORING CRITERIA - The learner is practicing giving feedback using intent vs impact:
- 5 (Expert): All 4 elements (empathy/positive intent, self-awareness/self-disclosure, intent vs impact gap, specific course technique) in a warm, professional response that feels like a real conversation.
- 4 (Proficient): 3-4 elements present in a reasonable response.
- 3 (Competent): 2 elements or somewhat lecture-like tone.
- 2 (Basic): 1 element or dismissive/harsh toward Priya.
- 1 (Novice): Off-topic or does not write feedback for Priya.

SCORING DECISION TREE:
1. Does the combined response include 3+ elements (empathy, self-awareness, intent vs impact, course technique)? → If NO, max Level 3.
2. If YES: Is the response harsh, purely critical, or doesn't acknowledge Priya's positive intent? → If YES, score Level 3 and flag error first.
3. If YES (3+ elements) AND warm/professional tone: Score Level 4.
4. Does it include all 4 elements in a warm, professional response that feels like a real conversation? → Score Level 5.

ERROR HANDLING: If the response is harsh, purely critical, or doesn't acknowledge Priya's positive intent, flag this error FIRST in the improvements feedback—this contradicts the intent vs impact principle that is central to this exercise. The presence of harsh or purely critical language in the combined responses caps the score at Level 3 maximum. Level 4+ requires removing or correcting such errors. When combined responses meet Level 4 content requirements AND contain no harsh/critical language, score Level 4.`
    }
  }
};

const DEFAULT_MODULE_ID = 'project_stakeholders';

export const MODULE_SUBTITLES: Record<string, string> = {
  ...EXCEL_MODULE_SUBTITLES,
  project_stakeholders: "Identify the right stakeholders",
  scope_wbs_reflection: "Clean up a faulty Work Breakdown Structure",
  ai_kpi_prompt: "Write an AI prompt to develop project KPIs",
  csf_functions: "Apply CSF functions to a real scenario",
  asset_classification: "Classify assets by criticality",
  risk_communication: "Translate technical risk for executives",
  identify_wrapup: "Apply the complete Identify function",
  access_control: "Apply access control principles",
  protect_wrapup: "Design a layered protection strategy",
  incident_response: "Lead an incident response",
  drr_wrapup: "Apply Detect, Respond, and Recover",
  implementation_plan: "Create a CSF implementation roadmap",
  csf_capstone: "Course Capstone: Assess, Plan, Communicate",
  eq_emotional_chain: "Analyze the Event → Thoughts → Behavior chain",
  eq_ch1_wrapup: "Apply EQ foundations to a workplace challenge",
  eq_cognitive_hijack: "Spot triggers and cognitive hijacks",
  eq_self_awareness_wrapup: "Coach a colleague on self-awareness and flow",
  eq_abcde_model: "Apply the ABCDE model to reframe a situation",
  eq_stress_response_review: "Review and fix a stress response",
  eq_empathy_mistakes: "Identify empathy mistakes in a conversation",
  eq_social_awareness_wrapup: "Read social cues and communicate effectively",
  eq_relationship_wrapup: "Develop your team's relationship skills",
  eq_feedback_loop: "Apply the Review/Refine/Repeat process",
  eq_capstone: "Course Capstone: Lead with emotional intelligence"
};

// Pool of Level 5 reward animations - delivered randomly exhaustively then reset
const REWARD_ANIMATION_POOL = [
  "https://media.giphy.com/media/l2Sqir5ZxfoS27EvS/giphy.mp4",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTQwMWtkMWtkY3d4MXA4NDRndWhrOGE0bXVocmpjbGNyZG1jMncwayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wtUTJUtDDKB36UN7X0/giphy.mp4",
  "https://media.giphy.com/media/2SYc7mttUnWWaqvWz8/giphy.mp4",
  "https://media.giphy.com/media/11uArCoB4fkRcQ/giphy.mp4",
  "https://media.giphy.com/media/NzeJJic0gjUaw8FoVV/giphy.mp4",
  "https://media.giphy.com/media/RLBHnS501YAS2yk3mo/giphy.mp4",
  "https://media.giphy.com/media/h0H7PL3l0EPovjbq0v/giphy.mp4"
];

let _isFirstRewardAnimation = true;
let _availableRewardAnimations = [...REWARD_ANIMATION_POOL.slice(1)];

export function SkillBuilderInline({ onClose, onContinue, onComplete, onTakeaways, onViewSummary, prefillText, onPrefillComplete, aiHelpfulness = 3, onAiHelpfulnessChange, moduleId = DEFAULT_MODULE_ID, showRefNumbers = false, onJumpToWrapUp, onPartChange, sidebarOpen = true, sessionId: externalSessionId, onScoreUpdate }: SkillBuilderInlineProps) {
  const RefBadge = ({ num }: { num: string }) => showRefNumbers ? (
    <span className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-50 shadow-md border border-white">{num}</span>
  ) : null;
  const MODULE_CONFIG = MODULE_CONFIGS[moduleId] || MODULE_CONFIGS[DEFAULT_MODULE_ID];
  
  const effectiveModuleId = moduleId || DEFAULT_MODULE_ID;
  const draftKey = `sb_draft_${effectiveModuleId}`;

  const [phase, setPhase] = useState<'intro' | 'conversation' | 'complete'>('intro');
  const [input, setInput] = useState(() => {
    try { return localStorage.getItem(`sb_draft_${effectiveModuleId}`) || ''; } catch { return ''; }
  });

  useEffect(() => {
    try { if (input) localStorage.setItem(draftKey, input); else localStorage.removeItem(draftKey); } catch {}
  }, [input, draftKey]);

  useEffect(() => {
    const handleDownloadClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href*="/exercise-files/"][download]') as HTMLAnchorElement | null;
      if (!anchor) return;
      e.preventDefault();
      e.stopPropagation();
      const url = anchor.getAttribute('href');
      if (!url) return;
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const tmp = document.createElement('a');
          tmp.href = blobUrl;
          tmp.download = url.split('/').pop() || 'exercise.xlsx';
          document.body.appendChild(tmp);
          tmp.click();
          document.body.removeChild(tmp);
          URL.revokeObjectURL(blobUrl);
        })
        .catch(() => {});
    };
    document.addEventListener('click', handleDownloadClick, true);
    return () => document.removeEventListener('click', handleDownloadClick, true);
  }, []);

  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [sessionId] = useState(() => externalSessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [showSummarize, setShowSummarize] = useState(false);
  const [summarizedResponse, setSummarizedResponse] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDelayedReward, setShowDelayedReward] = useState(false);
  const [hasCombinedResponse, setHasCombinedResponse] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [revisedText, setRevisedText] = useState('');
  const [showFinalVersion, setShowFinalVersion] = useState(false);
  const [finalizedResponse, setFinalizedResponse] = useState('');
  const [expandedHelpInfo, setExpandedHelpInfo] = useState<Set<number>>(new Set());
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
  const [showAboutPanel, setShowAboutPanel] = useState(false);
  const [isFirstTimeAbout, setIsFirstTimeAbout] = useState(false);
  const [rewardAnimations, setRewardAnimations] = useState(true);
  const [successStreaks, setSuccessStreaks] = useState(true);
  const [currentRewardAnimation, setCurrentRewardAnimation] = useState<string>('');
  const [badgesEnabled, setBadgesEnabled] = useState(false);
  const [localAiHelpLevel, setLocalAiHelpLevel] = useState(aiHelpfulness <= 5 ? aiHelpfulness : 3);
  const [accumulatedResponse, setAccumulatedResponse] = useState('');
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<Badge | null>(null);
  const [previousTextLength, setPreviousTextLength] = useState(0);
  const [inheritedText, setInheritedText] = useState('');
  const [consecutiveSameScoreCount, setConsecutiveSameScoreCount] = useState(0);
  const [showNeedMoreHelp, setShowNeedMoreHelp] = useState(false);
  const [isRefreshingHelp, setIsRefreshingHelp] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; extractedText: string } | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [fileDetailsText, setFileDetailsText] = useState('');
  const [showResponseBox, setShowResponseBox] = useState(true);
  const [isTypingAnimation, setIsTypingAnimation] = useState(false);
  const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
  const [part1FinalResponse, setPart1FinalResponse] = useState('');
  const [part2FinalResponse, setPart2FinalResponse] = useState('');
  const [part1Score, setPart1Score] = useState(0);
  const [part2Score, setPart2Score] = useState(0);
  const totalParts = MODULE_CONFIG.part3 ? 3 : MODULE_CONFIG.part2 ? 2 : 1;
  const isMultiPart = totalParts > 1;
  const isLastPart = currentPart === totalParts;

  const currentPartExpectsFileUpload = useMemo(() => {
    const excelConfig = EXCEL_MODULE_CONFIGS[moduleId] as ExcelModuleConfig | undefined;
    if (!excelConfig) return false;
    if (currentPart === 1) return !!excelConfig.expectsFileUpload;
    if (currentPart === 2) return !!excelConfig.part2?.expectsFileUpload;
    if (currentPart === 3) return !!excelConfig.part3?.expectsFileUpload;
    return false;
  }, [moduleId, currentPart]);

  const handleFileUpload = async (file: File) => {
    setIsUploadingFile(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload-xlsx', { method: 'POST', body: formData });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Upload failed. Please try a different file.');
      }
      const data = await response.json();
      if (!data.extractedText || data.extractedText.trim().length === 0) {
        throw new Error('The file appears to be empty. Please check your Excel file and try again.');
      }
      setUploadedFile({ name: data.fileName, extractedText: data.extractedText });
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
      setUploadedFile(null);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleFileClear = () => {
    setUploadedFile(null);
    setUploadError('');
  };

  const handleFileSubmit = async () => {
    if (!uploadedFile || isSubmitting) return;
    const truncated = uploadedFile.extractedText.length > 8000
      ? uploadedFile.extractedText.slice(0, 8000) + '\n\n[... truncated for evaluation ...]'
      : uploadedFile.extractedText;
    let fileResponse = `[UPLOADED FILE: ${uploadedFile.name}]\n\n${truncated}`;
    if (fileDetailsText.trim()) {
      fileResponse += `\n\n[LEARNER NOTE: ${fileDetailsText.trim()}]`;
    }
    setInput(fileResponse);
    setUploadedFile(null);
    setFileDetailsText('');
    setTimeout(() => {
      handleSubmit(fileResponse);
    }, 0);
  };

  const handleDetailsOnlySubmit = () => {
    if (!fileDetailsText.trim() || isSubmitting) return;
    const detailsResponse = `[QUESTION ABOUT TASK]: ${fileDetailsText.trim()}`;
    setInput(detailsResponse);
    setFileDetailsText('');
    setTimeout(() => {
      handleSubmit(detailsResponse);
    }, 0);
  };

  const recognitionRef = useRef<any>(null);
  const preRecordingTextRef = useRef<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const optionsPanelRef = useRef<HTMLDivElement>(null);
  const aboutPanelRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const gearButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-resize textarea when input changes
  useEffect(() => {
    if (inputRef.current) {
      const el = inputRef.current;
      const prevHeight = el.style.height;
      el.style.height = '0px';
      const scrollHeight = el.scrollHeight;
      const newHeight = Math.max(scrollHeight + 10, 140);
      el.style.height = newHeight + 'px';
      if (prevHeight !== newHeight + 'px' && containerRef.current) {
        requestAnimationFrame(() => {
          if (!containerRef.current || !inputRef.current) return;
          const container = containerRef.current;
          const elRect = inputRef.current.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const overflowBottom = elRect.bottom - containerRect.bottom;
          if (overflowBottom > 0) {
            container.scrollBy({ top: overflowBottom + 20, behavior: 'smooth' });
          }
        });
      }
    }
  }, [input]);

  // Handle prefilled text from Demo Tips with typing animation
  useEffect(() => {
    if (prefillText) {
      inputRef.current?.focus();
      
      // Get the existing gray text (previous responses) to preserve
      const existingGrayText = previousTextLength > 0 ? input.slice(0, previousTextLength) : '';
      const startingText = existingGrayText;
      
      let currentIndex = 0;
      const charsPerTick = 3; // Type multiple characters at once for speed
      const intervalMs = 8; // 20% faster typing animation
      
      const typeInterval = setInterval(() => {
        currentIndex += charsPerTick;
        const newText = currentIndex >= prefillText.length 
          ? startingText + prefillText 
          : startingText + prefillText.slice(0, currentIndex);
        
        if (currentIndex >= prefillText.length) {
          setInput(newText);
          clearInterval(typeInterval);
          onPrefillComplete?.();
        } else {
          setInput(newText);
        }
        
        // Sync cursor position (resize handled by useEffect on input change)
        if (inputRef.current) {
          const cursorPos = newText.length;
          inputRef.current.setSelectionRange(cursorPos, cursorPos);
        }
      }, intervalMs);
      
      return () => clearInterval(typeInterval);
    }
  }, [prefillText]);

  // Handle click outside options panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (optionsPanelRef.current && !optionsPanelRef.current.contains(target) && 
          gearButtonRef.current && !gearButtonRef.current.contains(target)) {
        setShowOptionsPanel(false);
      }
    };
    if (showOptionsPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptionsPanel]);

  // Auto-open About panel on first-ever Skill Builder encounter (resets on page refresh)
  useEffect(() => {
    if (!hasShownWelcome) {
      hasShownWelcome = true;
      setIsFirstTimeAbout(true);
      setShowAboutPanel(true);
    }
  }, []);

  // Handle click outside about panel (only for non-first-time opens)
  useEffect(() => {
    if (isFirstTimeAbout) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (aboutPanelRef.current && !aboutPanelRef.current.contains(target) && 
          aboutButtonRef.current && !aboutButtonRef.current.contains(target)) {
        setShowAboutPanel(false);
      }
    };
    if (showAboutPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAboutPanel, isFirstTimeAbout]);

  // Auto-focus textarea when response box becomes visible
  useEffect(() => {
    if (showResponseBox && !isTypingAnimation) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showResponseBox, isTypingAnimation]);

  // Sync localAiHelpLevel with parent prop if changed externally (e.g., Demo Shortcuts)
  useEffect(() => {
    if (aiHelpfulness <= 5 && aiHelpfulness !== localAiHelpLevel) {
      setLocalAiHelpLevel(aiHelpfulness);
    }
  }, [aiHelpfulness]);

  // Handle AI help level change - sync with parent
  const handleAiHelpLevelChange = (level: number) => {
    setLocalAiHelpLevel(level);
    onAiHelpfulnessChange?.(level);
  };

  // Delay reward animation until Final Response text is visible and rendered
  useEffect(() => {
    if (showFinalVersion && finalizedResponse && currentScore === 5 && rewardAnimations) {
      // Wait for Final Response box to be fully rendered before showing animation
      const timer = setTimeout(() => {
        setShowDelayedReward(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setShowDelayedReward(false);
    }
  }, [showFinalVersion, finalizedResponse, currentScore, rewardAnimations]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        // Append transcript to the text that existed before recording started
        setInput(preRecordingTextRef.current + transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // Capture existing text before starting recording
      preRecordingTextRef.current = input;
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const scrollToBottom = () => {
    const doScroll = () => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    };
    setTimeout(doScroll, 50);
    setTimeout(doScroll, 200);
    setTimeout(doScroll, 400);
  };

  const handleStart = () => {
    setPhase('conversation');
    // Add the initial AI question
    setConversation([{
      role: 'ai',
      content: MODULE_CONFIG.initialQuestion
    }]);
    setTimeout(() => {
      inputRef.current?.focus();
      scrollToBottom();
    }, 300);
  };

  const handleStartNextPart = () => {
    const latestUserResponse = conversation.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
    const nextPart = (currentPart + 1) as 1 | 2 | 3;
    
    if (currentPart === 1) {
      setPart1FinalResponse(latestUserResponse);
      setPart1Score(currentScore);
    } else if (currentPart === 2) {
      setPart2FinalResponse(latestUserResponse);
      setPart2Score(currentScore);
    }
    
    setCurrentPart(nextPart);
    if (onPartChange) onPartChange(nextPart);
    setCurrentScore(0);
    setConsecutiveSameScoreCount(0);
    setShowNeedMoreHelp(false);
    setScoreHistory([]);
    setShowResponseBox(true);
    setInput('');
    setPreviousTextLength(0);
    setInheritedText('');
    setUploadedFile(null);
    setIsUploadingFile(false);
    
    const nextPartConfig = nextPart === 3 ? MODULE_CONFIG.part3! : MODULE_CONFIG.part2!;
    setConversation(prev => [...prev, {
      role: 'ai',
      content: nextPartConfig.question,
      isPartQuestion: true
    }]);
    setTimeout(() => {
      inputRef.current?.focus();
      scrollToBottom();
    }, 300);
  };

  const buildFinalText = (latestResponse: string) => {
    if (totalParts === 3) {
      return `PART 1:\n${part1FinalResponse}\n\nPART 2:\n${part2FinalResponse}\n\nPART 3:\n${latestResponse}`;
    }
    if (totalParts === 2) {
      return `PART 1:\n${part1FinalResponse}\n\nPART 2:\n${latestResponse}`;
    }
    return latestResponse;
  };

  const handleNeedMoreHelp = async () => {
    if (isRefreshingHelp || localAiHelpLevel >= 10) return;
    setIsRefreshingHelp(true);
    
    const newLevel = Math.min(10, localAiHelpLevel + 1);
    setLocalAiHelpLevel(newLevel);
    if (onAiHelpfulnessChange) {
      onAiHelpfulnessChange(newLevel);
    }
    
    const lastUserMsg = [...conversation].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) {
      setIsRefreshingHelp(false);
      return;
    }
    
    const activeQuestion = currentPart === 1 ? MODULE_CONFIG.initialQuestion : currentPart === 2 ? (MODULE_CONFIG.part2?.question || '') : (MODULE_CONFIG.part3?.question || '');
    const activeIdealAnswer = currentPart === 1 ? (MODULE_CONFIG.idealAnswer || '') : currentPart === 2 ? (MODULE_CONFIG.part2?.idealAnswer || '') : (MODULE_CONFIG.part3?.idealAnswer || '');
    const activeScoringCriteria = MODULE_CONFIG.scoringCriteria || '';
    
    try {
      const response = await fetch('/api/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          moduleId: MODULE_CONFIG.id,
          attemptNumber: conversation.filter(m => m.role === 'user').length,
          partNumber: currentPart,
          userResponse: lastUserMsg.content,
          allResponses: [lastUserMsg.content],
          prompt: activeQuestion,
          idealAnswer: activeIdealAnswer,
          scoringCriteria: activeScoringCriteria,
          socraticMode: true,
          aiHelpfulness: newLevel,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversation(prev => {
          const updated = [...prev];
          for (let i = updated.length - 1; i >= 0; i--) {
            if (updated[i].role === 'ai' && updated[i].score !== undefined) {
              updated[i] = {
                ...updated[i],
                improvements: data.improvements || [],
                content: data.feedback || updated[i].content,
                strengths: data.strengths || updated[i].strengths,
              };
              break;
            }
          }
          return updated;
        });
        setShowNeedMoreHelp(false);
      }
    } catch (err) {
      console.error('Failed to refresh help:', err);
    } finally {
      setIsRefreshingHelp(false);
    }
  };

  const handleSubmit = async (overrideInput?: string) => {
    const rawInput = overrideInput || input;
    if (!rawInput.trim() || isSubmitting) return;
    
    // Normalize double line breaks to single line breaks
    const currentInput = rawInput.replace(/\n\n+/g, '\n').trim();
    setIsSubmitting(true);
    
    // Add user message to conversation
    setConversation(prev => [...prev, { role: 'user', content: currentInput }]);
    setInput('');
    scrollToBottom();
    
    // Use the correct part config
    const getPartConfig = () => {
      if (currentPart === 3 && MODULE_CONFIG.part3) return MODULE_CONFIG.part3;
      if (currentPart === 2 && MODULE_CONFIG.part2) return MODULE_CONFIG.part2;
      return { question: MODULE_CONFIG.initialQuestion, idealAnswer: MODULE_CONFIG.idealAnswer, scoringCriteria: MODULE_CONFIG.scoringCriteria };
    };
    const partConfig = getPartConfig();
    const activeQuestion = partConfig.question;
    const activeIdealAnswer = partConfig.idealAnswer;
    const activeScoringCriteria = partConfig.scoringCriteria;
    
    try {
      let currentPartMessages = conversation;
      if (currentPart > 1) {
        const lastPartTransitionIndex = conversation.reduce((lastIdx, msg, idx) => 
          msg.isPartQuestion ? idx : lastIdx, -1);
        if (lastPartTransitionIndex >= 0) {
          currentPartMessages = conversation.slice(lastPartTransitionIndex + 1);
        }
      }
      const previousUserResponses = currentPartMessages
        .filter(m => m.role === 'user')
        .map(m => m.content);
      const attemptNumber = previousUserResponses.length + 1;
      
      const requestBody = {
        sessionId,
        moduleId: MODULE_CONFIG.id,
        attemptNumber,
        partNumber: currentPart,
        userResponse: currentInput,
        allResponses: [currentInput],
        prompt: activeQuestion,
        idealAnswer: activeIdealAnswer,
        scoringCriteria: activeScoringCriteria,
        socraticMode: true,
        aiHelpfulness,
      };

      let attemptData: any = null;
      let lastError: Error | null = null;
      for (let retry = 0; retry < 2; retry++) {
        try {
          const response = await fetch('/api/submit-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
          }
          attemptData = await response.json();
          break;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          if (retry === 0) {
            await new Promise(r => setTimeout(r, 1500));
          }
        }
      }

      if (!attemptData) {
        throw lastError || new Error('Failed to get feedback');
      }
      const newScore = attemptData.score;
      const isHelpResponse = newScore === 0;
      
      if (!isHelpResponse) {
        // Track consecutive same scores and auto-open help / increase AI helpfulness
        const newMessageIndex = conversation.length + 1;
        const updatedHistory = [...scoreHistory, newScore];
        setScoreHistory(updatedHistory);
        
        const scoreWentDown = currentScore > 0 && newScore < currentScore && newScore < 5;
        
        if (currentScore > 0 && newScore === currentScore && newScore < 5) {
          setExpandedHelpInfo(prev => new Set([...Array.from(prev), newMessageIndex]));
          
          const newConsecutiveCount = consecutiveSameScoreCount + 1;
          setConsecutiveSameScoreCount(newConsecutiveCount);
          
          if (newConsecutiveCount >= 2 && localAiHelpLevel < 10) {
            const newLevel = Math.min(10, localAiHelpLevel + 1);
            setLocalAiHelpLevel(newLevel);
            if (onAiHelpfulnessChange) {
              onAiHelpfulnessChange(newLevel);
            }
          }
          
          if (newConsecutiveCount >= 2) {
            setShowNeedMoreHelp(true);
          }
        } else if (scoreWentDown) {
          setConsecutiveSameScoreCount(0);
          setShowNeedMoreHelp(true);
          setExpandedHelpInfo(prev => new Set([...Array.from(prev), newMessageIndex]));
        } else {
          setConsecutiveSameScoreCount(0);
          setShowNeedMoreHelp(false);
        }
        
        setCurrentScore(newScore);
        
        if (onScoreUpdate) {
          onScoreUpdate(newScore, moduleId);
        }
      }
      
      // If perfect score, prepend celebration message and show animation
      let feedbackContent = attemptData.feedback;
      if (newScore === 5) {
        feedbackContent = "Fantastic work! You nailed it!\n\n" + attemptData.feedback;
        if (rewardAnimations) {
          if (_isFirstRewardAnimation) {
            setCurrentRewardAnimation(REWARD_ANIMATION_POOL[0]);
            _isFirstRewardAnimation = false;
          } else {
            if (_availableRewardAnimations.length === 0) {
              _availableRewardAnimations = [...REWARD_ANIMATION_POOL];
            }
            const randomIndex = Math.floor(Math.random() * _availableRewardAnimations.length);
            setCurrentRewardAnimation(_availableRewardAnimations[randomIndex]);
            _availableRewardAnimations.splice(randomIndex, 1);
          }
          setShowCelebration(true);
        }
      }
      
      // Add AI feedback as conversation message
      setConversation(prev => [...prev, { 
        role: 'ai', 
        content: feedbackContent,
        score: newScore,
        strengths: attemptData.strengths || [],
        improvements: attemptData.improvements || []
      }]);
      
      scrollToBottom();
      
      // Check for new badges earned (only if badges are enabled)
      if (badgesEnabled) {
        try {
          const badgeResponse = await fetch('/api/badges/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, moduleId: MODULE_CONFIG.id, score: newScore }),
          });
          if (badgeResponse.ok) {
            const { newBadges } = await badgeResponse.json();
            if (newBadges && newBadges.length > 0 && rewardAnimations) {
              setNewlyEarnedBadge(newBadges[0].badge);
              setTimeout(() => setNewlyEarnedBadge(null), 5000);
            }
          }
        } catch (badgeError) {
          console.log('Badge check failed:', badgeError);
        }
      }
      
      // If score is 5, handle based on multi-part status
      if (newScore === 5) {
        if (isMultiPart && !isLastPart) {
          // Not on last part: don't finalize, show Start Next Part button
          setShowResponseBox(false);
          setInput('');
          setPreviousTextLength(0);
          setInheritedText('');
        } else {
          // Single-part or last part: finalize as normal
          const finalText = buildFinalText(currentInput);
          handleFinalize(finalText);
          return;
        }
      } else {
        // For scores 1-4, allow continued revising
        // Hide the response box - user must click Revise to continue
        setShowResponseBox(false);
        setInput('');
        setPreviousTextLength(0);
        setInheritedText('');
      }
      
    } catch (error) {
      console.error('Error submitting response:', error);
      setConversation(prev => [...prev, {
        role: 'ai',
        content: 'There was a temporary issue getting feedback. Your response has been saved — please click "Revise and Resubmit" to try again.',
        score: 0,
        strengths: [],
        improvements: []
      }]);
      setShowResponseBox(false);
      scrollToBottom();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setShowSummarize(false);
    
    try {
      // Collect all user responses
      const allUserResponses = conversation
        .filter(m => m.role === 'user')
        .map(m => m.content);
      
      const response = await fetch('/api/summarize-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userResponses: allUserResponses,
          idealAnswer: MODULE_CONFIG.idealAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize response');
      }

      const data = await response.json();
      setSummarizedResponse(data.summary);
      setRevisedText(data.summary);
      setHasCombinedResponse(true);
      
      // Add summary to conversation flow with learner styling (right-aligned bubble)
      setConversation(prev => [...prev, { 
        role: 'user', 
        content: data.summary,
        isCombinedResponse: true
      }]);
      
      onComplete?.(data.summary, currentScore, MODULE_CONFIG.id);
      scrollToBottom();
      
    } catch (error) {
      console.error('Error summarizing response:', error);
      alert('Failed to summarize. Please try again.');
      setShowSummarize(true);
    } finally {
      setIsSummarizing(false);
    }
  };

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

  // Handle finalization - correct spelling and show final version
  const handleFinalize = async (textToFinalize: string) => {
    // Show the Final Response box immediately but with loading state
    setShowFinalVersion(true);
    setSummarizedResponse(textToFinalize);
    setRevisedText(textToFinalize);
    setHasCombinedResponse(true);
    setShowSummarize(false);
    setFinalizedResponse(''); // Empty until API returns with paragraph breaks
    scrollToBottom();
    
    // Wait for corrected version with paragraph breaks before displaying text
    try {
      const response = await fetch('/api/finalize-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToFinalize,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFinalizedResponse(data.correctedText || textToFinalize);
      } else {
        setFinalizedResponse(textToFinalize);
      }
    } catch (error) {
      console.error('Error finalizing response:', error);
      setFinalizedResponse(textToFinalize);
    }
    scrollToBottom();
  };

  // Intro Phase - Goal + Prepare + Start button
  if (phase === 'intro') {
    return (
      <div className="max-w-[73rem] mx-auto">
        <div className="space-y-5 pb-6">
          {/* Skill Builder Header */}
          <div className="bg-gradient-to-r from-[#0a66c2]/5 to-[#0a66c2]/10 p-5 rounded-xl border border-[#0a66c2]/20 relative w-[95%] mx-auto mt-[5px]">
            <RefBadge num="303" />
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#0a66c2] rounded-xl relative">
                <RefBadge num="304" />
                <Sparkles className="w-9 h-9 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-4xl text-gray-900">Skill Builder</h3>
              </div>
            </div>
            {/* About and Options Icons */}
            <div className="absolute top-1/2 -translate-y-1/2 right-[47px] flex flex-row gap-4 font-['Outfit']">
              <button
                ref={aboutButtonRef}
                onClick={() => setShowAboutPanel(!showAboutPanel)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all shadow-sm border-[0.5px] border-slate-300"
                data-testid="button-about"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">About</span>
              </button>
              <div className="relative">
                <RefBadge num="305" />
                <button
                  ref={gearButtonRef}
                  onClick={() => setShowOptionsPanel(!showOptionsPanel)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all shadow-sm border-[0.5px] border-slate-300"
                  data-testid="button-options"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-semibold">Options</span>
                </button>
              </div>
            </div>

            {/* Options Panel */}
            <AnimatePresence>
              {showOptionsPanel && (
                <motion.div
                  ref={optionsPanelRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-4 right-4 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8 z-50 w-[380px]"
                >
                  <div className="flex items-center justify-between mb-7">
                    <h4 className="font-bold text-xl text-[#0a66c2]">Personalization Options</h4>
                    <button
                      onClick={() => setShowOptionsPanel(false)}
                      className="text-gray-400 hover:text-gray-600"
                      data-testid="button-close-options"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* AI Help Level */}
                    <div className="space-y-3 pb-5 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-base text-gray-700">AI Help Level</span>
                        <span className="text-base font-semibold text-[#0a66c2]">{localAiHelpLevel}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={localAiHelpLevel}
                        onChange={(e) => handleAiHelpLevelChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0a66c2]"
                        data-testid="slider-ai-help-level"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Socratic questions</span>
                        <span>Direct hints</span>
                      </div>
                      <p className="text-xs text-gray-500 italic text-center">
                        {localAiHelpLevel === 1 ? "Pure Socratic - questions only" :
                         localAiHelpLevel === 2 ? "Mostly questions with subtle nudges" :
                         localAiHelpLevel === 3 ? "Balanced guidance with some hints" :
                         localAiHelpLevel === 4 ? "More direct hints about gaps" :
                         "Clear, specific guidance about gaps"}
                      </p>
                    </div>

                    {/* Reward Animations Toggle */}
                    <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                      <span className="text-base text-gray-700">Reward Animations</span>
                      <Switch
                        checked={rewardAnimations}
                        onCheckedChange={setRewardAnimations}
                        data-testid="switch-reward-animations"
                      />
                    </div>

                    {/* Level 5 Streaks Toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-base text-gray-700">Level 5 Streaks</span>
                      <Switch
                        checked={successStreaks}
                        onCheckedChange={setSuccessStreaks}
                        data-testid="switch-success-streaks"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* About Panel */}
            <AnimatePresence>
              {showAboutPanel && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/40 z-[99]"
                    onClick={() => { if (!isFirstTimeAbout) { setShowAboutPanel(false); } }}
                  />
                  <motion.div
                    ref={aboutPanelRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="fixed top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8 z-[100] w-[650px]"
                    style={{ left: sidebarOpen ? 'calc((100vw + 360px) / 2)' : '50%' }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="font-bold text-[23px] text-[#0a66c2]">{isFirstTimeAbout ? 'Welcome to Skill Builder!' : 'What is Skill Builder?'}</h4>
                      <button
                        onClick={() => { setShowAboutPanel(false); setIsFirstTimeAbout(false); }}
                        className="text-gray-400 hover:text-gray-600"
                        data-testid="button-close-about"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-[18px] text-gray-700 space-y-7">
                      <p>Skill Builder is a hands-on activity that helps you practice and build your skills, directly in the flow of the course.</p>
                      <p>The AI presents an engaging real-world scenario, evaluates your responses with feedback/scoring, and encourages you to make iterative improvements.</p>
                      <p>When you finish a Skill Builder, your final response and metrics about your skill gains are saved to your Skill Gains summary.</p>
                      <p>Skill Builders are <strong>optional</strong> but highly recommended—research shows that practicing concepts soon after learning them significantly strengthens retention and understanding.</p>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Goal and Prepare */}
          <div className="bg-gradient-to-r from-[#0a66c2]/5 to-[#0a66c2]/10 p-5 rounded-xl border border-[#0a66c2]/20 w-[95%] mx-auto relative">
            <RefBadge num="306" />
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-[16px] font-semibold text-[#0a66c2]">Skill Objective:</p>
                <p className="text-[16px] text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: MODULE_CONFIG.goalText }} />
              </div>
              
              {MODULE_CONFIG.durationText && (
                <div className="space-y-2 pt-2">
                  <p className="text-[16px] font-semibold text-[#0a66c2]">Duration:</p>
                  <p className="text-[16px] text-gray-900 leading-relaxed">{MODULE_CONFIG.durationText}</p>
                </div>
              )}
              
              <div className="space-y-2 pt-2">
                <p className="text-[16px] font-semibold text-[#0a66c2]">Prepare:</p>
                <ul className="text-[16px] text-gray-700 space-y-1.5 pl-5 list-disc">
                  {MODULE_CONFIG.prepareItems.map((item, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center pt-4 relative">
            <RefBadge num="307" />
            <Button 
              onClick={handleStart}
              className="px-8 py-3 text-base bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full"
              data-testid="button-start"
            >
              Start
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Complete Phase - Show summarized response
  if (phase === 'complete') {
    return (
      <div className="max-w-[73rem] mx-auto">
        <div className="space-y-5 pb-6">
          {/* Skill Builder Header */}
          <div className="bg-gradient-to-r from-[#0a66c2]/5 to-[#0a66c2]/10 p-5 rounded-xl border border-[#0a66c2]/20 w-[95%] mx-auto mt-[5px] relative">
            <RefBadge num="320" />
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#0a66c2] rounded-xl relative">
                <RefBadge num="321" />
                <Sparkles className="w-9 h-9 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-4xl text-gray-900">Skill Builder</h3>
                  <div className="flex items-center gap-2 relative">
                    <RefBadge num="322" />
                    <span className="text-sm text-gray-500">Final Score:</span>
                    {isMultiPart ? (
                      <span className="text-sm font-bold">
                        <span className={part1Score >= 4 ? 'text-emerald-600' : part1Score >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'}>
                          {part1Score}/5 {getSkillLabel(part1Score)}
                        </span>
                        <span className="text-gray-400 mx-1">(Part 1)</span>
                        <span className="text-gray-300 mx-0.5">,</span>
                        {totalParts === 3 ? (
                          <>
                            <span className={part2Score >= 4 ? 'text-emerald-600' : part2Score >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'}>
                              {part2Score}/5 {getSkillLabel(part2Score)}
                            </span>
                            <span className="text-gray-400 mx-1">(Part 2)</span>
                            <span className="text-gray-300 mx-0.5">,</span>
                            <span className={currentScore >= 4 ? 'text-emerald-600' : currentScore >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'}>
                              {currentScore}/5 {getSkillLabel(currentScore)}
                            </span>
                            <span className="text-gray-400 mx-1">(Part 3)</span>
                          </>
                        ) : (
                          <>
                            <span className={currentScore >= 4 ? 'text-emerald-600' : currentScore >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'}>
                              {currentScore}/5 {getSkillLabel(currentScore)}
                            </span>
                            <span className="text-gray-400 mx-1">(Part 2)</span>
                          </>
                        )}
                      </span>
                    ) : (
                      <>
                        <span className={`text-lg font-bold ${
                          currentScore >= 4 ? 'text-emerald-600' : 
                          currentScore >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'
                        }`}>
                          {currentScore}/5 - {getSkillLabel(currentScore)}
                        </span>
                        <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              currentScore >= 4 ? 'bg-emerald-500' : 
                              currentScore >= 3 ? 'bg-[#0a66c2]' : 'bg-amber-500'
                            }`}
                            style={{ width: `${(currentScore / 5) * 100}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Finalized Response */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4 relative">
            <RefBadge num="323" />
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0a66c2]" />
              <h4 className="font-semibold text-gray-900">Your Finalized Response</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
              {summarizedResponse}
            </p>
            
            {/* Score Info */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Skill Level Achieved:</span>
                {isMultiPart ? (
                  <span className="text-sm font-bold">
                    <span className={part1Score >= 4 ? 'text-emerald-600' : part1Score >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'}>
                      {part1Score}/5 {getSkillLabel(part1Score)}
                    </span>
                    <span className="text-gray-400 mx-1">(Part 1)</span>
                    <span className="text-gray-300 mx-0.5">,</span>
                    {totalParts === 3 ? (
                      <>
                        <span className={part2Score >= 4 ? 'text-emerald-600' : part2Score >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'}>
                          {part2Score}/5 {getSkillLabel(part2Score)}
                        </span>
                        <span className="text-gray-400 mx-1">(Part 2)</span>
                        <span className="text-gray-300 mx-0.5">,</span>
                        <span className={currentScore >= 4 ? 'text-emerald-600' : currentScore >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'}>
                          {currentScore}/5 {getSkillLabel(currentScore)}
                        </span>
                        <span className="text-gray-400 mx-1">(Part 3)</span>
                      </>
                    ) : (
                      <>
                        <span className={currentScore >= 4 ? 'text-emerald-600' : currentScore >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'}>
                          {currentScore}/5 {getSkillLabel(currentScore)}
                        </span>
                        <span className="text-gray-400 mx-1">(Part 2)</span>
                      </>
                    )}
                  </span>
                ) : (
                  <>
                    <span className={`text-base font-bold ${
                      currentScore >= 4 ? 'text-emerald-600' : 
                      currentScore >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'
                    }`}>
                      {currentScore}/5 - {getSkillLabel(currentScore)}
                    </span>
                    <div className="w-20 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          currentScore >= 4 ? 'bg-emerald-500' : 
                          currentScore >= 3 ? 'bg-[#0a66c2]' : 'bg-amber-500'
                        }`}
                        style={{ width: `${(currentScore / 5) * 100}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Saved Notification */}
          <div className="flex justify-center relative">
            <RefBadge num="324" />
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-lg border border-emerald-200">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Score and final response saved to your Skill Gains Summary</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Conversation Phase
  return (
    <div 
      ref={containerRef}
      className="max-w-[73rem] mx-auto overflow-y-auto scroll-smooth"
      style={{ maxHeight: 'calc(100vh - 220px)' }}
    >
      <div className={`space-y-5 ${
          conversation.some(m => m.role === 'ai' && m.score === 5) ? 'pb-2' : 'pb-24'
        }`}>
        {/* Skill Builder Header with small score */}
        <div className="bg-gradient-to-r from-[#0a66c2]/5 to-[#0a66c2]/10 p-5 rounded-xl border border-[#0a66c2]/20 relative w-[95%] mx-auto mt-[5px]">
          <RefBadge num="310" />
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#0a66c2] rounded-xl relative">
              <RefBadge num="311" />
              <Sparkles className="w-9 h-9 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-4xl text-gray-900 relative">
                Skill Builder
              </h3>
            </div>
            {/* About and Options Icons - positioned to match intro header */}
            <div className="absolute top-1/2 -translate-y-1/2 right-[47px] flex flex-row gap-4 font-['Outfit']">
              <button
                ref={aboutButtonRef}
                onClick={() => setShowAboutPanel(!showAboutPanel)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all shadow-sm border-[0.5px] border-slate-300"
                data-testid="button-about-conversation"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">About</span>
              </button>
              <button
                ref={gearButtonRef}
                onClick={() => setShowOptionsPanel(!showOptionsPanel)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all shadow-sm border-[0.5px] border-slate-300"
                data-testid="button-options-conversation"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-semibold">Options</span>
              </button>
            </div>
          </div>

          {/* Options Panel */}
          <AnimatePresence>
            {showOptionsPanel && (
              <motion.div
                ref={optionsPanelRef}
                initial={{ opacity: 0, x: 50, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: -50 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute top-4 right-4 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8 z-50 w-[380px]"
              >
                <div className="flex items-center justify-between mb-7">
                  <h4 className="font-bold text-xl text-[#0a66c2]">Personalization Options</h4>
                  <button
                    onClick={() => setShowOptionsPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                    data-testid="button-close-options-conversation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* AI Help Level Slider */}
                  <div className="space-y-3 pb-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-gray-700">AI Help Level</span>
                      <span className="text-base font-medium text-[#0a66c2]">{localAiHelpLevel}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={localAiHelpLevel}
                      onChange={(e) => {
                        const newLevel = parseInt(e.target.value);
                        setLocalAiHelpLevel(newLevel);
                        onAiHelpfulnessChange?.(newLevel);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0a66c2]"
                      data-testid="slider-ai-help-conversation"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Socratic questions</span>
                      <span>Direct hints</span>
                    </div>
                    <p className="text-xs text-gray-500 italic text-center">
                      {localAiHelpLevel === 1 ? "Pure Socratic - questions only" :
                       localAiHelpLevel === 2 ? "Mostly questions with subtle nudges" :
                       localAiHelpLevel === 3 ? "Balanced guidance with some hints" :
                       localAiHelpLevel === 4 ? "More direct hints about gaps" :
                       "Clear, specific guidance about gaps"}
                    </p>
                  </div>

                  {/* Reward Animations Toggle */}
                  <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                    <span className="text-base text-gray-700">Reward Animations</span>
                    <Switch
                      checked={rewardAnimations}
                      onCheckedChange={setRewardAnimations}
                      data-testid="switch-reward-animations-conversation"
                    />
                  </div>

                  {/* Level 5 Streaks Toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-base text-gray-700">Level 5 Streaks</span>
                    <Switch
                      checked={successStreaks}
                      onCheckedChange={setSuccessStreaks}
                      data-testid="switch-success-streaks-conversation"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* About Panel */}
          <AnimatePresence>
            {showAboutPanel && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/40 z-[99]"
                  onClick={() => { if (!isFirstTimeAbout) { setShowAboutPanel(false); } }}
                />
                <motion.div
                  ref={aboutPanelRef}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="fixed top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8 z-[100] w-[650px]"
                  style={{ left: sidebarOpen ? 'calc((100vw + 360px) / 2)' : '50%' }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="font-bold text-[23px] text-[#0a66c2]">{isFirstTimeAbout ? 'Welcome to Skill Builder!' : 'What is Skill Builder?'}</h4>
                    <button
                      onClick={() => { setShowAboutPanel(false); setIsFirstTimeAbout(false); }}
                      className="text-gray-400 hover:text-gray-600"
                      data-testid="button-close-about-conversation"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-[18px] text-gray-700 space-y-7">
                    <p>Skill Builder is a hands-on activity that helps you practice and build your skills, directly in the flow of the course.</p>
                    <p>The AI presents an engaging real-world scenario, evaluates your responses with feedback/scoring, and encourages you to make iterative improvements.</p>
                    <p>When you finish a Skill Builder, your final response and metrics about your skill gains are saved to your Skill Gains summary.</p>
                    <p>Skill Builders are <strong>optional</strong> but highly recommended—research shows that practicing concepts soon after learning them significantly strengthens retention and understanding.</p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Goal and Prepare - Always visible */}
        <div className="bg-gradient-to-r from-[#0a66c2]/5 to-[#0a66c2]/10 p-5 rounded-xl border border-[#0a66c2]/20 relative w-[95%] mx-auto">
          <RefBadge num="312" />
          <div className="space-y-3">
            <div className="flex items-start gap-0 relative">
              <div className="space-y-2 flex-1">
                <p className="text-[16px] font-semibold text-[#0a66c2]">Skill Objective:</p>
                <p className="text-[16px] text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: MODULE_CONFIG.goalText }} />
              </div>
              {currentScore > 0 && (
                <div className="flex flex-col items-end" style={{ marginLeft: '25px' }}>
                  <span className="text-xs text-gray-500">Skill Score</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      currentScore >= 4 ? 'text-emerald-600' : 
                      currentScore >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'
                    }`}>
                      {currentScore}/5
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          currentScore >= 4 ? 'bg-emerald-500' : 
                          currentScore >= 3 ? 'bg-[#0a66c2]' : 'bg-amber-500'
                        }`}
                        style={{ width: `${(currentScore / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {MODULE_CONFIG.durationText && (
              <div className="space-y-2 pt-2">
                <p className="text-[16px] font-semibold text-[#0a66c2]">Duration:</p>
                <p className="text-[16px] text-gray-900 leading-relaxed">{MODULE_CONFIG.durationText}</p>
              </div>
            )}
            
            <div className="space-y-2 pt-2 relative">
              <p className="text-[16px] font-semibold text-[#0a66c2]">Prepare:</p>
              <ul className="text-[16px] text-gray-700 space-y-1.5 pl-5 list-disc">
                {MODULE_CONFIG.prepareItems.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Conversation Messages */}
        {conversation.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-[95%] mx-auto ${message.role === 'user' ? 'justify-end -mt-1' : 'justify-start'}`}
          >
            {message.role === 'ai' ? (
              <div className="flex gap-3 relative items-start">
                <RefBadge num="313" />
                <div className="w-8 h-8 rounded-full bg-[#0a66c2] flex items-center justify-center shrink-0 relative mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm relative">
                                    {message.score !== undefined && message.score > 0 && (
                    <div className="mb-3 flex items-center gap-3 relative bg-gray-600 -mx-4 -mt-4 px-4 py-2.5 rounded-t-xl">
                      <span className="text-base font-medium text-amber-300">Skill Level: <span className="font-bold text-lg">{message.score}/5</span> {getSkillLabel(message.score)}{isMultiPart && <span className="text-amber-300/60"> (Part {currentPart})</span>}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((segment) => (
                          <div key={segment} className={`w-6 h-2.5 rounded-sm ${segment <= (message.score || 0) ? 'bg-amber-300' : 'bg-gray-500'}`} />
                        ))}
                      </div>
                      {showNeedMoreHelp && index === conversation.length - 1 && message.score < 5 && (
                        <button
                          onClick={handleNeedMoreHelp}
                          disabled={isRefreshingHelp}
                          className="ml-auto text-sm text-amber-200 hover:text-white transition-colors font-medium whitespace-nowrap"
                          data-testid="button-need-more-help"
                        >
                          {isRefreshingHelp ? 'Refreshing...' : 'Need more help?'}
                        </button>
                      )}
                    </div>
                  )}
                  {message.score === 5 && message.content.startsWith("Fantastic work! You nailed it!") ? (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-[1.2rem] font-bold text-emerald-500">Fantastic work! You nailed it!</p>
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          className="flex items-center gap-1.5"
                        >
                          <span className="text-xl">🎉</span>
                          <span className="text-sm font-bold text-emerald-600">Expert Level!</span>
                        </motion.div>
                      </div>
                      <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">{message.content.replace("Fantastic work! You nailed it!\n\n", "").replace(/<strong>.*?<\/strong>/g, '').trim()}</p>
                      
                      {/* Final Response Box integrated with blue styling */}
                      {showFinalVersion && finalizedResponse && (
                        <div className="mt-4 bg-gradient-to-r from-[#0a66c2]/10 to-[#0a66c2]/5 border border-[#0a66c2]/30 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#0a66c2]/20">
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <span className="text-[#0a66c2] font-semibold text-sm">Your Final Response</span>
                            </div>
                            <span className="text-gray-500 text-[13px]">(autocorrected for any spelling/grammar issues)</span>
                          </div>
                          {finalizedResponse ? (
                            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                              {finalizedResponse}
                            </p>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500 py-2">
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0a66c2] rounded-full animate-spin" />
                              <span className="text-sm">Formatting your response...</span>
                            </div>
                          )}
                          {finalizedResponse && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#0a66c2]/20 text-emerald-600">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-medium">Score and final response saved to your Skill Gains Summary</span>
                            </div>
                          )}
                        </div>
                      )}
                      {isMultiPart && !isLastPart && !showResponseBox && index === conversation.length - 1 && (
                        <div className="mt-4 pt-3 border-t border-gray-200 flex gap-3 items-center">
                          <button
                            onClick={handleStartNextPart}
                            className="text-sm px-4 py-2 rounded-lg transition-colors font-semibold bg-[#0a66c2] text-white hover:bg-[#004182] shadow-md"
                            data-testid="button-start-next-part-score5"
                          >
                            Save and move on to Part {currentPart + 1}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (() => {
                    const isFirstAiMessage = conversation.filter(m => m.role === 'ai').indexOf(message) === 0;
                    
                    // For first AI message (initial question) or part-transition questions, preserve strong tags for objective display
                    if (isFirstAiMessage || message.isPartQuestion) {
                      return (
                        <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
                      );
                    }
                    
                    // For subsequent AI feedback, extract questions wrapped in <strong> tags and add to improvements
                    const strongRegex = /<strong>(.*?)<\/strong>/gi;
                    const extractedQuestions: string[] = [];
                    let match;
                    while ((match = strongRegex.exec(message.content)) !== null) {
                      extractedQuestions.push(match[1]);
                    }
                    const allImprovements = [...(message.improvements || []), ...extractedQuestions];
                    // Only show feedback paragraph if it has content
                    const feedbackContent = message.content.replace(strongRegex, '').trim();
                    
                    return (
                      <>
                        {/* Only show feedback paragraph if not empty */}
                        {feedbackContent && (
                          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap mb-5" dangerouslySetInnerHTML={{ __html: feedbackContent.replace(/\n/g, '<br />') }} />
                        )}
                        {/* Strengths and Improvements - show for all AI responses after first */}
                        {conversation.filter(m => m.role === 'ai').indexOf(message) > 0 && (
                          <div className="space-y-5">
                            {message.strengths && message.strengths.length > 0 && (
                              <div>
                                <p className="text-base font-semibold text-emerald-600 mb-2">Strengths:</p>
                                <ul className="text-base text-gray-700 space-y-1 pl-4 list-disc">
                                  {message.strengths.slice(0, 2).map((strength, i) => (
                                    <li key={i}>{strength}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {allImprovements.length > 0 && (
                              <div>
                                <p className="text-base font-semibold text-amber-600 mb-2">Ways to improve:</p>
                                <ul className="text-base text-gray-700 space-y-1 pl-4 list-disc font-medium">
                                  {allImprovements.map((improvement, i) => (
                                    <li key={i}>{improvement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Revise Response and Save buttons - show only on latest AI response, after first, hide at Level 5 (except Part 1 of multi-part) */}
                        {conversation.filter(m => m.role === 'ai').indexOf(message) > 0 && (currentScore !== 5 || (isMultiPart && !isLastPart)) && !showResponseBox && index === conversation.length - 1 && (
                          <div className="mt-4 pt-3 border-t border-gray-200 flex gap-3 items-center">
                            <button
                              onClick={() => {
                                setShowResponseBox(true);
                                setTimeout(() => {
                                  if (containerRef.current) {
                                    containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
                                  }
                                }, 150);
                                const lastUserResponse = conversation.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
                                if (lastUserResponse) {
                                  const textWithNewline = lastUserResponse + '\n\n';
                                  setIsTypingAnimation(true);
                                  setInput('');
                                  setPreviousTextLength(0);
                                  setInheritedText(textWithNewline);
                                  let currentIndex = 0;
                                  const typeInterval = setInterval(() => {
                                    currentIndex += 3;
                                    const newText = lastUserResponse.slice(0, currentIndex);
                                    setInput(newText);
                                    if (currentIndex >= lastUserResponse.length) {
                                      clearInterval(typeInterval);
                                      setInput(textWithNewline);
                                      setPreviousTextLength(textWithNewline.length);
                                      setIsTypingAnimation(false);
                                      inputRef.current?.focus();
                                      setTimeout(() => {
                                        if (containerRef.current) {
                                          containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
                                        }
                                      }, 100);
                                    }
                                  }, 15);
                                }
                              }}
                              className={`text-sm px-4 py-2 rounded-lg transition-all font-semibold ${
                                currentScore >= 3 && currentScore <= 4
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg'
                                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500 shadow-sm hover:shadow-md'
                              }`}
                              data-testid="button-revise-response"
                            >
                              {currentScore >= 3 && currentScore <= 4 ? 'Keep Revising for Higher Score' : 'Revise Response'}
                            </button>
                            {currentScore >= 3 && (
                              isMultiPart && !isLastPart ? (
                                <button
                                  onClick={handleStartNextPart}
                                  className="text-sm px-4 py-2 rounded-lg transition-colors font-semibold bg-[#0a66c2] text-white hover:bg-[#004182] shadow-md"
                                  data-testid="button-start-next-part"
                                >
                                  Save and move on to Part {currentPart + 1}
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    const latestUserResponse = conversation.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
                                    const finalText = buildFinalText(latestUserResponse);
                                    handleFinalize(finalText);
                                  }}
                                  className={`text-sm px-4 py-2 rounded-lg transition-colors font-medium ${
                                    currentScore <= 4
                                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                                      : 'bg-[#0a66c2] text-white hover:bg-[#004182]'
                                  }`}
                                  data-testid="button-save-finish-inline"
                                >
                                  {isMultiPart ? `Save Parts 1-${totalParts} and Finish` : 'Save and Finish'}
                                </button>
                              )
                            )}
                            {/* Streak Encouragement Phrases for Level 3-4 - Slot Machine Effect (only on latest AI message) */}
                            {(currentScore === 3 || currentScore === 4) && index === conversation.length - 1 && (
                              <SlotMachineText phrases={
                                isMultiPart && !isLastPart ? [
                                  `Nice work! Ready for Part ${currentPart + 1}?`,
                                  `Part ${currentPart} is solid! Move on or keep refining.`,
                                  `Great foundation! Part ${currentPart + 1} awaits.`,
                                  `You've earned it—start Part ${currentPart + 1}!`,
                                  `Well done! Tackle Part ${currentPart + 1} next.`
                                ] : [
                                  "Reach Level 5 to hit your next streak milestone!",
                                  "Keep going. Level 5 is in sight!",
                                  "You're so close to mastery!",
                                  "Keep improving to reach Level 5!",
                                  "Almost there—Level 5 awaits!"
                                ]
                              } />
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                {/* Celebration video for perfect score - space reserved, animation delayed until Final Response visible */}
                {message.score === 5 && rewardAnimations && (
                  <div className="flex-shrink-0 flex items-center justify-center w-56 h-56">
                    {showDelayedReward && (
                      <motion.div
                        key="celebration"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <video
                          src={currentRewardAnimation || REWARD_ANIMATION_POOL[0]}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-56 h-56 object-contain"
                          data-testid="celebration-video"
                        />
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-end" style={{ maxWidth: '75%' }}>
                {message.isCombinedResponse && (
                  <p className="text-sm text-gray-600 mb-2 mr-11 font-bold">Here's all of your ideas combined together.</p>
                )}
                <div className="flex gap-3 items-start relative w-full">
                  <RefBadge num="314" />
                  <div className="bg-[#0a66c2] text-white p-4 rounded-2xl rounded-tr-sm shadow-sm relative flex-1 min-w-0">
                                        <p className="text-base leading-relaxed whitespace-pre-wrap break-words overflow-visible">{message.content.startsWith('[UPLOADED FILE:') ? (
                      <span className="flex flex-col gap-1">
                        <span className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 shrink-0" />
                          <span>Uploaded: {message.content.match(/\[UPLOADED FILE: (.+?)\]/)?.[1] || 'Excel file'}</span>
                        </span>
                        {message.content.includes('[LEARNER NOTE:') && (
                          <span className="text-sm opacity-80 italic mt-1">
                            {message.content.match(/\[LEARNER NOTE: (.+?)\]/)?.[1]}
                          </span>
                        )}
                      </span>
                    ) : message.content.startsWith('[QUESTION ABOUT TASK]') ? (
                      <span className="italic">
                        {message.content.replace('[QUESTION ABOUT TASK]: ', '')}
                      </span>
                    ) : message.content}</p>
                    {message.isCombinedResponse && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <div className="bg-white/15 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {isMultiPart ? (
                              <span className="text-sm font-semibold text-amber-300">
                                Skill Level: {part1Score}/5 {getSkillLabel(part1Score)} <span className="text-amber-300/60">(Part 1)</span>
                                {totalParts === 3 ? (
                                  <>, {part2Score}/5 {getSkillLabel(part2Score)} <span className="text-amber-300/60">(Part 2)</span>, {currentScore}/5 {getSkillLabel(currentScore)} <span className="text-amber-300/60">(Part 3)</span></>
                                ) : (
                                  <>, {currentScore}/5 {getSkillLabel(currentScore)} <span className="text-amber-300/60">(Part 2)</span></>
                                )}
                              </span>
                            ) : (
                              <>
                                <span className="text-sm font-semibold text-amber-300">
                                  Skill Level: {currentScore}/5 - {getSkillLabel(currentScore)}
                                </span>
                                <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-amber-300 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentScore / 5) * 100}%` }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                          <span className="text-sm text-amber-200">
                            This response and associated skill scores have been auto-saved to the Skill Gains Summary
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center shrink-0 self-start relative">
                    <span className="text-xs font-semibold text-orange-700">MF</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {/* Loading indicator */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-[95%] mx-auto justify-start"
          >
            <div className="flex gap-3 max-w-[85%] items-start">
              <div className="w-8 h-8 rounded-full bg-[#0a66c2] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-[#0a66c2]"
                  />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Input Area - hide when score is 5, combined response shown, or response box hidden */}
        {!isSubmitting && currentScore !== 5 && !hasCombinedResponse && showResponseBox && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: 'top' }}
            className="space-y-1 pt-1 relative w-[95%] mx-auto"
            onAnimationComplete={() => {
              // Focus the textarea after animation completes
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
          >
            <RefBadge num="315" />
            {currentPartExpectsFileUpload ? (
              <>
                <div className="flex justify-end">
                  <div className="flex items-center justify-between max-w-[75%] w-full mr-11 pb-1">
                    <p className="text-left text-gray-500 text-sm font-semibold">
                      Upload your revised Excel file:
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start justify-end">
                  <div className="flex-1 max-w-[75%] relative">
                    <FileUploadZone
                      onFileSelected={handleFileUpload}
                      isUploading={isUploadingFile}
                      uploadedFileName={uploadedFile?.name}
                      uploadError={uploadError}
                      onClear={handleFileClear}
                      disabled={isSubmitting}
                      compact
                    />
                    <div className="mt-3">
                      <p className="text-left text-gray-500 text-xs font-semibold mb-1.5">
                        Or ask for more details about the task here:
                      </p>
                      <textarea
                        value={fileDetailsText}
                        onChange={(e) => setFileDetailsText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && !uploadedFile) {
                            e.preventDefault();
                            handleDetailsOnlySubmit();
                          }
                        }}
                        placeholder="e.g. I don't know how to convert my range to an Excel Table..."
                        className="w-full min-h-[60px] resize-none p-3 rounded-xl border border-gray-300 focus:border-[#0a66c2]/50 focus:outline-none focus:ring-0 text-sm bg-white placeholder:text-gray-400"
                        disabled={isSubmitting}
                        data-testid="input-file-details"
                      />
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      {!uploadedFile && fileDetailsText.trim() && (
                        <button
                          onClick={handleDetailsOnlySubmit}
                          disabled={isSubmitting}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          data-testid="button-submit-details"
                        >
                          <ArrowUp className="w-4 h-4" />
                          Ask
                        </button>
                      )}
                      {uploadedFile && (
                        <button
                          onClick={handleFileSubmit}
                          disabled={isSubmitting}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a66c2] text-white hover:bg-[#004182] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          data-testid="button-submit-file"
                        >
                          <ArrowUp className="w-4 h-4" />
                          {isSubmitting ? 'Analyzing...' : 'Submit for Review'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-orange-700">MF</span>
                  </div>
                </div>
              </>
            ) : (
              <>
            {/* Instructions text */}
            <div className="flex justify-end">
              <div className="flex items-center justify-between max-w-[75%] w-full mr-11 pb-1">
                <p className="text-left text-gray-500 text-sm font-semibold flex items-center gap-1">
                  {conversation.filter(m => m.role === 'user').length === 0 
                    ? <>Type your response here (or click <Mic className="w-4 h-4 inline" /> to speak)</>
                    : "Add new ideas or edit existing material:"
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start justify-end">
              <div className="flex-1 max-w-[75%] relative">
                <div className="relative">
                  <Textarea 
                    ref={inputRef}
                    placeholder=""
                    spellCheck={false}
                    autoFocus
                    className="min-h-[140px] resize-none p-4 pr-12 rounded-2xl rounded-br-sm border-2 border-[#0a66c2]/30 focus:border-[#0a66c2]/30 focus:outline-none focus:ring-0 overflow-hidden bg-white"
                    style={{ 
                      minHeight: '140px',
                      color: 'transparent',
                      caretColor: '#1f2937',
                      fontSize: '16px',
                      lineHeight: '1.625',
                      fontFamily: 'inherit',
                      letterSpacing: 'normal',
                      wordSpacing: 'normal'
                    }}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                    onScroll={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      const overlay = target.nextElementSibling as HTMLElement;
                      if (overlay) {
                        overlay.scrollTop = target.scrollTop;
                        overlay.scrollLeft = target.scrollLeft;
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    data-testid="input-response"
                  />
                  {/* Overlay to show colored text - syncs with textarea */}
                  <div 
                    className="absolute top-0 left-0 right-0 bottom-0 p-4 pr-12 pointer-events-none rounded-2xl rounded-br-sm overflow-hidden whitespace-pre-wrap"
                    style={{ 
                      wordBreak: 'break-word',
                      fontSize: '16px',
                      lineHeight: '1.625',
                      fontFamily: 'inherit',
                      letterSpacing: 'normal',
                      wordSpacing: 'normal'
                    }}
                  >
                    {(() => {
                      if (!inheritedText) {
                        return <span style={{ color: '#0a66c2', fontWeight: 500 }}>{input}</span>;
                      }
                      
                      const inheritedIndices = new Set<number>();
                      let inheritedIdx = 0;
                      for (let inputIdx = 0; inputIdx < input.length && inheritedIdx < inheritedText.length; inputIdx++) {
                        if (input[inputIdx] === inheritedText[inheritedIdx]) {
                          inheritedIndices.add(inputIdx);
                          inheritedIdx++;
                        }
                      }
                      
                      const spans: { text: string; isInherited: boolean }[] = [];
                      for (let i = 0; i < input.length; i++) {
                        const isInherited = inheritedIndices.has(i);
                        if (spans.length === 0 || spans[spans.length - 1].isInherited !== isInherited) {
                          spans.push({ text: input[i], isInherited });
                        } else {
                          spans[spans.length - 1].text += input[i];
                        }
                      }
                      
                      return (
                        <>
                          {spans.map((span, idx) => (
                            <span 
                              key={idx} 
                              style={{ 
                                color: span.isInherited ? '#9ca3af' : '#0a66c2', 
                                fontWeight: span.isInherited ? 600 : 500 
                              }}
                            >
                              {span.text}
                            </span>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                  {/* Microphone button - top right */}
                  <button 
                    onClick={toggleRecording}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    data-testid="button-microphone"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  {/* Submit button - bottom right */}
                  <button
                    onClick={() => handleSubmit()}
                    disabled={(() => {
                      if (!inheritedText) return !input.trim() || isSubmitting;
                      let inheritedIdx = 0;
                      let matchedCount = 0;
                      for (let i = 0; i < input.length && inheritedIdx < inheritedText.length; i++) {
                        if (input[i] === inheritedText[inheritedIdx]) {
                          matchedCount++;
                          inheritedIdx++;
                        }
                      }
                      const hasNewContent = input.length > matchedCount || matchedCount < inheritedText.length;
                      return !input.trim() || isSubmitting || !hasNewContent;
                    })()}
                    className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                      (() => {
                        if (!inheritedText) {
                          return input.trim() ? 'bg-[#0a66c2] text-white hover:bg-[#004182] cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed';
                        }
                        let inheritedIdx = 0;
                        let matchedCount = 0;
                        for (let i = 0; i < input.length && inheritedIdx < inheritedText.length; i++) {
                          if (input[i] === inheritedText[inheritedIdx]) {
                            matchedCount++;
                            inheritedIdx++;
                          }
                        }
                        const hasNewContent = input.length > matchedCount || matchedCount < inheritedText.length;
                        return input.trim() && hasNewContent
                          ? 'bg-[#0a66c2] text-white hover:bg-[#004182] cursor-pointer' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed';
                      })()
                    }`}
                    data-testid="button-submit"
                  >
                    <RefBadge num="316" />
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
                </div>
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-orange-700">MF</span>
              </div>
            </div>
              </>
            )}
            
          </motion.div>
        )}

        {/* Final Response Box for manually saved responses (scores 3-4) */}
        {showFinalVersion && finalizedResponse && currentScore < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-[95%] mx-auto justify-start"
          >
            <div className="flex gap-3 relative items-start">
              <div className="w-8 h-8 rounded-full bg-[#0a66c2] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                {/* Skill Level Bar - Top */}
                <div className="mb-3 flex items-center gap-3 relative bg-gray-600 -mx-4 -mt-4 px-4 py-2.5 rounded-t-xl">
                  {isMultiPart ? (
                    <span className="text-sm font-medium text-amber-300">
                      Skill Level: <span className="font-bold">{part1Score}/5</span> {getSkillLabel(part1Score)} <span className="text-amber-300/60">(Part 1)</span>
                      {totalParts === 3 ? (
                        <>, <span className="font-bold">{part2Score}/5</span> {getSkillLabel(part2Score)} <span className="text-amber-300/60">(Part 2)</span>, <span className="font-bold">{currentScore}/5</span> {getSkillLabel(currentScore)} <span className="text-amber-300/60">(Part 3)</span></>
                      ) : (
                        <>, <span className="font-bold">{currentScore}/5</span> {getSkillLabel(currentScore)} <span className="text-amber-300/60">(Part 2)</span></>
                      )}
                    </span>
                  ) : (
                    <>
                      <span className="text-base font-medium text-amber-300">Skill Level: <span className="font-bold text-lg">{currentScore}/5</span> {getSkillLabel(currentScore)}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((segment) => (
                          <div key={segment} className={`w-6 h-2.5 rounded-sm ${segment <= currentScore ? 'bg-amber-300' : 'bg-gray-500'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <p className="text-[1.1rem] font-bold text-[#0a66c2] mb-3">Great work! Your response has been saved.</p>
                <div className="bg-gradient-to-r from-[#0a66c2]/10 to-[#0a66c2]/5 border border-[#0a66c2]/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#0a66c2]/20">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#0a66c2] font-semibold text-sm">Your Final Response</span>
                    </div>
                    <span className="text-gray-500 text-[13px]">(autocorrected for any spelling/grammar issues)</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {finalizedResponse}
                  </p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#0a66c2]/20 text-emerald-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Score and final response saved to your Skill Gains Summary</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Buttons after combined response */}
        {hasCombinedResponse && !isRevising && showFinalVersion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center pt-4 relative w-[95%] mx-auto"
          >
            <RefBadge num="317" />
            <div className="flex flex-wrap justify-center items-center gap-3">
            <Button 
              onClick={onContinue || onClose}
              className="px-6 py-2.5 bg-[#0a66c2] text-white hover:bg-[#004182]"
              data-testid="button-continue-course"
            >
              Continue Course
            </Button>
            <Button 
              variant="outline"
              onClick={onViewSummary}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              data-testid="button-view-skill-gains"
            >
              View My Skill Gains
            </Button>
            </div>
          </motion.div>
        )}

        {/* Continue Revising mode - new input to build on the response */}
        {hasCombinedResponse && isRevising && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 space-y-4"
          >
            <div className="flex gap-3 items-start justify-end">
              <div className="flex-1 max-w-[75%]">
                <Textarea 
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setInput(newValue);
                    // Clear inheritedText when user deletes most of the text
                    if (inheritedText && newValue.length < inheritedText.length * 0.3) {
                      setInheritedText('');
                    }
                  }}
                  placeholder="Add more to your response..."
                  className="min-h-[140px] resize-none p-4 text-base leading-relaxed rounded-2xl rounded-br-sm border-2 border-[#0a66c2]/30 focus:border-[#0a66c2] focus:outline-none focus:ring-0 overflow-hidden"
                  data-testid="textarea-revise"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-orange-700">MF</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => {
                  setIsRevising(false);
                  setInput('');
                }}
                variant="outline"
                className="px-6 py-2.5"
                data-testid="button-cancel-revise"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (input.trim()) {
                    // Reset combined response state to continue the conversation
                    setHasCombinedResponse(false);
                    setIsRevising(false);
                    // Submit the new input through normal flow
                    handleSubmit();
                  }
                }}
                disabled={!input.trim() || isSubmitting}
                className="px-6 py-2.5 bg-[#0a66c2] text-white hover:bg-[#004182] gap-2"
                data-testid="button-submit-revise"
              >
                <ArrowUp className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Badge Unlock Notification */}
        {newlyEarnedBadge && (
          <BadgeUnlockNotification 
            badge={newlyEarnedBadge} 
            onClose={() => setNewlyEarnedBadge(null)} 
          />
        )}
      </div>
    </div>
  );
}
