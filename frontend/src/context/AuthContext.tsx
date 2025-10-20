import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '../types';
import { Role as RoleEnum } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

/**
 * Normalize role string from backend to frontend enum format
 * Backend sends: 'admin', 'normalUser', 'storeOwner'
 * Frontend expects: 'ADMIN', 'NORMAL_USER', 'STORE_OWNER'
 */
function normalizeRoleFromBackend(role: string | Role): Role {
  const roleStr = String(role).toLowerCase();

  if (roleStr === 'admin') {
    return RoleEnum.ADMIN;
  }
  if (roleStr === 'normaluser' || roleStr === 'normal_user') {
    return RoleEnum.NORMAL_USER;
  }
  if (roleStr === 'storeowner' || roleStr === 'store_owner') {
    return RoleEnum.STORE_OWNER;
  }

  // Default fallback - try to match as-is
  return role as Role;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, userData: User) => {
    // Normalize role from backend (camelCase) to frontend (SCREAMING_SNAKE_CASE)
    const normalizedUser = {
      ...userData,
      role: normalizeRoleFromBackend(userData.role),
    };

    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, login, logout]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
