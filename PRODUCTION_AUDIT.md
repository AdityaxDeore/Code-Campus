# CodeCampus Production-Readiness Audit Report

**Date:** Generated from full codebase review  
**Scope:** All source files (~60+ files across components, pages, lib, utils, config)

---

## CRITICAL Severity

### 1. Hardcoded Firebase Credentials (Security)

**File:** `src/lib/firebase.js` (Lines 12–19)

```js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCZHdT3iDPkzfjvUkTrJ1nGyatrWxI5COk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "codecampus-355e8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "codecampus-355e8",
  // ...
};
```

**What breaks:** API keys are committed to source control and baked into the production bundle. Attackers can abuse the Firebase project (create accounts, read/write data if rules are loose, exhaust quota).

**Fix:** Remove all fallback values. Require environment variables at build time. Add a `.env.example` with placeholder keys only. Ensure `.env` is in `.gitignore`. Validate env vars are present during build:

```js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...
};
if (!firebaseConfig.apiKey) throw new Error("Missing VITE_FIREBASE_API_KEY");
```

---

### 2. Arbitrary Code Execution via `new Function()` (Security)

**File:** `src/pages/assignment-workspace/index.jsx` (inside `executeJavaScript` function)

```js
new Function('console', code)(mc);
```

**What breaks:** Users can execute arbitrary JavaScript in the browser context. While this is sandboxed from `eval` slightly, it can still access globals, read cookies, localStorage, and the DOM. A malicious student could exfiltrate auth tokens or other users' data.

**Fix:** Execute user code in a sandboxed Web Worker or an iframe with `sandbox` attribute (no `allow-same-origin`). At minimum, wrap in a try/catch and restrict scope:

```js
// Better: use a sandboxed iframe
const iframe = document.createElement('iframe');
iframe.sandbox = 'allow-scripts';
// Post code to iframe for execution
```

---

### 3. `createUser` Uses `updateDoc` Instead of `setDoc` (Data Loss)

**File:** `src/lib/firestore.js` (Lines 31–39)

```js
export const createUser = async (userId, userData) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), { ... });
```

**What breaks:** `updateDoc` throws a "No document to update" error when the user document doesn't exist yet (which is always the case for new users). New user registration silently fails — no user profile is created in Firestore.

**Fix:** Use `setDoc` with `{ merge: true }`:

```js
import { setDoc } from 'firebase/firestore';
await setDoc(doc(db, COLLECTIONS.USERS, userId), {
  ...userData,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}, { merge: true });
```

---

## HIGH Severity

### 4. Infinite Re-render Loop in Campus Forums (Performance / Crash)

**File:** `src/pages/campus-forums/index.jsx` (Line ~410)

```js
useEffect(() => {
  setPosts(mockPosts);
  setFriendRequests(mockFriendRequests);
}, [mockPosts, mockFriendRequests]);
```

**What breaks:** `mockPosts` and `mockFriendRequests` are objects/arrays defined inside the component body. They are recreated on every render, so their reference changes every time, causing the `useEffect` to re-trigger infinitely → `setPosts` → re-render → new `mockPosts` → `useEffect` fires again. This will freeze/crash the browser tab.

**Fix:** Move mock data outside the component or remove the dependency array:

```js
// Move outside component:
const MOCK_POSTS = [ ... ];
const MOCK_FRIEND_REQUESTS = [ ... ];

// Inside component:
useEffect(() => {
  setPosts(MOCK_POSTS);
  setFriendRequests(MOCK_FRIEND_REQUESTS);
}, []); // Run only on mount
```

---

### 5. `Math.random()` Called During Render (UI Flicker / Hydration)

**File:** `src/pages/problems/index.jsx` (Multiple locations within JSX, ~Lines 750–810)

```jsx
<div className="text-xs text-green-600">
  {Math.random() > 0.5 ? '↗️ Getting Easier' : '↘️ Getting Harder'}
</div>
// ...
<span>Avg. Time: {Math.floor(Math.random() * 30 + 10)} min</span>
<span>{(Math.random() * 50000 + 10000).toFixed(0)} submissions</span>
```

