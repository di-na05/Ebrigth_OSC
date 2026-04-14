import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });
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
        navigate('/dashboard');
      } else {
        setGeneralError('Invalid email or password');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LoginForm> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginForm] = {
              email: err.message,
              password: err.message,
            }[err.path[0] as keyof LoginForm] as any;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testCredentials = () => {
    setFormData({ email: 'ahmad.faris@example.com', password: 'password123' });
    setErrors({});
    setGeneralError('');
  };

  return (
    <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center px-4">
      <div className="bg-[var(--c-card)] rounded-lg shadow-lg max-w-md w-full p-8 border border-[var(--c-border)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500 mb-2">eBright</h1>
          <p className="text-[var(--c-text2)]">User Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 bg-[var(--c-input)] text-[var(--c-text)] border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition placeholder:text-[var(--c-text3)] ${
                errors.email ? 'border-red-500' : 'border-[var(--c-border)]'
              }`}
              placeholder="user@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-2 bg-[var(--c-input)] text-[var(--c-text)] border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition placeholder:text-[var(--c-text3)] ${
                errors.password ? 'border-red-500' : 'border-[var(--c-border)]'
              }`}
              placeholder="••••••"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {generalError && (
            <div className="p-3 bg-red-950 border border-red-800 rounded-lg text-red-200 text-sm">
              {generalError}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Login
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--c-border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--c-card)] text-[var(--c-text2)]">Demo Credentials</span>
            </div>
          </div>

          <div className="bg-[var(--c-input)] p-4 rounded-lg text-sm border border-[var(--c-border)]">
            <p className="text-[var(--c-text2)] mb-3">Try these demo credentials:</p>
            <ul className="space-y-2 text-[var(--c-text2)] font-mono text-xs">
              <li>Email: ahmad.faris@example.com</li>
              <li>Password: password123</li>
            </ul>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={testCredentials}
              className="mt-3"
            >
              Fill Demo Credentials
            </Button>
          </div>

          <p className="text-center text-sm text-[var(--c-text2)] mt-6">
            Admin? <a href="/admin/login" className="text-red-500 hover:underline font-medium">Sign in as admin</a>
          </p>
        </form>
      </div>
    </div>
  );
}
