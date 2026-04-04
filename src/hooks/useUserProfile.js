import { useCallback, useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../lib/firestore';

export const useUserProfile = (uid) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(uid));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!uid) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return () => { isMounted = false; };
    }

    setLoading(true);
    setError(null);

    const loadProfile = async () => {
      const data = await getUserProfile(uid);
      if (!isMounted) return;
      setProfile(data);
      setLoading(false);
    };

    loadProfile().catch((err) => {
      if (!isMounted) return;
      setError(err?.message || 'Failed to load profile');
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, [uid]);

  const updateProfile = useCallback(async (data) => {
    if (!uid) {
      const result = { success: false, error: 'Missing user id' };
      setError(result.error);
      return result;
    }

    setError(null);
    const result = await updateUserProfile(uid, data);

    if (result?.success) {
      const refreshed = await getUserProfile(uid);
      setProfile(refreshed);
    } else if (result?.error) {
      setError(result.error);
    }

    return result;
  }, [uid]);

  return {
    profile,
    loading,
    error,
    updateProfile
  };
};

export default useUserProfile;
