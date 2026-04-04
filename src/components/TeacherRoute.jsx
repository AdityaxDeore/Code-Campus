import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../contexts/RoleContext';
import { getCurrentUser, onAuthStateChange } from '../utils/auth';
import { isTeacherAccessAllowed } from '../utils/roleAccess';

const TeacherRoute = ({ children }) => {
  const { isTeacher } = useRole();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasTeacherAccess, setHasTeacherAccess] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    const localAuth = localStorage.getItem('isAuthenticated') === 'true';

    if (user || localAuth) {
      setIsAuthenticated(true);
      setHasTeacherAccess(isTeacherAccessAllowed(user));
      setLoading(false);
    }

    const unsubscribe = onAuthStateChange((authUser) => {
      const hasLocalSession = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(!!authUser || hasLocalSession);
      setHasTeacherAccess(isTeacherAccessAllowed(authUser));
      setLoading(false);
    });

    if (!user && !localAuth) {
      setLoading(false);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasTeacherRole = (isTeacher || localStorage.getItem('codecampus_role') === 'teacher') && hasTeacherAccess;

  if (!hasTeacherAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-amber-400 text-xl">!</span>
          </div>
          <p className="text-white text-lg font-semibold mb-2">Not permitted</p>
          <p className="text-gray-300 text-sm">
            Teacher access is restricted to accounts ending with @pccoepune.org.
          </p>
        </div>
      </div>
    );
  }

  return hasTeacherRole ? children : <Navigate to="/student-dashboard" replace />;
};

export default TeacherRoute;
