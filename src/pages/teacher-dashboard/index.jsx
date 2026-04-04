import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useRole } from '../../contexts/RoleContext';
import { getCurrentUser, getSession, onAuthStateChange } from '../../utils/auth';
import { getAssignments } from '../../lib/assignmentService';

/* ════════════════════════════════════════════════════════════
                      { label: 'Manage Courses', icon: 'BookOpen', path: '/teacher-courses', color: 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100' },
   Mock Data
   ════════════════════════════════════════════════════════════ */
const mockCourses = [
  { id: 'c1', name: 'Data Structures & Algorithms', code: 'CS201', students: 64, color: '#3b82f6' },
  { id: 'c2', name: 'Algorithm Design', code: 'CS301', students: 42, color: '#8b5cf6' },
  { id: 'c3', name: 'Database Systems', code: 'CS202', students: 55, color: '#06b6d4' },
];

const mockAssignments = [
  { id: 'a1', title: 'Binary Search Tree Implementation', course: 'CS201', due: new Date(Date.now() + 48 * 36e5).toISOString(), submissions: 38, total: 64, graded: 12, status: 'active' },
                      { label: 'Open Gradebook', icon: 'Table', path: '/teacher-gradebook', color: 'text-teal-600 bg-teal-50 hover:bg-teal-100' },
  { id: 'a2', title: 'Graph Traversal – BFS & DFS', course: 'CS201', due: new Date(Date.now() + 120 * 36e5).toISOString(), submissions: 5, total: 64, graded: 0, status: 'active' },
  { id: 'a3', title: 'Knapsack Problem', course: 'CS301', due: new Date(Date.now() + 168 * 36e5).toISOString(), submissions: 0, total: 42, graded: 0, status: 'draft' },
  { id: 'a4', title: 'Linked List Operations', course: 'CS201', due: new Date(Date.now() - 72 * 36e5).toISOString(), submissions: 62, total: 64, graded: 62, status: 'closed' },
  { id: 'a5', title: 'SQL Joins & Subqueries', course: 'CS202', due: new Date(Date.now() - 120 * 36e5).toISOString(), submissions: 51, total: 55, graded: 51, status: 'closed' },
];

const mockIntegrityFlags = [
  { id: 'f1', student: 'Rahul Sharma', assignment: 'BST Implementation', risk: 87, reason: 'Large paste (340 chars) + minimal keystrokes', time: '2h ago' },
  { id: 'f2', student: 'Priya Patel', assignment: 'BST Implementation', risk: 62, reason: 'Tab switch detected (3 times)', time: '5h ago' },
  { id: 'f3', student: 'Amit Kumar', assignment: 'Linked List Ops', risk: 45, reason: 'Unusual typing pattern', time: '1d ago' },
];

const mockRecentSubmissions = [
  { id: 's1', student: 'Aditya Deore', assignment: 'BST Implementation', time: '12 min ago', score: null },
  { id: 's2', student: 'Sneha Joshi', assignment: 'BST Implementation', time: '28 min ago', score: null },
  { id: 's3', student: 'Rahul Sharma', assignment: 'BST Implementation', time: '1h ago', score: 85 },
  { id: 's4', student: 'Priya Patel', assignment: 'Graph Traversal', time: '2h ago', score: null },
  { id: 's5', student: 'Vikram Singh', assignment: 'BST Implementation', time: '3h ago', score: 92 },
];

const mapDashboardAssignment = (assignment) => {
  const status = assignment.status === 'active' ? 'active' : assignment.status || 'draft';
  return {
    id: assignment._id,
    title: assignment.title || 'Untitled Assignment',
    course: assignment.course || 'General',
    due: assignment.deadline || new Date().toISOString(),
    submissions: assignment.submissions || 0,
    total: assignment.totalStudents || 0,
    graded: assignment.graded || 0,
    status,
  };
};

const REVIEW_RECORDS_STORAGE_KEY = 'codecampus_teacher_review_records_v1';

