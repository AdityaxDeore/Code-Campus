import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

const mockStudents = [
  { id: 's1', name: 'Aditya Deore', prn: '124B1F116', email: 'aditya@codecampus.edu', course: 'CS201', avgScore: 88, completion: 84, pending: 1, integrityRisk: 12, status: 'active' },
  { id: 's2', name: 'Chinmay Ahire', prn: '125B2F001', email: 'chinmay@codecampus.edu', course: 'CS201', avgScore: 74, completion: 61, pending: 3, integrityRisk: 36, status: 'active' },
  { id: 's3', name: 'Rahul Sharma', prn: '124B1F078', email: 'rahul@codecampus.edu', course: 'CS301', avgScore: 69, completion: 49, pending: 5, integrityRisk: 81, status: 'at-risk' },
  { id: 's4', name: 'Sneha Joshi', prn: '124B1F103', email: 'sneha@codecampus.edu', course: 'CS202', avgScore: 91, completion: 92, pending: 0, integrityRisk: 8, status: 'active' },
  { id: 's5', name: 'Prathamesh Pawar', prn: '124B1F092', email: 'prathamesh@codecampus.edu', course: 'CS202', avgScore: 58, completion: 34, pending: 6, integrityRisk: 67, status: 'at-risk' },
  { id: 's6', name: 'Sarang Thakare', prn: '124B1F120', email: 'sarang@codecampus.edu', course: 'CS201', avgScore: 79, completion: 73, pending: 2, integrityRisk: 24, status: 'active' },
];

const riskClass = (risk) => {
  if (risk >= 70) return 'text-red-700 bg-red-50';
  if (risk >= 40) return 'text-amber-700 bg-amber-50';
  return 'text-emerald-700 bg-emerald-50';
};

const statusClass = (status) => {
  if (status === 'at-risk') return 'text-red-700 bg-red-50';
  return 'text-emerald-700 bg-emerald-50';
};

const TeacherStudents = () => {
  const [query, setQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const courses = useMemo(() => {
    const set = new Set(mockStudents.map((s) => s.course));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return mockStudents.filter((s) => {
      const q = query.trim().toLowerCase();
      const queryMatch = !q || s.name.toLowerCase().includes(q) || s.prn.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const courseMatch = courseFilter === 'all' || s.course === courseFilter;

      let riskMatch = true;
      if (riskFilter === 'low') riskMatch = s.integrityRisk < 40;
      if (riskFilter === 'medium') riskMatch = s.integrityRisk >= 40 && s.integrityRisk < 70;
      if (riskFilter === 'high') riskMatch = s.integrityRisk >= 70;

      return queryMatch && courseMatch && riskMatch;
    });
  }, [query, courseFilter, riskFilter]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const atRisk = filtered.filter((s) => s.status === 'at-risk' || s.integrityRisk >= 70).length;
    const avgCompletion = total ? Math.round(filtered.reduce((acc, s) => acc + s.completion, 0) / total) : 0;
    const avgScore = total ? Math.round(filtered.reduce((acc, s) => acc + s.avgScore, 0) / total) : 0;
    return { total, atRisk, avgCompletion, avgScore };
  }, [filtered]);

  return (
    <>
      <Helmet>
        <title>Teacher Students - CodeCampus</title>
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1200px] mx-auto px-5 py-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">Students</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">Track student performance, pending work, and integrity risk.</p>
              </div>
              <div className="flex gap-2">
                <Link to="/teacher-dashboard" className="px-3.5 py-[7px] bg-white border border-slate-200 text-slate-700 text-[12px] font-medium rounded-md hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5">
                  <Icon name="ArrowLeft" size={13} /> Dashboard
                </Link>
                <Link to="/teacher-review" className="px-3.5 py-[7px] bg-blue-600 text-white text-[12px] font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5">
                  <Icon name="ClipboardCheck" size={13} /> Review Submissions
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5">
                <p className="text-[11px] text-slate-400 font-medium">Visible Students</p>
                <p className="text-[20px] font-semibold text-slate-900">{summary.total}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5">
                <p className="text-[11px] text-slate-400 font-medium">At Risk</p>
                <p className="text-[20px] font-semibold text-red-600">{summary.atRisk}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5">
                <p className="text-[11px] text-slate-400 font-medium">Avg Completion</p>
                <p className="text-[20px] font-semibold text-slate-900">{summary.avgCompletion}%</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5">
                <p className="text-[11px] text-slate-400 font-medium">Avg Score</p>
                <p className="text-[20px] font-semibold text-slate-900">{summary.avgScore}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/80 p-4 mb-4">
              <div className="grid md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Search</label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, PRN, email"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Course</label>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {courses.map((c) => (
                      <option key={c} value={c}>{c === 'all' ? 'All Courses' : c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Integrity Risk</label>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Student</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Course</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Avg Score</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Completion</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Pending</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Risk</th>
                      <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Status</th>
                      <th className="text-right text-[11px] font-semibold text-slate-500 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                        <td className="px-4 py-3">
                          <p className="text-[13px] font-medium text-slate-900">{s.name}</p>
                          <p className="text-[11px] text-slate-500">{s.prn}</p>
                          <p className="text-[11px] text-slate-400">{s.email}</p>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{s.course}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{s.avgScore}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{s.completion}%</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{s.pending}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${riskClass(s.integrityRisk)}`}>
                            {s.integrityRisk}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusClass(s.status)}`}>
                            {s.status === 'at-risk' ? 'At Risk' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button className="px-2.5 py-1.5 text-[11px] font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                              View
                            </button>
                            <button className="px-2.5 py-1.5 text-[11px] font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                              Message
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-slate-500">
                          No students matched these filters.
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

export default TeacherStudents;
