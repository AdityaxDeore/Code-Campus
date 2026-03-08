import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { getSession, getCurrentUser, onAuthStateChange } from '../../utils/auth';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const StatusBadge = ({ status }) => {
  const styles = {
    'not-started': 'bg-slate-100 text-slate-600',
    'in-progress': 'bg-amber-50 text-amber-700',
    'submitted': 'bg-emerald-50 text-emerald-700',
    'graded': 'bg-sky-50 text-sky-700',
  };
  const labels = {
    'not-started': 'Not Started', 'in-progress': 'In Progress',
    'submitted': 'Submitted', 'graded': 'Graded',
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${styles[status] || styles['not-started']}`}>
      {labels[status] || 'Not Started'}
    </span>
  );
};

const getDeadlineUrgency = (deadline) => {
  const h = (new Date(deadline) - new Date()) / 36e5;
  if (h < 0) return { label: 'Overdue', color: 'text-red-600', urgent: true };
  if (h < 6) return { label: `${Math.ceil(h)}h left`, color: 'text-red-500', urgent: true };
  if (h < 24) return { label: `${Math.ceil(h)}h left`, color: 'text-amber-600', urgent: true };
  if (h < 72) return { label: `${Math.ceil(h / 24)}d left`, color: 'text-amber-500', urgent: false };
  return { label: `${Math.ceil(h / 24)}d left`, color: 'text-slate-500', urgent: false };
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('Aditya Deore');
  const [loginMethod, setLoginMethod] = useState('');
  const [tab, setTab] = useState('active');

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUserEmail(currentUser.email || '');
        setUserName(currentUser.displayName || 'Aditya Deore');
        setLoginMethod('firebase'); return;
      }
      const session = await getSession();
      if (session?.user) {
        setUserEmail(session.user.email || '');
        setUserName(session.user.displayName || 'Aditya Deore');
        setLoginMethod('firebase'); return;
      }
      setLoginMethod(localStorage.getItem('loginMethod') || 'guest');
    };
    checkAuth();
    const unsub = onAuthStateChange((user) => {
      if (user) {
        setUserEmail(user.email || '');
        setUserName(user.displayName || 'Aditya Deore');
        setLoginMethod('firebase');
      }
    });
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [navigate]);

  const stats = {
    deadlines: 3, active: 5, solved: 47, pending: 1,
    aiHintsLeft: 7, aiHintsTotal: 10,
  };

  const assignments = [
    { id: 'a1', title: 'Binary Search Tree Implementation', course: 'DSA', deadline: new Date(Date.now() + 5*36e5).toISOString(), status: 'in-progress', progress: 60, difficulty: 'Medium', maxMarks: 100, scored: null },
    { id: 'a2', title: 'Graph Traversal – BFS & DFS', course: 'DSA', deadline: new Date(Date.now() + 26*36e5).toISOString(), status: 'not-started', progress: 0, difficulty: 'Hard', maxMarks: 150, scored: null },
    { id: 'a3', title: 'Knapsack Problem', course: 'Algorithms', deadline: new Date(Date.now() + 96*36e5).toISOString(), status: 'not-started', progress: 0, difficulty: 'Hard', maxMarks: 120, scored: null },
    { id: 'a4', title: 'Linked List Operations', course: 'DSA', deadline: new Date(Date.now() - 48*36e5).toISOString(), status: 'submitted', progress: 100, difficulty: 'Easy', maxMarks: 80, scored: 72 },
    { id: 'a5', title: 'Sorting Analysis', course: 'Algorithms', deadline: new Date(Date.now() - 120*36e5).toISOString(), status: 'graded', progress: 100, difficulty: 'Medium', maxMarks: 100, scored: 88 },
  ];

  const lastSession = { title: 'Binary Search Tree Implementation', file: 'bst.py', line: 47, saved: '12 min ago' };

  const notifications = [
    { id: 1, msg: 'BST Implementation due in 5 hours', time: 'Just now', icon: 'AlertTriangle', accent: 'text-red-500' },
    { id: 2, msg: 'Feedback released: Linked List Ops', time: '2h ago', icon: 'MessageCircle', accent: 'text-blue-500' },
    { id: 3, msg: 'New assignment: Graph Traversal', time: '5h ago', icon: 'FileText', accent: 'text-emerald-500' },
  ];

  const progress = { problems: { done: 12, of: 15 }, assignments: { done: 8, of: 12 }, avg: 84, trend: '+5%' };

  const activeList = assignments.filter(a => a.status === 'in-progress' || a.status === 'not-started');
  const doneList   = assignments.filter(a => a.status === 'submitted'  || a.status === 'graded');

  return (
    <>
      <Helmet>
        <title>Dashboard – CodeCampus</title>
        <meta name="description" content="Your CodeCampus student dashboard" />
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1200px] mx-auto px-5 py-7">

            {/* ─── Greeting ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7">
              <div>
                <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">
                  {getGreeting()}{userName ? `, ${userName}` : ''}
                </h1>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  {userEmail || 'Welcome to your dashboard'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/assignments">
                  <Button variant="outline" size="sm" iconName="ClipboardList" iconPosition="left">
                    Assignments
                  </Button>
                </Link>
                <Link to="/problem-workspace">
                  <Button size="sm" iconName="Code" iconPosition="left">
                    Code Editor
                  </Button>
                </Link>
              </div>
            </div>

            {/* ─── Stat Cards ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-7">
              {[
                { label: 'Deadlines',  val: stats.deadlines, icon: 'Clock',     c: '#ef4444' },
                { label: 'Active',     val: stats.active,    icon: 'FileCode2', c: '#f59e0b' },
                { label: 'Solved',     val: stats.solved,    icon: 'CheckCircle2', c: '#3b82f6' },
                { label: 'Pending',    val: stats.pending,   icon: 'Loader',    c: '#f97316' },
                { label: 'AI Hints',   val: `${stats.aiHintsLeft}/${stats.aiHintsTotal}`, icon: 'Sparkles', c: '#8b5cf6' },
              ].map((s, i) => (
                <div key={i}
                  className="bg-white rounded-lg px-4 py-3.5 border border-slate-200/80 hover:border-slate-300 transition-colors"
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
            <div className="grid lg:grid-cols-[1fr_320px] gap-5">

              {/* Left Column */}
              <div className="space-y-5">

                {/* Resume Card */}
                <div
                  className="relative rounded-lg p-5 text-white overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                    boxShadow: '0 4px 12px rgba(37,99,235,.25)',
                  }}
                >
                  <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[.06]" />
                  <p className="text-[11px] font-medium text-blue-200 uppercase tracking-widest mb-1.5">Resume</p>
                  <h3 className="text-base font-semibold mb-1">{lastSession.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-blue-200 mb-4">
                    <span className="flex items-center gap-1"><Icon name="FileCode" size={12}/>{lastSession.file}</span>
                    <span className="flex items-center gap-1"><Icon name="MapPin" size={12}/>Line {lastSession.line}</span>
                    <span className="flex items-center gap-1"><Icon name="Save" size={12}/>{lastSession.saved}</span>
                  </div>
                  <Link to="/problem-workspace">
                    <button className="px-4 py-[7px] bg-white text-blue-700 rounded-md text-[13px] font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1.5">
                      <Icon name="Play" size={14}/> Continue
                    </button>
                  </Link>
                </div>

                {/* Assignments Panel */}
                <div
                  className="bg-white rounded-lg border border-slate-200/80 overflow-hidden"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}
                >
                  <div className="flex items-center justify-between px-5 pt-4 pb-3">
                    <h2 className="text-[15px] font-semibold text-slate-900">Assignments</h2>
                    <div className="flex bg-slate-100 rounded-md p-[3px]">
                      {['active', 'done'].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                          className={`px-3 py-[5px] text-[12px] font-medium rounded-[5px] transition-all ${
                            tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {t === 'active' ? `Active (${activeList.length})` : `Done (${doneList.length})`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 pb-4 space-y-2">
                    {(tab === 'active' ? activeList : doneList).map(a => {
                      const u = getDeadlineUrgency(a.deadline);
                      return (
                        <div key={a.id}
                          className={`border rounded-lg p-3.5 transition-all hover:border-slate-300 ${
                            u.urgent && a.status !== 'submitted' && a.status !== 'graded'
                              ? 'border-red-200 bg-red-50/40' : 'border-slate-200/80'
                          }`}
                          style={{ boxShadow: '0 1px 2px rgba(0,0,0,.02)' }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className="text-[13px] font-medium text-slate-900">{a.title}</span>
                                <StatusBadge status={a.status} />
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                                <span>{a.course}</span>
                                <span className={`font-medium ${u.color}`}>
                                  <Icon name="Clock" size={10} className="inline mr-0.5 -mt-px" />{u.label}
                                </span>
                                {a.scored !== null && <span>Score: {a.scored}/{a.maxMarks}</span>}
                              </div>
                              {a.status === 'in-progress' && (
                                <div className="w-full bg-slate-100 rounded-full h-1 mt-2.5">
                                  <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${a.progress}%`, transition: 'width .4s' }} />
                                </div>
                              )}
                            </div>
                            {(a.status === 'in-progress' || a.status === 'not-started') && (
                              <Link to={`/assignment-workspace?id=${a.id}`}>
                                <button className="px-3 py-[6px] bg-blue-600 text-white text-[12px] font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1">
                                  <Icon name={a.status === 'in-progress' ? 'Play' : 'ExternalLink'} size={12} />
                                  {a.status === 'in-progress' ? 'Continue' : 'Open'}
                                </button>
                              </Link>
                            )}
                            {a.status === 'graded' && (
                              <Link to="/problem-history">
                                <button className="px-3 py-[6px] bg-slate-100 text-slate-700 text-[12px] font-medium rounded-md hover:bg-slate-200 transition-colors">Review</button>
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-5 pb-4">
                    <Link to="/assignments" className="block">
                      <Button variant="outline" size="sm" className="w-full text-[12px]">
                        View All Assignments
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Quick Nav */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Assignments', to: '/assignments', icon: 'ClipboardList', c: '#2563eb' },
                    { label: 'Tests', to: '/test', icon: 'ShieldCheck', c: '#dc2626' },
                    { label: 'Forums', to: '/campus-forums', icon: 'MessageSquare', c: '#10b981' },
                    { label: 'Achievements', to: '/achievement-center', icon: 'Trophy', c: '#f59e0b' },
                  ].map((n, i) => (
                    <Link key={i} to={n.to}
                      className="flex items-center gap-2.5 bg-white border border-slate-200/80 rounded-lg px-3.5 py-3 hover:border-slate-300 transition-colors group"
                      style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}
                    >
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: n.c + '12' }}>
                        <Icon name={n.icon} size={15} style={{ color: n.c }} />
                      </div>
                      <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{n.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-5">

                {/* AI Assistant */}
                <div
                  className="rounded-lg p-4 border border-indigo-200/80"
                  style={{ background: 'linear-gradient(160deg, #eef2ff 0%, #f5f3ff 100%)', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-[14px] font-semibold text-slate-900 flex items-center gap-1.5">
                      <Icon name="Sparkles" size={15} className="text-indigo-500" />
                      AI Assistant
                    </h3>
                    <span className="text-[10px] font-medium text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                      {stats.aiHintsLeft} left
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">Logic help, error explanations — no full answers.</p>
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {[
                      { l: 'Hint', icon: 'Lightbulb', c: '#f59e0b' },
                      { l: 'Debug', icon: 'Bug', c: '#ef4444' },
                      { l: 'Explain', icon: 'BookOpen', c: '#3b82f6' },
                    ].map((a, i) => (
                      <button key={i} className="flex flex-col items-center gap-1 py-2 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-600 hover:border-slate-300 transition-colors">
                        <Icon name={a.icon} size={14} style={{ color: a.c }} />
                        {a.l}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input type="text" placeholder="Ask about your code…"
                      className="w-full pl-3 pr-8 py-2 text-[12px] rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-500">
                      <Icon name="SendHorizontal" size={14} />
                    </button>
                  </div>
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>Usage</span>
                      <span>{stats.aiHintsTotal - stats.aiHintsLeft}/{stats.aiHintsTotal}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1">
                      <div className="bg-indigo-400 h-1 rounded-full" style={{ width: `${((stats.aiHintsTotal - stats.aiHintsLeft) / stats.aiHintsTotal) * 100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-lg border border-slate-200/80 p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <h3 className="text-[14px] font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Icon name="Bell" size={14} className="text-slate-400" />
                    Notifications
                    <span className="ml-auto text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">{notifications.length}</span>
                  </h3>
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div key={n.id} className="flex items-start gap-2 p-1.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer">
                        <Icon name={n.icon} size={14} className={`mt-0.5 ${n.accent}`} />
                        <div>
                          <p className="text-[12px] text-slate-700 leading-snug">{n.msg}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-white rounded-lg border border-slate-200/80 p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <h3 className="text-[14px] font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Icon name="BarChart3" size={14} className="text-slate-400" />
                    Progress
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Weekly Problems', done: progress.problems.done, of: progress.problems.of, c: '#3b82f6' },
                      { label: 'Assignments', done: progress.assignments.done, of: progress.assignments.of, c: '#10b981' },
                    ].map((p, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="text-slate-600">{p.label}</span>
                          <span className="font-medium text-slate-800">{p.done}/{p.of}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${(p.done / p.of) * 100}%`, background: p.c, transition: 'width .4s' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100">
                    <span className="text-[12px] text-slate-500">Average</span>
                    <span className="text-[14px] font-semibold text-slate-900">{progress.avg}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[12px] text-slate-500">Trend</span>
                    <span className="text-[12px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      <Icon name="TrendingUp" size={11} />{progress.trend}
                    </span>
                  </div>
                  <Link to="/problem-history" className="block mt-3">
                    <Button variant="outline" size="sm" className="w-full text-[12px]">View History</Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default StudentDashboard;
