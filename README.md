<p align="center">
  <img src="docs/graphics/hero-codecampus.svg" width="100%" alt="CodeCampus hero banner" />
</p>

<h1 align="center">CodeCampus</h1>

<p align="center">
  <strong>Your Code, Your Community, Your Career.</strong>
</p>

<p align="center">
  A polished academic coding platform for computer science students with a VS Code-style IDE, proctored exams, guided practice, teacher review flows, and community learning.
</p>

<p align="center">
  <a href="#visual-journey">Visual Journey</a> ·
  <a href="#features">Features</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#project-structure">Project Structure</a> ·
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-Auth-ffca28?logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-34d399" alt="MIT License" />
</p>

## Visual Journey

<p align="center">
  A guided tour through the main student and teacher experiences, using full local paths for reliable preview inside the editor.
</p>

<table>
  <tr>
    <td>
      <h3>01. Home</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/home.png" width="100%" alt="CodeCampus home screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>02. Practice Problems</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/practice%20problems.png" width="100%" alt="Practice problems screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>03. Learning Path</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/learning%20path.png" width="100%" alt="Learning path screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>04. Two Sum</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/twosum.png" width="100%" alt="Two Sum problem screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>05. VS Code</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/vscode.png" width="100%" alt="VS Code style workspace" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>06. Test</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/test.png" width="100%" alt="Test environment screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>07. Violations</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/violations.png" width="100%" alt="Violation tracking screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>08. Achievement</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/achivement.png" width="100%" alt="Achievement center screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>09. Teacher Home</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/teacher%20hhome.png" width="100%" alt="Teacher home screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>10. Students</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/students%20.png" width="100%" alt="Students screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>11. Teacher Views</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/teacher%20viewws.png" width="100%" alt="Teacher views screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>12. Report</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/report.png" width="100%" alt="Report screen" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>13. Timeline</h3>
      <img src="file:///C:/Users/adity/OneDrive/Documents/OOO/codecampus/photos/timeline.png" width="100%" alt="Timeline screen" />
    </td>
  </tr>
</table>

<p align="center">
  <strong>The sections below add the deeper technical details, setup notes, and implementation overview.</strong>
</p>

<p align="center">
  <img src="docs/graphics/tech-stack.svg" width="100%" alt="CodeCampus tech stack graphic" />
</p>

## Platform Highlights

<table>
  <tr>
    <td width="50%">
      <img src="docs/graphics/ide-preview.svg" width="100%" alt="IDE preview graphic" />
    </td>
    <td width="50%">
      <img src="docs/graphics/feature-mosaic.svg" width="100%" alt="Feature mosaic graphic" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/graphics/learning-loop.svg" width="100%" alt="Learning loop graphic" />
    </td>
    <td width="50%">
      <img src="docs/graphics/security-proctor.svg" width="100%" alt="Security and proctoring graphic" />
    </td>
  </tr>
</table>

<p align="center">
  <img src="docs/graphics/ide-walkthrough.svg" width="100%" alt="IDE walkthrough graphic" />
</p>

## 🚀 Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>📝 VS Code-Style Workspace</h3>
      <ul>
        <li>Activity bar, file explorer, search, and AI assistant in a familiar IDE layout</li>
        <li>Tabbed multi-file editing with Monaco Editor</li>
        <li>Integrated terminal, auto-save, and breadcrumb navigation</li>
        <li>Search across assignment files without leaving the workspace</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>📚 Assignments System</h3>
      <ul>
        <li>Subject-based organization for DSA, DBMS, Web Dev, OOP, and more</li>
        <li>Deadline tracking with urgency colors and visible progress</li>
        <li>Simulated JavaScript, Python, and SQL execution in browser</li>
        <li>Paste detection, auto-save, and multi-file project support</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🔒 Proctored Test Environment</h3>
      <ul>
        <li>Fullscreen enforcement with tab switch monitoring</li>
        <li>Auto-submit after repeated warnings or time expiry</li>
        <li>Question navigation with secure submission flow</li>
        <li>Built for low-distraction, high-integrity exam sessions</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🎓 Learning Features</h3>
      <ul>
        <li>Problem history, achievements, and gamification</li>
        <li>Campus forums for collaborative discussion</li>
        <li>Project showcase pages for portfolios and reviews</li>
        <li>Guided learning paths and long-term skill progression</li>
      </ul>
    </td>
  </tr>
</table>

## Architecture At A Glance

```mermaid
flowchart LR
  A[Student/Teacher UI] --> B[React + Vite Client]
  B --> C[Monaco IDE + Workspace]
  B --> D[AI Assistant]
  B --> E[Assignment Services]
  B --> F[Proctored Testing]
  D --> G[Contextual Hints]
  E --> H[Firestore]
  F --> I[Integrity Logs]
  B --> J[Auth Gateway]
  J --> K[Firebase Auth]
```

## 💻 Tech Stack

<table>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>React 18, Vite 5, React Router 6, TailwindCSS, Framer Motion, Monaco Editor</td>
  </tr>
  <tr>
    <td><strong>UI System</strong></td>
    <td>Radix UI, cva button variants, styled-components, Lucide icons</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Firebase Auth, Firestore, Express.js, MongoDB</td>
  </tr>
  <tr>
    <td><strong>Build & Deploy</strong></td>
    <td>Vite production builds, Docker, docker-compose, nginx, PostCSS</td>
  </tr>
</table>

## ⚡ Quick Start

