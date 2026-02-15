# CodeCampus — Software Design Document (SDD)

**Document Version:** 1.0  
**Date:** February 15, 2026  
**Authors:** CodeCampus Engineering Team  
**Status:** Draft

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Architecture](#2-system-architecture)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Data Architecture](#4-data-architecture)
5. [Module Design](#5-module-design)
6. [Code Execution Engine](#6-code-execution-engine)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Academic Integrity System](#8-academic-integrity-system)
9. [AI Assistant Design](#9-ai-assistant-design)
10. [Performance & Optimization](#10-performance--optimization)
11. [Security Considerations](#11-security-considerations)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Testing Strategy](#13-testing-strategy)
14. [API Contracts](#14-api-contracts)
15. [Future Architecture](#15-future-architecture)

---

## 1. Introduction

### 1.1 Purpose

This document describes the technical design of CodeCampus — a university-oriented coding education platform. It covers the current architecture (frontend-heavy MVP) and the target production architecture with server-side execution and real data persistence.

### 1.2 Scope

Covers all client-side modules, Firebase integration, code execution strategy, data models, security posture, and deployment topology.

### 1.3 Conventions

- **[CURRENT]** — Describes the system as built today
- **[TARGET]** — Describes the planned production state
- P0 / P1 / P2 — Priority classification (P0 = must-have for launch)

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                          │
│                                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐  ┌───────────────┐  │
│  │  React   │  │ Monaco Editor│  │  Framer   │  │  TailwindCSS  │  │
│  │  Router  │  │  (Code IDE)  │  │  Motion   │  │  (Styling)    │  │
│  └────┬─────┘  └──────┬───────┘  └─────┬─────┘  └───────────────┘  │
│       │               │                │                             │
│  ┌────▼───────────────▼────────────────▼──────────────────────────┐  │
│  │                    React 18 Component Tree                     │  │
│  │  App → DarkModeProvider → BrowserRouter → Routes → Pages      │  │
│  └────────────────────────────┬───────────────────────────────────┘  │
│                               │                                      │
│  ┌────────────────────────────▼───────────────────────────────────┐  │
│  │                    State Management Layer                      │  │
│  │  React Context (DarkMode, Auth) │ Redux Toolkit (future)      │  │
│  └────────────────────────────┬───────────────────────────────────┘  │
│                               │                                      │
│  ┌────────────────────────────▼───────────────────────────────────┐  │
│  │              Client-Side Code Execution Engine                 │  │
│  │  JS: new Function()  │  Python: Pattern Sim  │  SQL: Parser   │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │ HTTPS
                    ┌──────────────▼──────────────┐
                    │       Firebase Platform      │
                    │                              │
                    │  ┌──────┐ ┌──────────────┐  │
                    │  │ Auth │ │  Firestore    │  │
                    │  └──────┘ └──────────────┘  │
                    │  ┌──────┐ ┌──────────────┐  │
                    │  │Store │ │  Analytics   │  │
                    │  └──────┘ └──────────────┘  │
                    └──────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐  [TARGET]
                    │   Code Execution Service     │
                    │   (Judge0 / Piston API)       │
                    │   Python, Java, C++, SQL      │
                    └──────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| UI Framework | React | 18.2 | Hooks, Suspense, concurrent features |
| Build | Vite | 5.x | Fast HMR, ESM-native, optimized builds |
| Styling | TailwindCSS | 3.4 | Utility-first, dark mode, responsive |
| Code Editor | Monaco Editor | 4.7 | VS Code engine — industry standard |
| Routing | React Router | 6.x | Nested routes, lazy loading support |
| Animation | Framer Motion | 10.x | Declarative animations, page transitions |
| Backend | Firebase | 12.x | Auth, Firestore, Storage, Analytics |
| Charts | Recharts + D3 | Latest | Dashboard visualizations |
| Forms | React Hook Form | 7.x | Performant form handling |
| State | Context API + Redux Toolkit | Latest | Local + global state |
| HTTP Client | Axios | 1.x | Future API calls |
| Icons | Lucide React | Latest | Tree-shakeable icon library |

---

## 3. Frontend Architecture

### 3.1 Component Hierarchy

```
<App>
└── <DarkModeProvider>                    // Theme context
    └── <BrowserRouter>
        └── <ErrorBoundary>               // Top-level error catch
            └── <ScrollToTop />
            └── <Routes>
                ├── "/" → <Homepage />              // Public
                ├── "/login" → <Login />            // Public
                ├── "/about-code-campus" → Lazy     // Public
                ├── "/status" → Lazy                // Public
                │
                │── "/student-dashboard"            // 🔒 Protected
                │── "/problems"                     // 🔒 Protected
                │── "/problem-workspace?id=N"       // 🔒 Protected
                │── "/problem-history"              // 🔒 Protected
                │── "/assignments"                  // 🔒 Protected
                │── "/assignment-workspace?id=X"    // 🔒 Protected
                │── "/test"                         // 🔒 Protected
                │── "/achievement-center"           // 🔒 Protected
                │── "/campus-forums"                // 🔒 Protected
                │── "/learning-pathways"            // 🔒 Protected
                │── "/projects"                     // 🔒 Protected
                │── "/goals-homework"               // 🔒 Protected
                └── "*" → <NotFound />
```

### 3.2 Component Categories

#### Shared UI Components (`src/components/ui/`)

| Component | API | Purpose |
|---|---|---|
| `Button` | `variant`, `size`, `disabled`, `onClick` | Primary action component with CVA variants |
| `Input` | `type`, `placeholder`, `value`, `onChange` | Form input with consistent styling |
| `Select` | `options`, `value`, `onChange` | Dropdown selection |
| `Header` | `user`, `onLogout` | Navigation bar with auth-aware menu |
| `Checkbox` | `checked`, `onChange`, `label` | Toggle input |
| `DarkModeToggle` | — | Theme switcher button |
| `StyledCard` | `title`, `icon`, `gradient` | Feature card with hover effects |

#### App-Level Components (`src/components/`)

| Component | Purpose |
|---|---|
| `AppIcon` | Wrapper for Lucide icons with consistent sizing |
| `AppImage` | Image component with loading states |
| `ProtectedRoute` | Auth guard — redirects to `/login` if unauthenticated |
| `ErrorBoundary` | Catches React rendering errors, shows fallback UI |
| `Loading` | Suspense fallback — spinner/skeleton while chunks load |
| `ScrollToTop` | Scrolls to top on route change |

#### Shared Marketing Components (`src/shared/components/`)

| Component | Data Source | Used On |
|---|---|---|
| `HeroSection` | `heroData.js` | Homepage |
| `StatsSection` | Hardcoded | Homepage, About |
| `TestimonialSection` | `testimonialData.js` | Homepage |
| `UniversityPartnerships` | `universityData.js` | Homepage |
| `ValueProposition` | Hardcoded | Homepage |
| `TeamSection` | Hardcoded | About |
| `ActivityFeed` | Hardcoded | Homepage |

### 3.3 State Management Strategy

```
┌───────────────────────────────────────────────────┐
│              State Management Layers               │
├───────────────────────────────────────────────────┤
│                                                    │
│  Layer 1: React Context (Global UI State)          │
│  ┌─────────────────────┐  ┌────────────────────┐  │
│  │  DarkModeContext     │  │  AuthContext        │  │
│  │  - isDarkMode        │  │  - user             │  │
│  │  - toggleDarkMode()  │  │  - isAuthenticated  │  │
│  └─────────────────────┘  │  - loading           │  │
│                            └────────────────────┘  │
│                                                    │
│  Layer 2: Component-Local State (useState)         │
│  - Form inputs, modals, selected tabs             │
│  - Problem workspace: active language, test cases  │
│  - Assignment workspace: file tree, terminal       │
│  - Test page: answers, timer, warnings             │
│                                                    │
│  Layer 3: Redux Toolkit [TARGET - Not Active]      │
│  - Server-synced data caching                      │
│  - Cross-page state (submission history, etc.)     │
│                                                    │
│  Layer 4: URL State (Query Parameters)             │
│  - /problem-workspace?id=1                         │
│  - /assignment-workspace?id=a1                     │
│                                                    │
└───────────────────────────────────────────────────┘
```

### 3.4 Routing Design

| Route | Component | Auth | Load Strategy |
|---|---|---|---|
| `/` | Homepage | Public | Eager |
| `/login` | Login | Public | Eager |
| `/about-code-campus` | AboutCodeCampus | Public | Lazy |
| `/status` | StatusPage | Public | Lazy |
| `/student-dashboard` | StudentDashboard | Protected | Lazy |
| `/problems` | Problems | Protected | Lazy |
| `/problem-workspace` | ProblemWorkspace | Protected | Lazy |
| `/problem-history` | ProblemHistory | Protected | Lazy |
| `/assignments` | Assignments | Protected | Lazy |
| `/assignment-workspace` | AssignmentWorkspace | Protected | Lazy |
| `/test` | TestPage | Protected | Lazy |
| `/achievement-center` | AchievementCenter | Protected | Lazy |
| `/campus-forums` | CampusForums | Protected | Lazy |
| `/learning-pathways` | LearningPathways | Protected | Lazy |
| `/projects` | Projects | Protected | Lazy |
| `/goals-homework` | GoalsHomework | Protected | Lazy |
| `*` | NotFound | Public | Eager |

---

## 4. Data Architecture

### 4.1 Firestore Collection Schema

#### `users`
```json
{
  "uid": "string (Firebase Auth UID)",
  "email": "string",
  "displayName": "string",
  "photoURL": "string | null",
  "university": "string",
  "role": "student | instructor | admin",
  "xp": "number",
  "problemsSolved": "number",
  "streak": "number",
  "badges": ["string"],
  "createdAt": "timestamp",
  "lastActive": "timestamp"
}
```

#### `problems`
```json
{
  "id": "string",
  "title": "string",
  "difficulty": "Easy | Medium | Hard",
  "category": "DSA | Debugging | NPTEL | System Design",
  "tags": ["Arrays", "Strings", "Trees", "..."],
  "companyTags": ["Google", "Amazon", "..."],
  "description": "string (markdown)",
  "constraints": ["string"],
  "examples": [
    {
      "input": "string",
      "output": "string",
      "explanation": "string"
    }
  ],
  "testCases": [
    {
      "input": "string",
      "expectedOutput": "string",
      "isHidden": "boolean"
    }
  ],
  "hints": ["string"],
  "starterCode": {
    "javascript": "string",
    "python": "string",
    "java": "string",
    "cpp": "string"
  },
  "successRate": "number (0-100)",
  "totalSubmissions": "number",
  "createdBy": "string (user UID)",
  "createdAt": "timestamp"
}
```

#### `submissions`
```json
{
  "id": "string",
  "userId": "string (user UID)",
  "problemId": "string",
  "language": "string",
  "code": "string",
  "result": "Accepted | Wrong Answer | TLE | RTE | CE",
  "runtime": "number (ms)",
  "memory": "number (KB)",
  "testCasesPassed": "number",
  "totalTestCases": "number",
  "submittedAt": "timestamp"
}
```

#### `assignments`
```json
{
  "id": "string",
  "title": "string",
  "subject": "DSA | DBMS | Web Dev | OOP | Algorithms",
  "description": "string (markdown)",
  "deadline": "timestamp",
  "createdBy": "string (instructor UID)",
  "university": "string",
  "files": [
    {
      "name": "string",
      "path": "string",
      "language": "string",
      "content": "string",
      "isReadOnly": "boolean"
    }
  ],
  "testCases": ["..."],
  "maxScore": "number",
  "createdAt": "timestamp"
}
```

#### `assignmentSubmissions`
```json
{
  "id": "string",
  "assignmentId": "string",
  "userId": "string",
  "files": [
    {
      "path": "string",
      "content": "string",
      "lastModified": "timestamp"
    }
  ],
  "pasteEvents": [
    {
      "timestamp": "iso-string",
      "wordCount": "number",
      "file": "string"
    }
  ],
  "score": "number | null",
  "status": "in-progress | submitted | graded",
  "submittedAt": "timestamp | null"
}
```

#### `posts` (Campus Forums)
```json
{
  "id": "string",
  "title": "string",
  "content": "string (markdown)",
  "author": "string (user UID)",
  "authorName": "string",
  "authorAvatar": "string",
  "isVerified": "boolean",
  "category": "general | technical-help | project-showcase | announcements",
  "tags": ["string"],
  "upvotes": "number",
  "downvotes": "number",
  "commentCount": "number",
  "codeSnippet": "string | null",
  "codeLanguage": "string | null",
  "createdAt": "timestamp"
}
```

#### `testSessions`
```json
{
  "id": "string",
  "userId": "string",
  "testId": "string",
  "answers": {
    "questionId": "selectedOption | codeString"
  },
  "markedForReview": ["questionId"],
  "tabSwitchCount": "number",
  "fullscreenWarnings": "number",
  "pasteEvents": "number",
  "startedAt": "timestamp",
  "submittedAt": "timestamp",
  "autoSubmitted": "boolean",
  "autoSubmitReason": "timer | tab_switches | fullscreen | null"
}
```

#### `achievements`
```json
{
  "userId": "string",
  "badges": [
    {
      "id": "string",
      "name": "string",
      "category": "milestone | mastery | social | career",
      "rarity": "common | uncommon | rare | epic | legendary",
      "earnedAt": "timestamp"
    }
  ],
  "xpHistory": [
    {
      "amount": "number",
      "reason": "string",
      "timestamp": "timestamp"
    }
  ],
  "streakDays": "number",
  "longestStreak": "number"
}
```

### 4.2 Firestore Index Requirements

| Collection | Fields | Query Pattern |
|---|---|---|
| `problems` | `difficulty`, `category` | Filter problems list |
| `problems` | `tags` (array-contains) | Filter by topic |
| `submissions` | `userId`, `submittedAt` DESC | User's submission history |
| `submissions` | `problemId`, `result` | Problem statistics |
| `posts` | `category`, `createdAt` DESC | Forum feed |
| `assignmentSubmissions` | `assignmentId`, `userId` | Lookup student submission |

### 4.3 Data Flow Diagram

```
         ┌─────────────┐
         │   Student    │
         └──────┬───────┘
                │ Writes code, submits
                ▼
    ┌───────────────────────┐
    │  React Component      │
    │  (ProblemWorkspace)    │
    └───────┬───────────────┘
            │
    ┌───────▼────────────────┐     ┌─────────────────────┐
    │ [CURRENT]              │     │ [TARGET]             │
    │ Client-Side Execution  │     │ Server-Side via      │
    │ - JS: new Function()   │────▶│ Judge0/Piston API    │
    │ - Python: Pattern sim  │     │ - Real execution     │
    │ - SQL: Statement parse │     │ - Time/memory limits │
    └───────┬────────────────┘     └──────────┬──────────┘
            │ Result                          │ Result
            ▼                                 ▼
    ┌───────────────────────┐     ┌─────────────────────┐
    │ [CURRENT]              │     │ [TARGET]             │
    │ Display in UI          │     │ Store in Firestore   │
    │ (ephemeral, lost on    │     │ submissions/{id}     │
    │  page refresh)         │     │ + Update XP/badges   │
    └────────────────────────┘     └─────────────────────┘
```

---

## 5. Module Design

### 5.1 Problem Workspace Module

**Location:** `src/pages/problem-workspace/`

**Components:**
| Component | Responsibility |
|---|---|
| `index.jsx` | Main orchestrator — problem data, tabs, layout |
| `CodeEditor.jsx` | Monaco Editor wrapper — language config, themes |
| `ProblemPanel.jsx` | Problem description, examples, constraints, hints |
| `TestResults.jsx` | Test case pass/fail display with details |
| `SubmissionHistory.jsx` | Past submissions with runtime/memory stats |
| `CollaborativeMode.jsx` | Pair programming UI (planned) |
| `SuccessAnimation.jsx` | Confetti/celebration on accepted submission |

**Internal State:**
```javascript
{
  selectedProblem: Object,       // From problemsDatabase or Firestore
  language: "javascript",        // Selected programming language
  code: "string",               // Current editor content
  activeTab: "description",      // description | solutions | discussion | submissions
  testResults: [],              // Array of { passed, input, expected, actual }
  isRunning: boolean,           // Loading state during execution
  showHints: boolean,           // Hint panel visibility
  submissionHistory: [],        // Past submissions for this problem
}
```

### 5.2 Assignment Workspace Module

**Location:** `src/pages/assignment-workspace/`

**Internal Architecture:**
```
┌──────────────────────────────────────────────────────────┐
│                Assignment Workspace Layout                │
│                                                          │
│  ┌────────┐  ┌────────────────┐  ┌────────────────────┐ │
│  │Activity│  │  File Explorer  │  │   Editor Tabs      │ │
│  │  Bar   │  │  (Tree View)    │  │   ┌─────────────┐  │ │
│  │        │  │  src/           │  │   │ Monaco Editor│  │ │
│  │  📁   │  │  ├── main.py   │  │   │             │  │ │
│  │  🔍   │  │  ├── utils.py  │  │   │             │  │ │
│  │  🤖   │  │  tests/        │  │   └─────────────┘  │ │
│  │        │  │  └── test.py   │  │                     │ │
│  │        │  │  README.md     │  │   ┌─────────────┐  │ │
│  │        │  │                │  │   │  Terminal    │  │ │
│  │        │  │                │  │   │  $ python    │  │ │
│  │        │  │                │  │   │    main.py   │  │ │
│  └────────┘  └────────────────┘  │   └─────────────┘  │ │
│                                   └────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Status Bar: Language | Line:Col | Assignment Info   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────┐  (Slide-over panel)               │
│  │  AI Chat Panel   │                                    │
│  │  > How do I...?  │                                    │
│  │  🤖 Try using... │                                    │
│  └──────────────────┘                                    │
└──────────────────────────────────────────────────────────┘
```

**Key Behaviors:**
- **Paste Detection:** Listens to `document.paste` event; flags pastes > 10 words
- **Auto-Save:** Saves editor content to state on `onChange` (future: debounced Firestore write)
- **Code Execution:** Routes to language-specific handler (JS: real, Python/SQL: simulated)
- **AI Assistant:** Returns randomized hint-based responses (future: LLM API call)

### 5.3 Proctored Test Module

**Location:** `src/pages/test/`

**State Machine:**
```
                    ┌──────────┐
                    │  IDLE    │
                    └────┬─────┘
                         │ User clicks "Start Test"
                         ▼
                    ┌──────────┐
                    │  ACTIVE  │◄───── User answers questions
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        ┌──────────┐ ┌────────┐ ┌──────────┐
        │Tab Switch│ │Fullscr │ │  Timer   │
        │ Warning  │ │Exit    │ │ Expired  │
        │(count≥3) │ │(cnt≥3) │ │          │
        └────┬─────┘ └───┬────┘ └────┬─────┘
             │           │           │
             ▼           ▼           ▼
        ┌─────────────────────────────────┐
        │         AUTO-SUBMIT             │
        └─────────────────────────────────┘
                         │
                         ▼
                    ┌──────────┐
                    │SUBMITTED │
                    └──────────┘
```

**Integrity Event Tracking:**
```javascript
{
  tabSwitchCount: number,          // Incremented on visibilitychange
  fullscreenWarnings: number,      // Incremented on fullscreenchange
  copyPasteEvents: number,         // Incremented on paste
  autoSubmitReason: string | null, // "tab_switches" | "fullscreen" | "timer"
}
```

### 5.4 Achievement Center Module

**Location:** `src/pages/achievement-center/`

**Components:**
| Component | Purpose |
|---|---|
| `AchievementProfile.jsx` | User stats, XP, badges grid with rarity colors |
| `LeaderboardTable.jsx` | Sortable table with rank, user, score, change |
| `LeaderboardTabs.jsx` | Tab switcher: Problem Solvers / Collaborators / Contributors |
| `GameficationElements.jsx` | XP bar, streak tracker, topic mastery radar |
| `HallOfFame.jsx` | Top 3 showcase with medals |

**XP System Design:**
| Action | XP Reward |
|---|---|
| Solve Easy problem | +25 XP |
| Solve Medium problem | +50 XP |
| Solve Hard problem | +100 XP |
| Submit assignment on time | +30 XP |
| Help in forums (upvoted answer) | +10 XP |
| Complete learning path milestone | +50 XP |
| Maintain 7-day streak | +75 XP bonus |
| First accepted submission of the day | +5 XP |

**Badge Rarity Tiers:**
```
Common     → Gray    (e.g., First Steps, Hello World)
Uncommon   → Green   (e.g., 10 Problems Solved)
Rare       → Blue    (e.g., 7-Day Streak)
Epic       → Purple  (e.g., 100 Problems, Project Innovator)
Legendary  → Gold    (e.g., All Topics Mastered, Top 1%)
```

### 5.5 Campus Forums Module

**Location:** `src/pages/campus-forums/`

**Components:**
| Component | Purpose |
|---|---|
| `ForumHeader.jsx` | Category tabs, search, sort options |
| `ForumFeed.jsx` | Scrollable list of posts |
| `ForumPost.jsx` | Individual post card with votes, code snippet |
| `ForumSidebar.jsx` | Trending topics, top contributors, guidelines |
| `CreatePostModal.jsx` | New post form with markdown + code support |

---

## 6. Code Execution Engine

### 6.1 Current Implementation (Client-Side)

```
┌───────────────────────────────────────────────────┐
│               Code Execution Router               │
│                                                   │
│  Input: { code: string, language: string }        │
│                                                   │
│  ┌─────────┐   ┌──────────┐   ┌──────────────┐  │
│  │   JS    │   │  Python  │   │    SQL       │  │
│  │ Engine  │   │ Simulator│   │  Simulator   │  │
│  └────┬────┘   └────┬─────┘   └──────┬───────┘  │
│       │             │                │           │
│  Sandboxed     Pattern-match    Statement       │
│  Function()    print() calls    recognition     │
│  + console     + TODO detect    SELECT/CREATE/  │
│    capture     + error match    INSERT/ALTER    │
│                                                   │
│  Output: { ok: boolean, out: string }             │
└───────────────────────────────────────────────────┘
```

**JavaScript Engine:**
```javascript
const executeJavaScript = (code) => {
  const logs = [];
  const mockConsole = {
    log: (...args) => logs.push(args.map(a =>
      typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
    ).join(' ')),
    error: (...args) => logs.push('Error: ' + args.join(' ')),
    warn: (...args) => logs.push('Warning: ' + args.join(' ')),
    info: (...args) => logs.push('Info: ' + args.join(' '))
  };

  try {
    const fn = new Function('console', code);
    fn(mockConsole);
    return { ok: true, out: logs.join('\n') || 'Program executed. No output.' };
  } catch (e) {
    return { ok: false, out: `${e.name}: ${e.message}` };
  }
};
```

**Limitations:**
- JS: No DOM access, no async/await, no imports
- Python: Only recognizes `print()` with string literals
- SQL: No actual query execution, just statement classification
- No time/memory limits
- No multi-file execution

### 6.2 Target Implementation (Server-Side)

```
┌────────┐     ┌──────────────┐     ┌───────────────────┐
│ Client │────▶│ Firebase     │────▶│ Code Runner       │
│        │     │ Cloud        │     │ (Judge0 / Piston) │
│        │     │ Function     │     │                   │
│        │◀────│              │◀────│ Sandboxed Docker  │
│ Result │     │ Rate Limit   │     │ Container         │
│        │     │ + Auth Check │     │ - Time limit: 5s  │
└────────┘     └──────────────┘     │ - Memory: 256MB   │
                                     │ - No network      │
                                     └───────────────────┘
```

**API Contract:**
```
POST /api/execute
Authorization: Bearer <firebase-token>

Request:
{
  "language": "python",
  "code": "print('hello')",
  "stdin": "optional input",
  "timeLimit": 5000,
  "memoryLimit": 262144
}

Response:
{
  "stdout": "hello\n",
  "stderr": "",
  "exitCode": 0,
  "time": 0.042,
  "memory": 8192,
  "status": "Accepted"
}
```

---

## 7. Authentication & Authorization

### 7.1 Auth Flow

```
┌─────────┐    ┌───────────┐    ┌──────────────┐    ┌────────────┐
│  User   │───▶│  Login    │───▶│  Firebase    │───▶│  Auth      │
│  clicks │    │  Page     │    │  Auth SDK    │    │  Provider  │
│  login  │    │           │    │              │    │  (Google/  │
│         │    │  Email +  │    │  signIn()    │    │   GitHub/  │
│         │    │  Password │    │              │    │   Email)   │
└─────────┘    │  Google   │    │  onAuthState │    └────────────┘
               │  GitHub   │    │  Changed()   │
               └───────────┘    └──────┬───────┘
                                       │
                                       ▼
                                ┌──────────────┐
                                │  useAuth()   │
                                │  Hook        │
                                │              │
                                │  user: {...} │
                                │  loading     │
                                │  isAuth      │
                                └──────┬───────┘
                                       │
                                       ▼
                                ┌──────────────┐
                                │ Protected    │
                                │ Route        │
                                │              │
                                │ isAuth?      │
                                │ ├─ Yes → Page│
                                │ └─ No → /login
                                └──────────────┘
```

### 7.2 Authorization Matrix [TARGET]

| Resource | Student | Instructor | Admin |
|---|---|---|---|
| View problems | ✅ | ✅ | ✅ |
| Submit solutions | ✅ | ✅ | ✅ |
| Create problems | ❌ | ✅ | ✅ |
| View assignments | ✅ (own class) | ✅ (own class) | ✅ |
| Create assignments | ❌ | ✅ | ✅ |
| View integrity reports | ❌ | ✅ (own class) | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| View leaderboards | ✅ | ✅ | ✅ |
| Post in forums | ✅ | ✅ (verified badge) | ✅ |
| Take tests | ✅ | ❌ | ❌ |
| Create tests | ❌ | ✅ | ✅ |

### 7.3 Firebase Security Rules [TARGET]

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users — read own, admins read all
    match /users/{userId} {
      allow read: if request.auth.uid == userId
                  || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth.uid == userId;
    }

    // Problems — all authenticated users can read
    match /problems/{problemId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['instructor', 'admin'];
    }

    // Submissions — users read/write own
    match /submissions/{submissionId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }

    // Forum posts — authenticated read, authors write
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.author;
    }

    // Test sessions — user writes own, instructors read
    match /testSessions/{sessionId} {
      allow read: if request.auth.uid == resource.data.userId
                  || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['instructor', 'admin'];
      allow create, update: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 8. Academic Integrity System

### 8.1 Integrity Monitoring Architecture

```
┌─────────────────────────────────────────────────┐
│           Academic Integrity Layer               │
│                                                  │
│  ┌──────────────┐  ┌─────────────┐             │
│  │Paste Monitor │  │Tab Switch   │             │
│  │              │  │Monitor      │             │
│  │ Threshold:   │  │             │             │
│  │ >10 words    │  │ Visibility  │             │
│  │              │  │ API         │             │
│  │ Records:     │  │             │             │
│  │ - timestamp  │  │ Max: 3      │             │
│  │ - wordCount  │  │ warnings    │             │
│  │ - fileName   │  │ before      │             │
│  └──────┬───────┘  │ auto-submit │             │
│         │          └──────┬──────┘             │
│         │                 │                     │
│  ┌──────▼─────────────────▼──────────────────┐ │
│  │         Event Aggregator                   │ │
│  │  Collects all integrity events per session │ │
│  └──────────────────┬───────────────────────┘ │
│                     │                          │
│  ┌──────────────────▼───────────────────────┐ │
│  │         [TARGET] Firestore Write          │ │
│  │  testSessions/{id}/integrityEvents        │ │
│  │  assignmentSubmissions/{id}/pasteEvents    │ │
│  └───────────────────────────────────────────┘ │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │  [TARGET] MOSS Plagiarism Detection       │  │
│  │  - Cross-submission code similarity       │  │
│  │  - Run post-deadline on all submissions   │  │
│  │  - Generate similarity report             │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │  [TARGET] Instructor Dashboard            │  │
│  │  - View flagged submissions               │  │
│  │  - Timeline of paste events               │  │
│  │  - Tab-switch / fullscreen logs           │  │
│  │  - Code diff between similar submissions  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 8.2 Detection Capabilities

| Signal | Detection Method | Severity | Scope |
|---|---|---|---|
| Large paste (>10 words) | `paste` event listener | Warning | Assignments, Tests |
| Tab switch | `visibilitychange` event | Warning → Critical (3+) | Tests only |
| Fullscreen exit | `fullscreenchange` event | Warning → Critical (3+) | Tests only |
| Code similarity | MOSS (target) | Critical | Post-deadline |
| Rapid submission | Timestamp analysis (target) | Info | All |

---

## 9. AI Assistant Design

### 9.1 Current Implementation

The AI assistant operates as a **rule-based hint system** with randomized responses:

```
User Query → Keyword Detection → Response Category → Random Response

Categories:
  "hint"    → Problem-solving guidance (no solutions)
  "debug"   → Error analysis suggestions
  "explain" → Concept clarification
  "general" → Generic encouragement
```

### 9.2 Target Implementation

```
┌──────────┐     ┌─────────────────┐     ┌────────────────┐
│  User    │────▶│ Context Builder  │────▶│  LLM API       │
│  Query   │     │                  │     │  (GPT / Claude) │
│          │     │ + Current code   │     │                 │
│          │     │ + Problem desc   │     │ System Prompt:  │
│          │     │ + Error output   │     │ "Guide, don't  │
│          │     │ + Language       │     │  give answers"  │
│          │     │                  │     │                 │
│          │◀────│  Response filter │◀────│  Response       │
│  Hint    │     │  (no full code)  │     │                 │
└──────────┘     └─────────────────┘     └────────────────┘
```

**System Prompt (Target):**
```
You are an educational coding assistant for university students.
Rules:
1. NEVER provide complete solutions or full code implementations
2. Guide students to discover solutions themselves
3. Ask Socratic questions to probe understanding
4. Suggest specific techniques or data structures
5. Explain concepts with simple analogies
6. If shown an error, explain what type of error it is and hint at the fix
7. Encourage testing and debugging strategies
```

---

## 10. Performance & Optimization

### 10.1 Bundle Optimization

**Vite Chunk Strategy:**
```javascript
manualChunks: {
  'vendor-react':    ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit'],
  'vendor-ui':       ['@radix-ui/react-slot', 'class-variance-authority', 'clsx',
                       'framer-motion', 'lucide-react'],
  'vendor-data':     ['d3', 'date-fns', 'axios'],
  'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/analytics',
                       'firebase/firestore']
}
```

**Expected Bundle Sizes:**
| Chunk | Estimated Size | Load Timing |
|---|---|---|
| `vendor-react` | ~150 KB | Initial load |
| `vendor-ui` | ~120 KB | Initial load |
| `vendor-firebase` | ~200 KB | Initial load |
| `vendor-data` | ~180 KB | Deferred |
| Monaco Editor | ~2 MB | Lazy (workspace pages only) |
| Page chunks | ~20-80 KB each | Per-route lazy |

### 10.2 Loading Strategy

```
Initial Load (< 300KB gzipped):
  ├── HTML shell
  ├── vendor-react chunk
  ├── vendor-ui chunk
  ├── App + Homepage (eager)
  └── Login (eager)

On Navigation (per-route):
  ├── Route chunk (~20-80KB)
  └── Monaco Editor (~2MB, only for workspace routes)

Optimization Techniques:
  ├── React.lazy() + Suspense for all protected routes
  ├── <Loading /> component as Suspense fallback
  ├── Preload hints for likely next routes
  └── Service Worker caching (planned)
```

### 10.3 Runtime Performance

| Concern | Strategy |
|---|---|
| Large problem lists | Virtual scrolling (planned), pagination |
| Monaco Editor init | Lazy load, show skeleton during load |
| Forum infinite scroll | Cursor-based Firestore pagination |
| Dark mode flicker | CSS-based system preference detection + stored preference |
| Re-renders | React.memo on list items, stable callbacks |

---

## 11. Security Considerations

### 11.1 Current Vulnerabilities

| Issue | Risk | Mitigation Plan |
|---|---|---|
| Firebase config in source code | Medium | Use App Check, restrict API key by domain |
| Client-side JS execution (`new Function()`) | Medium | Sandbox with Web Workers + CSP headers |
| No rate limiting on submissions | High | Firebase Cloud Function with rate limiter |
| No input sanitization | Medium | DOMPurify for user-generated HTML/markdown |
| No CSRF protection | Low | Firebase Auth handles tokens; add SameSite cookies |

### 11.2 Security Architecture [TARGET]

```
┌──────────────────────────────────────────────┐
│                 Security Layers               │
│                                               │
│  Layer 1: Network                             │
│  ├── HTTPS everywhere                         │
│  ├── CSP headers (no inline scripts)          │
│  └── CORS whitelist                           │
│                                               │
│  Layer 2: Authentication                      │
│  ├── Firebase Auth (OAuth 2.0 + OIDC)         │
│  ├── University domain enforcement            │
│  └── Session timeout (24h)                    │
│                                               │
│  Layer 3: Authorization                       │
│  ├── Firestore Security Rules (per-doc ACL)   │
│  ├── Role-based access (student/instructor)   │
│  └── University scoping                       │
│                                               │
│  Layer 4: Data                                │
│  ├── Input sanitization (DOMPurify)           │
│  ├── Parameterized Firestore queries          │
│  └── No sensitive data in client state        │
│                                               │
│  Layer 5: Code Execution                      │
│  ├── Isolated Docker containers (Judge0)      │
│  ├── No network access in sandbox             │
│  ├── Time (5s) + memory (256MB) limits        │
│  └── Read-only filesystem                     │
│                                               │
│  Layer 6: Monitoring                          │
│  ├── Firebase Analytics for anomaly detection  │
│  ├── Rate limiting on all write operations    │
│  └── Alerting on unusual patterns             │
└──────────────────────────────────────────────┘
```

---

## 12. Deployment Architecture

### 12.1 Current

```
Developer → npm run build → Static files → Manual deploy
```

### 12.2 Target

```
┌──────────┐    ┌──────────────┐    ┌──────────────────┐
│  GitHub  │───▶│  GitHub      │───▶│  Vercel / Firebase│
│  Push    │    │  Actions CI  │    │  Hosting          │
│          │    │              │    │                    │
│  main    │    │  - Lint      │    │  CDN-backed       │
│  branch  │    │  - Test      │    │  static site      │
│          │    │  - Build     │    │  + Edge Functions  │
│          │    │  - Deploy    │    │                    │
└──────────┘    └──────────────┘    └──────────────────┘
                                           │
                                    ┌──────▼──────┐
                                    │  Firebase   │
                                    │  Services   │
                                    │  - Auth     │
                                    │  - Firestore│
                                    │  - Storage  │
                                    │  - Functions│
                                    └─────────────┘
                                           │
                                    ┌──────▼──────┐
                                    │  Judge0 /   │
                                    │  Piston     │
                                    │  (External  │
                                    │   or Self-  │
                                    │   hosted)   │
                                    └─────────────┘
```

### 12.3 Environment Configuration

| Variable | Purpose | Source |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase project auth | Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | OAuth redirect domain | Firebase Console |
| `VITE_FIREBASE_PROJECT_ID` | Project identifier | Firebase Console |
| `VITE_FIREBASE_STORAGE_BUCKET` | File storage endpoint | Firebase Console |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender | Firebase Console |
| `VITE_FIREBASE_APP_ID` | App identifier | Firebase Console |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics tracking | Firebase Console |
| `VITE_API_BASE_URL` | Backend API endpoint | Deployment config |
| `VITE_ENVIRONMENT` | `development` / `production` | Build pipeline |

---

## 13. Testing Strategy

### 13.1 Testing Pyramid [TARGET]

```
                    ┌─────────┐
                    │   E2E   │  Cypress / Playwright
                    │ (Few)   │  - Login flow
                    │         │  - Submit problem
                    ├─────────┤  - Take test
                    │Integra- │
                    │ tion    │  React Testing Library
                    │(Medium) │  - Page rendering
                    │         │  - User interactions
                    ├─────────┤  - Route guards
                    │  Unit   │
                    │ (Many)  │  Vitest
                    │         │  - Code execution engine
                    │         │  - Utility functions
                    │         │  - Data transformations
                    └─────────┘
```

### 13.2 Critical Test Cases

| Area | Test | Priority |
|---|---|---|
| Auth | Login redirects to dashboard | P0 |
| Auth | Unauthenticated user redirected to login | P0 |
| Problem Workspace | JS code executes correctly | P0 |
| Problem Workspace | Test cases validate properly | P0 |
| Test Page | Timer counts down and auto-submits | P0 |
| Test Page | Tab switch increments warning count | P0 |
| Assignment | Paste detection flags >10 words | P1 |
| Forums | Post creation works | P1 |
| Achievement | XP calculation is correct | P1 |
| Dark Mode | Theme toggles without flicker | P2 |

---

## 14. API Contracts

### 14.1 Internal Module Interfaces

#### Code Execution Interface
```typescript
interface ExecutionRequest {
  code: string;
  language: 'javascript' | 'python' | 'java' | 'cpp' | 'sql';
  stdin?: string;
  timeLimit?: number;    // ms, default 5000
  memoryLimit?: number;  // KB, default 262144
}

interface ExecutionResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  time: number;    // seconds
  memory: number;  // KB
  status: 'Accepted' | 'Wrong Answer' | 'TLE' | 'MLE' | 'RTE' | 'CE';
}
```

#### Problem Validation Interface
```typescript
interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface ValidationResult {
  passed: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  results: Array<{
    testCaseIndex: number;
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    time: number;
  }>;
}
```

#### Integrity Event Interface
```typescript
interface PasteEvent {
  timestamp: string;  // ISO 8601
  wordCount: number;
  file: string;
  sessionId: string;
}

interface ProctoringEvent {
  type: 'tab_switch' | 'fullscreen_exit' | 'paste' | 'copy';
  timestamp: string;
  count: number;       // cumulative
  autoSubmit: boolean; // true if threshold exceeded
}
```

### 14.2 External API Endpoints [TARGET]

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/execute` | Bearer token | Execute code |
| GET | `/api/problems` | Bearer token | List problems (paginated) |
| GET | `/api/problems/:id` | Bearer token | Get problem detail |
| POST | `/api/submissions` | Bearer token | Submit solution |
| GET | `/api/submissions?userId=` | Bearer token | User's submissions |
| GET | `/api/leaderboard?type=` | Bearer token | Leaderboard data |
| POST | `/api/assignments/:id/submit` | Bearer token | Submit assignment |

---

## 15. Future Architecture

### 15.1 V2 — Real-Time Collaboration

```
┌────────────┐     ┌────────────┐
│  Student A │     │  Student B │
│  Browser   │     │  Browser   │
└─────┬──────┘     └─────┬──────┘
      │  WebSocket        │ WebSocket
      └────────┬──────────┘
               │
        ┌──────▼──────┐
        │  Yjs CRDT   │
        │  Server     │
        │             │
        │ - Document  │
        │   sync      │
        │ - Presence  │
        │ - Cursors   │
        └─────────────┘
```

### 15.2 V3 — Containerized Runner

```
┌────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Submission│────▶│  Queue       │────▶│  Worker Pool    │
│            │     │  (Redis)     │     │                 │
│            │     │              │     │  ┌───────────┐  │
│            │     │  Rate limit  │     │  │  Docker   │  │
│            │     │  Priority    │     │  │  Container│  │
│            │◀────│  queue       │◀────│  │  (gVisor) │  │
│  Result    │     │              │     │  └───────────┘  │
└────────────┘     └──────────────┘     └─────────────────┘
```

### 15.3 Architecture Evolution Summary

| Phase | Frontend | Backend | Execution | Data |
|---|---|---|---|---|
| **V1 (Current)** | React SPA | Firebase (BaaS) | Client-side | Mocked / Firestore |
| **V1.3** | React SPA | Firebase + Cloud Functions | Judge0 Cloud | Firestore |
| **V2** | React SPA + Yjs | Firebase + WebSocket server | Judge0 Cloud | Firestore + CRDT |
| **V3** | React SPA + Yjs | Custom Node.js + Firebase | Self-hosted Piston | Firestore + Redis |

---

## Appendix A — File-to-Module Mapping

| Directory | Module | Owner |
|---|---|---|
| `src/components/ui/` | Shared UI Library | Frontend Team |
| `src/components/` | App Shell Components | Frontend Team |
| `src/contexts/` | Global State Providers | Frontend Team |
| `src/hooks/` | Custom React Hooks | Frontend Team |
| `src/lib/` | Firebase SDK Integration | Backend Team |
| `src/utils/` | Pure Utility Functions | Shared |
| `src/shared/` | Marketing Components + Data | Design Team |
| `src/pages/problem-workspace/` | Problem Solving Module | Core Team |
| `src/pages/assignment-workspace/` | Assignment Module | Core Team |
| `src/pages/test/` | Proctored Testing Module | Core Team |
| `src/pages/achievement-center/` | Gamification Module | Growth Team |
| `src/pages/campus-forums/` | Social Module | Community Team |
| `src/pages/student-dashboard/` | Dashboard Module | Core Team |
| `src/pages/homepage/` | Landing / Marketing | Design Team |

---

## Appendix B — Decision Log

| # | Decision | Rationale | Date |
|---|---|---|---|
| D1 | React 18 over Next.js | SPA is sufficient; no SSR needed for auth-gated app | 2025 |
| D2 | Vite over CRA | Faster dev server, better build optimization | 2025 |
| D3 | Firebase over custom backend | Rapid prototyping, built-in auth, real-time | 2025 |
| D4 | Monaco over CodeMirror | True VS Code experience, better language support | 2025 |
| D5 | TailwindCSS over CSS Modules | Faster development, consistent design system | 2025 |
| D6 | Client-side execution for MVP | No server cost, instant feedback, simpler deployment | 2025 |
| D7 | Judge0 for production execution | Managed service, multi-language, proven at scale | 2026 |
| D8 | Yjs for collaboration (V2) | Industry-standard CRDT, works with Monaco | TBD |

---

*End of Software Design Document*
