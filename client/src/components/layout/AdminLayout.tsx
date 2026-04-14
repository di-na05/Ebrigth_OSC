import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import { getPlatformConfig } from '../../data/platforms';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { platformSlug } = useAuth();
  const { isCollapsed } = useSidebar();
  const platformConfig = platformSlug ? getPlatformConfig(platformSlug) : null;

  return (
    <div
      className="flex min-h-screen bg-[var(--c-bg)] transition-colors duration-200"
      style={{ '--platform-accent': platformConfig?.accent || '#dc2626' } as React.CSSProperties}
    >
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
