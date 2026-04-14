import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { usePlatformTickets } from '../../hooks/useTickets';
import { useTicketsContext } from '../../context/TicketsContext';
import { useToast } from '../../context/ToastContext';
import { sendStatusEmail } from '../../utils/emailUtils';
import { formatGMT8 } from '../../utils/dateUtils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { MOCK_BRANCHES, MOCK_USERS, generateTicketNumber, getPlatformBranchNumber, type TicketStatus } from '../../data/mockData';
import { getPlatformConfig } from '../../data/platforms';
import type { MockTicket } from '../../data/mockData';

// ── Font: add to index.html ───────────────────────────────────────────────────
// <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES: TicketStatus[] = [
  'Ticket Received',
  'In Progress',
  'Rejected',
  'Complete',
];

const PLATFORM_ISSUE_CONTEXTS: Record<string, string[]> = {
  aone: ['Freeze Student', 'Archive Student', 'Delete Invoice', 'Login Issue', 'Others'],
  clickup: ['Missing', 'Duplicate', 'Linkage', 'Others'],
  ghl: ['Leads', 'Organizing Leads', 'Booking', 'Workflow', 'Others'],
  'process-street': ['Extend', 'Others'],
  other: ['State Your Issue'],
};

const KANBAN_COLUMNS: {
  status: TicketStatus;
  label: string;
  headerColor: string;
  dot: string;
  countBg: string;
}[] = [
  { status: 'Ticket Received', label: 'New Ticket',  headerColor: 'text-sky-400',    dot: 'bg-sky-400',    countBg: 'bg-sky-400/10 text-sky-400' },
  { status: 'In Progress',     label: 'In Progress', headerColor: 'text-amber-400',  dot: 'bg-amber-400',  countBg: 'bg-amber-400/10 text-amber-400' },
  { status: 'Rejected',        label: 'Rejected',    headerColor: 'text-red-400',    dot: 'bg-red-400',    countBg: 'bg-red-400/10 text-red-400' },
  { status: 'Complete',        label: 'Complete',    headerColor: 'text-purple-400', dot: 'bg-purple-500', countBg: 'bg-purple-400/10 text-purple-400' },
];

const selectClass =
  'w-full px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none';

const inputClass =
  'w-full px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none placeholder:text-[var(--c-text3)]';

// ─── Ticket Detail Popup ──────────────────────────────────────────────────────

type ModalAction = 'reject' | null;

interface TicketDetailPopupProps {
  ticket: MockTicket;
  onClose: () => void;
  onStatusChange: (
    ticketId: number,
    newStatus: TicketStatus,
    adminRemark?: string,
    rejectionReason?: string
  ) => void;
}

