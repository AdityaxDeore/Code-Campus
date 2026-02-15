import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useRole } from '../../contexts/RoleContext';
import { signOut } from '../../utils/auth';
import Icon from '../AppIcon';
import DarkModeToggle from './DarkModeToggle';


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isTeacher, toggleRole, role } = useRole();

  const studentNavItems = [
    { name: 'Dashboard', path: '/student-dashboard', icon: 'LayoutDashboard' },
    { name: 'Problems', path: '/problems', icon: 'Code' },
    { name: 'Learning Paths', path: '/learning-pathways', icon: 'BookOpen' },
    { name: 'Assignments', path: '/assignments', icon: 'ClipboardList' },
    { name: 'Tests', path: '/test', icon: 'ShieldCheck' },
    { name: 'Forums', path: '/campus-forums', icon: 'MessageSquare' },
  ];

  const teacherNavItems = [
    { name: 'Dashboard', path: '/teacher-dashboard', icon: 'LayoutDashboard' },
    { name: 'Assignments', path: '/assignments', icon: 'ClipboardList' },
    { name: 'Create', path: '/assignment-creation', icon: 'PlusCircle' },
    { name: 'Review', path: '/teacher-review', icon: 'CheckSquare' },
    { name: 'Forums', path: '/campus-forums', icon: 'MessageSquare' },
  ];

  const navigationItems = isTeacher ? teacherNavItems : studentNavItems;

  const moreItems = [
    { name: 'Achievements', path: '/achievement-center', icon: 'Trophy' },
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
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Role Toggle */}
          <button
            onClick={toggleRole}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all ${
              isTeacher
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
            title={`Switch to ${isTeacher ? 'student' : 'teacher'} view`}
          >
            <Icon name={isTeacher ? 'GraduationCap' : 'User'} size={12} />
            {isTeacher ? 'Teacher' : 'Student'}
            <Icon name="ArrowLeftRight" size={9} className="opacity-50" />
          </button>

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
                <p className="text-sm font-medium text-foreground">Alex Chen</p>
                <p className="text-xs text-muted-foreground">CS Student</p>
              </div>
              <Icon name="ChevronDown" size={16} className="hidden md:block text-muted-foreground" />
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg academic-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible academic-transition z-50">
              <div className="py-2">
                <Link to="/profile" className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted academic-transition">
                  <Icon name="User" size={16} />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted academic-transition">
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
                      localStorage.removeItem('userEmail');
                      localStorage.removeItem('userName');
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
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;