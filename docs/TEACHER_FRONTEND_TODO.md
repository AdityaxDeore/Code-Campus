# Teacher Frontend To Do

This document defines the complete teacher-facing frontend scope for CodeCampus.

## Purpose
- Give teachers a full workflow from assignment creation to grading and integrity review.
- Standardize features so implementation does not drift.
- Provide a clear phased rollout plan.

## 1. Dashboard Overview
- Show summary cards: active courses, active assignments, pending grading, overdue submissions, integrity alerts.
- Show quick feed: recent submissions, recent announcements, student activity.
- Show upcoming items: due today, due this week, exam windows.
- Allow quick course/section switch from global header.
- Provide global search across students, assignments, and submissions.

## 2. Course and Class Management
- Create, edit, archive courses.
- Create sections and map to semester/term.
- Invite students by code/link/email.
- Import class roster from CSV.
- View class roster table with status and contact details.
- Move students between sections.

## 3. Assignment Authoring
- Create coding assignments with title, description, language, marks, deadline.
- Create report/document assignments with upload rules.
- Add starter files and reference resources.
- Add rubric criteria and weights.
- Add hidden/public test cases.
- Configure assignment-level integrity policy.
- Save draft, publish, unpublish, duplicate, archive.
- Schedule release and close windows.

## 4. Problem Bank and Reuse
- Maintain a reusable problem bank.
- Tag problems by topic, difficulty, and outcome.
- Clone/import problems into new assignments.
- Version assignment content safely.

## 5. Submission Queue and Review
- List submissions with filters by course, assignment, status, date.
- Open code submissions in read-only editor.
- Open report submissions in document/PDF viewer.
- Compare submission against starter/template.
- Download submission bundle.
- Mark late/on-time status.

## 6. Grading and Feedback
- Grade by rubric with per-criterion scoring.
- Add inline comments for code lines.
- Add general feedback summary.
- Save draft grades.
- Publish final grades.
- Request resubmission with reason.
- Bulk grade objective items where possible.
- Export gradebook to CSV/Excel.

## 7. Integrity and Proctoring Center
- Display integrity score per submission.
- Show event timeline: paste events, tab switches, fullscreen exits, AI usage.
- Show AI detection report with confidence and evidence snippets.
- Flag, clear, or escalate integrity cases.
- Add private teacher notes per case.
- Show class-level integrity trends.

## 8. Communication and Notices
- Post assignment announcements.
- Send reminders to class or selected students.
- Respond to student questions linked to assignments.
- Publish feedback announcements after grading.

## 9. Student Insights and Analytics
- Student-level analytics: completion, average score, weak topics.
- Assignment-level analytics: score distribution, failure hotspots.
- Class-level trend charts over time.
- At-risk student indicators and watchlist.

## 10. Forum and Community Moderation
- Create pinned instructional posts.
- Moderate comments/posts: hide, lock, remove.
- Highlight good submissions and projects.

## 11. Teacher Settings
- Manage profile and teaching preferences.
- Configure default grading preferences.
- Configure default integrity policy profiles.
- Configure notification channels.

## 12. Advanced Features (Later)
- Co-teacher collaboration and permissions.
- Live exam monitoring mode.
- AI-assisted feedback drafting.
- LMS import/export connectors.

## Suggested Page Map
- Teacher Home Dashboard
- Courses
- Course Details
- Assignment Builder
- Assignment Details
- Submission Queue
- Submission Review
- Integrity Center
- Gradebook
- Analytics
- Announcements
- Teacher Settings

## MVP Build Order
1. Teacher Home Dashboard
2. Assignment Builder
3. Submission Queue
4. Submission Review + Grading
5. Integrity Center
6. Gradebook Export
7. Analytics and Announcements