**What breaks:** Every re-render produces different random values, causing visual flickering. In any SSR scenario it would cause hydration mismatches. The randomness is not meaningful — it's fake data pretending to be real metrics.

**Fix:** Generate random values once during initialization (e.g., `useMemo`) or, better, use deterministic mock data:

```js
const problemInsights = useMemo(() =>
  problems.map(p => ({
    ...p,
    trend: p.id % 2 === 0 ? 'Getting Easier' : 'Getting Harder',
    avgTime: 15 + (p.id * 3) % 25,
    submissions: 10000 + p.id * 1234,
  })),
  [problems]
);
```

---

### 6. Dynamic Tailwind Classes Not Compiled (Broken Styles)

**File:** `src/pages/achievement-center/index.jsx` (Line ~248)

```jsx
className={`h-2 rounded-full bg-${topic.color}-500`}
style={{ width: `${topic.progress}%` }}
```

Also in `src/pages/homepage/components/ActivityFeed.jsx`:

```jsx
className={`bg-${stat.color}-100`}
```

**What breaks:** Tailwind CSS purges classes at build time using static analysis. Dynamic class names like `` bg-${color}-500 `` are never found in the source code literally, so they are removed from the production CSS bundle. The elements will have no background color.

**Fix:** Use a mapping object with full class names:

```js
const colorMap = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
};
// Usage:
className={`h-2 rounded-full ${colorMap[topic.color]}`}
```

Or add a `safelist` to `tailwind.config.js`.

---

### 7. `style jsx` Tag in Vite Project (Non-functional CSS)

**File:** `src/pages/problem-workspace/components/CodeEditor.jsx`

```jsx
<style jsx>{`
  .code-editor-wrapper { ... }
`}</style>
```

**What breaks:** `<style jsx>` is a Next.js/styled-jsx feature. Vite with `@vitejs/plugin-react` does not support this. The styles will be rendered as a literal `<style>` element with the `jsx` attribute, and while the CSS may still apply in some browsers, it's not processed, scoped, or optimized. Build warnings may appear.

**Fix:** Use standard CSS modules, a `<style>` tag without `jsx`, Tailwind classes, or styled-components (already a dependency):

```jsx
// Option A: Plain <style> tag (simplest)
<style>{`.code-editor-wrapper { ... }`}</style>

// Option B: Move to a CSS module
import styles from './CodeEditor.module.css';
```

---

### 8. `null` Container Crashes `createRoot` (App Won't Mount)

**File:** `src/index.jsx` (Lines 7–9)

```js
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
```

**What breaks:** If `#root` element doesn't exist (broken HTML, CDN issues, ad blockers removing elements), `createRoot(null)` throws an unrecoverable error. The entire app fails to load with no user feedback.

**Fix:**

```js
const container = document.getElementById("root");
if (!container) {
  document.body.innerHTML = '<div style="padding:2rem;font-family:sans-serif"><h1>Failed to load application</h1><p>Please refresh or contact support.</p></div>';
  throw new Error("Root container not found");
}
const root = createRoot(container);
root.render(<App />);
```

---

### 9. `@reduxjs/toolkit` Bundled But Never Used (Bundle Bloat)

**File:** `package.json` (Line 34) + `vite.config.mjs` (Line 16)

```json
"@reduxjs/toolkit": "^2.6.1",
"redux": "^5.0.1",
```

```js
'vendor-react': ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit'],
```

**What breaks:** No file in the codebase imports from `@reduxjs/toolkit` or `redux`. Yet both are listed as dependencies AND included in manual chunks. This adds ~30-40KB gzipped to the vendor bundle for no reason. The `manualChunks` config will also fail with a build error if the dependency isn't actually imported somewhere.

**Fix:** Remove `@reduxjs/toolkit` and `redux` from both `package.json` and `vite.config.mjs` `manualChunks`.

---

### 10. `d3` and `axios` Bundled But Likely Unused (Bundle Bloat)

**File:** `package.json` + `vite.config.mjs` (Line 18)

```js
'vendor-data': ['d3', 'date-fns', 'axios'],
```

**What breaks:** A grep of the codebase shows no imports of `d3` or `axios`. These are large libraries (~70KB gzipped for d3) included in manual chunks. Like Redux, if they're not actually imported, the `manualChunks` configuration will cause a Rollup build error.

