import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { getAssignments } from '../../lib/assignmentService';

const subjects = [
  { key: 'all', label: 'All', icon: 'LayoutGrid' },
  { key: 'dsa', label: 'DSA', icon: 'Binary' },
  { key: 'oops', label: 'OOPS', icon: 'Boxes' },
  { key: 'datascience', label: 'Data Science', icon: 'BarChart3' },
  { key: 'dbms', label: 'DBMS', icon: 'Database' },
  { key: 'webdev', label: 'Web Dev', icon: 'Globe' },
];

const mockAssignments = [
  // DSA
  { id: 'a1', title: 'Binary Search Tree – Insert & Delete', subject: 'dsa', teacher: 'Prof. Sharma', deadline: new Date(Date.now() + 5 * 36e5).toISOString(), status: 'in-progress', progress: 60, difficulty: 'Medium', maxMarks: 100, scored: null, language: 'python', description: 'Implement insert, delete and search operations for a BST.' },
  { id: 'a2', title: 'Graph Traversal – BFS & DFS', subject: 'dsa', teacher: 'Prof. Sharma', deadline: new Date(Date.now() + 26 * 36e5).toISOString(), status: 'not-started', progress: 0, difficulty: 'Hard', maxMarks: 150, scored: null, language: 'python', description: 'Implement BFS and DFS on an adjacency list graph.' },
  { id: 'a3', title: 'Linked List Reversal', subject: 'dsa', teacher: 'Prof. Sharma', deadline: new Date(Date.now() - 48 * 36e5).toISOString(), status: 'graded', progress: 100, difficulty: 'Easy', maxMarks: 80, scored: 72, language: 'python', description: 'Reverse a singly linked list iteratively and recursively.' },
  // OOPS
  { id: 'a4', title: 'Design a Library System', subject: 'oops', teacher: 'Prof. Mehta', deadline: new Date(Date.now() + 72 * 36e5).toISOString(), status: 'not-started', progress: 0, difficulty: 'Medium', maxMarks: 120, scored: null, language: 'java', description: 'Model a library system using classes, inheritance and polymorphism.' },
  { id: 'a5', title: 'Abstract Factory Pattern', subject: 'oops', teacher: 'Prof. Mehta', deadline: new Date(Date.now() - 120 * 36e5).toISOString(), status: 'graded', progress: 100, difficulty: 'Hard', maxMarks: 100, scored: 88, language: 'java', description: 'Implement the Abstract Factory creational design pattern.' },
  // Data Science
  { id: 'a6', title: 'EDA on Iris Dataset', subject: 'datascience', teacher: 'Dr. Patel', deadline: new Date(Date.now() + 96 * 36e5).toISOString(), status: 'not-started', progress: 0, difficulty: 'Easy', maxMarks: 80, scored: null, language: 'python', description: 'Perform exploratory data analysis with pandas and matplotlib.' },
  // DBMS
  { id: 'a7', title: 'Normalize to 3NF', subject: 'dbms', teacher: 'Prof. Kumar', deadline: new Date(Date.now() + 48 * 36e5).toISOString(), status: 'in-progress', progress: 30, difficulty: 'Medium', maxMarks: 100, scored: null, language: 'sql', description: 'Given a denormalized schema, normalize it to Third Normal Form.' },
  // Web Dev
  { id: 'a8', title: 'REST API with Express', subject: 'webdev', teacher: 'Prof. Singh', deadline: new Date(Date.now() + 120 * 36e5).toISOString(), status: 'not-started', progress: 0, difficulty: 'Medium', maxMarks: 100, scored: null, language: 'javascript', description: 'Build a CRUD REST API using Express.js and MongoDB.' },
];

const getDeadlineInfo = (deadline) => {
  const h = (new Date(deadline) - new Date()) / 36e5;
  if (h < 0) return { label: 'Overdue', color: 'text-red-600', urgent: true };
  if (h < 6) return { label: `${Math.ceil(h)}h left`, color: 'text-red-500', urgent: true };
  if (h < 24) return { label: `${Math.ceil(h)}h left`, color: 'text-amber-600', urgent: true };
  if (h < 72) return { label: `${Math.ceil(h / 24)}d left`, color: 'text-amber-500', urgent: false };
  return { label: `${Math.ceil(h / 24)}d left`, color: 'text-slate-500', urgent: false };
};

const StatusBadge = ({ status }) => {
  const m = {
    'not-started': 'bg-slate-100 text-slate-600',
    'in-progress': 'bg-amber-50 text-amber-700',
    'submitted': 'bg-emerald-50 text-emerald-700',
    'graded': 'bg-sky-50 text-sky-700',
  };
  const l = { 'not-started': 'Not Started', 'in-progress': 'In Progress', 'submitted': 'Submitted', 'graded': 'Graded' };
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${m[status] || m['not-started']}`}>{l[status] || status}</span>;
};

const DifficultyBadge = ({ d }) => {
  const c = d === 'Easy' ? 'bg-emerald-50 text-emerald-700' : d === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';
  return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${c}`}>{d}</span>;
};

