# NIST CSF 2.0 Skill Builder Course - Project Recreation Guide

## What's in this archive

Complete source code for an AI-powered NIST Cybersecurity Framework (CSF) 2.0 interactive learning course. Simulates a LinkedIn Learning-style experience with 16 video lessons, 12 interactive Skill Builder exercises, AI-powered feedback scoring (Levels 1-5), and dynamic progress tracking.

### Archive Contents
```
client/           → React frontend (TypeScript, Vite, Tailwind CSS, shadcn/ui)
  src/pages/      → CourseView (main course), IntroStage, ConclusionStage
  src/components/ → SkillBuilderInline, CourseSidebar, SkillGainSummary, VideoDetails, etc.
  src/data/       → Video transcripts
  src/assets/     → Images and static assets
  public/         → Static files served at root (WBS exercise, KPI guide, etc.)
server/           → Express.js backend (TypeScript)
  routes.ts       → API endpoints including AI scoring pipeline
  storage.ts      → Database operations (Drizzle ORM)
  replit_integrations/ → AI integration modules
shared/           → Shared database schema (Drizzle + Zod types)
attached_assets/  → Video transcript text files, generated thumbnail images
```

### What's NOT included (you'll need to provide)
- **Video files** (.mp4) — 16 course videos (~900MB total)
  - Place in `client/public/videos/` with filenames matching the `videos` database table
  - The app functions without them (shows placeholder)
- **node_modules/** — Run `npm install` to recreate
- **PostgreSQL database** — Create one and set `DATABASE_URL`

---

## Step-by-step Recreation

### 1. Extract the archive
```bash
tar xzf skill-builder-course-archive.tar.gz
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up PostgreSQL database
Create a PostgreSQL database and set the connection string:
```bash
export DATABASE_URL="postgresql://user:password@host:port/dbname"
```

Push the schema:
```bash
npx drizzle-kit push
```

### 4. Set up OpenAI API access
The app uses OpenAI GPT-4o for AI-powered Skill Builder feedback. Set these environment variables:
```bash
export AI_INTEGRATIONS_OPENAI_API_KEY="your-openai-api-key"
export AI_INTEGRATIONS_OPENAI_BASE_URL="https://api.openai.com/v1"
```
On Replit, these are managed automatically via the AI Integrations feature.

### 5. Run the development server
```bash
npm run dev
```
The app binds to **port 5000**.

### 6. (Optional) Add video files
Place `.mp4` video files in `client/public/videos/`. Videos are referenced from the `videos` database table which is seeded on first run.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v4, shadcn/ui (New York style) |
| Routing | Wouter |
| Server State | TanStack React Query |
| Animation | Framer Motion |
| Backend | Express.js, TypeScript, tsx |
| Database | PostgreSQL via Drizzle ORM |
| AI | OpenAI GPT-4o (temperature 0.2 for deterministic scoring) |
| Build | esbuild (production) |

## Key Files

| File | Purpose |
|------|---------|
| `client/src/pages/CourseView.tsx` | Main course view — video player, sidebar, skill builders, demo shortcuts |
| `client/src/components/SkillBuilderInline.tsx` | Interactive exercise engine — 12 modules with scoring criteria, multi-part exercises |
| `client/src/components/SkillGainSummary.tsx` | Dynamic skill progress visualization across 6 core competencies |
| `client/src/components/CourseSidebar.tsx` | Course table of contents with completion checkmarks |
| `client/src/components/VideoDetails.tsx` | Course metadata, instructor info, related courses |
| `server/routes.ts` | API endpoints — AI scoring pipeline, attempt tracking, video/badge data |
| `server/storage.ts` | Database CRUD operations via Drizzle ORM |
| `shared/schema.ts` | Database schema shared between client and server |
| `client/src/data/transcripts.ts` | Video transcript content for all 16 lessons |

## Course Structure

### Modules (12 Skill Builders)
1. **csf_functions** — Apply CSF functions to a breach scenario
2. **asset_classification** — Classify organizational assets by criticality
3. **identify_wrapup** — Identify pillar action plan + executive pitch (2 parts)
4. **access_control** — Identify access control vulnerabilities
5. **protect_wrapup** — Protection plan for a law firm + partner communication (2 parts)
6. **incident_response** — Lead the first 30 minutes of an IR
7. **drr_wrapup** — Post-incident improvement plan + board summary (2 parts)
8. **implementation_plan** — Phased CSF roadmap + metrics plan (2 parts)
9. **csf_capstone** — Comprehensive assessment + action plan + board pitch (3 parts)
10. **project_stakeholders** — Stakeholder identification exercise
11. **scope_wbs_reflection** — WBS review exercise
12. **ai_kpi_prompt** — AI prompt engineering for KPIs

### Scoring System
- **5 levels**: Novice (1) → Basic (2) → Competent (3) → Proficient (4) → Expert (5)
- Each module has a **SCORING DECISION TREE** for deterministic evaluation
- **Error handling**: Factual/conceptual errors cap scores at Level 3 maximum
- **Multi-part exercises**: Require Level 3+ to advance to the next part
- **Combined responses**: Later responses supersede earlier ones on overlapping topics

### Demo Shortcuts Panel
Testing aid with sample responses at each level:
- **SR1** (→ Level 3): Correct but partial
- **SR2** (1+2 → Level 4): Correct, covers all requirements
- **SR3** (1+2+3 → Level 5): Correct, comprehensive, exemplary depth
- **Erroneous Response**: Contains factual/conceptual errors (capped at Level 3)
