import React, { createContext, useContext } from 'react';
import useAuth from '../hooks/useAuth';
import useUserProfile from '../hooks/useUserProfile';

const UserContext = createContext({
  user: null,
  loading: true,
  profile: null,
  profileLoading: true,
  updateProfile: () => {},
  profileError: null,
});

export const UserProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    updateProfile,
  } = useUserProfile(user?.uid);

  return (
    <UserContext.Provider value={{
      user,
      loading,
      profile,
      profileLoading,
      updateProfile,
      profileError,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
