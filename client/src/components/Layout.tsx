import { ReactNode } from 'react';
import { Navbar } from './layout/Navbar';
import { Sidebar } from './layout/Sidebar';
import { useSidebar } from '../context/SidebarContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