function TicketDetailPopup({ ticket, onClose, onStatusChange }: TicketDetailPopupProps) {
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket.status);
  const [action, setAction] = useState<ModalAction>(null);
  const [rejectValue, setRejectValue] = useState('');

  const handleStatusDropdownChange = (newStatus: TicketStatus) => {
    setSelectedStatus(newStatus);
    setAction(null);
    setRejectValue('');
    if (newStatus === 'Rejected') setAction('reject');
  };

  const handleConfirm = () => {
    if (action === 'reject' && !rejectValue.trim()) return;
    onStatusChange(
      ticket.id,
      selectedStatus,
      undefined,
      action === 'reject' ? rejectValue : undefined
    );
    onClose();
  };

  const fields = ticket.fields || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', fontFamily: "'DM Sans', sans-serif" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--c-border)]/60 bg-[var(--c-card)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--c-border)]">
          <div>
            <p className="font-semibold text-[var(--c-text)] font-mono text-sm tracking-wide">
              TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}
            </p>
            <p className="text-[var(--c-text3)] text-xs mt-0.5">{ticket.branch}</p>
          </div>
          <button onClick={onClose} className="text-[var(--c-text3)] hover:text-red-400 transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest font-medium">Details</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Ticket</p>
              <div className="bg-[var(--c-input)] rounded-lg px-3 py-2 text-[var(--c-text2)] text-xs font-mono">
                TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)} · {ticket.branch}
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Progress</p>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusDropdownChange(e.target.value as TicketStatus)}
                className="w-full bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] text-sm rounded-lg px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Issues</p>
              <div className="bg-[var(--c-input)] rounded-lg px-3 py-2 text-[var(--c-text2)] text-sm">{ticket.issueContext}</div>
            </div>
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Sub-type</p>
              <div className="bg-[var(--c-input)] rounded-lg px-3 py-2 text-[var(--c-text2)] text-sm">{ticket.subType || '—'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Created</p>
              <div className="bg-[var(--c-input)] rounded-lg px-3 py-2 text-[var(--c-text2)] text-sm">{formatGMT8(ticket.createdAt)}</div>
            </div>
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Updated</p>
              <div className="bg-[var(--c-input)] rounded-lg px-3 py-2 text-[var(--c-text2)] text-sm">{formatGMT8(ticket.updatedAt)}</div>
            </div>
          </div>

          {Object.keys(fields).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest font-medium">Submitted Details</p>
              <div className="bg-[var(--c-input)]/80 border border-[var(--c-border)] rounded-xl p-3 space-y-2">
                {Object.entries(fields).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-2">
                    <p className="text-xs text-[var(--c-text3)] capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    </p>
                    <p className="text-xs text-[var(--c-text2)]">{String(value) || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ticket.status === 'Complete' && ticket.adminRemark && (
            <div className="bg-purple-950/50 border border-purple-800/60 rounded-xl p-3">
              <p className="text-xs text-purple-400 font-medium mb-1">✓ Completion Remark</p>
              <p className="text-sm text-purple-200">{ticket.adminRemark}</p>
            </div>
          )}

          {ticket.status === 'Rejected' && ticket.rejectionReason && (
            <div className="bg-red-950/50 border border-red-800/60 rounded-xl p-3">
              <p className="text-xs text-red-400 font-medium mb-1">✗ Rejection Reason</p>
              <p className="text-sm text-red-200">{ticket.rejectionReason}</p>
            </div>
          )}

          {action === 'reject' && (
            <div className="space-y-2">
              <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest font-medium">
                Rejection Reason <span className="text-red-500">*</span>
              </p>
              <textarea
                value={rejectValue}
                onChange={(e) => setRejectValue(e.target.value)}
                placeholder="Enter rejection reason (required)..."
                rows={3}
                autoFocus
                className="w-full bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] text-sm rounded-xl px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--c-border)]">
          {(ticket.status === 'Ticket Received' || ticket.status === 'In Progress') && action !== 'reject' && (
            <button
              onClick={() => { setAction('reject'); setSelectedStatus('Rejected'); }}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--c-hover)] border border-red-800/60 text-red-400 hover:bg-red-950/60 transition-colors"
            >
              Reject
            </button>
          )}
          {ticket.status === 'In Progress' && action === null && (
            <button
              onClick={() => { setAction(null); setSelectedStatus('Complete'); setRejectValue(''); }}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Mark Complete
            </button>
          )}
          {ticket.status === 'Ticket Received' && action === null && (
            <button
              onClick={() => { onStatusChange(ticket.id, 'In Progress'); onClose(); }}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Start
            </button>
          )}
          {action !== null && (
            <button
              onClick={handleConfirm}
              disabled={action === 'reject' && !rejectValue.trim()}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {action === 'reject' ? 'Confirm Reject' : 'Confirm'}
            </button>
          )}
          {action === null && selectedStatus !== ticket.status && selectedStatus !== 'Rejected' && (
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--c-hover)] hover:bg-[var(--c-border)] text-[var(--c-text2)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({
  ticket,
  onOpen,
  onStatusChange,
  navigate,
  platform,
}: {
  ticket: MockTicket;
  onOpen: (t: MockTicket) => void;
  onStatusChange: (id: number, status: TicketStatus) => void;
  navigate: (path: string) => void;
  platform: string;
}) {
  return (
    <div
      className="bg-[var(--c-card2)] border border-[var(--c-border)] rounded-xl p-3.5 cursor-pointer shadow-sm hover:shadow-md hover:border-red-400 transition-all group"
      onClick={() => onOpen(ticket)}
    >
      <p className="font-mono text-xs font-semibold text-[var(--c-text)] tracking-wide">
        TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}
      </p>
      <p className="text-xs text-[var(--c-text3)] mt-0.5 truncate mb-2.5">{ticket.branch}</p>
      <p className="text-[11px] text-[var(--c-text2)] truncate mb-3 leading-snug">{ticket.issueContext}</p>

      <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <span className="text-[10px] text-[var(--c-text3)] tabular-nums">{formatGMT8(ticket.createdAt)}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/admin/${platform}/tickets/${ticket.id}`); }}
            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--c-border)] text-[var(--c-text2)] hover:bg-[var(--c-border)] transition-colors"
          >
            View
          </button>
          {ticket.status === 'Ticket Received' && (
            <button
              onClick={(e) => { e.stopPropagation(); onStatusChange(ticket.id, 'In Progress'); }}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Start
            </button>
          )}
          {ticket.status === 'Complete' && (
            <button
              onClick={(e) => { e.stopPropagation(); onStatusChange(ticket.id, 'Complete'); }}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-700 text-white hover:bg-purple-600 transition-colors"
            >
              View
            </button>
          )}
        </div>
      </div>

      {ticket.status === 'Complete' && ticket.adminRemark && (
        <p className="mt-2 pt-2 border-t border-[var(--c-border)] text-[10px] text-purple-400 truncate">
          ✓ {ticket.adminRemark}
        </p>
      )}
      {ticket.status === 'Rejected' && ticket.rejectionReason && (
        <p className="mt-2 pt-2 border-t border-[var(--c-border)] text-[10px] text-red-400 truncate">
          ✕ {ticket.rejectionReason}
        </p>
      )}
    </div>
  );
}

// ─── Admin Ticket List ────────────────────────────────────────────────────────

export default function AdminTicketList() {
  const navigate = useNavigate();
  const { platform } = useParams<{ platform: string }>();
  const { data: platformTickets = [] } = usePlatformTickets(platform || '');
  const { updateTicketStatus } = useTicketsContext();
  const { showToast } = useToast();
  const platformConfig = platform ? getPlatformConfig(platform) : null;

  const issueContextOptions: string[] =
    PLATFORM_ISSUE_CONTEXTS[platform?.toLowerCase() ?? ''] ??
    [...new Set(platformTickets.map(t => t.issueContext).filter(Boolean))];

  const [selectedTicket, setSelectedTicket] = useState<MockTicket | null>(null);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');

  const [filters, setFilters] = useState({
    status: '',
    branch: '',
    issueContext: '',
    search: '',
    fromDate: '',
    toDate: '',
  });

  const resetFilters = () =>
    setFilters({ status: '', branch: '', issueContext: '', search: '', fromDate: '', toDate: '' });

  const filteredTickets = platformTickets
    .filter(ticket => {
      if (filters.status && ticket.status !== filters.status) return false;
      if (filters.branch && ticket.branch !== filters.branch) return false;
      if (filters.issueContext && ticket.subType !== filters.issueContext) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (
          !ticket.id.toString().includes(s) &&
          !ticket.branch.toLowerCase().includes(s) &&
          !ticket.issueContext.toLowerCase().includes(s) &&
          !(ticket.subType ?? '').toLowerCase().includes(s)
        ) return false;
      }
      if (filters.fromDate && new Date(ticket.createdAt) < new Date(filters.fromDate)) return false;
      if (filters.toDate) {
        const to = new Date(filters.toDate);
        to.setHours(23, 59, 59, 999);
        if (new Date(ticket.createdAt) > to) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const ticketsByStatus = (status: TicketStatus) =>
    filteredTickets.filter(t => t.status === status);

  const handleStatusChangeWithEmail = async (
    ticketId: number,
    newStatus: TicketStatus,
    adminRemark?: string,
    rejectionReason?: string
  ) => {
    const ticket = platformTickets.find(t => t.id === ticketId);
    const previousStatus = ticket?.status;
    updateTicketStatus(ticketId, newStatus, adminRemark, rejectionReason);

    if (previousStatus && previousStatus !== newStatus &&
        (newStatus === 'Complete' || newStatus === 'Rejected' || newStatus === 'In Progress')) {
      const user = MOCK_USERS.find(u => u.id === ticket!.userId);
      if (user && ticket) {
        showToast('Sending email notification...', 'warning');
        const result = await sendStatusEmail(
          { ...ticket, adminRemark: adminRemark || ticket.adminRemark },
          user,
          newStatus,
          adminRemark,
          rejectionReason
        );
        if (result.success) {
          showToast(`Email sent to ${user.email}`, 'success');
        } else if (result.reason === 'not_configured') {
          showToast('Email not configured. Add EmailJS keys to .env', 'warning');
        } else {
          showToast('Ticket complete. Email failed to send.', 'error');
        }
      }
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If dropped outside a droppable area or in same position
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Get the destination status
    const destinationStatus = destination.droppableId as TicketStatus;
    const ticketId = parseInt(draggableId);

    // Update ticket status
    handleStatusChangeWithEmail(ticketId, destinationStatus);
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1
          className="text-2xl font-semibold text-[var(--c-text)] tracking-tight"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {platformConfig ? `${platformConfig.name} Tickets` : 'All Tickets'}
        </h1>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-[var(--c-input)] border border-[var(--c-border)] rounded-xl p-1">
          <button
            onClick={() => setView('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              view === 'kanban'
                ? 'bg-[var(--c-border)] text-[var(--c-text)]'
                : 'text-[var(--c-text3)] hover:text-[var(--c-text2)]'
            }`}
          >
            ⊞ Board
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              view === 'table'
                ? 'bg-[var(--c-border)] text-[var(--c-text)]'
                : 'text-[var(--c-text3)] hover:text-[var(--c-text2)]'
            }`}
          >
            ≡ Table
          </button>
        </div>
      </div>

      {/* ── Kanban Board View ── */}
      {view === 'kanban' && (
        <>
          {/* Quick search for kanban */}
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search ID, branch, or issue..."
            className={`${inputClass} max-w-xs`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {KANBAN_COLUMNS.map(col => {
                const colTickets = ticketsByStatus(col.status);
                return (
                  <Droppable key={col.status} droppableId={col.status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-shrink-0 w-64 flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-3 px-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`} />
                            <span className={`text-xs font-semibold uppercase tracking-widest ${col.headerColor}`}>
                              {col.label}
                            </span>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.countBg}`}>
                            {colTickets.length}
                          </span>
                        </div>

                        <div className="h-px bg-[var(--c-hover)]/80 mb-3" />

                        <div
                          className={`flex flex-col gap-2.5 overflow-y-auto pr-0.5 rounded-lg transition-colors ${
                            snapshot.isDraggingOver ? 'bg-[var(--c-hover)]/40' : ''
                          }`}
                          style={{ minHeight: '200px', maxHeight: 'calc(100vh - 260px)' }}
                        >
                          {colTickets.length === 0 ? (
                            <div className="flex items-center justify-center h-16 rounded-xl border border-dashed border-[var(--c-border)]">
                              <p className="text-xs text-[var(--c-text3)]">Empty</p>
                            </div>
                          ) : (
                            colTickets.map((ticket, index) => (
                              <Draggable key={`ticket-${ticket.id}`} draggableId={`${ticket.id}`} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`transition-all ${
                                      snapshot.isDragging
                                        ? 'shadow-2xl rotate-3 opacity-50'
                                        : ''
                                    }`}
                                  >
                                    <KanbanCard
                                      ticket={ticket}
                                      onOpen={setSelectedTicket}
                                      onStatusChange={handleStatusChangeWithEmail}
                                      navigate={navigate}
                                      platform={platform || ''}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </>
      )}

      {/* ── Table View ── */}
      {view === 'table' && (
        <>
          {/* Filters */}
          <div className="bg-[var(--c-card)] rounded-xl border border-[var(--c-border)]/80 p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-[var(--c-text2)] mb-1.5 uppercase tracking-wider">Status</label>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={selectClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <option value="">All Statuses</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--c-text2)] mb-1.5 uppercase tracking-wider">Issue Type</label>
                <select value={filters.issueContext} onChange={(e) => setFilters({ ...filters, issueContext: e.target.value })} className={selectClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <option value="">All Types</option>
                  {issueContextOptions.map(ctx => <option key={ctx} value={ctx}>{ctx}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--c-text2)] mb-1.5 uppercase tracking-wider">Branch</label>
                <select value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })} className={selectClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <option value="">All Branches</option>
                  {MOCK_BRANCHES.map(b => <option key={b.code} value={b.name}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--c-text2)] mb-1.5 uppercase tracking-wider">From Date</label>
                <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--c-text2)] mb-1.5 uppercase tracking-wider">To Date</label>
                <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--c-text2)] mb-1.5">&nbsp;</label>
                <Button variant="secondary" onClick={resetFilters} fullWidth>Reset</Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--c-text2)] mb-1.5 uppercase tracking-wider">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by ticket ID, branch name, or issue type..."
                className={inputClass}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[var(--c-card)] rounded-xl border border-[var(--c-border)]/80 overflow-hidden">
            {filteredTickets.length === 0 ? (
              <div className="p-10 text-center text-[var(--c-text3)] text-sm">No tickets found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--c-input)]/60 border-b border-[var(--c-border)]">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--c-text3)] uppercase tracking-widest">ID</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--c-text3)] uppercase tracking-widest">Branch</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--c-text3)] uppercase tracking-widest">Issue Type</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--c-text3)] uppercase tracking-widest">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--c-text3)] uppercase tracking-widest">Created</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--c-text3)] uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map(ticket => (
                      <>
                        <tr
                          key={ticket.id}
                          className="border-b border-[var(--c-border)]/60 hover:bg-[var(--c-hover)]/40 cursor-pointer transition-colors"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-xs text-[var(--c-text)] font-medium tracking-wide">
                              TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-[var(--c-text2)]">{ticket.branch}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-sm text-[var(--c-text2)]">{ticket.issueContext}</span>
                            {ticket.subType && ticket.subType !== ticket.issueContext && (
                              <span className="ml-1.5 text-xs text-[var(--c-text3)]">· {ticket.subType}</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={ticket.status} />
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[var(--c-text3)]">{formatGMT8(ticket.createdAt)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => { e.stopPropagation(); navigate(`/admin/${platform}/tickets/${ticket.id}`); }}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--c-hover)] border border-[var(--c-border)] text-[var(--c-text2)] hover:bg-[var(--c-border)] transition-colors"
                              >
                                View
                              </button>
                              {ticket.status === 'Ticket Received' && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleStatusChangeWithEmail(ticket.id, 'In Progress'); }}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                                  >
                                    Start
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--c-hover)] border border-red-800/60 text-red-400 hover:bg-red-950/60 transition-colors"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {ticket.status === 'In Progress' && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--c-hover)] border border-red-800/60 text-red-400 hover:bg-red-950/60 transition-colors"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>

                        {ticket.status === 'Complete' && ticket.adminRemark && (
                          <tr key={`remark-${ticket.id}`} className="border-b border-[var(--c-border)]/60">
                            <td colSpan={6} className="px-5 py-2 bg-purple-950/30">
                              <p className="text-xs text-purple-300">
                                <span className="font-semibold text-purple-400">✓ Remark:</span>{' '}
                                {ticket.adminRemark}
                              </p>
                            </td>
                          </tr>
                        )}

                        {ticket.status === 'Rejected' && ticket.rejectionReason && (
                          <tr key={`reason-${ticket.id}`} className="border-b border-[var(--c-border)]/60">
                            <td colSpan={6} className="px-5 py-2 bg-red-950/30">
                              <p className="text-xs text-red-300">
                                <span className="font-semibold text-red-400">✕ Reason:</span>{' '}
                                {ticket.rejectionReason}
                              </p>
                            </td>
                          </tr>
                        )}

                        {ticket.status === 'Complete' && (
                          <tr key={`complete-${ticket.id}`} className="border-b border-[var(--c-border)]/60">
                            <td colSpan={6} className="px-5 py-1.5 bg-[var(--c-hover)]/30">
                              <p className="text-xs text-[var(--c-text3)]">
                                <span className="font-semibold text-[var(--c-text2)]">✔ Completed</span>
                                {ticket.adminRemark && ` · ${ticket.adminRemark}`}
                              </p>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Ticket Detail Popup */}
      {selectedTicket && (
        <TicketDetailPopup
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={(ticketId, newStatus, adminRemark, rejectionReason) => {
            handleStatusChangeWithEmail(ticketId, newStatus, adminRemark, rejectionReason);
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
}