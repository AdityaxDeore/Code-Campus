import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { signInWithEmail, signUpWithEmail, onAuthStateChange } from '../../utils/auth';
import { trackLogin } from '../../lib/analytics';
import { useRole } from '../../contexts/RoleContext';

// Dev credentials for testing
const DEV_CREDENTIALS = {
  student: { email: 'student@codecampus.dev', password: 'password123', name: 'Alan Turing' },
  teacher: { email: 'teacher@codecampus.dev', password: 'password123', name: 'Prof. Ada Lovelace' },
};

const Login = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form state for login/signup
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // User is already logged in, redirect to dashboard
        navigate('/student-dashboard');
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Check for dev credentials first
      const isStudentDev = formData.email === DEV_CREDENTIALS.student.email && formData.password === DEV_CREDENTIALS.student.password;
      const isTeacherDev = formData.email === DEV_CREDENTIALS.teacher.email && formData.password === DEV_CREDENTIALS.teacher.password;

      if (isStudentDev || isTeacherDev) {
        // Dev login - bypass Firebase
        const role = isTeacherDev ? 'teacher' : 'student';
        const devUser = isTeacherDev ? DEV_CREDENTIALS.teacher : DEV_CREDENTIALS.student;
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', devUser.email);
        localStorage.setItem('userName', devUser.name);
        localStorage.setItem('loginMethod', 'dev');
        
        setRole(role);
        trackLogin('dev_login');
        
        navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
        return;
      }

      // Regular Firebase authentication
      let result;
      
      if (isSignUp) {
        // Sign up with Firebase
        result = await signUpWithEmail(formData.email, formData.password, {
          full_name: formData.fullName
        });
      } else {
        // Sign in with Firebase
        result = await signInWithEmail(formData.email, formData.password);
      }
      
      const { user, error } = result;
      
      if (error) {
        // Handle Firebase authentication errors
        let errorMessage = isSignUp ? 'Sign up failed. Please try again.' : 'Sign in failed. Please try again.';
        
        if (error.includes('email-already-in-use')) {
          errorMessage = 'An account with this email already exists.';
        } else if (error.includes('user-not-found')) {
          errorMessage = 'No account found with this email address.';
        } else if (error.includes('wrong-password')) {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.includes('invalid-email')) {
          errorMessage = 'Invalid email address format.';
        } else if (error.includes('weak-password')) {
          errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (error.includes('too-many-requests')) {
          errorMessage = 'Too many failed attempts. Please try again later.';
        } else if (error.includes('user-disabled')) {
          errorMessage = 'This account has been disabled. Contact support.';
        }
        
        setErrors({ general: errorMessage });
        return;
      }

      if (user) {
        // Track successful login/signup
        trackLogin(isSignUp ? 'signup_email' : 'signin_email');
        
        // Store user data in localStorage (for backward compatibility)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userName', user.displayName || formData.fullName || '');
        localStorage.setItem('loginMethod', 'firebase');
        
        // Navigate to dashboard
        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Dev login handler
  const handleDevLogin = (role) => {
    const devUser = role === 'teacher' ? DEV_CREDENTIALS.teacher : DEV_CREDENTIALS.student;
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', devUser.email);
    localStorage.setItem('userName', devUser.name);
    localStorage.setItem('loginMethod', 'dev');
    setRole(role);
    trackLogin('dev_login_button');
    navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? 'Sign Up' : 'Login'} - CodeCampus</title>
        <meta name="description" content={isSignUp ? "Create your CodeCampus account" : "Sign in to CodeCampus with your email address"} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center relative overflow-hidden">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-500/20 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-pink-500/20 rounded-full animate-pulse delay-500"></div>
        
        <div className="relative w-full max-w-md mx-4 z-10">
          <div className="text-center mb-8">
            <a href="/homepage" className="inline-flex items-center space-x-3 mb-6">
              <div className="relative">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="academic-transition hover:scale-105"
                >
                  <rect width="32" height="32" rx="8" fill="#3B82F6" />
                  <path d="M8 12L16 8L24 12V20C24 21.1046 23.1046 22 22 22H10C8.89543 22 8 21.1046 8 20V12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16L16 14L20 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CodeCampus</h1>
              </div>
            </a>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Join CodeCampus' : 'Welcome Back'}
            </h2>
            <p className="text-gray-300">
              {isSignUp ? 'Create your account and start your coding journey' : 'Sign in to your CodeCampus account'}
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 p-8">
            {/* Toggle between Sign In and Sign Up */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrors({});
                  setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isSignUp 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrors({});
                  setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isSignUp 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Dev Credentials Display */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon name="Zap" size={14} className="text-amber-500" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Development Credentials</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/80 rounded-md p-2.5 border border-blue-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Icon name="User" size={11} className="text-blue-600" />
                    <span className="font-semibold text-blue-600">Student</span>
                  </div>
                  <div className="space-y-0.5 text-slate-600">
                    <div className="font-mono text-[10px]">{DEV_CREDENTIALS.student.email}</div>
                    <div className="font-mono text-[10px]">{DEV_CREDENTIALS.student.password}</div>
                  </div>
                </div>
                <div className="bg-white/80 rounded-md p-2.5 border border-emerald-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Icon name="GraduationCap" size={11} className="text-emerald-600" />
                    <span className="font-semibold text-emerald-600">Teacher</span>
                  </div>
                  <div className="space-y-0.5 text-slate-600">
                    <div className="font-mono text-[10px]">{DEV_CREDENTIALS.teacher.email}</div>
                    <div className="font-mono text-[10px]">{DEV_CREDENTIALS.teacher.password}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => handleDevLogin('student')}
                  className="flex-1 py-1.5 px-3 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Icon name="User" size={11} />
                  Quick Login: Student
                </button>
                <button
                  type="button"
                  onClick={() => handleDevLogin('teacher')}
                  className="flex-1 py-1.5 px-3 bg-emerald-600 text-white text-xs font-semibold rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Icon name="GraduationCap" size={11} />
                  Quick Login: Teacher
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <Icon name="AlertCircle" size={14} />
                    <span>{errors.general}</span>
                  </p>
                </div>
              )}

              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                      <Icon name="AlertCircle" size={12} />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                    <Icon name="AlertCircle" size={12} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                    <Icon name="AlertCircle" size={12} />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                      <Icon name="AlertCircle" size={12} />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <button 
                      onClick={() => {
                        setIsSignUp(false);
                        setErrors({});
                        setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
                      }}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Sign in here
                    </button>
                  </>
                ) : (
                  <>
                    Need help?{' '}
                    <a href="/contact" className="text-blue-600 hover:text-blue-500 font-medium">
                      Contact Support
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
