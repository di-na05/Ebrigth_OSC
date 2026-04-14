import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { role, platformSlug } = useAuth();
  const params = useParams<{ platform?: string }>();
  const urlPlatform = params.platform;

  if (role === null) {
    // Not logged in - redirect to appropriate login page
    if (allowedRole === 'admin' || allowedRole === 'super-admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    // Wrong role - redirect to appropriate dashboard
    if (role === 'user') {
      return <Navigate to="/dashboard" replace />;
    }
    if (role === 'super-admin') {
      return <Navigate to="/admin/super-admin/dashboard" replace />;
    }
    if (role === 'admin' && platformSlug) {
      return <Navigate to={`/admin/${platformSlug}/dashboard`} replace />;
    }
  }

  // For admin routes, verify platform matches
  if (allowedRole === 'admin' && urlPlatform && platformSlug) {
    if (urlPlatform !== platformSlug) {
      return <Navigate to={`/admin/${platformSlug}/dashboard`} replace />;
    }
  }

  return <>{children}</>;
}
