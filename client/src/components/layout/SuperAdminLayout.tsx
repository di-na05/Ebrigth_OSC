import { ReactNode } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-[var(--c-bg)] transition-colors duration-200">
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
