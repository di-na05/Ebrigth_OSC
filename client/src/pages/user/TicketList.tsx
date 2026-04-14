import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUserTickets } from '../../hooks/useTickets';
import { formatGMT8 } from '../../utils/dateUtils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { MOCK_BRANCHES, generateTicketNumber, getPlatformBranchNumber } from '../../data/mockData';
import type { TicketStatus } from '../../data/mockData';

const ISSUE_CONTEXTS = ['Aone', 'ClickUp', 'GHL', 'Process Street', 'Other'];
const STATUSES: TicketStatus[] = ['Ticket Received', 'In Progress', 'Rejected', 'Complete'];

export default function TicketList() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: userTickets = [] } = useUserTickets(currentUser?.id || 0);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    branch: '',
    issueContext: '',
    fromDate: '',
    toDate: '',
  });

  // Apply filters then sort oldest → newest
  const filteredTickets = userTickets
    .filter(ticket => {
      if (filters.status && ticket.status !== filters.status) return false;
      if (filters.branch && ticket.branch !== filters.branch) return false;
      if (filters.issueContext && ticket.issueContext !== filters.issueContext) return false;

      if (filters.fromDate) {
        const ticketDate = new Date(ticket.createdAt);
        const fromDate = new Date(filters.fromDate);
        if (ticketDate < fromDate) return false;
      }

      if (filters.toDate) {
        const ticketDate = new Date(ticket.createdAt);
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        if (ticketDate > toDate) return false;
      }

      return true;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const resetFilters = () => {
    setFilters({
      status: '',
      branch: '',
      issueContext: '',
      fromDate: '',
      toDate: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[var(--c-text)]">My Tickets</h1>
        <Button onClick={() => navigate('/tickets/new')}>New Ticket</Button>
      </div>

      {/* Filters */}
      <div className="bg-[var(--c-card)] rounded-lg shadow-sm border border-[var(--c-border)] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--c-border)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Branch</label>
            <select
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--c-border)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Branches</option>
              {MOCK_BRANCHES.map(branch => (
                <option key={branch.code} value={branch.name}>{branch.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Issue Context</label>
            <select
              value={filters.issueContext}
              onChange={(e) => setFilters({ ...filters, issueContext: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--c-border)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Contexts</option>
              {ISSUE_CONTEXTS.map(ctx => (
                <option key={ctx} value={ctx}>{ctx}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--c-border)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--c-border)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={resetFilters}
              fullWidth
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-[var(--c-card)] rounded-lg shadow-sm border border-[var(--c-border)] overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-[var(--c-text2)]">
            No tickets found. Try adjusting your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--c-input)] border-b border-[var(--c-border)] text-[var(--c-text2)]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--c-text)]">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--c-text)]">Branch</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--c-text)]">Issue Context</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--c-text)]">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--c-text)]">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--c-text)]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-[var(--c-hover)] cursor-pointer text-[var(--c-text)]" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                    <td className="px-6 py-4 text-sm text-[var(--c-text)] font-medium">TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}</td>
                    <td className="px-6 py-4 text-sm text-[var(--c-text)]">{ticket.branch}</td>
                    <td className="px-6 py-4 text-sm text-[var(--c-text)]">{ticket.issueContext}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--c-text2)]">{formatGMT8(ticket.createdAt)}</td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${ticket.id}`); }}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Remarks/Reasons Row */}
        {filteredTickets.map(ticket => {
          if (ticket.status === 'Complete' && ticket.adminRemark) {
            return (
              <div key={`remark-${ticket.id}`} className="px-6 py-3 bg-green-950 border-t border-green-800">
                <p className="text-sm text-green-200"><strong>✓ Remark:</strong> {ticket.adminRemark}</p>
              </div>
            );
          }
          if (ticket.status === 'Rejected' && ticket.rejectionReason) {
            return (
              <div key={`reason-${ticket.id}`} className="px-6 py-3 bg-red-950 border-t border-red-800">
                <p className="text-sm text-red-200"><strong>✗ Reason:</strong> {ticket.rejectionReason}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
