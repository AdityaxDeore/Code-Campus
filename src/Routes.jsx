import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import TeacherRoute from "components/TeacherRoute";
import StudentRoute from "components/StudentRoute";
import Loading from "components/Loading";

// Eagerly loaded components
import NotFound from "pages/NotFound";
import Homepage from './pages/homepage';
import Login from './pages/login';

// Lazily loaded components
const CampusForums = lazy(() => import('./pages/campus-forums'));
const AchievementCenter = lazy(() => import('./pages/achievement-center'));
const ProblemWorkspace = lazy(() => import('./pages/problem-workspace'));
const AboutCodeCampus = lazy(() => import('./pages/about-code-campus'));
const StudentDashboard = lazy(() => import('./pages/student-dashboard'));
const ComingSoon = lazy(() => import('./pages/coming-soon'));
const Projects = lazy(() => import('./pages/projects'));
const StatusPage = lazy(() => import('./pages/status'));
const ProblemHistory = lazy(() => import('./pages/problem-history'));
const Problems = lazy(() => import('./pages/problems'));
const LearningPathways = lazy(() => import('./pages/learning-pathways'));
const Assignments = lazy(() => import('./pages/assignments'));
const AssignmentWorkspace = lazy(() => import('./pages/assignment-workspace'));
const AssignmentCreation = lazy(() => import('./pages/assignment-creation'));
const TeacherReview = lazy(() => import('./pages/teacher-review'));
const TestPage = lazy(() => import('./pages/test'));
const ReportSubmission = lazy(() => import('./pages/report-submission'));
const TeacherDashboard = lazy(() => import('./pages/teacher-dashboard'));
const TeacherStudents = lazy(() => import('./pages/teacher-students'));
const TeacherCourses = lazy(() => import('./pages/teacher-courses'));
const TeacherAssignments = lazy(() => import('./pages/teacher-assignments'));
const TeacherSubmissions = lazy(() => import('./pages/teacher-submissions'));
const TeacherGradebook = lazy(() => import('./pages/teacher-gradebook'));
const TeacherSettings = lazy(() => import('./pages/teacher-settings'));

const Routes = () => {
  return (
    <BrowserRouter basename="/codecampus">
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about-code-campus" element={
          <Suspense fallback={<Loading />}>
            <AboutCodeCampus />
          </Suspense>
        } />
        <Route path="/status" element={
          <Suspense fallback={<Loading />}>
            <StatusPage />
          </Suspense>
        } />
        
        {/* Protected routes */}
        <Route path="/student-dashboard" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <StudentDashboard />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/campus-forums" element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <CampusForums />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/achievement-center" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <AchievementCenter />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/problems" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <Problems />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/learning-pathways" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <LearningPathways />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/assignments" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <Assignments />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/assignment-workspace" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <AssignmentWorkspace />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/assignment-creation" element={
          <TeacherRoute>
            <Suspense fallback={<Loading />}>
              <AssignmentCreation />
            </Suspense>
          </TeacherRoute>
        } />
        <Route path="/create-assignment" element={
          <TeacherRoute>
            <Navigate to="/assignment-creation" replace />
          </TeacherRoute>
        } />
        <Route path="/teacher-dashboard" element={
          <TeacherRoute>
            <Suspense fallback={<Loading />}>
              <TeacherDashboard />
            </Suspense>
          </TeacherRoute>
        } />
        <Route path="/teacher-students" element={
          <TeacherRoute>
            <Suspense fallback={<Loading />}>
              <TeacherStudents />
            </Suspense>
          </TeacherRoute>
        } />
        <Route path="/teacher-courses" element={
          <TeacherRoute>
            <Suspense fallback={<Loading />}>
              <TeacherCourses />
            </Suspense>
          </TeacherRoute>
        } />
        <Route path="/teacher-review" element={
          <TeacherRoute>
            <Suspense fallback={<Loading />}>
              <TeacherReview />
            </Suspense>
          </TeacherRoute>
        } />
        <Route path="/teacher-assignments" element={
          <TeacherRoute>
            <Suspense fallback={<Loading />}>
              <TeacherAssignments />
            </Suspense>
          </TeacherRoute>
        } />
        <Route path="/teacher-submissions" element={
          <TeacherRoute>
            <Suspense fallback={<Loading />}>
              <TeacherSubmissions />
            </Suspense>
          </TeacherRoute>
        } />
        <Route path="/teacher-gradebook" element={
          <TeacherRoute>
            <Suspense fallback={<Loading />}>
              <TeacherGradebook />
            </Suspense>
          </TeacherRoute>
        } />
        <Route path="/teacher-settings" element={
          <TeacherRoute>
            <Suspense fallback={<Loading />}>
              <TeacherSettings />
            </Suspense>
          </TeacherRoute>
        } />
        <Route path="/report-submission" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <ReportSubmission />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/test" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <TestPage />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/problem-workspace" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <ProblemWorkspace />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/problem-history" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <ProblemHistory />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/projects" element={
          <StudentRoute>
            <Suspense fallback={<Loading />}>
              <Projects />
            </Suspense>
          </StudentRoute>
        } />
        <Route path="/coming-soon" element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ComingSoon />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Placeholder routes - Protected */}
        <Route path="/settings" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/success-stories" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/study-groups" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/mentorship" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/tutorials" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        
        {/* Public placeholder routes */}
        <Route path="/blog" element={<ComingSoon />} />
        <Route path="/getting-started" element={<ComingSoon />} />
        <Route path="/docs" element={<ComingSoon />} />
        <Route path="/api" element={<ComingSoon />} />
        <Route path="/careers" element={<ComingSoon />} />
        <Route path="/press" element={<ComingSoon />} />
        <Route path="/partners" element={<ComingSoon />} />
        <Route path="/contact" element={<ComingSoon />} />
        <Route path="/privacy" element={<ComingSoon />} />
        <Route path="/terms" element={<ComingSoon />} />
        <Route path="/cookies" element={<ComingSoon />} />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
