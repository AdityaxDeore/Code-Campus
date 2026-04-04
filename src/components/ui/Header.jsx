import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { signOut } from '../../utils/auth';
import Icon from '../AppIcon';
import DarkModeToggle from './DarkModeToggle';
import { useRole } from '../../contexts/RoleContext';
import { useUser } from '../../context/UserContext';
import { isTeacherEmailAllowed } from '../../utils/roleAccess';


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isTeacher, setRole } = useRole();
  const { user, profile } = useUser();

  const displayName = profile?.displayName
    || user?.displayName
    || (user?.email ? user.email.split('@')[0] : null)
    || 'Student';
  const roleLabel = profile?.role
    ? `${profile.role.charAt(0).toUpperCase()}${profile.role.slice(1)}`
    : (isTeacher ? 'Teacher' : 'Student');
  const teacherEligible = localStorage.getItem('loginMethod') === 'demo'
    || isTeacherEmailAllowed(profile?.email || user?.email);

  const switchToTeacherMode = () => {
    if (!teacherEligible) {
      alert('Not permitted: teacher access is limited to @pccoepune.org accounts.');
      return;
    }
    setRole('teacher');
    navigate('/teacher-dashboard');
    setIsMobileMenuOpen(false);
  };

  const switchToStudentMode = () => {
    setRole('student');
    navigate('/student-dashboard');
    setIsMobileMenuOpen(false);
  };

  const navigationItems = isTeacher
    ? [
        { name: 'Dashboard', path: '/teacher-dashboard', icon: 'LayoutDashboard' },
        { name: 'Courses', path: '/teacher-courses', icon: 'BookOpen' },
        { name: 'Students', path: '/teacher-students', icon: 'Users' },
        { name: 'Assignments', path: '/teacher-assignments', icon: 'ClipboardList' },
        { name: 'Submissions', path: '/teacher-submissions', icon: 'Inbox' },
        { name: 'Gradebook', path: '/teacher-gradebook', icon: 'Table' },
        { name: 'Create', path: '/assignment-creation', icon: 'PlusCircle' },
        { name: 'Review', path: '/teacher-review', icon: 'CheckSquare' },
        { name: 'Forums', path: '/campus-forums', icon: 'MessageSquare' },
      ]
    : [
        { name: 'Dashboard', path: '/student-dashboard', icon: 'LayoutDashboard' },
        { name: 'Problems', path: '/problems', icon: 'Code' },
        { name: 'Learning Paths', path: '/learning-pathways', icon: 'BookOpen' },
        { name: 'Assignments', path: '/assignments', icon: 'ClipboardList' },
        { name: 'Tests', path: '/test', icon: 'ShieldCheck' },
        { name: 'Forums', path: '/campus-forums', icon: 'MessageSquare' },
      ];

  const moreItems = isTeacher
    ? [
        { name: 'Teacher Home', path: '/teacher-dashboard', icon: 'GraduationCap' },
        { name: 'Courses', path: '/teacher-courses', icon: 'BookOpen' },
        { name: 'Assignment Queue', path: '/teacher-assignments', icon: 'ClipboardList' },
        { name: 'Submission Queue', path: '/teacher-submissions', icon: 'Inbox' },
        { name: 'Gradebook', path: '/teacher-gradebook', icon: 'Table' },
        { name: 'Teacher Review', path: '/teacher-review', icon: 'ClipboardCheck' },
        { name: 'About', path: '/about-code-campus', icon: 'Info' },
        { name: 'Settings', path: '/teacher-settings', icon: 'Settings' },
        { name: 'Help', path: '/help', icon: 'HelpCircle' },
      ]
    : [
        { name: 'Achievements', path: '/achievement-center', icon: 'Trophy' },
      ...(teacherEligible ? [{ name: 'Teacher', path: '/teacher-dashboard', icon: 'GraduationCap' }] : []),
        { name: 'About', path: '/about-code-campus', icon: 'Info' },
        { name: 'Settings', path: '/settings', icon: 'Settings' },
        { name: 'Help', path: '/help', icon: 'HelpCircle' },
      ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border academic-shadow">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/homepage" className="flex items-center space-x-3">
            <div className="relative">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="academic-transition hover:scale-105"
              >
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  fill="var(--color-primary)"
                />
                <path
                  d="M8 12L16 8L24 12V20C24 21.1046 23.1046 22 22 22H10C8.89543 22 8 21.1046 8 20V12Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16L16 14L20 16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">CodeCampus</h1>
              <p className="text-xs text-muted-foreground -mt-1">Academic Excellence</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium academic-transition ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.name}</span>
            </Link>
          ))}
          
          {/* More Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted hover:text-primary academic-transition">
              <Icon name="MoreHorizontal" size={16} />
              <span>More</span>
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg academic-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible academic-transition z-50">
              <div className="py-2">
                {moreItems?.map((item) => (
                  !isTeacher && item?.path === '/teacher-dashboard' ? (
                    <button
                      key={item?.path}
                      onClick={switchToTeacherMode}
                      className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-muted academic-transition text-popover-foreground w-full text-left"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.name}</span>
                    </button>
                  ) : (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-muted academic-transition ${
                        isActivePath(item?.path)
                          ? 'text-primary font-medium' :'text-popover-foreground'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.name}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Notifications */}
          <button onClick={() => navigate('/status')} className="relative p-2 text-muted-foreground hover:text-primary academic-transition">
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted academic-transition">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
              <Icon name="ChevronDown" size={16} className="hidden md:block text-muted-foreground" />
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg academic-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible academic-transition z-50">
              <div className="py-2">
                {isTeacher ? (
                  <button
                    onClick={switchToStudentMode}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted academic-transition w-full text-left"
                  >
                    <Icon name="ArrowLeftRight" size={16} />
                    <span>Switch to Student</span>
                  </button>
                ) : (
                  <button
                    onClick={switchToTeacherMode}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted academic-transition w-full text-left"
                  >
                    <Icon name="ArrowLeftRight" size={16} />
                    <span>Switch to Teacher</span>
                  </button>
                )}
                <Link to="/profile" className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted academic-transition">
                  <Icon name="User" size={16} />
                  <span>Profile</span>
                </Link>
                <Link to={isTeacher ? '/teacher-settings' : '/settings'} className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted academic-transition">
                  <Icon name="Settings" size={16} />
                  <span>Settings</span>
                </Link>
                <hr className="my-2 border-border" />
                <button 
                  onClick={async () => { 
                    try { 
                      await signOut(); 
                      // Clear local storage
                      localStorage.removeItem('isAuthenticated');
                      localStorage.removeItem('loginMethod');
                    } catch (e) {
                      console.error('Sign out error:', e);
                    } 
                    navigate('/login'); 
                  }} 
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted academic-transition w-full text-left"
                >
                  <Icon name="LogOut" size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-muted-foreground hover:text-primary academic-transition"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium academic-transition ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.name}</span>
              </Link>
            ))}
            
            <hr className="my-4 border-border" />
            
            {moreItems?.map((item) => (
              !isTeacher && item?.path === '/teacher-dashboard' ? (
                <button
                  key={item?.path}
                  onClick={switchToTeacherMode}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm academic-transition text-foreground hover:bg-muted w-full text-left"
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.name}</span>
                </button>
              ) : (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm academic-transition ${
                    isActivePath(item?.path)
                      ? 'text-primary font-medium bg-muted' :'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.name}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;