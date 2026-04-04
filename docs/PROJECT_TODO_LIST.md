# Project To Do List

This is the consolidated remaining work list for moving CodeCampus from prototype stage to production-ready.

## P0 - Critical Foundation
- [ ] Unify authentication flow across login, session state, and protected routes.
- [ ] Choose one backend strategy and remove mixed runtime ambiguity (Firebase-first or Express-first).
- [ ] Replace in-memory assignment persistence with durable storage.
- [ ] Implement full role-based access control (student, teacher, admin).
- [ ] Wire role provider and enforce role-based route guards.
- [ ] Harden code execution path (remove weak client-only execution for production workloads).
- [ ] Implement secure remote code runner integration for real execution.
- [ ] Finalize secure environment configuration and remove sensitive local defaults from backend code.

## P1 - Core Product Completion
- [ ] Complete teacher assignment lifecycle (create, publish, review, grade, feedback, resubmission).
- [ ] Implement end-to-end submission persistence for code and reports.
- [ ] Build complete integrity case management workflow.
- [ ] Integrate file upload pipeline with storage, metadata, validation, and retrieval.
- [ ] Complete forum backend integration (posts, comments, reactions, moderation).
- [ ] Complete notification system (in-app reminders and assignment updates).
- [ ] Add gradebook view and export.
- [ ] Add assignment and class analytics.

## P2 - Stability, Security, and Quality
- [ ] Add full API/input validation on all write paths.
- [ ] Strengthen Firestore rules and permission checks.
- [ ] Add centralized error handling and user-friendly failure states.
- [ ] Add structured logging and production monitoring.
- [ ] Add automated tests for auth, route protection, data services, grading, and integrity flows.
- [ ] Add regression tests for critical pages.
- [ ] Refactor oversized page modules into smaller components/hooks.
- [ ] Clean up dead code, stale docs, and legacy pathways.

## P3 - Performance and Scalability
- [ ] Audit bundle size and remove unused dependencies.
- [ ] Optimize route-level code splitting and heavy page loads.
- [ ] Add caching and query optimization for analytics-heavy screens.
- [ ] Improve rendering performance on large lists and dashboards.

## P4 - Product Expansion
- [ ] Realtime collaboration features (presence, shared editing).
- [ ] Co-teacher workflows and delegated permissions.
- [ ] Advanced proctoring analytics and alerting.
- [ ] LMS integration and external interoperability.
- [ ] Advanced AI teaching assistant workflows.

## Known Architectural Gaps To Resolve
- [ ] Auth mismatch: login path and protected route checks use different assumptions.
- [ ] Route coverage mismatch: some page modules exist but are not currently wired.
- [ ] Provider mismatch: role context exists but is not mounted at app root.
- [ ] Data maturity mismatch: several screens rely on mock data.
- [ ] Documentation mismatch: some docs reflect older code state and need synchronization.

## Suggested Execution Sequence
1. Authentication and route guard unification.
2. Assignment/submission data model hardening.
3. Teacher dashboard and grading workflows.
4. Integrity center and analytics.
5. Security and test hardening.
6. Performance and scale improvements.

## Definition of Done (Production Baseline)
- [ ] Single coherent auth and authorization model.
- [ ] Durable persistence for all core entities.
- [ ] Complete teacher workflow from authoring to grading.
- [ ] Integrity reports actionable in UI and auditable.
- [ ] Stable deployment with monitoring and tests.
- [ ] Documentation aligned with actual implementation.
