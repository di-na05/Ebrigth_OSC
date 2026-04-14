import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { getPlatformSlugFromName } from '../../data/platforms';
import { z } from 'zod';
import { MOCK_USERS } from '../../data/mockData';

// ── Font import (add to your index.html or global CSS if preferred) ──────────
// @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    try {
      loginSchema.parse(formData);
      setIsLoading(true);

      const success = login(formData.email, formData.password);
      if (success) {
        const user = MOCK_USERS.find(u => u.email === formData.email);
        if (user && user.role === 'admin' && user.platform) {
          const platformSlug = getPlatformSlugFromName(user.platform);
          navigate(`/admin/${platformSlug}/dashboard`);
        } else {
          setGeneralError('Invalid admin credentials');
        }
      } else {
        setGeneralError('Invalid email or password');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LoginForm> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginForm] = err.message as any;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testCredentials = () => {
    setFormData({ email: 'admin.aone@example.com', password: 'admin123' });
    setErrors({});
    setGeneralError('');
  };

  return (
    <div
      className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="bg-[var(--c-card)] rounded-2xl shadow-2xl max-w-md w-full p-8 border border-[var(--c-border)]/60">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-red-500 mb-1 tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em' }}
          >
            ebright
          </h1>
          <p className="text-[var(--c-text3)] text-sm font-light tracking-wide">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--c-text2)] mb-1.5 tracking-wide uppercase">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2.5 bg-[var(--c-input)] border rounded-xl text-[var(--c-text)] text-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none transition placeholder:text-[var(--c-text3)] ${
                errors.email ? 'border-red-500' : 'border-[var(--c-border)]/80'
              }`}
              placeholder="admin@example.com"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--c-text2)] mb-1.5 tracking-wide uppercase">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-2.5 bg-[var(--c-input)] border rounded-xl text-[var(--c-text)] text-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none transition placeholder:text-[var(--c-text3)] ${
                errors.password ? 'border-red-500' : 'border-[var(--c-border)]/80'
              }`}
              placeholder="••••••"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
          </div>

          {generalError && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-sm">
              {generalError}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Sign in as Admin
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--c-border)]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[var(--c-card)] text-[var(--c-text3)] tracking-wider uppercase">Demo Access</span>
            </div>
          </div>

          <div className="bg-[var(--c-input)]/60 p-4 rounded-xl text-sm border border-[var(--c-border)]/60">
            <p className="text-[var(--c-text2)] mb-3 text-xs font-medium tracking-wide uppercase">Try these credentials</p>
            <ul className="space-y-1.5 text-[var(--c-text3)] font-mono text-xs">
              <li>admin.aone@example.com <span className="text-[var(--c-text3)]">(Aone)</span></li>
              <li>admin.ghl@example.com <span className="text-[var(--c-text3)]">(GHL)</span></li>
              <li>admin.ps@example.com <span className="text-[var(--c-text3)]">(Process Street)</span></li>
              <li>admin.clickup@example.com <span className="text-[var(--c-text3)]">(ClickUp)</span></li>
              <li className="text-[var(--c-text3)] pt-1">Password: <span className="text-[var(--c-text2)]">admin123</span></li>
            </ul>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={testCredentials}
              className="mt-3"
            >
              Fill Demo Credentials (Aone)
            </Button>
          </div>

          <p className="text-center text-sm text-[var(--c-text3)] mt-6">
            User?{' '}
            <a href="/login" className="text-red-400 hover:text-red-300 transition-colors font-medium">
              Sign in as user
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}