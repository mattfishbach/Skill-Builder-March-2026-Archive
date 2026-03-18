import { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { CoursePlayer } from '@/components/CoursePlayer';
import { CourseSidebar } from '@/components/CourseSidebar';
import { SkillBuilderInline, MODULE_CONFIGS, MODULE_SUBTITLES } from '@/components/SkillBuilderInline';
import { SkillGainSummary, generateDemoScores, mergeDemoWithReal } from '@/components/SkillGainSummary';
import { LearningTakeawaysModal } from '@/components/LearningTakeawaysReport';
import { VideoDetails } from '@/components/VideoDetails';
import { videoTranscripts } from '@/data/transcripts';
import { IntroStage } from '@/components/IntroStage';
import { ConclusionStage } from '@/components/ConclusionStage';
import { BadgesShowcase } from '@/components/Badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Share2, Bookmark, Download, Menu, Lightbulb, ChevronDown, ChevronUp, Copy, X, TrendingDown, AlertCircle, BarChart2, Users, Award, TrendingUp, Zap, Trophy, Hand, PersonStanding, Handshake, Settings, FileSpreadsheet } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import skillBuilderBg from '@/assets/images/skill-builder-bg.png';
import type { Badge, Video } from '@shared/schema';

type PresentationStage = 'intro' | 'demo' | 'conclusion';

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

// Define the order of TOC items for navigation (matches CourseSidebar)
const TOC_ITEMS = [
  { type: 'video', title: 'Empower your organization' },
  { type: 'video', title: 'Core functions of the NIST Cybersecurity Framework (CSF)' },
  { type: 'video', title: 'Key framework updates' },
  { type: 'skill-builder', moduleId: 'csf_functions' },
  { type: 'video', title: 'Asset management' },
  { type: 'skill-builder', moduleId: 'asset_classification' },
  { type: 'video', title: 'Risk assessment and risk strategy' },
  { type: 'video', title: 'Governance and risk management' },
  { type: 'skill-builder', moduleId: 'identify_wrapup' },
  { type: 'video', title: 'Identity and access management' },
  { type: 'video', title: 'Data security' },
  { type: 'skill-builder', moduleId: 'access_control' },
  { type: 'video', title: 'Security awareness and culture' },
  { type: 'video', title: 'Protective tech' },
  { type: 'skill-builder', moduleId: 'protect_wrapup' },
  { type: 'video', title: 'Detecting threats and anomalies' },
  { type: 'video', title: 'Incident response' },
  { type: 'skill-builder', moduleId: 'incident_response' },
  { type: 'video', title: 'Recovery from incidents' },
  { type: 'skill-builder', moduleId: 'drr_wrapup' },
  { type: 'video', title: 'Customizing for your organization' },
  { type: 'video', title: 'Measuring success and sustaining efforts' },
  { type: 'skill-builder', moduleId: 'implementation_plan' },
  { type: 'video', title: 'Cybersecurity is a continuous journey' },
  { type: 'skill-builder', moduleId: 'csf_capstone' },
  { type: 'skill-gain-summary' },
  { type: 'skill-builder', moduleId: 'project_stakeholders' },
  { type: 'skill-builder', moduleId: 'scope_wbs_reflection' },
  { type: 'skill-builder', moduleId: 'ai_kpi_prompt' },
];

const DEMO_TIPS_CONFIG: Record<string, DemoTipConfig> = {
  csf_functions: {
    title: "Demo Shortcuts - CSF Functions",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Detect was weak because they didn't notice the breach for 3 weeks. Protect failed since the phishing email got through without safeguards like MFA or email filtering."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Govern was also likely weak—if leadership had clearer policies and oversight, better protections might have been in place."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Identify may have been weak too—if the customer database was recognized as a critical asset, it would have received stronger protections."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "Detect was weak because they didn't notice the breach for 3 weeks. Protect failed since the phishing email got through. Recover was also weak because the company couldn't detect the attack quickly enough."
    },
    idealAnswer: "Multiple CSF functions were likely weak:\n\nDETECT was clearly weak—the breach wasn't discovered for 3 weeks, meaning monitoring and alerting capabilities were inadequate.\n\nPROTECT was weak—the phishing email succeeded without safeguards like MFA or email filtering to prevent or limit the compromise.\n\nGOVERN was likely weak—there may not have been clear policies or leadership oversight ensuring cybersecurity was integrated into operations.\n\nIDENTIFY may have been weak—if the customer database wasn't recognized as a critical asset, it may not have received stronger protections."
  },
  asset_classification: {
    title: "Demo Shortcuts - Asset Classification",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Patient records - Critical, contains sensitive PHI data. Coffee machine - Low priority. Marketing website - Medium, public-facing but no sensitive data."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Billing system - Critical, handles payment data. Email server - High, common attack vector."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Forgotten test server - High risk, classic shadow IT. Probably unpatched and unmonitored—an easy entry point for attackers."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "Patient records - Critical, sensitive data. Coffee machine - Low priority. Marketing website - Critical, since it's public-facing and a defacement would be catastrophic for the company."
    },
    idealAnswer: "1. Patient medical records database - CRITICAL. Contains PHI regulated by HIPAA; a breach means fines, lawsuits, and lost trust.\n\n2. Break room coffee machine - LOW. No sensitive data, but should still be inventoried as a potential network entry point.\n\n3. Billing and payment processing system - CRITICAL. Handles payment card data (PCI-DSS); compromise leads to fraud and regulatory penalties.\n\n4. Company marketing website - MEDIUM. Public-facing but no sensitive data; defacement is embarrassing, not catastrophic.\n\n5. Email server - HIGH to CRITICAL. Contains sensitive communications and credentials; a common attack vector for phishing and data leaks.\n\n6. Forgotten test server - HIGH (risk). Classic shadow IT—likely unpatched, unmonitored, and a prime target for attackers."
  },
  risk_communication: {
    title: "Demo Shortcuts - Risk Communication",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "We've found a critical vulnerability in our web servers. Hackers are actively exploiting this at other companies—we need to act quickly."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "The flaw affects three customer-facing systems. If we don't patch within 48 hours, attackers could access customer data, costing us millions in fines and reputation damage."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "We need to approve an emergency maintenance window this week. I recommend we brief the board on our remediation timeline and customer notification plan."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "There's a critical vulnerability in our web servers that needs patching. It's a CVE with a 9.8 score. We can wait for the next scheduled maintenance window to apply the fix."
    },
    idealAnswer: "A strong executive summary might read:\n\n\"We've found a critical security flaw in three customer-facing systems that hackers are actively exploiting at other companies. If we don't patch within 48 hours, attackers could access customer data, costing us millions in fines and reputation damage. We need to approve an emergency maintenance window this week.\"\n\nKey elements: (1) States the business impact, (2) Creates urgency, (3) Proposes clear action, (4) Quantifies risk in business terms."
  },
  identify_wrapup: {
    title: "Demo Shortcuts - Identify Wrap-Up",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Asset Inventory (Asset Management) - can't protect what you don't know you have. Governance - move security decisions from the CTO to a formal structure with policies."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Risk Assessment - shift from reactive to proactive with regular assessments to prioritize threats before incidents occur."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Each recommendation maps to the Identify function: Asset Management for visibility, Governance for accountability, and Risk Assessment for prioritization—building the foundation before layering Protect and Detect."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "They should do a risk assessment and create some security policies. They should also deploy SIEM and endpoint detection tools right away to start catching threats."
    },
    idealAnswer: "1. ASSET INVENTORY (Asset Management) - Conduct a complete inventory of all hardware, software, and data—you can't protect what you don't know you have.\n\n2. ESTABLISH GOVERNANCE (Governance) - Move security decisions from the CTO alone to a formal structure with policies, roles, and executive oversight.\n\n3. PROACTIVE RISK ASSESSMENT (Risk Assessment) - Shift from reactive to proactive by establishing regular risk assessments to prioritize threats before incidents occur.",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "We don't know who can access customer data—a breach could cost millions in fines and lost customers."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "With $10M in revenue, we're a target. A breach could cost millions, far more than prevention."
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "Right now, we don't know who can access our customer data—and with $10M in revenue, we're a target. A breach could cost millions in fines, drive away customers, and damage the reputation we've built—far more than the cost of getting ahead of it now."
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (tests error detection → capped at Level 3)",
        text: "You need security to protect the company. I recommend implementing MFA and deploying endpoint detection across all devices immediately."
      },
      idealAnswer: "\"Right now, we don't know who can access our customer data—and with $10M in revenue, we're a target. A breach could cost millions in fines, drive away customers, and damage the reputation we've built—far more than the cost of getting ahead of it now.\""
    }
  },
  access_control: {
    title: "Demo Shortcuts - Access Control",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "The shared admin account is a problem because you can't track who did what. They should use individual accounts with MFA. The contractor's VPN account is a zombie account that should have been disabled when they left."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "The exec assistant's admin access violates least privilege—remove admin access and create a read-only view instead. Personal phones accessing the database are unmanaged and risky."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Deprovision accounts immediately when access ends and do quarterly reviews. Require managed devices or a Zero Trust access model for accessing sensitive data."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "The shared admin account is a problem because you can't track who did what. They should use individual accounts. The employees accessing the database from personal phones is fine as long as they have strong passwords."
    },
    idealAnswer: "1. Former Contractor's Active VPN Account\nRISK: Classic \"zombie account\"—the Colonial Pipeline breach started with exactly this. Attackers can discover and exploit forgotten accounts.\nFIX: Deprovision accounts immediately when access ends; conduct quarterly access reviews.\n\n2. Shared Admin Account with Sticky Note Password\nRISK: No individual accountability, no MFA possible, and the password is visible to anyone in the office.\nFIX: Eliminate shared accounts; give each admin individual credentials with MFA.\n\n3. Executive Assistant with Payroll Admin Access\nRISK: Violates least privilege—unnecessary admin access creates risk of accidental changes or compromise.\nFIX: Remove admin access; create a read-only view or formal approval process instead.\n\n4. Uncontrolled Device Access to Customer Database\nRISK: Personal phones are unmanaged—no encryption, no remote wipe, no patch control. A lost phone with cached customer data is a breach waiting to happen.\nFIX: Require managed devices or a Zero Trust access model (e.g., VDI or containerized app) for accessing sensitive data."
  },
  protect_wrapup: {
    title: "Demo Shortcuts - Protect Wrap-Up",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Endpoint Protection (Technology) - law firms are high-value ransomware targets and need more than a basic firewall. Data Classification (Data Security) - privileged communications need stronger protection than general files."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Device Management (Identity/Access) - a lost personal laptop with unencrypted client files creates malpractice liability. Require managed devices for remote access."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Deploy EDR on all devices, classify data so privileged communications get the strongest protection, and this is both a security and ethical obligation for the firm."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "They need better security training and should encrypt their data. The annual training video they already have is a good foundation and just needs minor updates."
    },
    idealAnswer: "1. ENDPOINT PROTECTION (Technology) - Deploy EDR on all devices—law firms are high-value ransomware targets and a basic firewall alone can't protect against modern threats.\n\n2. DATA CLASSIFICATION (Data Security) - Classify data by sensitivity so privileged communications get stronger protection than general files—this is an ethical obligation for law firms.\n\n3. DEVICE MANAGEMENT (Identity/Access) - Require managed devices for remote access—a lost personal laptop with unencrypted client files creates malpractice liability.",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "Any attorney's personal laptop could be lost with unencrypted client files—that's a malpractice claim and bar complaint."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "Your only defense is a basic firewall, which won't stop modern ransomware—one attack could lock every case file and shut down the firm for weeks."
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "Our plan fixes both: managed devices so client data never sits unprotected on personal hardware, endpoint detection to catch threats before they spread, and data classification so privileged communications get the strongest protection."
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (tests error detection → capped at Level 3)",
        text: "The personal device issue isn't urgent since attorneys need flexibility to work from home. The real priority is encrypting the file server—once that's done, laptops don't matter."
      },
      idealAnswer: "\"Right now you have two urgent risks. First, any attorney's personal laptop could be lost or stolen with unencrypted client files—that's a malpractice claim and bar complaint. Second, your only defense is a basic firewall, which won't stop modern ransomware—one attack could lock every case file and shut down the firm for weeks. Our plan fixes both: managed devices so client data never sits unprotected on personal hardware, endpoint detection to catch threats before they spread, and data classification so privileged communications get the strongest protection.\""
    }
  },
  incident_response: {
    title: "Demo Shortcuts - Incident Response",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Isolate the server from the network to preserve evidence. Block the external IP at the firewall. Notify IT leadership and start investigating."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Notify the CISO and legal counsel—this is a potential data breach with regulatory implications. Preserve logs before they rotate."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Check whether other systems are affected—don't assume it's contained. This is a Friday attack for a reason—don't wait until Monday."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "Shut down the server to stop the data transfer. Notify IT leadership and start investigating."
    },
    idealAnswer: "FIRST ACTIONS:\n1. Isolate the server from the network (don't power off—preserve evidence) and block the external IP at the firewall.\n2. Preserve logs before they rotate and document everything with timestamps.\n3. Check whether other systems are affected—don't assume it's contained.\n\nNOTIFICATIONS (within 30 minutes):\n• CISO/executive sponsor—this is a potential data breach\n• Legal counsel—regulatory and liability implications\n• IR team lead and key technical staff\n• Don't wait until Monday—this is a Friday attack for a reason"
  },
  drr_wrapup: {
    title: "Demo Shortcuts - DRR Wrap-Up",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Detect: EDR would have spotted ransomware behavior in hours instead of 4 days. Respond: need a documented and practiced response plan. Recover: test their backups."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "The 2-week response suggests confusion about roles—need tabletop exercises so the team knows the playbook. A week to restore means backups weren't tested."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Need quarterly recovery drills and a prioritized list of which systems to restore first. Track detection-to-containment time as a key metric."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "Detect: better monitoring tools. Respond: immediately shut down all affected systems to stop the attack from spreading. Recover: test their backups."
    },
    idealAnswer: "DETECT: Deploy endpoint detection (EDR)—ransomware shows suspicious behavior before encrypting files, and EDR could have flagged it in hours instead of 4 days.\n\nRESPOND: Document and practice an incident response plan—the 2-week response suggests confusion about roles. Regular tabletop exercises help the team act faster.\n\nRECOVER: Test backup restoration quarterly—a week to restore means backups weren't tested. Define a recovery priority order for critical systems.",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "This attack went undetected for 4 days and took 3 weeks to recover. We lacked real-time monitoring and a practiced response plan."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "We're deploying detection tools, running quarterly drills, and testing our backups so we can catch and recover from threats in hours, not weeks."
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "We'll track detection time with a target of under 4 hours—down from the 4 days it took this time."
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (tests error detection → capped at Level 3)",
        text: "We got hit by ransomware because our security wasn't good enough. We need better tools. The good news is our firewall blocked most of the attack, so our current defenses are mostly working."
      },
      idealAnswer: "\"This attack went undetected for 4 days and took 3 weeks to fully recover because we lacked real-time monitoring and a practiced response plan. We're deploying detection tools, running quarterly drills, and testing our backups so we can catch and recover from threats in hours, not weeks. We'll track detection time with a target of under 4 hours.\""
    }
  },
  implementation_plan: {
    title: "Demo Shortcuts - Implementation",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Phase 1 (Identify): asset inventory and risk assessment—can't protect what you don't know. Establish basic governance with security roles."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Phase 2 (Protect + Detect): endpoint protection, monitoring, data classification for PHI. Security awareness training."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Phase 3 (Respond + Recover): document IR plan, run tabletop exercise, test backups, plan Year 2 roadmap."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "Phase 1: Buy and deploy EDR and SIEM tools immediately since we have no protection. Phase 2: Train employees. Phase 3: Monitor and improve."
    },
    idealAnswer: "PHASE 1: FOUNDATION (Months 1-2) — Focus: Identify\n• Conduct asset inventory and initial risk assessment (especially PHI/HIPAA threats)\n• Establish basic governance—assign security roles, get executive sponsor\n\nPHASE 2: CORE PROTECTIONS (Months 3-4) — Focus: Protect + Detect\n• Deploy endpoint protection (EDR) and basic monitoring/alerting\n• Data classification for PHI; security awareness training\n\nPHASE 3: MATURITY (Months 5-6) — Focus: Respond + Recover\n• Document IR plan and run a tabletop exercise; test backup restoration\n• Plan next 12-month roadmap based on learnings",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "Metrics: asset inventory completion %, MFA adoption rate, mean time to detect. Monthly one-page reports to the CEO."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "Frame for the board in business terms—'we can detect threats in hours instead of days.' Quarterly board updates connecting security to customer trust."
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "Each report ties progress back to patient data protection and HIPAA compliance. Target: all PHI-containing systems classified and encrypted by Month 4."
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (tests error detection → capped at Level 3)",
        text: "Track how many security tools we've installed and send the board a detailed technical report. We don't need regular reporting—just update the board when something goes wrong."
      },
      idealAnswer: "METRICS:\n1. Asset inventory completion % (target: 100% of critical assets by Month 2)\n2. MFA adoption rate (target: 100% of employees)\n3. Mean time to detect threats (establish baseline, then reduce by 50%)\n4. HIPAA compliance gap closure (target: all PHI-containing systems classified and encrypted by Month 4)\n\nCOMMUNICATION: Monthly 1-page progress report to the CEO; quarterly board update framing security in business terms (e.g., \"we can detect threats in hours instead of days\"). Each report ties progress back to patient data protection and regulatory compliance."
    }
  },
  project_stakeholders: {
    title: "Demo Shortcuts - Chapter 1",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "Nicholas Anderson (VP General Services) should be consulted since he oversees general services and would need to approve any changes to procedure room availability. David Moore (Facilities) manages the physical rooms."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "Christina Garcia (Director of Nursing) is essential for addressing staffing shortages—she can ensure nurses and technicians are available during extended hours."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Dr. Samuel Tan (Physician Services) should be involved to coordinate physician scheduling and ensure doctors are available to reduce rescheduling times."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "Nicholas Anderson (VP General Services) should be consulted since he oversees general services. Also, the hospital CEO should be directly involved in scheduling decisions for procedure rooms."
    },
    idealAnswer: "To ensure rescheduling procedures are decreased, facilities must be available to meet patient demand. This may require changing the available hours for procedure rooms and ensuring they are appropriately staffed during those hours. Nicholas Anderson (VP General Services) and David Moore (Facilities) are the owners of the procedure rooms, so they will need to be consulted about availability, facility capacity, and the equipment used during procedures. If staffing shortages cause reschedules, Dr. Samuel Tan (Physician Services) and Christina Garcia (Director of Nursing) would be needed to ensure the technicians, doctors, and nurses are available to reduce the rescheduling times and meet this project objective."
  },
  scope_wbs_reflection: {
    title: "Demo Shortcuts - Chapter 2",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "The WBS has vague work packages like 'Do planning stuff' and 'Reduce wait times somehow' that are too unclear to be estimated or assigned. Many items focus on activities rather than deliverables."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "The 'Other Tasks' section with 'Miscellaneous' and 'TBD' items is problematic—a proper WBS shouldn't have catch-all categories. 'Hold kickoff meeting' describes an action, not a deliverable."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "The WBS violates the 100% Rule—it's missing project documentation, change management process, and project closure deliverables. There's also inconsistent decomposition where testing has 8 items but training only has 2."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "The WBS has vague work packages like 'Do planning stuff' that are too unclear. Also, the WBS should not include any testing activities since testing is part of operations, not project work."
    },
    idealAnswer: "The WBS has the following issues: (1) Vague work packages like 'Do planning stuff' that can't be estimated. (2) Activity-focused items instead of deliverables (e.g., 'Hold kickoff meeting'). (3) Catch-all 'Other Tasks' with 'Miscellaneous' and 'TBD'. (4) Violates 100% Rule—missing project documentation and project closure. (5) Inconsistent decomposition—testing has 8 items, training has 2."
  },
  csf_capstone: {
    title: "Demo Shortcuts - Course Capstone",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "No asset inventory (Identify) — can't protect what you don't know. Breach undetected for 2 weeks (Detect) — no monitoring. No governance (Govern) — ad hoc decisions by one person, no policies."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "No IR or recovery plan (Respond/Recover) — no playbook for the next incident. Unclassified customer data (Protect) — financial data at rest isn't encrypted, risking regulatory fines."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Shadow IT cloud services are blind spots attackers exploit. Ad hoc governance is especially dangerous during a merger when alignment with business strategy is critical."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "The detection is weak because the breach wasn't found for 2 weeks. They also don't have an incident response plan. The security awareness training being 18 months old isn't critical since experienced employees already know the basics."
    },
    idealAnswer: "1. NO ASSET INVENTORY / SHADOW IT (Identify) — You can't protect what you don't know you have; untracked cloud services are blind spots attackers exploit.\n\n2. NO GOVERNANCE STRUCTURE (Govern) — Ad hoc decisions by one person means no policies, no accountability, and no alignment with business strategy—especially dangerous during a merger.\n\n3. BREACH WENT UNDETECTED FOR 2 WEEKS (Detect) — Without monitoring and alerting, attackers have free rein; early detection dramatically reduces breach costs.\n\n4. NO INCIDENT RESPONSE OR RECOVERY PLAN (Respond/Recover) — When the next incident hits, there's no playbook—chaos instead of coordinated action, and no plan to restore operations.",
    part2: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "Days 1-30 (Identify + Govern): Full asset inventory including shadow IT, establish governance with security roles and policies."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "Days 31-60 (Protect + Detect): Deploy EDR, set up monitoring, classify and encrypt customer data."
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "Days 61-90 (Respond + Recover): Document IR plan, run tabletop exercise, create recovery plan with backup testing, establish metrics and leadership reporting cadence."
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (tests error detection → capped at Level 3)",
        text: "Phase 1: Deploy EDR and SIEM tools right away to fix detection gaps. Phase 2: Train people. Phase 3: Create plans."
      },
      idealAnswer: "DAYS 1-30 — FOUNDATION (Identify + Govern):\n• Conduct full asset inventory including shadow IT cloud services — you can't protect what you don't know\n• Establish governance: assign security roles, create basic policies, get executive sponsor for the program\n\nDAYS 31-60 — CORE DEFENSES (Protect + Detect):\n• Deploy endpoint protection (EDR) and basic network monitoring/alerting to close the 2-week detection gap\n• Classify and encrypt customer financial data; launch engaging security awareness training\n\nDAYS 61-90 — MATURITY (Respond + Recover):\n• Document incident response plan and run a tabletop exercise so the team knows the playbook\n• Create recovery plan with backup testing; establish metrics and a reporting cadence for leadership"
    },
    part3: {
      sampleResponses: [
        {
          label: "Sample Response 1 (→ Level 3)",
          text: "Right now we don't have a clear picture of our systems, and a recent breach went unnoticed for two weeks. A data breach could cost us millions in fines and drive members to competitors."
        },
        {
          label: "Sample Response 2 (1+2 → Level 4)",
          text: "Our 90-day plan starts with visibility, then adds monitoring and response capabilities. During a merger, member trust is everything."
        },
        {
          label: "Sample Response 3 (1+2+3 → Level 5)",
          text: "I'll report monthly on three metrics: asset inventory completion, time-to-detect threats, and incident response readiness—so you'll always know where we stand."
        }
      ],
      erroneousResponse: {
        label: "Erroneous Response (tests error detection → capped at Level 3)",
        text: "We need cybersecurity because hackers are a real threat. The breach was contained quickly so no customer data was actually compromised. I'll share our vulnerability scan results and SIEM alert data with the board to show progress."
      },
      idealAnswer: "\"Right now, we don't have a clear picture of all our systems, and a recent breach went unnoticed for two weeks—during a merger when member trust is everything. A single data breach could cost us millions in regulatory fines and drive members to competitors. Our 90-day plan starts by getting visibility into what we have, then adds the monitoring and response capabilities to catch and contain threats fast. I'll report monthly on three metrics: asset inventory completion, time-to-detect threats, and incident response readiness.\""
    }
  },
  ai_kpi_prompt: {
    title: "Demo Shortcuts - Chapter 3",
    sampleResponses: [
      {
        label: "Sample Response 1 (→ Level 3)",
        text: "I'm managing the launch of a new customer support system with three goals: improving user satisfaction, reducing response time, and reducing operational costs."
      },
      {
        label: "Sample Response 2 (1+2 → Level 4)",
        text: "For each goal, suggest 2-3 specific, measurable KPIs. Focus on the vital few metrics that matter most to leadership."
      },
      {
        label: "Sample Response 3 (1+2+3 → Level 5)",
        text: "Finally, provide a tracking plan in table format with columns for Metric Name, Target Value, Measurement Frequency, and Owner. Make sure the KPIs are actionable and can be measured with standard customer support tools."
      }
    ],
    erroneousResponse: {
      label: "Erroneous Response (tests error detection → capped at Level 3)",
      text: "Give me KPIs for a customer support system. Include metrics for employee morale, team happiness, and office culture since those affect everything. Don't worry about formatting—just give me a long list of everything we could possibly track."
    },
    idealAnswer: "I'm managing the launch of a new customer support system with three goals: (1) improving user satisfaction, (2) reducing response time, and (3) reducing operational costs. For each goal, suggest 2-3 specific, measurable KPIs. Focus on the vital few metrics that matter most to leadership. Then provide a tracking plan in table format with: Metric Name, Target Value, Measurement Frequency, and Owner."
  }
};

