# AI Learning Assistant

## Overview

This is an AI-powered interactive learning platform that simulates a LinkedIn Learning-style course experience with "Skill Builder" exercises. The application provides learners with scenario-based practice questions, evaluates their responses using OpenAI's GPT models, and delivers personalized feedback with comprehension scores. The core learning loop allows up to 3 attempts per module, encouraging iterative improvement.

## User Preferences

Preferred communication style: Simple, everyday language.
Humor: Respond to jokes in prompts with reflected humor. Use emoticons and clever wordplay when appropriate. Keep it varied—one pun is funny, two in a row is overkill. Moderation and variety are key.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for UI transitions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a presentation-stage pattern with three main stages: intro, demo (course view), and conclusion. The SkillBuilderInline component handles the interactive learning flow with attempt tracking and AI feedback display.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Pattern**: RESTful endpoints under `/api/*`
- **Build**: esbuild for production bundling with selective dependency inlining

The server handles skill builder submissions, stores attempt history, and proxies AI requests through Replit's AI integrations.

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between client/server)
- **Key Tables**:
  - `users`: Basic authentication (id, username, password)
  - `attempts`: Skill builder responses (sessionId, moduleId, attemptNumber, score, feedback)
  - `conversations`/`messages`: Chat history for AI interactions

### AI Integration
- **Provider**: OpenAI API via Replit AI Integrations
- **Purpose**: Evaluates learner responses against ideal answers, provides qualitative feedback and scores
- **Scoring Logic**: AI evaluates ONLY the current (most recent) response as a standalone answer. All responses are still stored sequentially in the `attempts` table for future analysis of learning progression.
- **Configuration**: Environment variables `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Key Design Decisions

1. **Shared Schema Pattern**: Database schema lives in `shared/` directory, enabling type-safe data access on both client and server through Drizzle-Zod integration.

2. **Session-Based Attempts**: Learner progress is tracked by session ID (generated client-side) rather than requiring user authentication, simplifying the demo experience.

3. **Modular Replit Integrations**: AI features (chat, image generation, batch processing) are organized under `server/replit_integrations/` as plug-and-play modules.

4. **Static Asset Serving**: Production builds serve the Vite-compiled frontend from `dist/public`, with SPA fallback routing.

## External Dependencies

### AI Services
- **OpenAI API** (via Replit AI Integrations): Powers the skill builder feedback system and optional chat features
- Model used for feedback: GPT models accessible through Replit's proxy

### Database
- **PostgreSQL**: Required for persistence. Connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations stored in `/migrations`

### Third-Party Libraries
- **shadcn/ui**: Pre-built accessible React components (Radix UI primitives)
- **Framer Motion**: Animation library for smooth UI transitions
- **Zod**: Runtime validation for API requests and form data

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `AI_INTEGRATIONS_OPENAI_API_KEY`: API key for AI features
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: Replit AI proxy endpoint

### Skill Gains Summary (Dynamic)
- **Data Source**: Real attempt data fetched from `/api/attempts/session/:sessionId`
- **Skill Mapping**: Each of 9 CSF Skill Builders maps to 1-3 core skills with relative weights
- **Core Skills (6)**: CSF Framework Knowledge, Risk Analysis, Security Architecture, Incident Management, Strategic Planning, Executive Communication
- **Computation**: Weighted average of (best score × 20%) across contributing SBs per skill
- **SKILL_MAP constant**: Defined in `client/src/components/SkillGainSummary.tsx`
- **API**: `GET /api/attempts/session/:sessionId` returns best score per module

## Version History

### v1.0 HackDayFinalized (February 4, 2026)
**Commit**: `5578c5b0efaa7f3c6cd5b910cee47e6cc7e3882d`
**Rollback Point**: Use Replit's checkpoint system to restore to this version if needed.

Complete Skill Builder demo featuring:
- 3-stage presentation flow (Opening slides → Course demo → Wrap-up)
- 3 Skill Builder modules across 3 chapters
- AI-powered feedback with Socratic questioning
- Skill Gains Summary with visualizations
- Demo Shortcuts panel for testing
- Production Considerations wrap-up slides
- Published at: https://ai-learning-assistant-lindakovacs.replit.app