import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MOCK_USERS, type MockUser } from '../data/mockData';
import { getPlatformSlugFromName, type PlatformSlug } from '../data/platforms';

export type UserRole = 'user' | 'admin' | 'super-admin' | null;
export type Platform = 'Aone' | 'GHL' | 'Process Street' | 'ClickUp' | 'Other' | null;

interface AuthContextType {
  currentUser: MockUser | null;
  role: UserRole;
  platform: Platform;
  platformSlug: PlatformSlug | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateCurrentUser: (updates: Partial<Pick<MockUser, 'name' | 'email' | 'password'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

  const login = useCallback((email: string, password: string): boolean => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const updateCurrentUser = useCallback((updates: Partial<Pick<MockUser, 'name' | 'email' | 'password'>>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      // Persist to in-memory store so password verification still works
      const entry = MOCK_USERS.find(u => u.id === prev.id);
      if (entry) Object.assign(entry, updates);
      return updated;
    });
  }, []);

  const platformSlug = currentUser?.role === 'admin' && currentUser?.platform 
    ? getPlatformSlugFromName(currentUser.platform)
    : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        platform: (currentUser?.role === 'admin' ? currentUser?.platform : null) || null,
        platformSlug,
        isAuthenticated: !!currentUser,
        login,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
