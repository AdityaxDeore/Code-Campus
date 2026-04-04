import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import { getAssignments, updateAssignmentStatus } from '../../lib/assignmentService';

const mapAssignmentForQueue = (assignment) => {
  return {
    id: assignment._id,
    title: assignment.title || 'Untitled Assignment',
    course: assignment.course || 'General',
    dueDate: assignment.deadline || new Date().toISOString(),
    status: assignment.status === 'active' ? 'published' : (assignment.status || 'draft'),
    submissions: assignment.submissions || 0,
    totalStudents: assignment.totalStudents || 0,
  };
};

const statusBadge = (status) => {
  if (status === 'published') return 'bg-emerald-50 text-emerald-700';
  if (status === 'draft') return 'bg-amber-50 text-amber-700';
  return 'bg-slate-100 text-slate-600';
};

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  const refreshAssignments = async () => {
    const result = await getAssignments();
    if (!result.success) return;
    setAssignments(result.assignments.map(mapAssignmentForQueue));
  };

  useEffect(() => {
    refreshAssignments();
  }, []);

  const courses = useMemo(() => {
    const set = new Set(assignments.map((a) => a.course));
    return ['all', ...Array.from(set)];
  }, [assignments]);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const q = query.trim().toLowerCase();
      const matchQuery = !q || a.title.toLowerCase().includes(q) || a.course.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchCourse = courseFilter === 'all' || a.course === courseFilter;
      return matchQuery && matchStatus && matchCourse;
    });
  }, [assignments, query, statusFilter, courseFilter]);

  const stats = useMemo(() => {
    return {
      total: assignments.length,
      published: assignments.filter((a) => a.status === 'published').length,
      draft: assignments.filter((a) => a.status === 'draft').length,
      closed: assignments.filter((a) => a.status === 'closed').length,
    };
  }, [assignments]);

  const togglePublish = async (id) => {
    const assignment = assignments.find((item) => item.id === id);
    if (!assignment || assignment.status === 'closed') return;
    const nextStatus = assignment.status === 'published' ? 'draft' : 'published';
    await updateAssignmentStatus(id, nextStatus);
    await refreshAssignments();
  };

  const closeAssignment = async (id) => {
    await updateAssignmentStatus(id, 'closed');
    await refreshAssignments();
  };

  return (
    <>
      <Helmet>
        <title>Teacher Assignment Queue - CodeCampus</title>
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1200px] mx-auto px-5 py-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">Assignment Queue</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">Manage drafts, published assignments, and closures.</p>
              </div>
              <div className="flex gap-2">
                <Link to="/assignment-creation" className="px-3.5 py-[7px] bg-blue-600 text-white text-[12px] font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5">
                  <Icon name="PlusCircle" size={13} /> Create Assignment
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Total</p><p className="text-[20px] font-semibold text-slate-900">{stats.total}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Published</p><p className="text-[20px] font-semibold text-emerald-600">{stats.published}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Drafts</p><p className="text-[20px] font-semibold text-amber-600">{stats.draft}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Closed</p><p className="text-[20px] font-semibold text-slate-700">{stats.closed}</p></div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/80 p-4 mb-4">
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search assignments"
                  className="border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
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
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Assignment</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Course</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Due</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Submissions</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Status</th>
                      <th className="text-right text-[11px] font-semibold text-slate-500 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                        <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{a.title}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{a.course}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{new Date(a.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{a.submissions}/{a.totalStudents}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusBadge(a.status)}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <Link to="/teacher-review" className="px-2.5 py-1.5 text-[11px] font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">Review</Link>
                            {a.status !== 'closed' && (
                              <button onClick={() => togglePublish(a.id)} className="px-2.5 py-1.5 text-[11px] font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                                {a.status === 'published' ? 'Unpublish' : 'Publish'}
                              </button>
                            )}
                            {a.status !== 'closed' && (
                              <button onClick={() => closeAssignment(a.id)} className="px-2.5 py-1.5 text-[11px] font-medium rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors">Close</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-10 text-center text-[13px] text-slate-500">No assignments found.</td></tr>
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

export default TeacherAssignments;
