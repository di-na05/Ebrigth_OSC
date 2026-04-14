import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { getPlatformConfig } from '../../data/platforms';
import { Sun, Moon } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout, platformSlug, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const platformConfig = platformSlug ? getPlatformConfig(platformSlug) : null;

  const handleLogout = () => {
    logout();
    if (role === 'admin' || role === 'super-admin') {
      navigate('/admin/login', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="bg-[var(--c-surface)] shadow-sm border-b border-[var(--c-border)] h-16 transition-colors duration-200">
      <div className="h-full flex items-center gap-4 px-6">
        <div className="flex-1 flex items-center gap-2">
          <h1 className="text-xl font-bold text-red-500">eBright</h1>
          {platformConfig && role === 'admin' && (
            <>
              <span className="text-[var(--c-text3)]">·</span>
              <span style={{ color: platformConfig.accent }} className="text-sm font-semibold">
                {platformConfig.name}
              </span>
            </>
          )}
          {role === 'super-admin' && (
            <>
              <span className="text-[var(--c-text3)]">·</span>
              <span className="text-sm font-semibold text-red-500">Super Admin</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--c-border)] text-[var(--c-text2)] hover:text-[var(--c-text)] hover:border-[var(--c-text3)] transition-colors"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div className="text-right">
            <p className="text-sm font-medium text-[var(--c-text)]">{currentUser?.name}</p>
            <p className="text-xs text-[var(--c-text2)]">{currentUser?.email}</p>
            {role === 'admin' && platformConfig && (
              <p className="text-xs text-[var(--c-text3)]">
                Admin ·{' '}
                <span style={{ color: platformConfig.accent }} className="font-medium">
                  {platformConfig.name}
                </span>
              </p>
            )}
            {role === 'super-admin' && (
              <p className="text-xs text-[var(--c-text3)]">Super Admin</p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