export default function CourseView() {
  const [, navigate] = useLocation();
  const [stage, setStage] = useState<PresentationStage>('demo');
  const [isSkillBuilderActive, setIsSkillBuilderActive] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string>('');
  const [isSkillGainSummaryActive, setIsSkillGainSummaryActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>("Empower your organization");
  const [skillBuilderCompleted, setSkillBuilderCompleted] = useState(false);
  const [passedModuleIds, setPassedModuleIds] = useState<Set<string>>(new Set());
  const [collatedResponse, setCollatedResponse] = useState('');
  const [showDemoTips, setShowDemoTips] = useState(false);
  const [showCallouts, setShowCallouts] = useState(false);
  const [calloutAnimationKey, setCalloutAnimationKey] = useState(0);
  const [tipText, setTipText] = useState('');
  const [aiHelpfulness, setAiHelpfulness] = useState(3);
  const [currentSkillBuilderPart, setCurrentSkillBuilderPart] = useState<1 | 2 | 3>(1);
  const [calloutPositions, setCalloutPositions] = useState<{sb1: number, sb2: number, sb3: number, summary: number}>({sb1: 140, sb2: 320, sb3: 400, summary: 460});
  const [showRefNumbers, setShowRefNumbers] = useState(false);
  const [showStarburst, setShowStarburst] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [showLearningTakeawaysModal, setShowLearningTakeawaysModal] = useState(false);
  const [takeawaysScores, setTakeawaysScores] = useState<Record<string, { score: number; userResponse: string; feedback: string; partScores?: Record<number, number> }>>({});
  const takeawaysDemoScores = useMemo(() => generateDemoScores(), []);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const demoPanelRef = useRef<HTMLDivElement>(null);
  const contentPanelRef = useRef<HTMLDivElement>(null);
  const [videosData, setVideosData] = useState<Video[]>([]);

  useLayoutEffect(() => {
    if (contentPanelRef.current) {
      contentPanelRef.current.scrollTop = 0;
    }
  }, [isSkillGainSummaryActive, isSkillBuilderActive, selectedVideo]);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => setVideosData(data))
      .catch(console.error);
  }, []);

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

  const currentVideo = videosData.find(v => v.title === selectedVideo);


  // Reference number badge component - disabled for now
  const RefBadge = ({ num }: { num: string }) => null;

  // Export all Skill Builders to HTML spreadsheet for SME review
  const exportSkillBuildersForSME = () => {
    // Define the NIST CSF skill builders to export (exclude original demo ones)
    const nistSkillBuilders = [
      'csf_functions',
      'asset_classification', 
      'identify_wrapup',
      'access_control',
      'protect_wrapup',
      'incident_response',
      'drr_wrapup',
      'implementation_plan'
    ];

    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
    };

    const rows = nistSkillBuilders
      .filter(id => MODULE_CONFIGS[id])
      .map(id => {
        const config = MODULE_CONFIGS[id];
        const subtitle = MODULE_SUBTITLES[id] || '';
        const questionText = config.part2 
          ? `PART 1:\n${config.initialQuestion}\n\nPART 2:\n${config.part2.question}`
          : config.initialQuestion;
        const idealText = config.part2
          ? `PART 1:\n${config.idealAnswer}\n\nPART 2:\n${config.part2.idealAnswer}`
          : config.idealAnswer;
        const scoringText = config.part2
          ? `PART 1:\n${config.scoringCriteria}\n\nPART 2:\n${config.part2.scoringCriteria}`
          : config.scoringCriteria;
        return `
          <tr>
            <td>${escapeHtml(id)}</td>
            <td>${escapeHtml(subtitle)}</td>
            <td>${escapeHtml(questionText)}</td>
            <td>${escapeHtml(config.goalText)}</td>
            <td>${escapeHtml(config.durationText || '')}</td>
            <td>${escapeHtml(scoringText)}</td>
            <td>${escapeHtml(idealText)}</td>
          </tr>
        `;
      }).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NIST CSF 2.0 Skill Builders - SME Review</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
          }
          h1 {
            color: #0f172a;
            border-bottom: 3px solid #0a66c2;
            padding-bottom: 12px;
            margin-bottom: 8px;
          }
          .subtitle {
            color: #64748b;
            margin-bottom: 24px;
          }
          .export-info {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 24px;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          th {
            background: linear-gradient(135deg, #0a66c2 0%, #004182 100%);
            color: white;
            text-align: left;
            padding: 14px 12px;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
            font-size: 13px;
            line-height: 1.5;
          }
          tr:hover td {
            background: #f8fafc;
          }
          td:nth-child(1) { width: 10%; font-weight: 600; color: #0a66c2; }
          td:nth-child(2) { width: 12%; }
          td:nth-child(3) { width: 20%; }
          td:nth-child(4) { width: 12%; }
          td:nth-child(5) { width: 6%; text-align: center; }
          td:nth-child(6) { width: 18%; }
          td:nth-child(7) { width: 22%; background: #fefce8; }
          .actions {
            margin-top: 20px;
            display: flex;
            gap: 12px;
          }
          button {
            background: #0a66c2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
          }
          button:hover { background: #004182; }
          @media print {
            .actions { display: none; }
            body { background: white; }
          }
        </style>
      </head>
      <body>
        <h1>NIST CSF 2.0 Skill Builders - SME Review</h1>
        <p class="subtitle">Course: NIST CSF 2.0: Empower Your Organization to Navigate the Modern Cybersecurity Threat Landscape</p>
        <div class="export-info">
          <strong>Export Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>Total Skill Builders:</strong> ${nistSkillBuilders.filter(id => MODULE_CONFIGS[id]).length}
        </div>
        <table>
          <thead>
            <tr>
              <th>Module ID</th>
              <th>Skill Focus</th>
              <th>Challenge Prompt</th>
              <th>Skill Objective</th>
              <th>Duration</th>
              <th>Scoring Criteria</th>
              <th>Ideal Answer</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="actions">
          <button onclick="window.print()">Print / Save as PDF</button>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Click outside to close Demo Shortcuts panel
  useEffect(() => {
    if (!showDemoTips) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (demoPanelRef.current && !demoPanelRef.current.contains(event.target as Node)) {
        setShowDemoTips(false);
      }
    };
    
    // Add small delay to avoid closing immediately from the click that opened it
    const timeoutId = setTimeout(() => {
      // Use capture phase to catch clicks before they're stopped by child elements
      document.addEventListener('click', handleClickOutside, true);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showDemoTips]);


  // Fetch badges data - refresh when modal opens
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [badgesRes, userBadgesRes] = await Promise.all([
          fetch('/api/badges'),
          fetch(`/api/badges/${sessionId}`)
        ]);
        if (badgesRes.ok) {
          const badges = await badgesRes.json();
          setAllBadges(badges);
        }
        if (userBadgesRes.ok) {
          const userBadges = await userBadgesRes.json();
          setEarnedBadgeIds(userBadges.map((ub: any) => ub.badgeId));
        }
      } catch (error) {
        console.log('Failed to fetch badges:', error);
      }
    };
    fetchBadges();
  }, [sessionId, showBadgesModal]);

  // Dismiss starburst on any click (with delay to avoid the launch click)
  useEffect(() => {
    if (showStarburst) {
      const handleClick = () => setShowStarburst(false);
      const delayTimer = setTimeout(() => {
        document.addEventListener('click', handleClick);
      }, 100);
      return () => {
        clearTimeout(delayTimer);
        document.removeEventListener('click', handleClick);
      };
    }
  }, [showStarburst]);

  useEffect(() => {
    const updateCalloutPositions = () => {
      if (showCallouts) {
        const sb1Element = document.querySelector('[data-callout-id="project_stakeholders"]');
        const sb2Element = document.querySelector('[data-callout-id="scope_wbs_reflection"]');
        const sb3Element = document.querySelector('[data-callout-id="ai_kpi_prompt"]');
        const summaryElement = document.querySelector('[data-callout-id="skill_gain_summary"]');
        
        const headerOffset = 60;
        
        if (sb1Element) {
          const rect = sb1Element.getBoundingClientRect();
          const titleY = rect.top - headerOffset + 8;
          setCalloutPositions(prev => ({...prev, sb1: titleY}));
        }
        if (sb2Element) {
          const rect = sb2Element.getBoundingClientRect();
          const titleY = rect.top - headerOffset + 8;
          setCalloutPositions(prev => ({...prev, sb2: titleY}));
        }
        if (sb3Element) {
          const rect = sb3Element.getBoundingClientRect();
          // Center of target element, minus arrow offset (16px padding + 16px top-4 = 32px)
          const centerY = rect.top - headerOffset + (rect.height / 2) - 32;
          setCalloutPositions(prev => ({...prev, sb3: centerY}));
        }
        if (summaryElement) {
          const rect = summaryElement.getBoundingClientRect();
          // Center of target element, minus arrow offset (16px padding + 16px top-4 = 32px)
          const centerY = rect.top - headerOffset + (rect.height / 2) - 32;
          setCalloutPositions(prev => ({...prev, summary: centerY}));
        }
      }
    };
    
    updateCalloutPositions();
    window.addEventListener('resize', updateCalloutPositions);
    window.addEventListener('scroll', updateCalloutPositions, true);
    
    return () => {
      window.removeEventListener('resize', updateCalloutPositions);
      window.removeEventListener('scroll', updateCalloutPositions, true);
    };
  }, [showCallouts]);

  const handleSkillBuilderClick = (moduleId: string) => {
    setSelectedVideo(null);
    setActiveModuleId(moduleId);
    setIsSkillBuilderActive(true);
    setIsSkillGainSummaryActive(false);
    setCurrentSkillBuilderPart(1);
  };

  const handleSkillGainSummaryClick = () => {
    setSelectedVideo(null);
    setIsSkillBuilderActive(false);
    setIsSkillGainSummaryActive(true);
  };

  const handleLearningTakeawaysClick = () => {
    fetch(`/api/attempts/session/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setTakeawaysScores(data);
        setShowLearningTakeawaysModal(true);
      })
      .catch(() => {
        setTakeawaysScores({});
        setShowLearningTakeawaysModal(true);
      });
  };

  const handleSkillBuilderClose = () => {
    setIsSkillBuilderActive(false);
  };

  const handleContinueWithCourse = () => {
    // Find current position in TOC based on what's active
    let currentIndex = -1;
    
    if (isSkillBuilderActive && activeModuleId) {
      currentIndex = TOC_ITEMS.findIndex(
        item => item.type === 'skill-builder' && item.moduleId === activeModuleId
      );
    } else if (isSkillGainSummaryActive) {
      currentIndex = TOC_ITEMS.findIndex(item => item.type === 'skill-gain-summary');
    } else if (selectedVideo) {
      currentIndex = TOC_ITEMS.findIndex(
        item => item.type === 'video' && item.title === selectedVideo
      );
    }
    
    // Navigate to next item
    const nextIndex = currentIndex + 1;
    if (nextIndex < TOC_ITEMS.length) {
      const nextItem = TOC_ITEMS[nextIndex];
      
      if (nextItem.type === 'video') {
        setIsSkillBuilderActive(false);
        setIsSkillGainSummaryActive(false);
        setActiveModuleId('');
        setSelectedVideo(nextItem.title || null);
      } else if (nextItem.type === 'skill-builder' && nextItem.moduleId) {
        setSelectedVideo(null);
        setActiveModuleId(nextItem.moduleId);
        setIsSkillBuilderActive(true);
        setIsSkillGainSummaryActive(false);
      } else if (nextItem.type === 'skill-gain-summary') {
        setSelectedVideo(null);
        setIsSkillBuilderActive(false);
        setIsSkillGainSummaryActive(true);
        setTimeout(() => {
          const container = document.querySelector('[data-content-panel]');
          if (container) container.scrollTop = 0;
        }, 0);
      }
    } else {
      // End of course - just close the skill builder
      setIsSkillBuilderActive(false);
    }
  };

  const handleTakeaways = () => {
    setStage('conclusion');
  };

  const handleCopyTip = (text: string) => {
    setTipText(text);
    setShowDemoTips(false);
  };

  if (stage === 'intro') {
    return <IntroStage onComplete={() => setStage('demo')} />;
  }

  if (stage === 'conclusion') {
    return <ConclusionStage />;
  }

  return (
    <div className="h-screen bg-white flex flex-col font-sans overflow-hidden">
      <header className="h-14 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-30 relative">
        <RefBadge num="100" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 relative">
            <RefBadge num="101" />
            <span className="text-[#0a66c2] font-bold text-xl">in</span>
            <span className="font-semibold text-[#0a66c2]">Learning</span>
          </div>
          
        </div>
        
        <div className="flex-1" />
        
        {/* Demo Shortcuts Dropdown in Header - Right aligned */}
        <div className="relative mr-10" ref={demoPanelRef}>
          <button 
            onClick={() => setShowDemoTips(!showDemoTips)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 rounded-lg transition-colors"
            data-testid="button-toggle-demo-tips"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">Demo Shortcuts</span>
            <ChevronDown className={`w-3 h-3 text-gray-300 transition-transform ${showDemoTips ? 'rotate-180' : ''}`} />
          </button>
            
            {showDemoTips && (() => {
              const currentTipsConfig = DEMO_TIPS_CONFIG[activeModuleId] || DEMO_TIPS_CONFIG.project_stakeholders;
              return (
                <div className="absolute top-full right-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
                  <div className="pl-5 pr-10 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Export Skill Builders Button */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={exportSkillBuildersForSME}
                        className="bg-[#0a66c2] text-white hover:bg-[#004182] py-2 px-4 text-sm font-semibold gap-1.5 rounded-full"
                        data-testid="button-export-skill-builders"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Export all Skill Builders for SME Review
                      </Button>
                      <Button
                        onClick={() => navigate('/courses')}
                        className="bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 text-sm font-semibold gap-1.5 rounded-full"
                        data-testid="button-course-menu"
                      >
                        Back to Course Menu
                      </Button>
                    </div>
                    
                    <div className="border-t border-gray-200" />
                    
                    {/* AI Helpfulness */}
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
                        data-testid="slider-ai-helpfulness"
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
                        
                        {/* Sample Responses - vertical stack with full text */}
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
                                  data-testid={`button-copy-tip-${idx + 1}`}
                                >
                                  <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700" />
                                  <span className="text-[10px] text-gray-500 group-hover:text-gray-700">TypeIt</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Erroneous Response */}
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
                                  data-testid="button-copy-tip-erroneous"
                                >
                                  <Copy className="w-3.5 h-3.5 text-red-500 group-hover:text-red-700" />
                                  <span className="text-[10px] text-red-500 group-hover:text-red-700">TypeIt</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                        
                        {/* Ideal Answer */}
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
                              data-testid="button-copy-tip-ideal"
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
          <div className="flex items-center gap-2 text-sm text-gray-600 relative">
            <RefBadge num="103" />
            <Download className="w-4 h-4" />
            <span>1,461</span>
            <Bookmark className="w-4 h-4 ml-2" />
            <span>24,731</span>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 relative">
            <RefBadge num="104" />
            +
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 relative">
            <RefBadge num="105" />
            <Share2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 relative"
            onClick={() => setShowBadgesModal(true)}
            data-testid="button-open-badges"
          >
            <Trophy className="w-5 h-5" />
            {earnedBadgeIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {earnedBadgeIds.length}
              </span>
            )}
          </Button>
          <Avatar className="w-8 h-8 relative">
            <RefBadge num="106" />
            <AvatarFallback className="bg-orange-200 text-orange-700 text-sm font-semibold">MF</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden h-[calc(100vh-3.5rem)]">
        {sidebarOpen && (
          <div
            className="w-[360px] hidden lg:block h-full flex-shrink-0 relative bg-[#1b1f23] toc-scroll"
            onWheel={(e) => {
              const el = e.currentTarget;
              el.scrollTop += e.deltaY;
              const thumb = el.querySelector('.toc-scroll-thumb') as HTMLElement;
              if (thumb) {
                const scrollRatio = el.scrollTop / (el.scrollHeight - el.clientHeight);
                const thumbHeight = Math.max(30, (el.clientHeight / el.scrollHeight) * el.clientHeight);
                thumb.style.height = thumbHeight + 'px';
                thumb.style.top = (scrollRatio * (el.clientHeight - thumbHeight)) + 'px';
                thumb.classList.add('visible');
                clearTimeout((el as any)._scrollTimer);
                (el as any)._scrollTimer = setTimeout(() => thumb.classList.remove('visible'), 1500);
              }
            }}>
            <div className="toc-scroll-thumb" />
            <RefBadge num="200" />
            <CourseSidebar 
              onClose={() => setSidebarOpen(false)} 
              onSkillBuilderClick={handleSkillBuilderClick} 
              onSkillGainSummaryClick={handleSkillGainSummaryClick}
              onLearningTakeawaysClick={handleLearningTakeawaysClick}
              showRefNumbers={showRefNumbers}
              onVideoClick={(title) => {
                setIsSkillBuilderActive(false);
                setIsSkillGainSummaryActive(false);
                setActiveModuleId('');
                setSelectedVideo(title);
              }}
              activeItem={isSkillBuilderActive ? 'Skill Builder' : isSkillGainSummaryActive ? 'Skill Gains Summary' : activeModuleId ? null : selectedVideo}
              activeModuleId={activeModuleId}
              skillBuilderCompleted={skillBuilderCompleted}
              passedModuleIds={passedModuleIds}
            />
          </div>
        )}

        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-[#1b1f23] text-white text-sm hover:bg-[#2d3339] transition-colors h-fit"
            data-testid="button-open-sidebar"
          >
            <Menu className="w-4 h-4" />
            Contents
          </button>
        )}

        <div ref={contentPanelRef} className="flex-1 overflow-y-auto bg-white relative" data-content-panel="true">
          <RefBadge num="300" />
          <div className="mx-auto w-full min-h-full">
            {selectedVideo && !isSkillBuilderActive && !isSkillGainSummaryActive && (
              <>
                <div className="bg-black relative w-full">
                  <RefBadge num="301" />
                  <CoursePlayer 
                    title={selectedVideo} 
                    courseTitle="NIST CSF 2.0: Empower Your Organization to Navigate the Modern Cybersecurity Threat Landscape" 
                    videoUrl={currentVideo?.videoUrl}
                    durationSeconds={currentVideo?.durationSeconds || 0}
                    transcript={selectedVideo ? videoTranscripts[selectedVideo] : undefined}
                  />
                </div>
                <VideoDetails transcript={selectedVideo ? videoTranscripts[selectedVideo] : undefined} />
              </>
            )}
            
            <div className="bg-white p-0 relative w-full">
              <RefBadge num="302" />
              {isSkillBuilderActive && (
                <SkillBuilderInline 
                  key={activeModuleId}
                  moduleId={activeModuleId}
                  sessionId={sessionId}
                  onClose={handleSkillBuilderClose}
                  onContinue={handleContinueWithCourse}
                  onComplete={(response?: string, score?: number, completedModuleId?: string) => {
                    setSkillBuilderCompleted(true);
                    if (response) setCollatedResponse(response);
                    if (score && score >= 3 && completedModuleId) {
                      setPassedModuleIds(prev => {
                        const next = new Set(Array.from(prev));
                        next.add(completedModuleId);
                        return next;
                      });
                    }
                  }}
                  onTakeaways={handleTakeaways}
                  onViewSummary={() => {
                    setIsSkillBuilderActive(false);
                    setIsSkillGainSummaryActive(true);
                  }}
                  prefillText={tipText}
                  onPrefillComplete={() => setTipText('')}
                  aiHelpfulness={aiHelpfulness}
                  onAiHelpfulnessChange={setAiHelpfulness}
                  showRefNumbers={showRefNumbers}
                  onPartChange={(part) => setCurrentSkillBuilderPart(part)}
                  sidebarOpen={sidebarOpen}
                  onScoreUpdate={(score, completedModuleId) => {
                    if (score >= 3) {
                      setPassedModuleIds(prev => {
                        const next = new Set(Array.from(prev));
                        next.add(completedModuleId);
                        return next;
                      });
                    }
                  }}
                />
              )}
              {isSkillGainSummaryActive && (
                <SkillGainSummary collatedResponse={collatedResponse} sessionId={sessionId} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Callouts Overlay */}
      {showCallouts && (() => {
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight - 60 : 800;
        const halfwayPoint = viewportHeight / 2;
        const isInBottomHalf = (position: number) => position > halfwayPoint;
        
        return (
        <div key={calloutAnimationKey} className={`fixed inset-0 z-[100] top-[60px] ${sidebarOpen ? 'left-[360px]' : 'left-0'} overflow-visible`}>
          {/* Semi-transparent background - only covers main content area */}
          <div className="absolute inset-0 bg-[#2a2a2a]/95" />
          
          {/* Large header - left-aligned with callout boxes */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
            className="absolute top-20 left-2 right-8 max-w-[65rem] z-10"
          >
            <h1 className="text-[48px] font-bold text-white tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>Sample Course with Skill Builders</h1>
          </motion.div>
          
          {/* Callouts container - positioned to align with TOC items */}
          <div className="relative h-full flex flex-col overflow-visible">
            {/* SB1 Callout - just to the right of SB1 in TOC */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="absolute left-2 right-8 max-w-[65rem]" 
              style={{
                top: `${calloutPositions.sb1}px`,
                transform: isInBottomHalf(calloutPositions.sb1) ? 'translateY(-100%) translateY(20px)' : 'none'
              }}
            >
              <div className="bg-white p-2 lg:p-4 rounded-xl shadow-2xl relative">
                <RefBadge num="600" />
                {/* Arrow pointing left toward TOC title - position based on screen location */}
                <div className={`absolute -left-3 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-white ${isInBottomHalf(calloutPositions.sb1) ? 'bottom-4' : 'top-4'}`} />
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className="p-1 lg:p-2 bg-[#0a66c2]/10 rounded-lg shrink-0">
                    <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 text-[#0a66c2]" />
                  </div>
                  <div>
                    <p className="text-[14px] lg:text-[18px] text-gray-700 leading-snug lg:leading-relaxed">
                      In this Skill Builder you practice identifying the right stakeholders for a particular score objective (3-5 min)
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SB2 Callout - just to the right of SB2 in TOC */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute left-2 right-8 max-w-[65rem]" 
              style={{
                top: `${calloutPositions.sb2}px`,
                transform: isInBottomHalf(calloutPositions.sb2) ? 'translateY(-100%) translateY(20px)' : 'none'
              }}
            >
              <div className="bg-white p-2 lg:p-4 rounded-xl shadow-2xl relative">
                <RefBadge num="601" />
                {/* Arrow pointing left toward TOC title - position based on screen location */}
                <div className={`absolute -left-3 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-white ${isInBottomHalf(calloutPositions.sb2) ? 'bottom-4' : 'top-4'}`} />
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className="p-1 lg:p-2 bg-[#0a66c2]/10 rounded-lg shrink-0">
                    <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 text-[#0a66c2]" />
                  </div>
                  <div>
                    <p className="text-[14px] lg:text-[18px] text-gray-700 leading-snug lg:leading-relaxed">
                      Here you practice how to refine an existing Work Breakdown Structure (3-4 min)
                    </p>
                    <p className="text-[13px] lg:text-[16px] text-[#0a66c2] font-bold leading-snug lg:leading-relaxed mt-2">
                      The PDF handout for this Skill Builder was auto-generated using an AI production agent.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SB3 Callout - just to the right of SB3 (Chapter 3 Skill Builder) in TOC */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="absolute left-2 right-8 max-w-[65rem]" 
              style={{
                top: `${calloutPositions.sb3}px`
              }}
            >
              <div className="bg-white p-2 lg:p-4 rounded-xl shadow-2xl relative">
                <RefBadge num="603" />
                {/* Arrow pointing left toward TOC - always at top */}
                <div className="absolute -left-3 top-4 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-white" />
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className="p-1 lg:p-2 bg-[#0a66c2]/10 rounded-lg shrink-0">
                    <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 text-[#0a66c2]" />
                  </div>
                  <div>
                    <p className="text-[14px] lg:text-[18px] text-gray-700 leading-snug lg:leading-relaxed">
                      Here you practice creating an AI prompt that outputs meaningful project KPIs (4-5 min)
                    </p>
                    <p className="text-[13px] lg:text-[16px] text-[#0a66c2] font-bold leading-snug lg:leading-relaxed mt-2">
                      Created in 3 minutes using AI production agent, based on content from an Adaptive Learning course.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Skill Gain Summary Callout - just to the right of Skill Gain Summary in TOC */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute left-2 right-8 max-w-[65rem]" 
              style={{
                top: `${calloutPositions.summary}px`
              }}
            >
              <div className="bg-white p-2 lg:p-4 rounded-xl shadow-2xl relative">
                <RefBadge num="604" />
                {/* Arrow pointing left toward TOC - always at top */}
                <div className="absolute -left-3 top-4 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-white" />
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className="p-1 lg:p-2 bg-[#0a66c2]/10 rounded-lg shrink-0">
                    <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 text-[#0a66c2]" />
                  </div>
                  <div>
                    <p className="text-[14px] lg:text-[18px] text-gray-700 leading-snug lg:leading-relaxed">
                      Skill gains are summarized here
                    </p>
                    <p className="text-[13px] lg:text-[16px] text-[#0a66c2] font-bold leading-snug lg:leading-relaxed mt-2">
                      This skill gain data is also available to enterprise admins.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Close Button - aligned with right edge of callout panels */}
          <div className="absolute top-11 left-2 right-8 max-w-[65rem] z-20 flex justify-end">
            <Button 
              onClick={() => setShowCallouts(false)}
              className="bg-[#0a66c2] text-white hover:bg-[#004182] px-6 py-2 font-semibold gap-2 relative rounded-lg"
              data-testid="button-close-callouts"
            >
              <RefBadge num="605" />
              <X className="w-5 h-5" />
              Close
            </Button>
          </div>
          </div>
        </div>
        );
      })()}

      {/* Starburst Callout */}
      <AnimatePresence>
        {showStarburst && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`fixed bottom-24 z-[60] flex justify-center ${sidebarOpen ? 'left-[360px]' : 'left-0'} right-0`}
          >
            <div className="relative">
              <div className="relative bg-gradient-to-r from-[#0a66c2] via-[#2980b9] to-[#0a66c2] text-white px-6 py-4 pr-10 rounded-2xl shadow-2xl border-2 border-white/30 max-w-lg overflow-visible">
                {/* Rainbow spark that races around the edge once */}
                <motion.div
                  className="absolute w-3 h-3 rounded-full z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #00ffff, #0000ff, #9400d3)',
                    boxShadow: '0 0 8px 2px rgba(255,255,255,0.9), 0 0 16px 4px rgba(255,200,100,0.7)'
                  }}
                  initial={{ left: '0%', top: '0%', opacity: 0 }}
                  animate={{ 
                    left: ['0%', '100%', '100%', '0%', '0%'],
                    top: ['0%', '0%', '100%', '100%', '0%'],
                    opacity: [0, 1, 1, 1, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.6,
                    ease: 'linear',
                    times: [0, 0.25, 0.5, 0.75, 1]
                  }}
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowStarburst(false); }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                  data-testid="button-close-starburst"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <p className="font-semibold text-center text-lg drop-shadow-md">
                  Check out the Shortcuts at any time
                </p>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#2980b9]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Badges Modal */}
      <AnimatePresence>
        {showBadgesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center"
            onClick={() => setShowBadgesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Badges</h2>
                    <p className="text-sm text-gray-500">Earn badges by completing challenges and achieving milestones</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBadgesModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  data-testid="button-close-badges-modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <BadgesShowcase
                allBadges={allBadges}
                earnedBadgeIds={earnedBadgeIds}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LearningTakeawaysModal
        open={showLearningTakeawaysModal}
        onOpenChange={setShowLearningTakeawaysModal}
        bestScores={takeawaysScores}
        demoBestScores={mergeDemoWithReal(takeawaysDemoScores, takeawaysScores)}
        completedCount={Object.keys(takeawaysScores).length}
        totalModules={9}
      />
    </div>
  );
}
