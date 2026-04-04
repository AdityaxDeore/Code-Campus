import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

const REVIEW_RECORDS_STORAGE_KEY = 'codecampus_teacher_review_records_v1';

const SUBMISSION_META = {
  sub_1: { studentName: 'Aditya Deore', assignmentTitle: 'Binary Search Tree – Insert & Delete', course: 'CS201', maxMarks: 100 },
  sub_2: { studentName: 'Chinmay Ahire', assignmentTitle: 'Binary Search Tree – Insert & Delete', course: 'CS201', maxMarks: 100 },
  sub_3: { studentName: 'Aditya Gurav', assignmentTitle: 'Binary Search Tree – Insert & Delete', course: 'CS201', maxMarks: 100 },
  sub_4: { studentName: 'Ved Jadhav', assignmentTitle: 'Binary Search Tree – Insert & Delete', course: 'CS201', maxMarks: 100 },
  sub_5: { studentName: 'Veerbhadra Manhat', assignmentTitle: 'Binary Search Tree – Insert & Delete', course: 'CS201', maxMarks: 100 },
  sub_6: { studentName: 'Sharvil Patil', assignmentTitle: 'Binary Search Tree – Insert & Delete', course: 'CS201', maxMarks: 100 },
};

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

const formatStatus = (status) => {
  if (status === 'published') return 'Published';
  if (status === 'draft') return 'Draft';
  if (status === 'resubmission_requested') return 'Resubmission Requested';
  return 'Pending';
};

const statusClass = (status) => {
  if (status === 'published') return 'bg-emerald-50 text-emerald-700';
  if (status === 'draft') return 'bg-blue-50 text-blue-700';
  if (status === 'resubmission_requested') return 'bg-red-50 text-red-700';
  return 'bg-amber-50 text-amber-700';
};

const toCsvCell = (value) => {
  const raw = String(value ?? '');
  const escaped = raw.replace(/"/g, '""');
  return `"${escaped}"`;
};

const TeacherGradebook = () => {
  const [records, setRecords] = useState(() => loadReviewRecords());
  const [query, setQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const refresh = () => setRecords(loadReviewRecords());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const rows = useMemo(() => {
    const all = Object.values(records).map((record, idx) => {
      const submissionId = record.submissionId || `unknown_${idx}`;
      const meta = SUBMISSION_META[submissionId] || {};
      const maxMarks = typeof record.totalMax === 'number' ? record.totalMax : (meta.maxMarks || 100);
      const score = typeof record.totalScore === 'number' ? record.totalScore : null;

      return {
        id: submissionId,
        studentName: record.studentName || meta.studentName || 'Unknown Student',
        assignmentTitle: record.assignmentTitle || meta.assignmentTitle || 'Unknown Assignment',
        course: meta.course || 'CS201',
        status: record.status || 'pending',
        score,
        maxMarks,
        percent: score !== null && maxMarks > 0 ? Math.round((score / maxMarks) * 100) : null,
        updatedAt: record.updatedAt || '',
      };
    });

    return all.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  }, [records]);

  const courses = useMemo(() => ['all', ...Array.from(new Set(rows.map((r) => r.course)))], [rows]);
  const assignments = useMemo(() => ['all', ...Array.from(new Set(rows.map((r) => r.assignmentTitle)))], [rows]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const q = query.trim().toLowerCase();
      const queryMatch = !q || row.studentName.toLowerCase().includes(q) || row.assignmentTitle.toLowerCase().includes(q);
      const courseMatch = courseFilter === 'all' || row.course === courseFilter;
      const assignmentMatch = assignmentFilter === 'all' || row.assignmentTitle === assignmentFilter;
      const statusMatch = statusFilter === 'all' || row.status === statusFilter;
      return queryMatch && courseMatch && assignmentMatch && statusMatch;
    });
  }, [rows, query, courseFilter, assignmentFilter, statusFilter]);

  const stats = useMemo(() => {
    const published = filtered.filter((r) => r.status === 'published' && typeof r.score === 'number');
    const average = published.length ? Math.round(published.reduce((sum, r) => sum + r.score, 0) / published.length) : 0;
    return {
      total: filtered.length,
      published: filtered.filter((r) => r.status === 'published').length,
      draft: filtered.filter((r) => r.status === 'draft').length,
      resubmission: filtered.filter((r) => r.status === 'resubmission_requested').length,
      average,
    };
  }, [filtered]);

  const exportCsv = () => {
    const header = ['Student', 'Course', 'Assignment', 'Status', 'Score', 'Max Marks', 'Percentage', 'Updated At'];
    const lines = filtered.map((r) => [
      r.studentName,
      r.course,
      r.assignmentTitle,
      formatStatus(r.status),
      r.score ?? '',
      r.maxMarks,
      r.percent !== null ? `${r.percent}%` : '',
      r.updatedAt ? new Date(r.updatedAt).toLocaleString() : '',
    ]);

    const csv = [header, ...lines].map((line) => line.map(toCsvCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradebook_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Teacher Gradebook - CodeCampus</title>
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1200px] mx-auto px-5 py-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">Gradebook</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">Track review outcomes and export grade data as CSV.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportCsv}
                  disabled={filtered.length === 0}
                  className="px-3.5 py-[7px] bg-blue-600 text-white text-[12px] font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="Download" size={13} /> Export CSV
                </button>
                <Link to="/teacher-review" className="px-3.5 py-[7px] bg-white border border-slate-200 text-slate-700 text-[12px] font-medium rounded-md hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5">
                  <Icon name="ClipboardCheck" size={13} /> Open Review
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Visible</p><p className="text-[20px] font-semibold text-slate-900">{stats.total}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Published</p><p className="text-[20px] font-semibold text-emerald-600">{stats.published}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Draft</p><p className="text-[20px] font-semibold text-blue-600">{stats.draft}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Resubmission</p><p className="text-[20px] font-semibold text-red-600">{stats.resubmission}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Avg Score</p><p className="text-[20px] font-semibold text-slate-700">{stats.average}</p></div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/80 p-4 mb-4">
              <div className="grid md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search student or assignment"
                  className="border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {courses.map((course) => <option key={course} value={course}>{course === 'all' ? 'All Courses' : course}</option>)}
                </select>
                <select value={assignmentFilter} onChange={(e) => setAssignmentFilter(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {assignments.map((assignment) => <option key={assignment} value={assignment}>{assignment === 'all' ? 'All Assignments' : assignment}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="resubmission_requested">Resubmission Requested</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Student</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Course</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Assignment</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Score</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Status</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                        <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{row.studentName}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{row.course}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{row.assignmentTitle}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">
                          {typeof row.score === 'number' ? `${row.score}/${row.maxMarks} (${row.percent}%)` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusClass(row.status)}`}>
                            {formatStatus(row.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '—'}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-slate-500">
                          No grade records found. Open Teacher Review and save/publish grades to populate this table.
                        </td>
                      </tr>
                    )}
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

export default TeacherGradebook;
