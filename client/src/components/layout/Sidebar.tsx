import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Users2,
} from 'lucide-react';
import { getPlatformConfig } from '../../data/platforms';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, role, platformSlug } = useAuth();
  const { isCollapsed, toggle } = useSidebar();
  const platformConfig = platformSlug ? getPlatformConfig(platformSlug) : null;

  const handleLogout = () => {
    logout();
    if (role === 'admin' || role === 'super-admin') {
      navigate('/admin/login', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  const userInitials =
    currentUser?.name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  const navLinks =
    role === 'super-admin'
      ? [
          { label: 'Dashboard',       href: '/admin/super-admin/dashboard', icon: LayoutDashboard },
          { label: 'User Management', href: '/admin/super-admin/users',     icon: Users },
          { label: 'All Tickets',     href: '/admin/super-admin/tickets',   icon: Ticket },
          { label: 'Platforms',       href: '/admin/super-admin/platforms', icon: Users2 },
          { label: 'Profile',         href: '/admin/super-admin/profile',   icon: User },
        ]
      : role === 'admin'
      ? [
          { label: 'Dashboard', href: `/admin/${platformSlug}/dashboard`, icon: LayoutDashboard },
          { label: 'All Tickets', href: `/admin/${platformSlug}/tickets`, icon: Ticket },
          { label: 'Team',      href: `/admin/team`,                     icon: Users2 },
          { label: 'Profile',   href: `/admin/profile`,                  icon: User },
        ]
      : [
          { label: 'Dashboard',  href: '/dashboard',  icon: LayoutDashboard },
          { label: 'My Tickets', href: '/tickets',    icon: Ticket },
          { label: 'New Ticket', href: '/tickets/new',icon: PlusCircle },
          { label: 'Profile',    href: '/profile',    icon: User },
          { label: 'Team',       href: '/team',       icon: Users2 },
        ];

  const isActive = (path: string) => location.pathname === path;
  const w = isCollapsed ? 'w-16' : 'w-60';
  const px = isCollapsed ? 'px-2' : 'px-6';

  return (
    <div
      className={`${w} min-h-screen bg-[var(--c-surface)] border-r border-[var(--c-border)] fixed left-0 top-0 flex flex-col z-40 transition-all duration-300 overflow-hidden`}
    >
      {/* Logo + collapse button */}
      <div className={`${px} py-5 border-b border-[var(--c-border)] flex items-center justify-between`}>
        {!isCollapsed && (
          <span className="text-red-500 font-bold text-lg">eBright</span>
        )}
        <button
          onClick={toggle}
          className="text-[var(--c-text2)] hover:text-[var(--c-text)] transition-colors p-1"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Profile section */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-b border-[var(--c-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[var(--c-text)] font-medium text-sm truncate">
                {currentUser?.name}
              </p>
              <p className="text-[var(--c-text2)] text-xs">
                {role === 'super-admin'
                  ? 'Super Admin'
                  : role === 'admin'
                  ? `Admin · ${platformConfig?.name}`
                  : 'Branch Mgr'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {navLinks.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              title={isCollapsed ? label : ''}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left flex-shrink-0 ${
                active
                  ? 'bg-red-950/50 border-l-2 border-red-500 text-red-400 font-medium'
                  : 'text-[var(--c-text2)] hover:text-[var(--c-text)] hover:bg-[var(--c-hover)]'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!isCollapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-[var(--c-border)]">
        <button
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : ''}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-[var(--c-text3)] hover:text-red-400 hover:bg-[var(--c-hover)] text-sm transition-colors flex-shrink-0"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
