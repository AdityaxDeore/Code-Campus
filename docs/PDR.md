# CodeCampus — Product Design Review (PDR)

**Document Version:** 1.0  
**Date:** February 15, 2026  
**Authors:** CodeCampus Engineering Team  
**Status:** Draft — Pending Stakeholder Review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Goals](#3-product-vision--goals)
4. [Target Users & Personas](#4-target-users--personas)
5. [Feature Scope](#5-feature-scope)
6. [User Flows](#6-user-flows)
7. [Current State Assessment](#7-current-state-assessment)
8. [Gap Analysis & Risks](#8-gap-analysis--risks)
9. [Success Metrics](#9-success-metrics)
10. [Milestones & Timeline](#10-milestones--timeline)
11. [Open Questions](#11-open-questions)

---

## 1. Executive Summary

**CodeCampus** is a web-based educational coding platform engineered for university computer science programs. It combines a VS Code-style IDE, proctored testing, gamified achievement tracking, campus-wide discussion forums, and AI-assisted learning into a single integrated experience.

The platform's core thesis is that _collaborative, portfolio-driven learning in a university context outperforms the isolated, competitive model of existing platforms_ like LeetCode, HackerRank, or Codeforces.

**Current stage:** MVP frontend complete with client-side code execution. Backend integration (Firebase) is initialized but most data remains mocked in-memory.

---

## 2. Problem Statement

| Pain Point | Who Feels It | Current Workaround |
|---|---|---|
| Coding platforms are individual / competitive, not collaborative | Students | Use ad-hoc Discord/WhatsApp groups |
| No built-in academic integrity for online coding exams | Instructors | Manual invigilation or third-party proctoring |
| Assignments lack IDE-quality editing | Students | Download files, work locally, re-upload |
| No unified portfolio from coursework | Students | Manually maintain GitHub / portfolio site |
| LeetCode-style grind has no academic alignment | Students | Map problems to syllabus manually |
| Universities lack branded coding platforms | Administrators | Pay for enterprise LMS licenses |

---

## 3. Product Vision & Goals

### Vision
> Transform how universities teach and assess programming — by replacing disconnected tools with a single, student-centric, integrity-aware learning platform.

### Goals (6-month horizon)

| # | Goal | Measurable Target |
|---|---|---|
| G1 | Launch V1 with real backend at 1 pilot university | ≥ 200 active students |
| G2 | Full assignment lifecycle (create → submit → grade) | End-to-end flow tested |
| G3 | Proctored exam capability used for at least 1 real exam | Zero integrity incidents |
| G4 | Student engagement via gamification | ≥ 60% monthly active retention |
| G5 | Code execution in ≥ 4 languages on server | Python, JS, Java, C++ |

---

## 4. Target Users & Personas

### Persona 1 — **Aanya (CS Sophomore)**
- **Needs:** Practice DSA, track progress, build portfolio
- **Pain:** Juggles LeetCode, VS Code, Google Drive, Classroom
- **Success:** One place to practice, submit assignments, see leaderboard

### Persona 2 — **Prof. Sharma (Instructor)**
- **Needs:** Assign problems, detect plagiarism, proctor exams
- **Pain:** Students copy from Stack Overflow; manual proctoring is exhausting
- **Success:** Dashboard showing paste events, tab-switch violations, auto-grading

### Persona 3 — **Ravi (Teaching Assistant)**
- **Needs:** Review submissions, answer questions, manage leaderboard
- **Pain:** Repeating answers on WhatsApp groups
- **Success:** Campus forum with searchable Q&A, submission review queue

### Persona 4 — **Dean of CS (Administrator)**
- **Needs:** University-branded platform, usage analytics, cost control
- **Pain:** Per-seat licensing for Coursera/HackerRank is expensive
- **Success:** White-label deployment with university SSO

---

## 5. Feature Scope

### 5.1 Core Modules

| Module | Status | Priority | Description |
|---|---|---|---|
| **Problem Workspace** | ✅ UI Complete | P0 | Monaco-based IDE with test-case validation |
| **Assignment Workspace** | ✅ UI Complete | P0 | Multi-file editor with paste detection + AI chat |
| **Proctored Test** | ✅ UI Complete | P0 | Fullscreen lock, tab-switch detection, auto-submit |
| **Student Dashboard** | ✅ UI Complete | P0 | Stats, deadlines, quick actions |
| **Problems Catalog** | ✅ UI Complete | P1 | Filterable problem listing (difficulty, topic, company) |
| **Achievement Center** | ✅ UI Complete | P1 | Leaderboards, badges, XP, Hall of Fame |
| **Campus Forums** | ✅ UI Complete | P1 | Discussion threads with code sharing |
| **Learning Pathways** | ✅ UI Complete | P2 | Structured learning tracks with prerequisites |
| **Project Showcase** | 🔲 Planned | P2 | Portfolio builder from coursework |
| **Instructor Dashboard** | 🔲 Planned | P1 | Assignment creation, integrity reports, grading |

### 5.2 Cross-Cutting Concerns

| Concern | Status | Notes |
|---|---|---|
| Authentication (Firebase) | ⚙️ Initialized | Google, GitHub, email providers configured |
| Dark Mode | ✅ Complete | React Context-based toggle |
| Responsive Design | ✅ Complete | Mobile-first Tailwind layout |
| Route Protection | ✅ Complete | `ProtectedRoute` wrapper on all authenticated pages |
| Code Splitting | ✅ Complete | Lazy loading + manual vendor chunks |
| Analytics | ⚙️ Initialized | Firebase Analytics wired, events defined |
| Error Boundaries | ✅ Complete | Graceful error recovery UI |

### 5.3 Code Execution Engine

| Language | Current Status | Production Plan |
|---|---|---|
| JavaScript | ✅ Sandboxed `new Function()` | Keep client-side + optional server |
| Python | ⚠️ Print-statement simulation | Judge0 / Piston API |
| SQL | ⚠️ Statement-type recognition | sql.js (WASM) or server-side |
| Java | 🔲 Not implemented | Judge0 / Piston API |
| C++ | 🔲 Not implemented | Judge0 / Piston API |

---

## 6. User Flows

### 6.1 Student: Solve a Problem

```
Homepage → Login → Student Dashboard → Problems Catalog
  → Select problem → Problem Workspace (Monaco IDE)
  → Write code → Run (test against sample cases)
  → Submit → Validate all test cases
  → See results → XP awarded → Leaderboard updated
  → View in Problem History
```

### 6.2 Student: Complete an Assignment

```
Student Dashboard → Assignments list → Select assignment
  → Assignment Workspace (multi-file IDE)
  → Browse file tree → Edit code → Run in terminal
  → Use AI assistant for hints
  → Auto-save in progress
  → Submit before deadline
  (Paste events logged in background)
```

### 6.3 Student: Take a Proctored Test

```
Student Dashboard → Test page → Accept terms
  → Enter fullscreen → Timer starts
  → Navigate questions → Write answers / code
  → Mark for review / skip
  (Tab switch → warning counter incremented)
  (Exit fullscreen → warning counter incremented)
  (3 warnings → auto-submit)
  → Manual submit OR timer expires → auto-submit
  → Results shown
```

### 6.4 Instructor: Create & Monitor Assignment *(Planned)*

```
Instructor Dashboard → Create Assignment
  → Define files, test cases, rubric, deadline
  → Publish to class
  → Monitor submissions in real-time
  → View paste events, time logs
  → Auto-grade + manual review → Publish grades
```

---

## 7. Current State Assessment

### What's Working
- **Complete UI/UX** across 14+ pages with dark mode, responsive design
- **Monaco Editor integration** with syntax highlighting for 7+ languages
- **Client-side JS execution** with console capture and error handling
- **Academic integrity UI**: paste detection, fullscreen enforcement, tab monitoring
- **Firebase initialized**: auth, firestore, analytics, storage SDKs wired
- **Performance optimizations**: lazy loading, vendor chunking, code splitting
- **Comprehensive component library**: Button, Input, Select, Header, StyledCard, etc.

### What's Missing
- **No real backend data persistence** — all problems, assignments, users are hardcoded
- **No server-side code execution** — Python/SQL are simulated, Java/C++ unsupported
- **No instructor-facing interface** — can't create assignments, view integrity reports
- **No real-time collaboration** — planned for V2
- **No plagiarism detection engine** — MOSS integration planned
- **No CI/CD pipeline** — no automated tests, no deployment automation
- **Firebase security rules** — not deployed to production

---

## 8. Gap Analysis & Risks

### Technical Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Client-side code execution is insecure / limited | High | Migrate to Judge0/Piston for production |
| Firebase API key exposed in source | High | Move to server-side proxy, use App Check |
| No automated testing | Medium | Add Vitest + React Testing Library |
| Monaco Editor bundle is large (~2MB) | Medium | Already chunked; consider dynamic import |
| Paste detection is trivially byppassable | Medium | Add plagiarism engine (MOSS) as second layer |
| All data is mocked — migration to real data model needed | High | Define Firestore schema early, seed data |

### Product Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Students resist yet another platform | High | University mandate + genuinely better UX |
| Instructors unwilling to create content | High | Provide problem bank + import from LeetCode |
| Proctoring perceived as surveillance | Medium | Transparent policy + minimal data collection |
| Feature creep delays V1 launch | Medium | Strict P0/P1/P2 prioritization |

---

## 9. Success Metrics

### North Star Metric
**Weekly Active Coders (WAC):** Number of unique students who write and run code per week.

### Supporting Metrics

| Metric | Target (V1) | Measurement |
|---|---|---|
| WAC | 150+ at pilot university | Firebase Analytics |
| Avg. session duration | > 20 min | Analytics |
| Problems solved / student / week | ≥ 3 | Firestore aggregation |
| Assignment on-time submission rate | ≥ 85% | Submission timestamps |
| Test integrity violation rate | < 5% | Proctoring event logs |
| Forum posts / week | ≥ 50 | Firestore count |
| NPS (Net Promoter Score) | ≥ 40 | In-app survey |

---

## 10. Milestones & Timeline

| Milestone | Target Date | Key Deliverables |
|---|---|---|
| **V1.0 — Foundation** | Mar 2026 | Firebase schema deployed, security rules, env configs, CI/CD |
| **V1.1 — Auth + Profiles** | Apr 2026 | Google/Azure AD OAuth, university domain enforcement, profile pages |
| **V1.2 — Workspaces + Persistence** | May 2026 | CRUD workspaces, auto-save to Firestore, file versioning |
| **V1.3 — Problems + Execution** | Jun 2026 | Server-side code execution (Judge0), submission storage, rate limiting |
| **V1.4 — Forums + Notifications** | Jul 2026 | Real-time forum threads, reactions, in-app notifications |
| **V1.5 — Leaderboards + Analytics** | Aug 2026 | Per-college aggregates, weekly snapshots, instructor dashboard |
| **V2.0 — Real-time Collaboration** | Q4 2026 | Yjs CRDT sync, presence cursors, pair programming |
| **V3.0 — Sandbox Runner** | Q1 2027 | Containerized execution, memory/time quotas, self-host option |

---

## 11. Open Questions

| # | Question | Owner | Due |
|---|---|---|---|
| OQ-1 | Which university will be the pilot? What SSO provider do they use? | Product | Mar 2026 |
| OQ-2 | Judge0 cloud vs. self-hosted Piston — cost/latency tradeoff? | Engineering | Mar 2026 |
| OQ-3 | Should the instructor dashboard be a separate app or same SPA? | Engineering | Mar 2026 |
| OQ-4 | How do we import existing problem banks (LeetCode, Codeforces)? | Product | Apr 2026 |
| OQ-5 | GDPR / data residency requirements for student data? | Legal | Mar 2026 |
| OQ-6 | Pricing model — per-university license, per-seat, or freemium? | Business | Apr 2026 |
| OQ-7 | Mobile app (React Native) — when is it needed vs. responsive web? | Product | Q3 2026 |

---

## Appendix A — Competitive Landscape

| Platform | Strengths | Weaknesses vs. CodeCampus |
|---|---|---|
| **LeetCode** | Massive problem bank, company tags | No collaboration, no academic features, no proctoring |
| **HackerRank** | Enterprise hiring tools | Expensive per-seat, no portfolio, generic |
| **Replit** | Cloud IDE, multiplayer | Not academia-focused, no integrity tools |
| **CodeSignal** | Assessment-focused | No IDE workspace, limited learning paths |
| **Moodle/Canvas** | University LMS standards | No code editor, no execution, terrible UX |
| **GitHub Classroom** | Git-based assignments | High learning curve, no IDE, no gamification |

---

## Appendix B — Tech Stack Summary

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 18 | UI rendering with hooks, Suspense, lazy loading |
| Build Tool | Vite 5 | Dev server, HMR, optimized production builds |
| Styling | TailwindCSS 3.4 | Utility-first CSS with dark-mode support |
| Code Editor | Monaco Editor | VS Code-grade editing experience |
| Animation | Framer Motion | Page transitions, micro-interactions |
| Icons | Lucide React | Consistent icon set |
| Auth & DB | Firebase (Auth, Firestore, Storage, Analytics) | Backend-as-a-service |
| Charts | Recharts + D3 | Data visualization in dashboards |
| Forms | React Hook Form | Form state and validation |
| State | Redux Toolkit + React Context | Global state management |
| Routing | React Router v6 | Client-side SPA routing |
| HTTP | Axios | API communication (future) |

---

*End of PDR — Review scheduled for [TBD]*