const Assignments = () => {
  const [activeSubject, setActiveSubject] = useState('all');
  const [viewMode, setViewMode] = useState('active'); // active | completed
  const [dbAssignments, setDbAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch assignments on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const result = await getAssignments();
        if (result.success && result.assignments.length > 0) {
          // Map assignments to match expected format
          const mapped = result.assignments.map(a => ({
            id: a._id,
            title: a.title,
            subject: a.subject || 'dsa',
            teacher: a.teacherName || 'Teacher',
            deadline: a.deadline,
            status: 'not-started',
            progress: 0,
            difficulty: a.difficulty || 'Medium',
            maxMarks: a.maxMarks || 100,
            scored: null,
            language: (a.allowedLanguages && a.allowedLanguages[0]) || 'python',
            description: a.instructions || '',
          }));
          setDbAssignments(mapped);
        }
      } catch (err) {
        console.log('API not available, using mock data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // Combine: DB assignments first, then mock assignments
  const allAssignments = [...dbAssignments, ...mockAssignments];

  const filtered = allAssignments.filter(a => {
    const subjectMatch = activeSubject === 'all' || a.subject === activeSubject;
    const statusMatch = viewMode === 'active'
      ? (a.status === 'in-progress' || a.status === 'not-started')
      : (a.status === 'submitted' || a.status === 'graded');
    return subjectMatch && statusMatch;
  });

  const counts = {
    active: allAssignments.filter(a => a.status === 'in-progress' || a.status === 'not-started').length,
    completed: allAssignments.filter(a => a.status === 'submitted' || a.status === 'graded').length,
  };

  return (
    <>
      <Helmet>
        <title>Assignments – CodeCampus</title>
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1100px] mx-auto px-5 py-7">

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">Assignments</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">Complete coding assignments from your courses</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/assignment-creation">
                  <button className="px-3.5 py-[7px] bg-emerald-600 text-white text-[12px] font-medium rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                    <Icon name="Plus" size={13} />
                    Create Assignment
                  </button>
                </Link>
              <div className="flex bg-slate-100 rounded-md p-[3px]">
                {['active', 'completed'].map(v => (
                  <button key={v} onClick={() => setViewMode(v)}
                    className={`px-3 py-[5px] text-[12px] font-medium rounded-[5px] transition-all ${
                      viewMode === v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {v === 'active' ? `Active (${counts.active})` : `Completed (${counts.completed})`}
                  </button>
                ))}
              </div>
              </div>
            </div>

            {/* Subject Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {subjects.map(s => (
                <button key={s.key} onClick={() => setActiveSubject(s.key)}
                  className={`flex items-center gap-1.5 px-3 py-[7px] text-[12px] font-medium rounded-md border transition-all ${
                    activeSubject === s.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ boxShadow: activeSubject === s.key ? 'none' : '0 1px 2px rgba(0,0,0,.04)' }}
                >
                  <Icon name={s.icon} size={13} />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Assignment Cards */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200/80 p-12 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                <Icon name="Inbox" size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-[14px] text-slate-500 font-medium">No assignments here</p>
                <p className="text-[12px] text-slate-400 mt-1">Try a different subject or tab</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(a => {
                  const dl = getDeadlineInfo(a.deadline);
                  return (
                    <div key={a.id}
                      className={`bg-white rounded-lg border p-4 transition-all hover:border-slate-300 ${
                        dl.urgent && viewMode === 'active' ? 'border-red-200 bg-red-50/30' : 'border-slate-200/80'
                      }`}
                      style={{ boxShadow: '0 1px 2px rgba(0,0,0,.03)' }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[14px] font-medium text-slate-900">{a.title}</span>
                            <StatusBadge status={a.status} />
                            <DifficultyBadge d={a.difficulty} />
                          </div>
                          <p className="text-[12px] text-slate-500 mb-2 line-clamp-1">{a.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1"><Icon name="User" size={11} />{a.teacher}</span>
                            <span className="flex items-center gap-1 capitalize"><Icon name="Tag" size={11} />{subjects.find(s => s.key === a.subject)?.label}</span>
                            <span className={`flex items-center gap-1 font-medium ${dl.color}`}><Icon name="Clock" size={11} />{dl.label}</span>
                            <span className="flex items-center gap-1 uppercase text-[10px] font-semibold text-slate-400">{a.language}</span>
                            {a.scored !== null && <span>Score: {a.scored}/{a.maxMarks}</span>}
                          </div>
                          {a.status === 'in-progress' && (
                            <div className="w-full max-w-xs bg-slate-100 rounded-full h-1 mt-2.5">
                              <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${a.progress}%`, transition: 'width .4s' }} />
                            </div>
                          )}
                        </div>
                        {(a.status === 'in-progress' || a.status === 'not-started') && (
                          <Link to={`/assignment-workspace?id=${a.id}`}>
                            <button className="px-3.5 py-[7px] bg-blue-600 text-white text-[12px] font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                              <Icon name={a.status === 'in-progress' ? 'Play' : 'ExternalLink'} size={13} />
                              {a.status === 'in-progress' ? 'Continue' : 'Start'}
                            </button>
                          </Link>
                        )}
                        {a.status === 'graded' && (
                          <Link to={`/teacher-review?id=${a.id}`}>
                            <button className="px-3 py-[7px] bg-slate-100 text-slate-700 text-[12px] font-medium rounded-md hover:bg-slate-200 transition-colors">Review</button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
};

export default Assignments;