**Fix:** Remove unused dependencies, or conditionally include them in `manualChunks` only if actually imported.

---

### 11. Placeholder Routes Missing `<Suspense>` Wrapper

**File:** `src/Routes.jsx` (Lines 143–150)

```jsx
<Route path="/settings" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
<Route path="/help" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
```

**What breaks:** `ComingSoon` is lazy-loaded (`const ComingSoon = lazy(() => import(...))`), but these routes use it directly without a `<Suspense>` boundary. When these routes are first accessed, React will throw: "A component suspended while rendering, but no fallback UI was specified."

**Fix:** Wrap in `<Suspense>`:

```jsx
<Route path="/settings" element={
  <ProtectedRoute>
    <Suspense fallback={<Loading />}>
      <ComingSoon />
    </Suspense>
  </ProtectedRoute>
} />
```

---

## MEDIUM Severity

### 12. `JSON.parse` Without try/catch (Potential Crash)

**File:** `src/contexts/DarkModeContext.jsx` (Line 21)

```js
setIsDarkMode(JSON.parse(savedDarkMode));
```

**What breaks:** If `localStorage.getItem('darkMode')` returns a corrupted or non-JSON string (e.g., `"undefined"`, `"truee"`, or manually altered value), `JSON.parse` throws a `SyntaxError`. This crashes the `DarkModeProvider` and, since it wraps the entire app, takes down the whole application.

**Fix:**

```js
try {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    setIsDarkMode(JSON.parse(savedDarkMode));
  }
} catch {
  localStorage.removeItem('darkMode');
  setIsDarkMode(false);
}
```

---

### 13. `setTimeout` Without Cleanup (Memory Leak)

**File:** `src/pages/problem-workspace/index.jsx` (Lines ~248, ~270)

```js
const handleRunCode = async (code, language) => {
  setIsRunning(true);
  setTimeout(() => {
    setTestResults(mockResults);
    setIsRunning(false);
  }, 2000);
};

const handleSubmitCode = async (code, language) => {
  setIsSubmitting(true);
  setTimeout(() => {
    // ...
    setIsSubmitting(false);
    setShowSuccessAnimation(true);
  }, 3000);
};
```

**What breaks:** If the user navigates away from the page before the timeout fires, `setState` is called on an unmounted component. React 18 won't crash but it's a memory leak and can cause unexpected behavior.

**Fix:** Use a ref-based cleanup:

```js
const timerRef = useRef(null);
useEffect(() => () => clearTimeout(timerRef.current), []);

const handleRunCode = (code, language) => {
  setIsRunning(true);
  timerRef.current = setTimeout(() => { ... }, 2000);
};
```

---

### 14. `console.error` Calls in Production Code

**File:** `src/components/ui/Header.jsx` (Line ~170)

```js
} catch (e) {
  console.error('Sign out error:', e);
}
```

**What breaks:** `console.error` calls in production leak implementation details to the browser console. Not a crash risk, but a security/UX concern in production.

**Fix:** Use a logger utility that can be silenced in production, or remove console statements.

---

### 15. Error State Set But Never Displayed

**File:** `src/pages/problem-workspace/components/CollaborativeMode.jsx`

```js
setError('Failed to connect');
```

**What breaks:** The `error` state is set in the catch block, but the component's JSX never renders it. Users experience a silent failure with no feedback when collaborative mode fails to connect.

**Fix:** Add error display in the component's JSX:

```jsx
{error && (
  <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
    {error}
  </div>
)}
```

---

### 16. `mockSubmissions` Set in `useEffect` Without Deps Guard

**File:** `src/pages/problem-workspace/index.jsx` (Lines ~224–226)

```js
useEffect(() => {
  setSubmissions(mockSubmissions);
}, []);
```

While the empty deps array prevents an infinite loop, the `mockSubmissions` array is defined as a `const` inside the component body (lines ~186-222), meaning it's recreated every render. This is a wasted allocation.

**Fix:** Move `mockSubmissions` outside the component.

---

### 17. `onKeyPress` Deprecated

