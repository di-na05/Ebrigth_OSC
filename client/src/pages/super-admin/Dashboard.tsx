import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DATA, MOCK_BRANCHES, MOCK_USERS } from '../../data/mockData';

const STATUS_COLORS: Record<string, string> = {
  'Ticket Received': 'text-blue-600 dark:text-blue-400',
  'In Progress':     'text-amber-600 dark:text-amber-400',
  'Rejected':        'text-red-600   dark:text-red-400',
  'Complete':        'text-purple-600 dark:text-purple-400',
};

const STATUS_BG: Record<string, string> = {
  'Ticket Received': 'bg-blue-50  border-blue-200  dark:bg-blue-950/40  dark:border-blue-900',
  'In Progress':     'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
  'Rejected':        'bg-red-50   border-red-200   dark:bg-red-950/40   dark:border-red-900',
  'Complete':        'bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-900',
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTickets: 0,
    totalUsers: 0,
    totalBranches: 0,
    ticketsByStatus: {} as Record<string, number>,
  });

  useEffect(() => {
    const allTickets = MOCK_DATA.getTickets();
    const statusCounts: Record<string, number> = {};
    allTickets.forEach((ticket) => {
      statusCounts[ticket.status] = (statusCounts[ticket.status] || 0) + 1;
    });

    setStats({
      totalTickets:   allTickets.length,
      totalUsers:     MOCK_USERS.length,
      totalBranches:  MOCK_BRANCHES.length,
      ticketsByStatus: statusCounts,
    });
  }, []);

  const statCards = [
    { label: 'Total Tickets',  value: stats.totalTickets,  accent: 'text-red-500' },
    { label: 'Total Users',    value: stats.totalUsers,    accent: 'text-blue-500' },
    { label: 'Total Branches', value: stats.totalBranches, accent: 'text-purple-500' },
    { label: 'System Status',  value: 'Operational',       accent: 'text-green-500', isText: true },
  ];

  const STATUS_ORDER = ['Ticket Received', 'In Progress', 'Rejected', 'Complete'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--c-text)] mb-1">Super Admin Dashboard</h1>
        <p className="text-[var(--c-text2)] text-sm">System-wide overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-[var(--c-card)] rounded-xl border border-[var(--c-border)] p-5">
            <p className="text-[var(--c-text2)] text-xs mb-2 uppercase tracking-wider">{card.label}</p>
            {card.isText ? (
              <p className={`text-sm font-bold ${card.accent}`}>{card.value}</p>
            ) : (
              <p className={`text-3xl font-bold ${card.accent}`}>{card.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Ticket Status Summary */}
      <div className="bg-[var(--c-card)] rounded-xl border border-[var(--c-border)] p-6">
        <h2 className="text-base font-semibold text-[var(--c-text)] mb-4">Tickets by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATUS_ORDER.map(status => (
            <div
              key={status}
              className={`px-4 py-3 rounded-xl border ${STATUS_BG[status] || 'bg-[var(--c-hover)] border-[var(--c-border)]'}`}
            >
              <p className={`text-xs mb-1 font-medium uppercase tracking-wide ${STATUS_COLORS[status] || 'text-[var(--c-text2)]'}`}>
                {status}
              </p>
              <p className={`text-2xl font-bold ${STATUS_COLORS[status] || 'text-[var(--c-text)]'}`}>
                {stats.ticketsByStatus[status] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--c-card)] rounded-xl border border-[var(--c-border)] p-6">
        <h2 className="text-base font-semibold text-[var(--c-text)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/admin/super-admin/tickets')}
            className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
          >
            View All Tickets
          </button>
          <button
            onClick={() => navigate('/admin/super-admin/users')}
            className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate('/admin/super-admin/platforms')}
            className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Platform Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
