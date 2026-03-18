# Skill Builder Master Prompt

**Everything needed to rebuild this AI-powered interactive learning course on any vibe-coding platform.**

---

## 1. VISION AND DESIGN PHILOSOPHY

Build an AI-powered NIST Cybersecurity Framework (CSF) 2.0 interactive learning course that simulates a LinkedIn Learning-style experience. The course combines video lessons with interactive "Skill Builder" exercises where learners practice applying concepts to realistic scenarios, receive AI-powered feedback, and iteratively improve their responses.

### Core Design Goals

- **Learn by doing.** Skill Builders are the heart of the experience. They present engaging real-world cybersecurity scenarios, evaluate learner responses with structured AI feedback, and encourage iterative improvement.
- **Professional polish.** The UI should look and feel like LinkedIn Learning — clean, confident, and familiar. Learners should feel like they're using a real LMS, not a prototype.
- **Deterministic scoring.** AI feedback must be consistent and predictable. Every Skill Builder uses a Scoring Decision Tree that produces the same score for the same quality of response, regardless of how many times the learner submits.
- **Iterative improvement loop.** Learners are never "stuck." They can revise and resubmit as many times as they want. Each new response builds on their previous ones, and the AI evaluates the combined knowledge demonstrated across all responses.
- **Error detection matters.** The scoring system explicitly tests whether learners include incorrect or dangerous ideas. Errors cap scores at Level 3 maximum until corrected — this is a deliberate pedagogical choice.

### What "Skill Builder" Is

Skill Builder is a hands-on activity embedded directly in the flow of the course. The AI presents an engaging real-world scenario, evaluates responses with feedback and scoring, and encourages iterative improvements. When finished, the learner's final response and skill metrics are saved to a Skill Gains Summary.

Skill Builders are optional but highly recommended — research shows that practicing concepts soon after learning them significantly strengthens retention and understanding.

---

## 2. UI/UX DESIGN

### Visual Identity

- **Primary color:** LinkedIn blue `#0a66c2`
- **Dark sidebar:** `#1b1f23` (dark charcoal)
- **Score colors:** Amber/orange for levels 1-2, LinkedIn blue for level 3, emerald green for levels 4-5
- **Typography:** Clean sans-serif (system font stack or Inter/Outfit)
- **Icons:** Lucide React icon set throughout
- **Animations:** Framer Motion for smooth UI transitions

### Layout Structure

The main course view has three zones:

1. **Collapsible sidebar (left, ~360px wide):** Dark background. Shows the full course table of contents organized by chapter. Videos show circle icons (filled blue = completed, empty = available). Skill Builders show a lightning bolt icon in blue (or a checkmark once passed). The Skill Gains Summary has a special green award icon. Chapters are collapsible accordion sections.

2. **Main content area (center):** This is where videos play and Skill Builders render. Max width ~73rem. When viewing a video, shows the video player, title, instructor info, and transcript. When a Skill Builder is active, the entire area becomes the Skill Builder interface.

3. **Demo Shortcuts panel (right, collapsible):** A testing aid that shows pre-written sample responses at different quality levels. Each Skill Builder has three sample responses (SR1 → Level 3, SR2 → cumulative Level 4, SR3 → cumulative Level 5) plus one erroneous response that tests error detection (capped at Level 3). Clicking a sample response auto-fills the text input.

### Course Sidebar Details

The sidebar is organized into these sections:

- **Introduction** — 1 video ("Empower your organization", 42s)
- **1. Intro to NIST CSF 2.1** — 2 videos + 1 Skill Builder (CSF Functions in Action)
- **2. Deep Dive into Identify** — 3 videos + 2 Skill Builders (Asset Classification, Identify Wrap-Up)
- **3. Strengthening the Protect Function** — 4 videos + 2 Skill Builders (Access Control Audit, Protect Wrap-Up)
- **4. Detect, Respond, and Recover Functions** — 3 videos + 2 Skill Builders (Incident Response, DRR Wrap-Up)
- **5. Implementing the Framework** — 2 videos + 1 Skill Builder (Implementation Roadmap)
- **Conclusion** — 1 video + Capstone Skill Builder + Skill Gains Summary

Sidebar items highlight when active. Videos show duration in "Xm Xs video" format. Skill Builders show "X-Xm interactive" format.

### Skill Builder UI Phases

Each Skill Builder has three phases:

