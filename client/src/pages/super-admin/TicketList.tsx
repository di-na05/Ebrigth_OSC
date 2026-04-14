import { useEffect, useState } from 'react';
import { MOCK_DATA, MOCK_BRANCHES, generateTicketNumber, isTicketVisible } from '../../data/mockData';
import { DateDropdown } from '../../components/DateDropdown';
import type { MockTicket } from '../../data/mockData';

export default function SuperAdminTicketList() {
  const [tickets, setTickets] = useState<MockTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<MockTicket[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    platform: '',
    branch: '',
    searchTerm: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  });

  useEffect(() => {
    const allTickets = MOCK_DATA.getTickets();
    setTickets(allTickets);
    applyFilters(allTickets, filters);
  }, []);

  const applyFilters = (ticketsToFilter: MockTicket[], filtersToApply: typeof filters) => {
    let filtered = ticketsToFilter;

    // Apply 7-day visibility rule for completed tickets
    filtered = filtered.filter(t => isTicketVisible(t));

    if (filtersToApply.status) {
      filtered = filtered.filter(t => t.status === filtersToApply.status);
    }
    if (filtersToApply.platform) {
      filtered = filtered.filter(t => t.platform === filtersToApply.platform);
    }
    if (filtersToApply.branch) {
      filtered = filtered.filter(t => t.branch === filtersToApply.branch);
    }
    if (filtersToApply.searchTerm) {
      const term = filtersToApply.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.platform.toLowerCase().includes(term) ||
        t.branch.toLowerCase().includes(term) ||
        t.subType.toLowerCase().includes(term)
      );
    }
    if (filtersToApply.dateFrom) {
      filtered = filtered.filter(t => new Date(t.createdAt) >= filtersToApply.dateFrom!);
    }
    if (filtersToApply.dateTo) {
      filtered = filtered.filter(t => new Date(t.createdAt) <= filtersToApply.dateTo!);
    }

    filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setFilteredTickets(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(tickets, newFilters);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ticket Received':
        return 'bg-blue-950 text-blue-200';
      case 'In Progress':
        return 'bg-amber-950 text-amber-200';
      case 'Rejected':
        return 'bg-red-950 text-red-200';
      case 'Complete':
        return 'bg-purple-950 text-purple-200';
      default:
        return 'bg-[var(--c-hover)] text-[var(--c-text)]';
    }
  };

  const getPlatformBranchNumber = (branch: string) => {
    const branchObj = MOCK_BRANCHES.find(b => b.name === branch);
    return branchObj?.branchNumber || '00';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--c-text)] mb-2">All Tickets</h1>
        <p className="text-[var(--c-text2)]">System-wide ticket overview</p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--c-input)] rounded-lg border border-[var(--c-border)] p-4 grid grid-cols-1 md:grid-cols-6 gap-4">
        <input
          type="text"
          placeholder="Search tickets..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)] placeholder:text-[var(--c-text3)]"
        />

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)]"
        >
          <option value="">All Status</option>
          <option value="Ticket Received">Ticket Received</option>
          <option value="In Progress">In Progress</option>
          <option value="Rejected">Rejected</option>
          <option value="Complete">Complete</option>
        </select>

        <select
          value={filters.platform}
          onChange={(e) => handleFilterChange('platform', e.target.value)}
          className="px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)]"
        >
          <option value="">All Platforms</option>
          <option value="Aone">Aone</option>
          <option value="GHL">GHL</option>
          <option value="Process Street">Process Street</option>
          <option value="ClickUp">ClickUp</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={filters.branch}
          onChange={(e) => handleFilterChange('branch', e.target.value)}
          className="px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)]"
        >
          <option value="">All Branches</option>
          {MOCK_BRANCHES.map(branch => (
            <option key={branch.code} value={branch.name}>{branch.name}</option>
          ))}
        </select>

        <DateDropdown
          onDateRangeChange={(from, to) => {
            setFilters({ ...filters, dateFrom: from, dateTo: to });
            applyFilters(tickets, { ...filters, dateFrom: from, dateTo: to });
          }}
          label="Date Range"
        />

        <button
          onClick={() => {setFilters({ status: '', platform: '', branch: '', searchTerm: '', dateFrom: null, dateTo: null }); applyFilters(tickets, { status: '', platform: '', branch: '', searchTerm: '', dateFrom: null, dateTo: null });}}
          className="px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)] hover:bg-[var(--c-border)] transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Tickets Table */}
      <div className="bg-[var(--c-input)] rounded-lg border border-[var(--c-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--c-border)] bg-[var(--c-hover)]/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Ticket #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Platform</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Branch</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-[var(--c-border)] hover:bg-[var(--c-hover)]/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--c-text)]">
                    TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}
                  </td>
                  <td className="px-4 py-3 text-[var(--c-text2)]">{ticket.platform}</td>
                  <td className="px-4 py-3 text-[var(--c-text2)]">{ticket.branch}</td>
                  <td className="px-4 py-3 text-[var(--c-text)]">{ticket.subType}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--c-text2)]">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--c-text2)]">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