### Prerequisites
- Node.js 16+ and npm
- A Firebase project (free tier works!)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdityaxDeore/codecampus.git
   cd codecampus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** ⚠️ **IMPORTANT**

   Without this step, you'll see a white screen!

   ```bash
   # Copy the environment template
   cp .env.example .env  # Mac/Linux
   copy .env.example .env  # Windows
   ```

   Then edit `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

   **Where to get these values:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a project (or select existing)
   - Go to **Project Settings** → **General** → **Your apps**
   - Click **Web app** → **Config** → Copy the values

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:4028`

### Troubleshooting

**White screen after cloning?**
- Make sure you created the `.env` file with valid Firebase credentials
- Check the browser console for specific error messages
- Restart the dev server after adding credentials

**Build fails?**
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure you're using Node.js 16+

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:4028)
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

### Quick Navigation

Once the server is running, access these routes:

- `/` - Homepage
- `/login` - Authentication
- `/student-dashboard` - Student dashboard
- `/assignments` - Assignment listing
- `/assignment-workspace?id=a1` - VS Code workspace (BST assignment)
- `/assignment-workspace?id=a2` - Graph traversal assignment
- `/assignment-workspace?id=a7` - SQL normalization assignment
- `/test` - Proctored test environment
- `/achievement-center` - Leaderboards and achievements
- `/campus-forums` - Discussion forums

## 📁 Project Structure

```
codecampus/
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Button, Input, Header, etc.
│   │   ├── AppIcon.jsx       # Icon wrapper component
│   │   ├── ErrorBoundary.jsx # Error handling
│   │   └── ProtectedRoute.jsx # Auth guards
│   ├── pages/
│   │   ├── assignment-workspace/  # VS Code-style IDE
│   │   ├── assignments/           # Assignment listing page
│   │   ├── test/                  # Proctored test environment
│   │   ├── student-dashboard/     # Main student dashboard
│   │   ├── achievement-center/    # Leaderboards and badges
│   │   ├── campus-forums/         # Discussion forums
│   │   ├── problem-workspace/     # Problem solving IDE
│   │   ├── problems/              # Problem catalog
│   │   ├── homepage/              # Landing page
│   │   └── login/                 # Authentication
│   ├── shared/               # Shared components and data
│   ├── lib/                  # Firebase config and utilities
│   ├── contexts/             # React Context (Dark mode, etc.)
│   ├── hooks                # Custom React hooks
│   ├── utils/                # Helper functions
│   └── styles/               # Global CSS and Tailwind
├── public/                   # Static assets
├── docs/                     # Documentation
│   ├── graphics/             # README visuals
│   └── screenshots/          # README screenshots
└── vite.config.mjs           # Vite configuration
```

## Code Execution Engines

The platform supports in-browser code execution for multiple languages:

### JavaScript
- **Sandboxed Execution** - Runs in isolated Function context
- **Console Capture** - Intercepts log, error, warn, and info
- **Error Handling** - Displays runtime errors with stack traces

### Python (Simulated)
- **Pattern Matching** - Analyzes print() statements
- **TODO Detection** - Warns about unimplemented code sections
- **Output Simulation** - Mimics Python console behavior

### SQL (Simulated)
- **Statement Parsing** - Recognizes SELECT, CREATE, INSERT, ALTER, DROP
- **Query Feedback** - Provides execution status for each statement
- **Multi-Statement Support** - Handles semicolon-separated queries

## 🎮 Academic Integrity Features

- **Copy-Paste Monitoring** - Flags pastes over 10 words
- **Timestamp Tracking** - Records all paste events with word count
- **Instructor Dashboard** - Review flagged submissions (planned)
- **Tab Switch Alerts** - Monitors focus during proctored tests
- **Fullscreen Lock** - Enforces secure testing environment

## 🧠 AI Assistant

- **Context-Aware** - Understands current assignment and language
- **Hint-Based** - Guides students without giving direct solutions
- **Debugging Help** - Analyzes errors and suggests fixes
- **Quick Actions** - Pre-built prompts for hints, debugging, and explanations

## Performance

- Route-based code splitting for optimal loading
- Vendor chunk optimization
- Lazy-loaded components with Suspense
- Optimized bundle size with manual chunks

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## ⌨️ Keyboard Shortcuts (Workspace)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save current file |
| `Ctrl/Cmd + B` | Toggle sidebar |
| `Ctrl/Cmd + `` ` `` | Toggle terminal |

## 🖥️ Terminal Commands

Available in the integrated terminal:

```bash
run        # Execute current file
clear      # Clear terminal history
ls         # List all files in project
cat <file> # Display file contents
help       # Show available commands
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

### Vercel Deploy Panel

<p align="center">
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" alt="Deploy on Vercel" />
  <img src="https://img.shields.io/badge/Build-npm%20run%20build-22c55e" alt="Build command" />
  <img src="https://img.shields.io/badge/Output-build-3b82f6" alt="Output directory" />
  <img src="https://img.shields.io/badge/SPA-Rewrite%20Enabled-8b5cf6" alt="SPA rewrite" />
</p>

**Environment Validation Tips**
- Confirm all `VITE_FIREBASE_*` variables exist in Vercel before the first build.
- If deploying under a subpath, set `VITE_BASE_PATH=/your-subpath/` in Vercel.
- After deploy, verify `/login`, `/assignments`, and `/achievement-center` load without refresh errors.

## 📄 License

MIT License - see LICENSE file for details.

## Root Files

```
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

Project by -
Aditya Deore
