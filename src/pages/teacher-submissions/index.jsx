import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

const mockSubmissions = [
  { id: 'sub1', student: 'Aditya Deore', assignment: 'BST Insert and Delete', course: 'CS201', submittedAt: '2026-04-03T11:22:00', status: 'submitted', score: null, integrityRisk: 12 },
  { id: 'sub2', student: 'Rahul Sharma', assignment: 'BST Insert and Delete', course: 'CS201', submittedAt: '2026-04-03T13:05:00', status: 'needs-review', score: null, integrityRisk: 82 },
  { id: 'sub3', student: 'Sneha Joshi', assignment: 'Graph Traversal BFS DFS', course: 'CS201', submittedAt: '2026-04-02T17:15:00', status: 'graded', score: 91, integrityRisk: 8 },
  { id: 'sub4', student: 'Prathamesh Pawar', assignment: 'Graph Traversal BFS DFS', course: 'CS201', submittedAt: '2026-04-03T08:54:00', status: 'submitted', score: null, integrityRisk: 44 },
  { id: 'sub5', student: 'Sarang Thakare', assignment: 'SQL Joins and Subqueries', course: 'CS202', submittedAt: '2026-04-01T19:30:00', status: 'graded', score: 76, integrityRisk: 21 },
];

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

const toReviewRecordId = (submissionId) => {
  if (submissionId.startsWith('sub_')) return submissionId;
  if (submissionId.startsWith('sub')) return submissionId.replace(/^sub/, 'sub_');
  return submissionId;
};

const formatStatusLabel = (status) => {
  if (status === 'needs-review') return 'Needs Review';
  if (status === 'resubmission-requested') return 'Resubmission Requested';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const statusBadge = (status) => {
  if (status === 'graded') return 'bg-emerald-50 text-emerald-700';
  if (status === 'draft') return 'bg-blue-50 text-blue-700';
  if (status === 'resubmission-requested') return 'bg-red-50 text-red-700';
  if (status === 'needs-review') return 'bg-red-50 text-red-700';
  return 'bg-amber-50 text-amber-700';
};

const TeacherSubmissions = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [reviewRecords] = useState(() => loadReviewRecords());

  const submissions = useMemo(() => {
    return mockSubmissions.map((s) => {
      const record = reviewRecords[toReviewRecordId(s.id)];
      if (!record) return s;

      const nextStatus =
        record.status === 'published'
          ? 'graded'
          : record.status === 'resubmission_requested'
            ? 'resubmission-requested'
            : record.status === 'draft'
              ? 'draft'
              : s.status;

      return {
        ...s,
        status: nextStatus,
        score: typeof record.totalScore === 'number' ? record.totalScore : s.score,
      };
    });
  }, [reviewRecords]);

  const courses = useMemo(() => ['all', ...Array.from(new Set(submissions.map((s) => s.course)))], [submissions]);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const q = query.trim().toLowerCase();
      const matchQuery = !q || s.student.toLowerCase().includes(q) || s.assignment.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchCourse = courseFilter === 'all' || s.course === courseFilter;
      return matchQuery && matchStatus && matchCourse;
    });
  }, [submissions, query, statusFilter, courseFilter]);

  const stats = useMemo(() => {
    return {
      total: filtered.length,
      review: filtered.filter((s) => s.status !== 'graded').length,
      graded: filtered.filter((s) => s.status === 'graded').length,
      highRisk: filtered.filter((s) => s.integrityRisk >= 70).length,
    };
  }, [filtered]);

  return (
    <>
      <Helmet>
        <title>Teacher Submission Queue - CodeCampus</title>
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1200px] mx-auto px-5 py-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">Submission Queue</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">Review, grade, and triage integrity-risk submissions.</p>
              </div>
              <div className="flex gap-2">
                <Link to="/teacher-review" className="px-3.5 py-[7px] bg-blue-600 text-white text-[12px] font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5">
                  <Icon name="ClipboardCheck" size={13} /> Open Review Center
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Visible</p><p className="text-[20px] font-semibold text-slate-900">{stats.total}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Needs Review</p><p className="text-[20px] font-semibold text-amber-600">{stats.review}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Graded</p><p className="text-[20px] font-semibold text-emerald-600">{stats.graded}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">High Risk</p><p className="text-[20px] font-semibold text-red-600">{stats.highRisk}</p></div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/80 p-4 mb-4">
              <div className="grid md:grid-cols-3 gap-3">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student or assignment" className="border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="needs-review">Needs Review</option>
                  <option value="draft">Draft Saved</option>
                  <option value="resubmission-requested">Resubmission Requested</option>
                  <option value="graded">Graded</option>
                </select>
                <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {courses.map((c) => <option key={c} value={c}>{c === 'all' ? 'All Courses' : c}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Student</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Assignment</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Course</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Submitted</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Risk</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Status</th>
                      <th className="text-right text-[11px] font-semibold text-slate-500 px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                        <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{s.student}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{s.assignment}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{s.course}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{new Date(s.submittedAt).toLocaleString()}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{s.integrityRisk}%</td>
                        <td className="px-4 py-3"><span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusBadge(s.status)}`}>{formatStatusLabel(s.status)}</span></td>
                        <td className="px-4 py-3 text-right">
                          <Link to="/teacher-review" className="px-2.5 py-1.5 text-[11px] font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                            {s.status === 'graded' ? 'Re-open' : s.status === 'resubmission-requested' ? 'Follow Up' : 'Review'}
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-[13px] text-slate-500">No submissions matched your filters.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TeacherSubmissions;