**File:** `src/pages/campus-forums/index.jsx` (Line ~790)

```jsx
onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
```

**What breaks:** `onKeyPress` is deprecated in React and modern DOM specs. It may be removed in future browser versions.

**Fix:** Use `onKeyDown` instead:

```jsx
onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
```

---

### 18. `Input` Component Uses `Math.random()` for IDs

**File:** `src/components/ui/Input.jsx` (Line 14)

```js
const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;
```

Also in `Select.jsx` (Line 35) and `Checkbox.jsx` (Line 19).

**What breaks:** New IDs are generated every render, breaking the label-input association. The `htmlFor`/`id` pair changes each render, making the label click target unreliable and causing React reconciliation issues.

**Fix:** Use `useId()` (React 18+):

```js
import { useId } from 'react';
const generatedId = useId();
const inputId = id || generatedId;
```

---

### 19. No Modal Accessibility (A11y)

**File:** `src/pages/campus-forums/index.jsx` (FriendRequestsModal, CreatePostModal)  
**File:** `src/pages/learning-pathways/index.jsx` (selectedPath modal)

**What breaks:** Modals lack:
- Focus trap (Tab key escapes the modal)
- Escape key handler (pressing Escape doesn't close)
- `role="dialog"` and `aria-modal="true"` attributes
- Focus restoration when closing

This makes the app inaccessible to keyboard/screen reader users and fails WCAG 2.1 compliance.

**Fix:** Add `role="dialog"`, `aria-modal="true"`, trap focus with a library like `focus-trap-react`, and handle Escape key.

---

### 20. Sign-out Navigation Race Condition

**File:** `src/components/ui/Header.jsx` (Lines ~164-173)

```js
onClick={async () => { 
  try { 
    await signOut(); 
    localStorage.removeItem('isAuthenticated');
    // ...
  } catch (e) {
    console.error('Sign out error:', e);
  } 
  navigate('/login'); 
}}
```

**What breaks:** `navigate('/login')` runs regardless of whether sign-out succeeded or failed. If `signOut()` throws, the user is navigated to login but may still have an active Firebase auth session, causing inconsistent auth state.

**Fix:** Only navigate on successful sign-out:

```js
try { 
  await signOut(); 
  localStorage.removeItem('isAuthenticated');
  navigate('/login'); 
} catch (e) {
  // Show error to user instead of navigating
}
```

---

### 21. `react-helmet` Instead of `react-helmet-async`

**Files:** `src/pages/problem-history/index.jsx`, `src/pages/test/index.jsx`, `src/pages/campus-forums/index.jsx`

**What breaks:** `react-helmet` is not thread-safe and has known issues with React 18's concurrent mode. It can cause memory leaks and duplicate tags in Strict Mode.

**Fix:** Replace with `react-helmet-async`:

```jsx
import { HelmetProvider, Helmet } from 'react-helmet-async';
// Wrap app root in <HelmetProvider>
```

---

### 22. `problemsDatabase` Object Recreated Every Render

**File:** `src/pages/problem-workspace/index.jsx` (Lines 30-170)

The entire `problemsDatabase` object (140+ lines of static data) is declared inside the component body, meaning it's recreated on every render.

**Fix:** Move `problemsDatabase` outside the component or wrap in `useMemo(() => ..., [])`.

---

## LOW Severity

### 23. `window.open` Without `noopener,noreferrer`

**File:** `src/pages/achievement-center/index.jsx` (Line ~242)

```js
onClick={() => window.open('https://www.linkedin.com/', '_blank', 'noopener')}
```

Missing `noreferrer`. Several `<a>` tags throughout the app also use `target="_blank"` without `rel="noopener noreferrer"`.

**Fix:** Always use both: `window.open(url, '_blank', 'noopener,noreferrer')` and `<a target="_blank" rel="noopener noreferrer">`.

---

### 24. `alert()` Used for User Feedback

**File:** `src/pages/achievement-center/index.jsx` (Line ~243)

```js
onClick={() => alert('Export coming soon. Visit Tutorials for guidance.')}
```

**What breaks:** `alert()` blocks the main thread and provides a poor user experience. It also looks unprofessional in production.

**Fix:** Use a toast notification library or a custom modal.

---

### 25. `NotFound` Uses Bare Import Paths

**File:** `src/pages/NotFound.jsx` (Lines 3-4)

```js
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
```

**What breaks:** These rely on Vite path aliases configured via `vite-tsconfig-paths`. While this works, it's fragile — if `jsconfig.json` paths are misconfigured or the plugin isn't loaded, these imports fail. Most other files use relative paths consistently.

**Fix:** Use relative paths for consistency: `../../components/ui/Button`.

---

### 26. `NotFound` Passes Non-standard Props to `Button`

**File:** `src/pages/NotFound.jsx` (Lines 33-35)

```jsx
<Button
  variant="primary"
  icon={<Icon name="ArrowLeft" />}
  iconPosition="left"
```

**What breaks:** The `Button` component expects `iconName` (string) and renders icons internally, not an `icon` prop (JSX element). The `variant="primary"` is also non-standard — the Button uses `"default"`. The icon won't render.

**Fix:**

```jsx
<Button variant="default" iconName="ArrowLeft" iconPosition="left">
```

---

### 27. `useEffect` Dependency Warning - `problemsDatabase` Not in Deps

**File:** `src/pages/problem-workspace/index.jsx` (Line ~173)

```js
useEffect(() => {
  if (problemId && problemsDatabase[problemId]) {
    setCurrentProblem(problemsDatabase[problemId]);
  } else {
    setCurrentProblem(problemsDatabase[1]);
  }
}, [problemId]);
```

`problemsDatabase` is used but not in the dependency array. Since it's defined inside the component, React's exhaustive-deps rule will warn.

**Fix:** Move `problemsDatabase` outside the component.

---

### 28. Large 1660-Line Component (Maintainability)

**File:** `src/pages/campus-forums/index.jsx` — 1,660 lines

**What breaks:** Not a runtime issue, but the file is extremely large with multiple inline component definitions (`InstagramPost`, `FriendRequestsModal`, `CreatePostModal`, `Sidebar`, `ForumView`), state hooks declared after component definitions, and duplicated rendering logic. This makes the code nearly unmaintainable and increases the risk of bugs.

**Fix:** Extract inline components to separate files. Move state that's declared after component definitions to the top of the parent component.

---

### 29. `styled-components` Mixed with Tailwind CSS (Inconsistency)

**Files:** `src/components/ui/DarkModeToggle.jsx`, `src/components/ui/StyledCard.jsx`

**What breaks:** The codebase overwhelmingly uses Tailwind CSS, but two components use `styled-components`. This creates bundle bloat (styled-components runtime ~12KB gzipped) and developer confusion about which styling approach to use.

**Fix:** Convert to Tailwind CSS for consistency, or at minimum document the decision.

---

### 30. No Error Boundaries on Individual Routes

**File:** `src/Routes.jsx`

There's a single top-level `<ErrorBoundary>` wrapping all routes. If any page crashes, the entire application shows the error fallback. Individual routes lack granular error boundaries.

**Fix:** Add per-route error boundaries so only the affected page shows an error, while navigation remains functional.

---

## Summary by Category

| Category | Critical | High | Medium | Low |
|---|---|---|---|---|
| **Security** | 2 | 0 | 0 | 1 |
| **Data Integrity** | 1 | 0 | 0 | 0 |
| **Performance** | 0 | 3 | 2 | 0 |
| **Broken Functionality** | 0 | 3 | 2 | 2 |
| **Memory Leaks** | 0 | 0 | 1 | 0 |
| **Bundle Size** | 0 | 2 | 0 | 1 |
| **Accessibility** | 0 | 0 | 1 | 0 |
| **Code Quality** | 0 | 0 | 3 | 4 |
| **Crash Risk** | 0 | 1 | 1 | 0 |

**Total: 3 Critical, 9 High, 10 Medium, 8 Low**

---

## Priority Action Plan

1. **Immediately** fix Critical #1 (credentials), #2 (code execution), #3 (createUser)
2. **Before launch** fix all High issues (#4-#11)
3. **Soon after** address Medium issues (#12-#22)
4. **Ongoing** clean up Low issues (#23-#30)
