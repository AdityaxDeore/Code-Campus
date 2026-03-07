# CodeCampus — PPT Diagrams (Mermaid)

Paste these Mermaid diagrams into any Mermaid renderer (or supported tools) and export as PNG/SVG for PPT.

## Diagram 1: Teacher → Student → Review Cycle

```mermaid
flowchart LR
  T[Teacher] -->|Create assignment| A[Assignment]
  A -->|Publish| S[Student]
  S -->|Solve in IDE| W[Workspace]
  W -->|Submit| SUB[Submission]
  SUB --> I[Integrity checks]
  SUB --> AI[AI guidance logs]
  I --> R[Risk score]
  AI --> R
  R -->|Report + score| TR[Teacher Review]
  TR -->|Feedback + grade| S
```

## Diagram 2: Proctored Test Flow

```mermaid
flowchart LR
  ST[Student] -->|Start test| TL[Test lobby]
  TL --> EX[Exam mode]
  EX -->|Timer| TMR[Countdown]
  EX -->|MCQ/Coding| Q[Questions]
  EX -->|Monitor| MON[Tab/Paste checks]
  Q -->|Submit| SUB[Test submission]
  MON --> REP[Integrity report]
  SUB --> REP
  REP -->|Review| TCH[Teacher]
```

## Diagram 3: Integrity Signal Sources

```mermaid
flowchart TB
  P[Paste events] --> R[Risk score]
  TS[Tab switches] --> R
  TT[Typing pattern] --> R
  AI[AI usage] --> R
  R --> IR[Integrity report]
  IR --> TR[Teacher review]
```
