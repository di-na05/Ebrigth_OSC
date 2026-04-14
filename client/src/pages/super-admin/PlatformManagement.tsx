import { useState } from 'react';
import { MOCK_USERS } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Users, AlertCircle, Activity } from 'lucide-react';
import type { MockUser } from '../../data/mockData';

interface Platform {
  id: string;
  name: string;
  admin: MockUser;
  userCount: number;
  ticketCount: number;
  status: 'active' | 'inactive';
  createdDate: string;
}

export default function SuperAdminPlatformManagement() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  // Get all platform admins
  const platformAdmins = MOCK_USERS.filter(user => user.role === 'admin');

  // Create mock platforms
  const platforms: Platform[] = platformAdmins.map(admin => ({
    id: admin.id.toString(),
    name: admin.platform || 'Unknown Platform',
    admin: admin,
    userCount: Math.floor(Math.random() * 50) + 10,
    ticketCount: Math.floor(Math.random() * 200) + 50,
    status: Math.random() > 0.2 ? 'active' : 'inactive',
    createdDate: 'January 2024',
  }));

  const totalUsers = MOCK_USERS.filter(user => user.role === 'user').length;
  const totalAdmins = platformAdmins.length;
  const totalTickets = platforms.reduce((sum, p) => sum + p.ticketCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--c-text)]">Platform Management</h1>
          <p className="text-[var(--c-text2)] mt-1">Manage all platforms and administrators</p>
        </div>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[var(--c-text2)] text-sm">Total Users</p>
            <Users size={20} className="text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{totalUsers}</p>
          <p className="text-xs text-[var(--c-text3)] mt-2">Active accounts</p>
        </div>

        {/* Total Platforms */}
        <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[var(--c-text2)] text-sm">Platforms</p>
            <Activity size={20} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{platforms.length}</p>
          <p className="text-xs text-[var(--c-text3)] mt-2">Active platforms</p>
        </div>

        {/* Total Administrators */}
        <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[var(--c-text2)] text-sm">Administrators</p>
            <Users size={20} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{totalAdmins}</p>
          <p className="text-xs text-[var(--c-text3)] mt-2">Platform admins</p>
        </div>

        {/* Total Tickets */}
        <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[var(--c-text2)] text-sm">Total Tickets</p>
            <AlertCircle size={20} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{totalTickets}</p>
          <p className="text-xs text-[var(--c-text3)] mt-2">All platforms</p>
        </div>
      </div>

      {/* Platforms Table */}
      <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[var(--c-border)]">
          <h3 className="text-lg font-semibold text-[var(--c-text)]">All Platforms</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--c-border)] bg-[var(--c-hover)]/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text2)] uppercase tracking-wider">
                  Platform Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text2)] uppercase tracking-wider">
                  Administrator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text2)] uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text2)] uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text2)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text2)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {platforms.map(platform => (
                <tr key={platform.id} className="border-b border-[var(--c-border)] hover:bg-[var(--c-hover)]/30">
                  <td className="px-6 py-4 text-sm text-[var(--c-text)] font-medium">{platform.name}</td>
                  <td className="px-6 py-4 text-sm text-[var(--c-text2)]">{platform.admin.name}</td>
                  <td className="px-6 py-4 text-sm text-[var(--c-text2)]">{platform.userCount}</td>
                  <td className="px-6 py-4 text-sm text-[var(--c-text2)]">{platform.ticketCount}</td>
                  <td className="px-6 py-4 text-sm">
                    {platform.status === 'active' ? (
                      <span className="text-green-400">● Active</span>
                    ) : (
                      <span className="text-yellow-400">● Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedPlatform(platform)}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Detail Modal */}
      {selectedPlatform && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--c-input)] rounded-lg border border-[var(--c-border)] max-w-2xl w-full p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-lg font-semibold text-[var(--c-text)]">{selectedPlatform.name}</p>
                <p className="text-[var(--c-text2)] text-sm mt-1">Platform Details</p>
              </div>
              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-[var(--c-text2)] hover:text-[var(--c-text)] text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Details Grid */}
            <div className="space-y-4 mb-6">
              {/* Administrator */}
              <div className="bg-[var(--c-hover)]/50 rounded-lg p-4">
                <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest mb-1">Administrator</p>
                <p className="text-[var(--c-text)] font-medium">{selectedPlatform.admin.name}</p>
                <p className="text-[var(--c-text2)] text-sm">{selectedPlatform.admin.email}</p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[var(--c-hover)]/50 rounded-lg p-3">
                  <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Users</p>
                  <p className="text-lg font-bold text-[var(--c-text)] mt-1">{selectedPlatform.userCount}</p>
                </div>
                <div className="bg-[var(--c-hover)]/50 rounded-lg p-3">
                  <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Tickets</p>
                  <p className="text-lg font-bold text-[var(--c-text)] mt-1">{selectedPlatform.ticketCount}</p>
                </div>
                <div className="bg-[var(--c-hover)]/50 rounded-lg p-3">
                  <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Status</p>
                  <p className={`font-semibold mt-1 ${selectedPlatform.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {selectedPlatform.status === 'active' ? '● Active' : '● Inactive'}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-[var(--c-hover)]/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Created</p>
                    <p className="text-[var(--c-text)] font-medium mt-1">{selectedPlatform.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Platform ID</p>
                    <p className="text-[var(--c-text)] font-medium mt-1">{selectedPlatform.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-[var(--c-border)]">
              <Button variant="secondary" className="flex-1">
                Edit Platform
              </Button>
              <Button variant="secondary" className="flex-1">
                View Tickets
              </Button>
              <Button variant="secondary" className="flex-1">
                Manage Users
              </Button>
            </div>

            <Button
              onClick={() => setSelectedPlatform(null)}
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
