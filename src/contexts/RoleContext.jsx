/**
 * ════════════════════════════════════════════════════════════════
 *  Role Context — Teacher / Student role switching
 * ════════════════════════════════════════════════════════════════
 *
 *  Provides `role` ('student' | 'teacher') and `toggleRole()`.
 *  Persists choice in localStorage so it survives page reloads.
 *
 *  In production this would come from a Firestore user profile or
 *  custom claims on the Firebase Auth token. For now it's a simple
 *  client-side toggle for demo / development purposes.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'codecampus_role';

const RoleContext = createContext({
  role: 'student',
  isTeacher: false,
  isStudent: true,
  toggleRole: () => {},
  setRole: () => {},
});

export const RoleProvider = ({ children }) => {
  const [role, setRoleState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'teacher' ? 'teacher' : 'student';
    } catch {
      return 'student';
    }
  });

  const setRole = useCallback((newRole) => {
    const r = newRole === 'teacher' ? 'teacher' : 'student';
    setRoleState(r);
    try { localStorage.setItem(STORAGE_KEY, r); } catch {}
  }, []);

  const toggleRole = useCallback(() => {
    setRole(role === 'teacher' ? 'student' : 'teacher');
  }, [role, setRole]);

  return (
    <RoleContext.Provider value={{
      role,
      isTeacher: role === 'teacher',
      isStudent: role === 'student',
      toggleRole,
      setRole,
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);

export default RoleContext;
