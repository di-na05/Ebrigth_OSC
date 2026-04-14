import { useAuth } from '../../hooks/useAuth';
import { useUserTickets } from '../../hooks/useTickets';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatGMT8 } from '../../utils/dateUtils';
import { generateTicketNumber, getPlatformBranchNumber } from '../../data/mockData';

const METRIC_CARDS = [
  {
    key: 'total' as const,
    label: 'Total Tickets',
    bg: 'bg-[var(--c-card)] border-[var(--c-border)]',
    text: 'text-[var(--c-text)]',
    sub: 'text-[var(--c-text2)]',
  },
  {
    key: 'received' as const,
    label: 'Ticket Received',
    bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/60 dark:border-blue-900',
    text: 'text-blue-700 dark:text-blue-200',
    sub: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'inProgress' as const,
    label: 'In Progress',
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:border-amber-900',
    text: 'text-amber-700 dark:text-amber-200',
    sub: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'rejected' as const,
    label: 'Rejected',
    bg: 'bg-red-50 border-red-200 dark:bg-red-950/60 dark:border-red-900',
    text: 'text-red-700 dark:text-red-200',
    sub: 'text-red-600 dark:text-red-400',
  },
  {
    key: 'complete' as const,
    label: 'Complete',
    bg: 'bg-purple-50 border-purple-200 dark:bg-purple-950/60 dark:border-purple-900',
    text: 'text-purple-700 dark:text-purple-200',
    sub: 'text-purple-600 dark:text-purple-400',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: userTickets = [] } = useUserTickets(currentUser?.id || 0);

  const stats = {
    total:      userTickets.length,
    received:   userTickets.filter(t => t.status === 'Ticket Received').length,
    inProgress: userTickets.filter(t => t.status === 'In Progress').length,
    rejected:   userTickets.filter(t => t.status === 'Rejected').length,
    complete:   userTickets.filter(t => t.status === 'Complete').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--c-text)]">Dashboard</h1>
          <p className="text-[var(--c-text2)] text-sm mt-0.5">
            Welcome back, {currentUser?.name || 'Guest'}
          </p>
        </div>
        <Button onClick={() => navigate('/tickets/new')}>Create New Ticket</Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {METRIC_CARDS.map(card => (
          <div key={card.key} className={`${card.bg} border rounded-xl p-5`}>
            <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${card.sub}`}>
              {card.label}
            </p>
            <p className={`text-3xl font-bold ${card.text}`}>{stats[card.key]}</p>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="bg-[var(--c-card)] rounded-xl shadow-sm border border-[var(--c-border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--c-text)]">Recent Tickets</h2>
          <button
            onClick={() => navigate('/tickets')}
            className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            View all →
          </button>
        </div>

        {userTickets.length === 0 ? (
          <p className="text-[var(--c-text2)] text-center py-10 text-sm">
            No tickets yet.{' '}
            <button
              onClick={() => navigate('/tickets/new')}
              className="text-red-500 hover:underline"
            >
              Create your first ticket
            </button>
          </p>
        ) : (
          <div className="space-y-2">
            {userTickets.slice(0, 5).map(ticket => (
              <div
                key={ticket.id}
                className="flex items-center justify-between px-4 py-3 border border-[var(--c-border)] rounded-xl hover:bg-[var(--c-hover)] cursor-pointer transition-colors"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-semibold text-[var(--c-text)] truncate">
                    TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}
                  </p>
                  <p className="text-xs text-[var(--c-text2)] mt-0.5 truncate">
                    {ticket.branch} · {ticket.issueContext}
                    {ticket.subType ? ` · ${ticket.subType}` : ''}
                  </p>
                  <p className="text-[10px] text-[var(--c-text3)] mt-0.5">{formatGMT8(ticket.createdAt)}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
