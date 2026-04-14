import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_USERS } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Mail, Search } from 'lucide-react';
import type { MockUser } from '../../data/mockData';

export default function AdminTeamManagement() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  // Filter users by role (only show regular users for this admin)
  const teamUsers = MOCK_USERS.filter(user => user.role === 'user');

  const filteredUsers = teamUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (userId: number) => {
    // Simulate online status based on user ID
    return userId % 3 === 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--c-text)]">Team Management</h1>
          <p className="text-[var(--c-text2)] mt-1">Managing {filteredUsers.length} team members</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--c-text3)]" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg text-[var(--c-text)] placeholder:text-[var(--c-text3)] focus:border-red-500 outline-none transition"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="bg-[var(--c-input)] border border-[var(--c-border)] hover:border-red-600 rounded-lg p-4 cursor-pointer transition"
            >
              {/* User Avatar & Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
                  {user.name
                    ?.split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'U'}
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    getStatusColor(user.id) ? 'bg-green-500' : 'bg-[var(--c-border)]'
                  }`}
                />
              </div>

              {/* User Info */}
              <p className="text-[var(--c-text)] font-medium truncate">{user.name}</p>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Mail size={14} className="text-[var(--c-text3)]" />
                <span className="text-[var(--c-text2)] truncate">{user.email}</span>
              </div>

              {/* Status */}
              <div className="mt-3 pt-3 border-t border-[var(--c-border)]">
                <div className="text-sm">
                  {getStatusColor(user.id) ? (
                    <span className="text-green-400">● Online</span>
                  ) : (
                    <span className="text-[var(--c-text2)]">● Offline</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-[var(--c-text2)]">No team members found</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--c-input)] rounded-lg border border-[var(--c-border)] max-w-md w-full p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl">
                  {selectedUser.name
                    ?.split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'U'}
                </div>
                <div>
                  <p className="text-lg font-semibold text-[var(--c-text)]">{selectedUser.name}</p>
                  <p className="text-[var(--c-text2)] text-sm">Team Member</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-[var(--c-text2)] hover:text-[var(--c-text)] text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* User Details */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Email</p>
                <p className="text-[var(--c-text)] font-medium mt-1">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Role</p>
                <p className="text-[var(--c-text)] font-medium capitalize mt-1">{selectedUser.role}</p>
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
            {currentUser?.id !== selectedUser.id && (
              <div className="flex gap-2 pt-4 border-t border-[var(--c-border)]">
                <Button variant="secondary" className="flex-1">
                  Message
                </Button>
                <Button variant="secondary" className="flex-1">
                  View Profile
                </Button>
              </div>
            )}

            <Button
              onClick={() => setSelectedUser(null)}
              variant="secondary"
              className="w-full mt-3"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
