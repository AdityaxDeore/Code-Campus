export const TEACHER_DOMAIN = 'pccoepune.org';

export const isTeacherEmailAllowed = (email) => {
  if (!email || typeof email !== 'string') return false;
  return email.toLowerCase().endsWith(`@${TEACHER_DOMAIN}`);
};

export const getStoredUserEmail = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.email || null;
  } catch {
    return null;
  }
};

export const isTeacherAccessAllowed = (authUser) => {
  if (localStorage.getItem('loginMethod') === 'demo') return true;
  const email = authUser?.email || getStoredUserEmail();
  return isTeacherEmailAllowed(email);
};
