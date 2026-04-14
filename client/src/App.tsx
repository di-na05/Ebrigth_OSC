import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Toast } from './components/ui/Toast';

// Layouts
import Layout from './components/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { SuperAdminLayout } from './components/layout/SuperAdminLayout';

// User Pages
import UserLogin from './pages/user/Login';
import UserDashboard from './pages/user/Dashboard';
import UserTicketList from './pages/user/TicketList';
import UserNewTicket from './pages/user/NewTicket';
import UserTicketDetail from './pages/user/TicketDetail';
import UserProfile from './pages/user/Profile';
import UserDirectory from './pages/user/UserDirectory';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTicketList from './pages/admin/TicketList';
import AdminTicketDetail from './pages/admin/TicketDetail';
import AdminProfile from './pages/admin/Profile';
import AdminTeamManagement from './pages/admin/TeamManagement';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import SuperAdminUserManagement from './pages/super-admin/UserManagement';
import SuperAdminTicketList from './pages/super-admin/TicketList';
import SuperAdminProfile from './pages/super-admin/Profile';
import SuperAdminPlatformManagement from './pages/super-admin/PlatformManagement';

// Route Protection
import { ProtectedRoute } from './components/layout/ProtectedRoute';

function App() {
  const { role, isAuthenticated, platformSlug } = useAuth();

  return (
    <>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            isAuthenticated && role === 'super-admin' ? (
              <Navigate to="/admin/super-admin/dashboard" replace />
            ) : isAuthenticated && role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : isAuthenticated && role === 'user' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      {/* User Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated && role === 'user' ? (
            <Navigate to="/dashboard" replace />
          ) : isAuthenticated && role === 'admin' ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <UserLogin />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="user">
            <Layout>
              <UserDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedRoute allowedRole="user">
            <Layout>
              <UserTicketList />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute allowedRole="user">
            <Layout>
              <UserNewTicket />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute allowedRole="user">
            <Layout>
              <UserTicketDetail />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRole="user">
            <Layout>
              <UserProfile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/team"
        element={
          <ProtectedRoute allowedRole="user">
            <Layout>
              <UserDirectory />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/login"
        element={
          isAuthenticated && role === 'super-admin' ? (
            <Navigate to="/admin/super-admin/dashboard" replace />
          ) : isAuthenticated && role === 'admin' ? (
            <Navigate to={`/admin/${platformSlug}/dashboard`} replace />
          ) : isAuthenticated && role === 'user' ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AdminLogin />
          )
        }
      />

      <Route
        path="/admin/:platform/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/:platform/tickets"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <AdminTicketList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/:platform/tickets/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <AdminTicketDetail />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <AdminProfile />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/team"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <AdminTeamManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/admin/super-admin/dashboard"
        element={
          <ProtectedRoute allowedRole="super-admin">
            <SuperAdminLayout>
              <SuperAdminDashboard />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/super-admin/users"
        element={
          <ProtectedRoute allowedRole="super-admin">
            <SuperAdminLayout>
              <SuperAdminUserManagement />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/super-admin/tickets"
        element={
          <ProtectedRoute allowedRole="super-admin">
            <SuperAdminLayout>
              <SuperAdminTicketList />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/super-admin/profile"
        element={
          <ProtectedRoute allowedRole="super-admin">
            <SuperAdminLayout>
              <SuperAdminProfile />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/super-admin/platforms"
        element={
          <ProtectedRoute allowedRole="super-admin">
            <SuperAdminLayout>
              <SuperAdminPlatformManagement />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Toast />
    </>
  );
}

export default App;