**Phase 1: Intro**
- Header with sparkles icon, "Skill Builder" title in large bold text
- About button and Options (gear) button in top-right
- Blue gradient card showing: Skill Objective, Duration, and Prepare items (links to reference materials)
- Centered "Start" button (rounded pill, LinkedIn blue)

**Phase 2: Conversation**
- Persistent header with Skill Builder branding and current score display
- Persistent goal/prepare card (always visible at top)
- Scrollable conversation thread:
  - AI messages: Blue avatar with sparkles icon, white card with border/shadow
  - User messages: Right-aligned, blue background, white text
  - Score bar on AI feedback messages: Dark gray bar at top of card showing "Skill Level: X/5 Label" with 5 segment indicators (filled = gold, empty = gray)
- Strengths shown as green "What you did well" section
- Improvements shown as orange "What to work on" section (collapsible with chevron)
- Text input area at bottom with Submit button
- Score indicator in the goal card (top-right) updates after each submission

**Phase 3: Complete**
- Shows final score with level label
- Displays the finalized response (auto-corrected for spelling/grammar by AI)
- "Score and final response saved to your Skill Gains Summary" confirmation
- Navigation buttons: Continue to Next, View Skill Gains Summary

### Score Labels

| Score | Label | Color |
|-------|-------|-------|
| 1 | Novice | Amber |
| 2 | Basic | Amber |
| 3 | Competent | LinkedIn Blue |
| 4 | Proficient | Emerald |
| 5 | Expert | Emerald |

### Score Display

Each AI feedback message has a dark gray header bar showing:
- "Skill Level: X/5 Label (Part N)" for multi-part exercises
- Five small rectangular segments: filled gold up to the score, gray for the rest

### Celebration Animations

When a learner achieves Level 5 (Expert):
- "Fantastic work! You nailed it!" message with 🎉 emoji
- "Expert Level!" badge
- Optional reward animation (GIF/video) from a rotating pool — each animation shown once before repeating
- Reward animations can be toggled on/off in Options

### Options Panel

Accessible via gear icon. Contains:
- **AI Help Level** (slider, 1-5): Controls how the AI gives improvement suggestions
  - 1: Pure Socratic — questions only
  - 2: Mostly questions with subtle nudges
  - 3: Balanced guidance with some hints (default)
  - 4: More direct hints about gaps
  - 5: Clear, specific guidance about gaps
- **Reward Animations** (toggle): On/off for Level 5 celebration GIFs
- **Level 5 Streaks** (toggle): On/off for streak encouragement messages

### About Panel

Modal overlay explaining what Skill Builder is. Shows automatically the first time a user opens a Skill Builder (Welcome variant), then available via About button (standard variant).

---

## 3. THE LEARNING DYNAMIC

### Core Loop

1. AI presents a realistic scenario with a clear question
2. Learner writes a response in the text area
3. AI evaluates the response against an ideal answer using a Scoring Decision Tree
4. AI returns structured feedback: score (1-5), strengths, and improvements
5. Learner reads feedback, revises their thinking, and submits again
6. All responses are accumulated and treated as one combined answer — later responses can revise/supersede earlier ones
7. Repeat until satisfied (typically 2-4 submissions to reach Level 4-5)

### Combined Response Logic

This is critical to the learning experience:

- Every time the learner submits, ALL of their previous responses for that part are sent to the AI as a combined answer
- The AI scores based on the TOTAL knowledge demonstrated across ALL responses
- If the latest response contradicts or corrects an earlier response, the latest version takes precedence
- This means learners can build their answer incrementally: start with 2 ideas, then add a third, then refine
- The learner never needs to repeat content they've already said

### AI Helpfulness Auto-Adjustment

- If a learner gets the same score twice in a row, the improvement suggestions auto-expand
- If they get the same score three times, the AI helpfulness level automatically increases by 1
- This prevents learners from getting stuck without knowing how to improve

### Frustration Detection

If the learner is on attempt 3+ and seems stuck, frustrated, or asking for help directly, the AI overrides the helpfulness level and provides more direct hints — regardless of the slider setting.

### Humor Detection

If the learner submits a joke or nonsensical response:
- Score 1 (Novice)
- If humor is detected, respond with a touch of playful humor before redirecting
- If no humor detected, give neutral feedback
- Still find something genuinely positive for strengths
- Gently redirect back to the question in improvements

### Response Finalization

