import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const toggle = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', JSON.stringify(next));
      return next;
    });
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within SidebarProvider');
  return context;
}
