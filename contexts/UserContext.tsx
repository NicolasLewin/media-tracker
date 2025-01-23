"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children, initialUser }: { children: ReactNode, initialUser: any }) => {
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/user/verify-token', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.isLoggedIn) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};