When a learner achieves Level 5 (or decides to finish), their combined response is sent to a separate AI endpoint that:
1. Corrects spelling and grammar errors
2. Adds paragraph breaks for readability (for longer responses)
3. Does NOT add, remove, or rephrase any content
4. The corrected version is displayed as "Your Final Response" and saved to the Skill Gains Summary

---

## 4. THE SCORING SYSTEM

### 5-Level Rubric

Every Skill Builder uses a 5-level scoring rubric:

- **Level 1 (Novice):** Missing most key points or off-topic
- **Level 2 (Basic):** Shows basic understanding with few specifics
- **Level 3 (Competent):** Covers some key points with reasoning
- **Level 4 (Proficient):** Covers most key points with good reasoning, no errors
- **Level 5 (Expert):** Comprehensive coverage of all key points

### Scoring Decision Tree (the key innovation)

Every module has a 4-step Scoring Decision Tree that the AI must follow strictly:

```
STEP 1: Does the combined response meet the minimum content threshold?
        → If NO: Maximum score is Level 3.

STEP 2: If YES: Are there uncorrected errors, misconceptions, or dangerous recommendations?
        → If YES: Score Level 3 and flag the error FIRST in improvements.

STEP 3: If content threshold met AND no errors: Score Level 4.

STEP 4: Does the response meet the Level 5 "expert" criteria (deeper insight, broader coverage)?
        → If YES: Score Level 5.
```

The specific content threshold and Level 5 criteria vary by module, but the 4-step structure is always the same.

### Error Handling (critical pedagogical feature)

- Errors are always flagged FIRST in the improvements feedback, with direct, clear statements about why the idea is wrong
- Errors cap scores at Level 3 maximum, even if other content is strong
- Learners must correct or remove the error in a subsequent response to unlock Level 4+
- This teaches critical thinking: it's not enough to have good ideas — wrong ideas must be identified and fixed
- Error types vary by module: incorrect stakeholders, dismissing genuine risks, using jargon with non-technical audiences, skipping foundational steps, suggesting harmful actions

### AI Configuration

- **Model:** GPT-4o (or equivalent)
- **Temperature:** 0.2 (low, for deterministic scoring)
- **Response format:** JSON with structured fields
- **Max tokens:** 1500

### System Prompt Structure

The AI system prompt includes:
1. Role context ("supportive AI tutor")
2. The exercise question
3. The ideal answer
4. All learner responses (combined, labeled with order and recency)
5. Scoring criteria with the Decision Tree
6. Error handling instructions
7. Helpfulness level guidance
8. Output format specification (JSON with score_reasoning, score, feedback, strengths, improvements)

### Feedback Output Structure

```json
{
  "score_reasoning": "Step-by-step walk through the decision tree",
  "score": 4,
  "feedback": "",
  "strengths": ["One specific, genuine positive observation"],
  "improvements": ["Error flags first", "What's missing", "Guidance based on helpfulness level"]
}
```

Key rules for feedback:
- **Strengths** must be purely positive. Never include negative observations. Lean toward 1 bullet point; only add a 2nd when truly merited. Never use generic filler like "You've engaged with the scenario."
- **Improvements** are ordered: (1) errors flagged with DIRECT statements, (2) what's missing, (3) Socratic questions or hints based on helpfulness level.
- **Feedback** field is left as empty string — the opening paragraph is not used.
- Errors are called out with DIRECT language, not Socratic phrasing, regardless of helpfulness level.

---

## 5. MULTI-PART EXERCISES

Five modules have multiple parts:

| Module | Parts | Gate |
|--------|-------|------|
| identify_wrapup | 2 | Level 3+ on Part 1 |
| protect_wrapup | 2 | Level 3+ on Part 1 |
| drr_wrapup | 2 | Level 3+ on Part 1 |
| implementation_plan | 2 | Level 3+ on Part 1 |
| csf_capstone | 3 | Level 3+ on each part |

### How Multi-Part Works

- Part 1 presents the analytical/technical question
- Part 2 (and Part 3 for capstone) asks the learner to communicate their findings to a non-technical audience (CEO, board, senior partner)
- Each part has its own question, ideal answer, and scoring criteria
- The learner must achieve Level 3+ on the current part to unlock the next part
- Each part tracks its own score independently
- The conversation thread is continuous — learners can see their Part 1 work while doing Part 2
- When scoring a part, only responses submitted for that part are sent as the combined answer (not responses from previous parts)
- The final display shows scores for all parts: "Part 1: 4/5 Proficient, Part 2: 5/5 Expert"

