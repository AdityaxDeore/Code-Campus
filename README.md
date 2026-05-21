<div align="center">

<h1>CODECAMPUS</h1>

<p>
A modern coding education platform built around immersive development,
real-world assignments, secure evaluation, and intelligent learning workflows.
</p>

<br>

<img width="100%" src="./docs/hero-light.png"/>

<br><br>

<a href="#overview">Overview</a>
•
<a href="#experience">Experience</a>
•
<a href="#architecture">Architecture</a>
•
<a href="#setup">Setup</a>

</div>

---

# Overview

CodeCampus rethinks technical education as a continuous development environment.

Students do not move between multiple disconnected tools.

Assignments, execution, testing, collaboration, and guided assistance exist inside a single interface.

<br>

<img width="100%" src="./docs/overview.png"/>

---

# Experience

<table>

<tr>

<td width="50%">

### Workspace

Multi-file editing  
Integrated execution  
Context-aware assistance  
Terminal workflows  
Code navigation  

</td>

<td width="50%">

### Evaluation

Timed assessments  
Session monitoring  
Secure submissions  
Progress tracking  

</td>

</tr>

</table>

<br>

<img width="100%" src="./docs/workspace-dark.png"/>

---

# System

```text
Student Interface
│
├── Workspace
├── Assignments
├── Evaluation
├── Community
│
Application Layer
│
├── Editor Engine
├── Execution Engine
├── Assistant Layer
│
Infrastructure
│
├── Firebase
├── Firestore
└── Authentication
```

---

# Interface

<div align="center">

<img width="32%" src="./docs/dashboard.png"/>
<img width="32%" src="./docs/ide.png"/>
<img width="32%" src="./docs/test.png"/>

</div>

---

# Capabilities

| | |
|---|---|
| IDE | VS Code inspired editing |
| Execution | Browser-based execution |
| Learning | Guided problem solving |
| Assessment | Secure test environment |
| Progress | Analytics and history |

---

# Architecture

<img width="100%" src="./docs/architecture.png"/>

---

# Setup

Clone project

```bash
git clone https://github.com/AdityaxDeore/codecampus.git
```

Install

```bash
npm install
```

Configure environment

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

Run

```bash
npm start
```

Open

```text
http://localhost:4028
```

---

# Structure

```text
src
├── components
├── pages
├── shared
├── hooks
├── contexts
├── styles
├── lib
└── utils
```

---

<div align="center">

Built by Aditya Deore

</div>