const loadReviewRecords = () => {
  try {
    const raw = localStorage.getItem(REVIEW_RECORDS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const normalizeName = (name) => (name || '').toLowerCase().replace(/\s+/g, ' ').trim();

const getRecentStatusMeta = (status) => {
  if (status === 'published') {
    return { label: 'Final Grade Published', className: 'text-emerald-600 bg-emerald-50' };
  }
  if (status === 'draft') {
    return { label: 'Draft Saved', className: 'text-blue-600 bg-blue-50' };
  }
  if (status === 'resubmission_requested') {
    return { label: 'Resubmission Requested', className: 'text-red-600 bg-red-50' };
  }
  return { label: 'Ungraded', className: 'text-amber-500 bg-amber-50' };
};

/* ════════════════════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════════════════════ */
const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const formatDeadline = (iso) => {
  const h = (new Date(iso) - Date.now()) / 36e5;
  if (h < 0) return { label: 'Closed', color: 'text-slate-400' };
  if (h < 24) return { label: `${Math.ceil(h)}h left`, color: 'text-red-500' };
  if (h < 72) return { label: `${Math.ceil(h / 24)}d left`, color: 'text-amber-500' };
  return { label: `${Math.ceil(h / 24)}d left`, color: 'text-slate-500' };
};

const getRiskColor = (risk) => {
  if (risk >= 75) return { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' };
  if (risk >= 50) return { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' };
  return { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' };
};

/* ════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════ */
const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [reviewRecords, setReviewRecords] = useState(() => loadReviewRecords());
  const [assignments, setAssignments] = useState(mockAssignments);

  useEffect(() => {
    if (role !== 'teacher') { navigate('/student-dashboard'); return; }
    const checkAuth = async () => {
      const user = getCurrentUser();
      if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || '');
        setUserEmail(user.email || '');
        return;
      }
      const session = await getSession();
      if (session?.user) {
        setUserName(session.user.displayName || session.user.email?.split('@')[0] || '');
        setUserEmail(session.user.email || '');
        return;
      }
      if (!localStorage.getItem('isAuthenticated')) { navigate('/login'); return; }
      setUserName(localStorage.getItem('userName') || '');
      setUserEmail(localStorage.getItem('userEmail') || '');
    };
    checkAuth();
    const unsub = onAuthStateChange((user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || '');
        setUserEmail(user.email || '');
      } else if (localStorage.getItem('isAuthenticated') === 'true') {
        setUserName(localStorage.getItem('userName') || 'Teacher');
        setUserEmail(localStorage.getItem('userEmail') || '');
      } else {
        navigate('/login');
      }
    });
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [navigate, role]);

  useEffect(() => {
    const refreshReviewRecords = () => {
      setReviewRecords(loadReviewRecords());
    };

    window.addEventListener('focus', refreshReviewRecords);
    window.addEventListener('storage', refreshReviewRecords);
    return () => {
      window.removeEventListener('focus', refreshReviewRecords);
      window.removeEventListener('storage', refreshReviewRecords);
    };
  }, []);

  useEffect(() => {
    const loadAssignments = async () => {
      const result = await getAssignments();
      if (!result.success) return;
      setAssignments(result.assignments.map(mapDashboardAssignment));
    };
    loadAssignments();
  }, []);

  const totalStudents = mockCourses.reduce((s, c) => s + c.students, 0);
  const defaultPendingGrading = assignments.reduce((s, a) => s + (a.submissions - a.graded), 0);
  const activeAssignments = assignments.filter(a => a.status === 'active' || a.status === 'published');
  const closedAssignments = assignments.filter(a => a.status === 'closed');

  const reviewLifecycle = useMemo(() => {
    const records = Object.values(reviewRecords);
    const totalTracked = records.length;
    const publishedCount = records.filter((r) => r.status === 'published').length;
    const draftCount = records.filter((r) => r.status === 'draft').length;
    const resubmissionCount = records.filter((r) => r.status === 'resubmission_requested').length;
    return {
      totalTracked,
      publishedCount,
      draftCount,
      resubmissionCount,
      pendingCount: Math.max(totalTracked - publishedCount, 0),
      hasData: totalTracked > 0,
    };
  }, [reviewRecords]);

  const pendingGrading = reviewLifecycle.hasData ? reviewLifecycle.pendingCount : defaultPendingGrading;

  const recentSubmissions = useMemo(() => {
    const recordByStudent = new Map();
    Object.values(reviewRecords).forEach((record) => {
      if (record?.studentName) {
        recordByStudent.set(normalizeName(record.studentName), record);
      }
    });

    return mockRecentSubmissions.map((submission) => {
      const record = recordByStudent.get(normalizeName(submission.student));
      if (!record) {
        return {
          ...submission,
          lifecycleStatus: submission.score !== null ? 'published' : 'pending',
        };
      }

      return {
        ...submission,
        score: record.status === 'published' ? record.totalScore : submission.score,
        lifecycleStatus: record.status,
      };
    });
  }, [reviewRecords]);

  return (
    <>
      <Helmet>
        <title>Teacher Dashboard – CodeCampus</title>
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1200px] mx-auto px-5 py-7">

            {/* ─── Greeting ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Teacher</span>
                </div>
                <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">
                  {getGreeting()}{userName ? `, ${userName}` : ''}
                </h1>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  {userEmail || 'Manage your courses and assignments'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/assignment-creation">
                  <Button size="sm" iconName="Plus" iconPosition="left">
                    Create Assignment
                  </Button>
                </Link>
                <Link to="/teacher-review">
                  <Button variant="outline" size="sm" iconName="CheckSquare" iconPosition="left">
                    Review Submissions
                  </Button>
                </Link>
              </div>
            </div>

            {/* ─── Stat Cards ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 mb-7">
              {[
                { label: 'Total Students', val: totalStudents, icon: 'Users', c: '#3b82f6' },
                { label: 'Active Courses', val: mockCourses.length, icon: 'BookOpen', c: '#8b5cf6' },
                { label: 'Active Assignments', val: activeAssignments.length, icon: 'ClipboardList', c: '#f59e0b' },
                { label: 'Pending Grading', val: pendingGrading, icon: 'Clock', c: '#ef4444' },
                { label: 'Draft Grades', val: reviewLifecycle.draftCount, icon: 'Save', c: '#2563eb' },
                { label: 'Resub Requests', val: reviewLifecycle.resubmissionCount, icon: 'RotateCcw', c: '#dc2626' },
                { label: 'Integrity Flags', val: mockIntegrityFlags.length, icon: 'Shield', c: '#f97316' },
              ].map((s, i) => (
                <div key={i}
                  className="bg-white rounded-lg px-4 py-3.5 border border-slate-200/80 hover:border-slate-300 transition-colors cursor-default"
                  style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: s.c + '12' }}>
                      <Icon name={s.icon} size={15} style={{ color: s.c }} />
                    </div>
                    <div>
                      <p className="text-[18px] font-semibold text-slate-900 leading-none">{s.val}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{s.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Main Grid ─── */}
            <div className="grid lg:grid-cols-[1fr_340px] gap-5">

              {/* Left Column */}
              <div className="space-y-5">

                {/* ── Active Assignments ── */}
                <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-slate-800 flex items-center gap-1.5">
                      <Icon name="ClipboardList" size={14} className="text-blue-500" />
                      Active Assignments
                    </h2>
                    <Link to="/assignments" className="text-[11px] text-blue-500 hover:text-blue-600 font-medium">View All</Link>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {activeAssignments.map(a => {
                      const dl = formatDeadline(a.due);
                      const pct = a.total > 0 ? Math.round((a.submissions / a.total) * 100) : 0;
                      return (
                        <div key={a.id} className="px-4 py-3 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[13px] font-medium text-slate-800 truncate">{a.title}</span>
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{a.course}</span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                <span className={`font-medium ${dl.color}`}><Icon name="Clock" size={10} className="inline mr-0.5" />{dl.label}</span>
                                <span>{a.submissions}/{a.total} submitted</span>
                                <span>{a.graded} graded</span>
                              </div>
                              <div className="w-full max-w-[200px] bg-slate-100 rounded-full h-1 mt-2">
                                <div className="bg-blue-500 h-1 rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                            <Link to={`/teacher-review?assignment=${a.id}`}>
                              <button className="px-2.5 py-[5px] bg-blue-50 text-blue-600 text-[11px] font-medium rounded-md hover:bg-blue-100 transition-colors whitespace-nowrap">
                                <Icon name="Eye" size={11} className="inline mr-1" />Grade
                              </button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                    {activeAssignments.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <Icon name="Inbox" size={24} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-[12px] text-slate-400">No active assignments</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Courses ── */}
                <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h2 className="text-[14px] font-semibold text-slate-800 flex items-center gap-1.5">
                      <Icon name="BookOpen" size={14} className="text-purple-500" />
                      My Courses
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    {mockCourses.map(c => (
                      <div key={c.id} className="px-4 py-4 hover:bg-slate-50/50 transition-colors cursor-default">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{c.code}</span>
                        </div>
                        <p className="text-[13px] font-medium text-slate-800 mb-1 leading-snug">{c.name}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Icon name="Users" size={10} />{c.students} students
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Closed / Past Assignments ── */}
                <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h2 className="text-[14px] font-semibold text-slate-800 flex items-center gap-1.5">
                      <Icon name="Archive" size={14} className="text-slate-400" />
                      Past Assignments
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {closedAssignments.map(a => (
                      <div key={a.id} className="px-4 py-3 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[13px] font-medium text-slate-700">{a.title}</span>
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded ml-2">{a.course}</span>
                          </div>
                          <div className="text-right text-[11px]">
                            <span className="text-emerald-600 font-medium">{a.graded}/{a.total} graded</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">

                {/* ── Integrity Flags ── */}
                <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-slate-800 flex items-center gap-1.5">
                      <Icon name="ShieldAlert" size={14} className="text-orange-500" />
                      Integrity Flags
                    </h2>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">
                      {mockIntegrityFlags.length} flagged
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {mockIntegrityFlags.map(f => {
                      const rc = getRiskColor(f.risk);
                      return (
                        <div key={f.id} className="px-4 py-3 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[12px] font-medium text-slate-800">{f.student}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rc.bg} ${rc.text}`}>
                              {f.risk}% risk
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mb-1">{f.assignment}</p>
                          <p className="text-[10px] text-slate-400 italic">{f.reason}</p>
                          <div className="w-full bg-slate-100 rounded-full h-0.5 mt-2">
                            <div className={`h-0.5 rounded-full ${rc.bar}`} style={{ width: `${f.risk}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100">
                    <Link to="/teacher-review" className="text-[11px] text-blue-500 hover:text-blue-600 font-medium">
                      Review all flags →
                    </Link>
                  </div>
                </div>

                {/* ── Recent Submissions ── */}
                <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h2 className="text-[14px] font-semibold text-slate-800 flex items-center gap-1.5">
                      <Icon name="FileCheck" size={14} className="text-emerald-500" />
                      Recent Submissions
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {recentSubmissions.map(s => {
                      const statusMeta = getRecentStatusMeta(s.lifecycleStatus);
                      return (
                      <div key={s.id} className="px-4 py-2.5 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-medium text-slate-800 truncate">{s.student}</p>
                            <p className="text-[10px] text-slate-400 truncate">{s.assignment}</p>
                          </div>
                          <div className="text-right ml-3 flex-shrink-0">
                            {s.lifecycleStatus === 'published' && s.score !== null ? (
                              <span className="text-[11px] font-semibold text-emerald-600">{s.score}/100</span>
                            ) : (
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statusMeta.className}`}>{statusMeta.label}</span>
                            )}
                            <p className="text-[9px] text-slate-400 mt-0.5">{s.time}</p>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>

                {/* ── Quick Actions ── */}
                <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h2 className="text-[14px] font-semibold text-slate-800 flex items-center gap-1.5">
                      <Icon name="Zap" size={14} className="text-amber-500" />
                      Quick Actions
                    </h2>
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { label: 'Create New Assignment', icon: 'PlusCircle', path: '/assignment-creation', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
                      { label: 'View Students', icon: 'Users', path: '/teacher-students', color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' },
                      { label: 'Grade Submissions', icon: 'CheckSquare', path: '/teacher-review', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
                      { label: 'View Forums', icon: 'MessageSquare', path: '/campus-forums', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
                      { label: 'View Leaderboard', icon: 'Trophy', path: '/achievement-center', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
                    ].map((a, i) => (
                      <Link key={i} to={a.path}>
                        <button className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] font-medium rounded-md transition-colors ${a.color}`}>
                          <Icon name={a.icon} size={14} />
                          {a.label}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default TeacherDashboard;
