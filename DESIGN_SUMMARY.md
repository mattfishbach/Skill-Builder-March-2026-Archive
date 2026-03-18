# AI Learning Assistant - Skill Builder Design Summary

## Product Overview

The AI-powered Skill Builder is an interactive learning platform designed for LinkedIn Learning that provides learners with scenario-based practice exercises, AI-evaluated feedback, and measurable skill gains.

---

## Core Features

### 1. Three-Stage Learning Experience
- **Opening Stage**: Welcome screen with product introduction, feature highlights, and presenter credits
- **Demo Stage**: Interactive course view with Table of Contents, video content, and Skill Builder exercises
- **Wrap-Up Stage**: Summary screens with skill gain review and comparison data

### 2. Skill Builder Exercises
- Scenario-based practice questions aligned with video content
- AI-powered evaluation of learner responses using OpenAI GPT models
- Personalized feedback with comprehension scores (0-100%)
- Up to 3 attempts per module encouraging iterative improvement
- Goal-oriented prompts with preparation materials

### 3. Skill Gains Summary
- Visual representation of collective skill development
- Enterprise admin visibility for tracking team progress
- Integration with LinkedIn Learning ecosystem

---

## Visual Design

### Typography
- **Primary Font**: Outfit (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Color Palette
- **Primary Blue**: #0a66c2 (LinkedIn brand blue)
- **Success Green**: #057642
- **Background Gradient**: Custom dark gradient with blue/purple tones
- **Text**: White on dark backgrounds, gray-900 on light backgrounds
- **Callout Backgrounds**: Very dark gray (#1a1a1a) with 95% opacity

### UI Components
- Rounded corners (xl radius) for cards and buttons
- Shadow effects for depth and hierarchy
- Slide-in animations from right with staggered delays
- Yellow glow effects for emphasis on key CTAs

---

## Navigation & Interaction

### Keyboard Shortcuts
- **D**: Toggle opening/demo screens
- **T**: Toggle reference numbers (developer mode)
- **W**: Access wrap-up screen

### Course Sidebar (Table of Contents)
- Collapsible chapters with video and Skill Builder items
- Progress indicators (checkmarks for completed items)
- Visual distinction between video content and interactive exercises
- Skill Gain Summary section with green gradient styling

### Callout System
- Four informational callouts explaining Skill Builder features
- Animated slide-in from right side
- White callout boxes with arrow pointers to TOC items
- Blue/bold text highlights for AI production notes

---

## Content Structure

### Sample Course: "AI Project Management"
1. **Chapter 1: Getting Stakeholder Buy-In**
   - Video: Working with Stakeholders (6m 23s)
   - Skill Builder: Stakeholder Identification Practice

2. **Chapter 2: Scope and WBS**
   - Video: Defining Scope (5m 45s)
   - Skill Builder: Work Breakdown Structure Reflection

3. **Chapter 3: Prompt Engineering**
   - Video: Prompt Engineering (8m 45s)
   - Skill Builder: AI Prompt Practice

4. **Chapter 4: Final Advice**
   - Video: Final Advice (6m 15s)
   - Skill Gains Summary: Review Your Gains

---

## Technical Architecture

### Frontend
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS v4 with shadcn/ui components
- Framer Motion for animations
- Wouter for routing

### Backend
- Express.js with TypeScript
- PostgreSQL database via Drizzle ORM
- OpenAI API integration for AI feedback

### Key Design Patterns
- Session-based progress tracking (no auth required for demo)
- Shared schema between client/server for type safety
- Modular integration architecture

---

## AI Integration

### Feedback System
- Evaluates learner responses against ideal answers
- Provides qualitative feedback explaining strengths and areas for improvement
- Generates numerical comprehension scores
- Supports iterative learning with attempt tracking

### Production Notes (highlighted in callouts)
- PDF handouts auto-generated using AI production agents
- Skill Builders created in minutes using AI-assisted workflows
- Content derived from Adaptive Learning courses

---

## Target Users

### Learners
- Access practice exercises within course flow
- Receive immediate, personalized feedback
- Track skill development across modules

### L&D Administrators
- Monitor team skill gains
- Access enterprise reporting
- Integrate with existing LinkedIn Learning infrastructure

---

## Key Value Propositions

1. **In-the-Flow Learning**: Skill practice integrated directly into course experience
2. **AI-Powered Coaching**: Personalized feedback without instructor intervention
3. **Measurable Outcomes**: Quantified skill gains for learners and administrators
4. **Scalable Production**: AI-assisted content creation for rapid deployment

---

*Document generated: January 2026*
*Product: AI Learning Assistant - Skill Builder Demo*
*Platform: LinkedIn Learning*