### Part 2/3 Pattern

Part 2 (and Part 3) typically follows a pattern:
- A non-technical stakeholder asks a plain-language question
- The learner must translate technical findings into business terms
- Scoring penalizes: technical jargon, vague language, missing business impact
- Scoring rewards: connecting to revenue/customers/reputation, proposing metrics, clear call to action
- A "Risk Communication Template" or similar handout is linked as a reference

---

## 6. SKILL GAINS SUMMARY

### Overview

The Skill Gains Summary is a dashboard showing the learner's progress across 6 core competencies, calculated from their best scores across all completed Skill Builders.

### 6 Core Competencies

1. **CSF Framework Knowledge** (blue #0a66c2)
2. **Risk Analysis** (green #057642)
3. **Security Architecture** (cyan #0891b2)
4. **Incident Management** (purple #5f4bb6)
5. **Strategic Planning** (amber #915907)
6. **Executive Communication** (magenta #c026d3)

### Skill Mapping

Each Skill Builder maps to 1-3 competencies with relative weights:

| Module | Skills | Weights |
|--------|--------|---------|
| csf_functions | CSF Framework Knowledge, Risk Analysis | 0.7, 0.3 |
| asset_classification | Risk Analysis | 1.0 |
| identify_wrapup | CSF Framework Knowledge, Executive Communication | 0.6, 0.4 |
| access_control | Security Architecture, Risk Analysis | 0.6, 0.4 |
| protect_wrapup | Security Architecture, Executive Communication | 0.5, 0.5 |
| incident_response | Incident Management | 1.0 |
| drr_wrapup | Incident Management, Executive Communication | 0.6, 0.4 |
| implementation_plan | Strategic Planning, Executive Communication | 0.6, 0.4 |
| csf_capstone | CSF Framework Knowledge, Strategic Planning, Executive Communication | 0.35, 0.35, 0.3 |

### Computation

For each competency:
1. Find all modules that contribute to it
2. For each contributing module, take the best score achieved
3. Multiply: weight × best_score × 20 (to convert 1-5 score to 0-100 scale)
4. Sum weighted scores and divide by total weight
5. Round to nearest integer

This produces a 0-100 value for each competency.

### Visualization

- **Bar chart** showing all 6 competencies with colored bars
- **Radar/spider chart** as an alternative view
- **Results table** listing each completed Skill Builder with chapter, title, and score
- Clicking a result shows the learner's collated response
- Demo mode toggle to preview with randomized sample scores

---

## 7. DEMO SHORTCUTS PANEL

### Purpose

A testing/demo aid that provides pre-written sample responses at different quality levels. Essential for demonstrating the scoring system to stakeholders without writing full responses each time.

### Structure

For each Skill Builder, the Demo Shortcuts panel shows:

- **Sample Response 1 (→ Level 3):** A correct but incomplete response covering the basics
- **Sample Response 2 (1+2 → Level 4):** When combined with SR1, reaches Level 4 threshold
- **Sample Response 3 (1+2+3 → Level 5):** When combined with SR1+SR2, reaches Level 5
- **Erroneous Response:** Contains a specific factual or conceptual error that tests error detection (caps at Level 3)

For multi-part exercises, each part has its own set of sample responses.

### How It Works

- Clicking a sample response auto-fills the text input (like a "paste" action)
- The learner submits SR1 first, gets Level 3 feedback
- Then submits SR2, which combines with SR1 to reach Level 4
- Then submits SR3, which combines with SR1+SR2 to reach Level 5
- The erroneous response can be submitted at any time to test error detection

### Panel UI

- Collapsible panel on the right side of the screen
- Shows the current module's sample responses
- Each response has a label explaining the expected outcome
- Toggle visibility with a "Demo Shortcuts" button in the course header
- Also shows the ideal answer for reference

---

## 8. ALL 12 SKILL BUILDER MODULES

Each module is defined by: an ID, a scenario question, an ideal answer, scoring criteria with a decision tree, a goal statement, duration estimate, and preparation items.

---

### Module 1: csf_functions
**Title:** CSF Functions in Action
**Chapter:** 1. Intro to NIST CSF 2.1
**Duration:** 2-3 minutes
**Parts:** 1
**Skills:** CSF Framework Knowledge (0.7), Risk Analysis (0.3)

**Scenario:** Your company experienced a security incident. An employee clicked a phishing email, attackers accessed the customer database, and the breach wasn't discovered for 3 weeks. Leadership asks how to prevent this.

**Question:** Using the six CSF functions (Identify, Protect, Detect, Respond, Recover, Govern), which 2-3 functions were most likely weak? Give 1 sentence of reasoning for each.

**Ideal Answer:**
- DETECT was weak — breach wasn't discovered for 3 weeks (inadequate monitoring)
- PROTECT was weak — phishing email succeeded without MFA or email filtering
- GOVERN was weak — no clear policies or leadership oversight
- IDENTIFY may have been weak — customer database not recognized as critical asset

**Scoring Decision Tree:**
1. Does response include DETECT + PROTECT + GOVERN? → If NO, max Level 3
2. If YES: Uncorrected errors (e.g., conflating Recover with Detect)? → If YES, Level 3
3. If YES functions AND NO errors: Level 4
4. Also includes IDENTIFY with reasoning? → Level 5

**Error Detection Test:** A response that conflates Recover with Detect (e.g., "Recover was weak because they couldn't detect the attack quickly enough")

**Key Scoring Note:** Only naming DETECT and PROTECT with brief scenario-restating reasoning is Level 2, not Level 3. Level 3 requires either a third function OR deeper analysis.

---

### Module 2: asset_classification
**Title:** Asset Classification
**Chapter:** 2. Deep Dive into Identify
**Duration:** 3-4 minutes
**Parts:** 1
**Skills:** Risk Analysis (1.0)

**Scenario:** You're the new IT security lead at a mid-size healthcare company. Classify these 6 assets by criticality level (Critical, High, Medium, Low) with reasoning:
1. Patient medical records database
2. Employee break room smart coffee machine (WiFi-connected)
3. Billing and payment processing system
4. Company marketing website
5. Email server used by all staff
6. A test server a developer set up 2 years ago (still running)

**Ideal Answer:**
1. Patient records — CRITICAL (PHI regulated by HIPAA)
2. Coffee machine — LOW (no sensitive data, but inventory as network entry point)
3. Billing system — CRITICAL (payment card data, PCI-DSS)
4. Marketing website — MEDIUM (public-facing, no sensitive data)
5. Email server — HIGH to CRITICAL (sensitive communications, phishing vector)
6. Forgotten test server — HIGH risk (shadow IT, likely unpatched/unmonitored)

**Scoring Decision Tree:**
1. 4+ assets correctly classified with reasoning? → If NO, max Level 3
2. If YES: Uncorrected misclassifications (e.g., marketing website rated Critical)? → If YES, Level 3
3. If 4+ correct AND NO errors: Level 4
4. All 6 correct with solid reasoning, including test server as shadow IT risk? → Level 5

---

### Module 3: identify_wrapup (2 parts)
**Title:** Identify Wrap-Up
**Chapter:** 2. Deep Dive into Identify
**Duration:** 4-5 minutes
**Skills:** CSF Framework Knowledge (0.6), Executive Communication (0.4)

**Part 1 Scenario:** Cybersecurity consultant for a growing e-commerce startup (50 employees, $10M revenue). Assessment found: no asset inventory, CTO handles all security alone, risk discussions only after incidents, several employees have unnecessary admin access.

**Part 1 Question:** Write 2-3 prioritized recommendations. For each, name which Identify pillar (Asset Management, Risk Assessment, or Governance) and explain why.

**Part 1 Ideal:** Asset Inventory (Asset Management), Establish Governance, Proactive Risk Assessment

**Part 1 Decision Tree:**
1. Covers 2+ Identify pillars with good reasoning? → If NO, max Level 3
2. Off-scope recommendations (e.g., SIEM from Detect function)? → If YES, Level 3
3. 2+ pillars AND NO errors: Level 4
4. All 3 pillars with specific reasoning: Level 5

**Part 2 Question:** The CEO asks: "Why should we spend money on this? We haven't been hacked." Write 2 sentences translating your top risk into business terms. No jargon.

**Part 2 Ideal:** "Right now, we don't know who can access our customer data—and with $10M in revenue, we're a target. A breach could cost millions in fines, drive away customers, and damage the reputation we've built."

**Part 2 Decision Tree:**
1. Covers 3 of 4 business elements (revenue, customers, reputation, cost comparison) jargon-free? → If NO, max Level 3
2. Uncorrected jargon (MFA, endpoint detection, SIEM)? → If YES, Level 3
3. 3+ elements AND NO jargon: Level 4
4. All 4 elements, CEO would understand and act: Level 5

---

### Module 4: access_control
**Title:** Access Control Audit
**Chapter:** 3. Strengthening the Protect Function
**Duration:** 3-4 minutes
**Parts:** 1
**Skills:** Security Architecture (0.6), Risk Analysis (0.4)

**Scenario:** Reviewing access controls at a financial services company. Discovered:
1. CEO's executive assistant has admin access to payroll "in case the CEO needs something"
2. Former contractor's VPN account still active 6 months after project ended
3. IT help desk uses shared "admin" account with password on sticky note
4. Employees access customer database from any device, including personal phones

**Question:** Pick 2-3 most critical issues. For each, explain the risk and recommend a fix.

**Ideal Answer:**
1. Contractor's zombie account → Deprovision immediately, quarterly access reviews
2. Shared admin account → Eliminate shared accounts, individual credentials with MFA
3. Executive assistant's admin access → Violates least privilege, create read-only view
4. Uncontrolled device access → Require managed devices or Zero Trust model

**Decision Tree:**
1. 3+ issues addressed? → If NO, max Level 3
2. Dismisses a genuine risk (e.g., "personal phones are fine with passwords")? → If YES, Level 3
3. 3+ issues AND NO dismissals: Level 4
4. References advanced concepts (least privilege, MFA, Zero Trust, lifecycle management): Level 5

---

### Module 5: protect_wrapup (2 parts)
**Title:** Protect Wrap-Up
**Chapter:** 3. Strengthening the Protect Function
**Duration:** 4-5 minutes
**Skills:** Security Architecture (0.5), Executive Communication (0.5)

**Part 1 Scenario:** Mid-size law firm (75 employees) with sensitive client data. Found: basic firewall but no endpoint protection, annual security training video only, no data classification, attorneys access files from personal laptops.

**Part 1 Question:** Give 2-3 prioritized "Protect" recommendations. Name the Protect concept each addresses.

**Part 1 Ideal:** Endpoint Protection (Technology), Data Classification (Data Security), Device Management (Identity/Access)

**Part 1 Error Test:** Endorsing the annual training video as "a good foundation"

**Part 2 Question:** Senior partner asks about top 2 risks to client data. Write 2-3 sentences connecting recommendations to client confidentiality. No jargon — think liability and client trust.

**Part 2 Ideal:** Frame risks in terms of malpractice claims, bar complaints, firm shutdown.

**Part 2 Error Test:** Using jargon like EDR, XDR, Zero Trust, SASE

---

### Module 6: incident_response
**Title:** Incident Response
**Chapter:** 4. Detect, Respond, and Recover
**Duration:** 3-4 minutes
**Parts:** 1
**Skills:** Incident Management (1.0)

**Scenario:** 2:30 PM Friday. Alert: unusual data transfer — 50GB copied to external IP from customer records server over the past hour. Server still online.

**Question:** Describe your first 3 actions to contain the situation and who you'd notify in the first 30 minutes.

**Ideal Answer:**
- Actions: (1) Isolate server from network (don't power off — preserve evidence), block external IP; (2) Preserve logs, document with timestamps; (3) Check other systems
- Notify: CISO, legal counsel, IR team. Don't wait until Monday — Friday attack is deliberate timing.

**Decision Tree:**
1. Both containment AND notifications with practical steps? → If NO, max Level 3
2. Harmful recommendations (shutting down/wiping systems)? → If YES, Level 3
3. Containment + notifications AND NO harmful recommendations: Level 4
4. Also includes evidence preservation AND Friday timing awareness: Level 5

**Error Test:** Suggesting to shut down the server (destroys forensic evidence)

---

### Module 7: drr_wrapup (2 parts)
**Title:** DRR Wrap-Up
**Chapter:** 4. Detect, Respond, and Recover
**Duration:** 4-5 minutes
**Skills:** Incident Management (0.6), Executive Communication (0.4)

**Part 1 Scenario:** Company recovered from ransomware. Attack detected after 4 days, response took 2 weeks, recovery took 1 week. Leadership asks how to prevent recurrence.

**Part 1 Question:** Give 1 specific recommendation each for Detect, Respond, and Recover.

**Part 1 Ideal:**
- Detect: Deploy EDR (hours vs 4 days)
- Respond: Document and practice IR plan, tabletop exercises
- Recover: Test backup restoration quarterly, define recovery priority order

**Part 1 Key Note:** Generic one-liners like "better monitoring" are Level 2, not Level 3. Level 3+ requires specificity tied to the scenario.

**Part 2 Question:** CEO needs board summary. Write 2-3 sentences: what went wrong, what you're fixing, 1 metric to track. No jargon.

**Part 2 Ideal:** "This attack went undetected for 4 days and took 3 weeks to recover because we lacked real-time monitoring and a practiced response plan. We're deploying detection tools, running quarterly drills, and testing backups. We'll track detection time with a target of under 4 hours."

---

### Module 8: implementation_plan (2 parts)
**Title:** Implementation Roadmap
**Chapter:** 5. Implementing the Framework
**Duration:** 4-5 minutes
**Skills:** Strategic Planning (0.6), Executive Communication (0.4)

**Part 1 Scenario:** Healthcare technology startup (100 employees, Series B). No formal cybersecurity program. Leadership gives 6 months and limited budget.

**Part 1 Question:** Create phased roadmap: Phase 1 (Months 1-2), Phase 2 (Months 3-4), Phase 3 (Months 5-6). For each, name CSF function(s) and 1-2 key actions.

**Part 1 Ideal:**
- Phase 1 (Identify): Asset inventory, risk assessment, establish governance
- Phase 2 (Protect + Detect): EDR, monitoring, data classification, training
- Phase 3 (Respond + Recover): IR plan, tabletop exercise, backup testing

**Part 1 Error Test:** Jumping to buying/deploying tools in Phase 1 before Identify foundations

**Part 2 Question:** CEO asks for 2-3 key metrics and a plan for keeping leadership informed.

**Part 2 Ideal:** Asset inventory completion %, MFA adoption rate, mean time to detect. Monthly CEO report, quarterly board update in business terms. HIPAA awareness.

**Part 2 Error Test:** Technical metrics for leadership (SIEM alert volume, vulnerability scan pass rate)

---

### Module 9: csf_capstone (3 parts)
**Title:** Course Capstone
**Chapter:** Conclusion
**Duration:** 6-8 minutes
**Skills:** CSF Framework Knowledge (0.35), Strategic Planning (0.35), Executive Communication (0.3)

**Scenario:** Regional credit union (200 employees, 3 branches) preparing for merger growth. Assessment found:
- No complete asset inventory, shadow IT cloud services
- Ad hoc security decisions by IT director alone
- Last security training 18 months ago
- No endpoint protection beyond basic antivirus
- Phishing breach undetected for 2 weeks
- No IR or recovery plan
- Customer financial data not classified or encrypted

**Part 1 Question:** Identify 3-4 most critical gaps. Map each to a CSF function and explain urgency.

**Part 1 Decision Tree:**
1. 3-4 gaps across 3-4 functions (including Identify/Govern AND Detect/Respond/Recover)? → If NO, max Level 3
2. Dismisses genuine gaps (e.g., stale training isn't critical)? → If YES, Level 3
3. 3-4 gaps across 3-4 functions AND NO dismissals: Level 4
4. 5+ gaps across 5+ functions (including Protect) with cascade analysis and merger context: Level 5

**Part 2 Question:** CEO gives 90 days. Create prioritized 3-phase plan: Days 1-30 (Foundation), Days 31-60 (Core Defenses), Days 61-90 (Maturity). Name actions and CSF functions.

**Part 2 Ideal:** Foundation → Identify + Govern; Core Defenses → Protect + Detect; Maturity → Respond + Recover. "Crawl, walk, run" progression.

**Part 3 Question:** Board of directors (non-technical) asks: "Why should cybersecurity be a priority right now during this merger?" Write 3-4 sentences covering current risk, member/reputation protection, and success metrics.

**Part 3 Ideal:** Connect to member trust, merger timing urgency, regulatory fines, and offer 3 specific trackable metrics. Completely jargon-free.

---

### Modules 10-12: Original Demo Skill Builders

These three modules are from the original demo and cover project management topics rather than cybersecurity:

**Module 10: project_stakeholders** — Identify stakeholders for a hospital scheduling project (Brisbane Hospital scenario with org chart)
**Module 11: scope_wbs_reflection** — Review a faulty Work Breakdown Structure and identify issues
**Module 12: ai_kpi_prompt** — Write an AI prompt to generate KPIs for a customer support system launch

These follow the same scoring system and decision tree pattern. They're in a separate "Original Demo Skill Builders" section in the sidebar.

---

## 9. DATA MODEL

### Attempts Table

Stores every learner submission:

| Field | Type | Description |
|-------|------|-------------|
| id | serial | Auto-increment primary key |
| sessionId | text | Client-generated session identifier |
| moduleId | text | Which Skill Builder (e.g., "csf_functions") |
| attemptNumber | integer | Which attempt within the part (1, 2, 3...) |
| partNumber | integer | Which part of a multi-part exercise (1, 2, or 3) |
| userResponse | text | The learner's submitted text |
| score | integer | AI-assigned score 1-5 |
| feedback | text | AI feedback message |
| strengths | text[] | Array of strength observations |
| improvements | text[] | Array of improvement suggestions |
| createdAt | timestamp | When submitted |

### Session-Based Tracking

- No user authentication required
- Client generates a unique session ID on page load: `session_{timestamp}_{random}`
- All progress tied to this session ID
- Best scores per module fetched via: `GET /api/attempts/session/:sessionId`
- This returns the highest score achieved per module across all attempts

---

## 10. API ENDPOINTS

### POST /api/submit-response

Accepts a learner's response, sends it to OpenAI for evaluation, stores the result, and returns structured feedback.

**Request body:**
```json
{
  "sessionId": "session_123_abc",
  "moduleId": "csf_functions",
  "attemptNumber": 2,
  "partNumber": 1,
  "userResponse": "The current response text",
  "allResponses": ["First response", "Current response"],
  "prompt": "The exercise question",
  "idealAnswer": "The ideal answer",
  "scoringCriteria": "The scoring criteria with decision tree",
  "socraticMode": true,
  "aiHelpfulness": 3
}
```

**Response:** The stored attempt object with score, feedback, strengths, improvements.

### POST /api/finalize-response

Corrects spelling/grammar in the learner's final response without changing content.

### GET /api/attempts/session/:sessionId

Returns best scores per module for the given session, used by the Skill Gains Summary.

### GET /api/videos

Returns the list of course videos with titles, durations, chapters, and transcript keys.

---

## 11. TECH STACK RECOMMENDATIONS

This project was built with:

- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui components, Framer Motion, Wouter router, TanStack React Query, Recharts (for Skill Gains charts)
- **Backend:** Express.js + TypeScript, PostgreSQL with Drizzle ORM
- **AI:** OpenAI API (GPT-4o, temperature 0.2, JSON response format)

But the design is platform-agnostic. Any modern stack will work as long as it supports:
- A responsive React-style component architecture
- Server-side API routes that call an LLM
- A database for storing attempts
- JSON response parsing from AI

---

## 12. RECREATION CHECKLIST

To rebuild this project from scratch:

1. Set up a course layout with collapsible sidebar and main content area
2. Create the course structure (chapters, videos, Skill Builders) in the sidebar
3. Build the Skill Builder component with three phases (intro, conversation, complete)
4. Implement the conversation UI with AI/user message bubbles and score display
5. Create the API endpoint that sends learner responses + scoring criteria to OpenAI
6. Implement the Scoring Decision Tree pattern in the system prompt
7. Add combined response logic (accumulate all responses, latest supersedes)
8. Build multi-part exercise support with progression gates (Level 3+ to advance)
9. Add the AI helpfulness slider and auto-adjustment
10. Build the Skill Gains Summary with competency calculations and charts
11. Create the Demo Shortcuts panel with sample responses at each level
12. Add celebration animations for Level 5 scores
13. Implement response finalization (spelling/grammar correction)
14. Style everything to match LinkedIn Learning's aesthetic

### What Makes This Different From a Simple Chatbot

- **Deterministic scoring** via Scoring Decision Trees (not subjective AI judgment)
- **Error detection** that caps scores until errors are corrected
- **Combined response logic** that lets learners build incrementally
- **Multi-part exercises** that test both technical analysis AND executive communication
- **Adaptive AI helpfulness** that gets more helpful when learners are stuck
- **Structured feedback** (strengths always positive, improvements always actionable)

---

*This document contains the complete specification for rebuilding the AI-powered NIST CSF 2.0 Skill Builder course. The scoring system, learning dynamics, and UI patterns described here are the result of extensive testing and iteration.*
