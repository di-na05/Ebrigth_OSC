import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_USERS } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Mail, Search } from 'lucide-react';
import type { MockUser } from '../../data/mockData';

export default function UserManagement() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { bg: string; text: string; label: string }> = {
      user: { bg: 'bg-blue-950', text: 'text-blue-200', label: 'User' },
      admin: { bg: 'bg-amber-950', text: 'text-amber-200', label: 'Admin' },
      'super-admin': { bg: 'bg-red-950', text: 'text-red-200', label: 'Super Admin' },
    };
    const config = roleConfig[role] || { bg: 'bg-[var(--c-hover)]', text: 'text-[var(--c-text2)]', label: role };
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStatusColor = (userId: number) => {
    // Simulate online status
    const onlineUsers = [1, 2, 3, 5, 7];
    return onlineUsers.includes(userId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--c-text)]">Team Members</h1>
        <p className="text-[var(--c-text2)] text-sm mt-1">Connect and collaborate with your team</p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--c-card)] rounded-lg shadow-sm border border-[var(--c-border)] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Search Members</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-[var(--c-text3)]" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Filter by Role */}
          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-[var(--c-text2)]">
          Showing {filteredUsers.length} of {MOCK_USERS.length} team members
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-lg overflow-hidden hover:border-red-500 transition-colors cursor-pointer group"
          >
            {/* Card Header with Status */}
            <div className="h-24 bg-gradient-to-r from-red-600 to-red-700 relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-[var(--c-card)] border-4 border-[var(--c-card)] flex items-center justify-center text-xl font-bold text-[var(--c-text)] bg-gradient-to-br from-red-500 to-red-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {getStatusColor(user.id) && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[var(--c-card)] rounded-full"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="pt-12 px-4 pb-4 text-center">
              <h3 className="text-lg font-semibold text-[var(--c-text)] group-hover:text-red-400 transition-colors">
                {user.name}
              </h3>
              <p className="text-sm text-[var(--c-text2)] mb-2">{user.email}</p>

              {/* Role Badge */}
              <div className="mb-4">
                {getRoleBadge(user.role)}
              </div>

              {/* Info Grid */}
              <div className="space-y-2 text-left border-t border-[var(--c-border)] pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-[var(--c-text3)]" />
                  <span className="text-[var(--c-text2)] truncate">{user.email}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 pt-4 border-t border-[var(--c-border)]">
                {getStatusColor(user.id) ? (
                  <span className="text-xs text-green-400">● Online</span>
                ) : (
                  <span className="text-xs text-[var(--c-text3)]">● Offline</span>
                )}
              </div>

              {currentUser?.id === user.id && (
                <div className="mt-2 inline-block px-2 py-1 bg-red-950 text-red-200 rounded text-xs font-medium">
                  You
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-lg p-12 text-center">
          <p className="text-[var(--c-text2)]">No team members found matching your search.</p>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--c-card)] rounded-lg shadow-lg max-w-md w-full border border-[var(--c-border)] overflow-hidden">
            {/* Modal Header */}
            <div className="h-20 bg-gradient-to-r from-red-600 to-red-700 relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-3 right-3 text-white hover:bg-red-700 p-1 rounded transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-[var(--c-card)] border-4 border-[var(--c-card)] flex items-center justify-center text-xl font-bold text-[var(--c-text)] bg-gradient-to-br from-red-500 to-red-600">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="pt-12 px-6 pb-6 space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-[var(--c-text)]">{selectedUser.name}</h2>
                <p className="text-sm text-[var(--c-text2)]">{selectedUser.email}</p>
              </div>

              {/* Details */}
              <div className="bg-[var(--c-input)] rounded-lg p-4 space-y-3 border border-[var(--c-border)]">
                <div>
                  <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Role</p>
                  <div className="mt-1">
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">User ID</p>
                  <p className="text-[var(--c-text)] font-medium">#{selectedUser.id}</p>
                </div>

                <div>
                  <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Email</p>
                  <p className="text-[var(--c-text)] font-medium">{selectedUser.email}</p>
                </div>

                <div>
                  <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Status</p>
                  <p className="text-[var(--c-text)] font-medium mt-1">
                    {getStatusColor(selectedUser.id) ? (
                      <span className="text-green-400">● Online</span>
                    ) : (
                      <span className="text-[var(--c-text2)]">● Offline</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {currentUser?.id !== selectedUser.id && (
                  <>
                    <Button className="flex-1" variant="secondary">
                      Message
                    </Button>
                    <Button className="flex-1">
                      View Profile
                    </Button>
                  </>
                )}
                {currentUser?.id === selectedUser.id && (
                  <Button className="w-full" variant="secondary">
                    Go to My Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
