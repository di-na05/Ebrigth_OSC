import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatformTickets } from '../../hooks/useTickets';
import { useTicketsContext } from '../../context/TicketsContext';
import { useToast } from '../../context/ToastContext';
import { sendStatusEmail } from '../../utils/emailUtils';
import { formatGMT8 } from '../../utils/dateUtils';
import { MOCK_USERS, generateTicketNumber, getPlatformBranchNumber, type TicketStatus } from '../../data/mockData';
import { getPlatformConfig } from '../../data/platforms';
import type { MockTicket } from '../../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ── Font: add to index.html ───────────────────────────────────────────────────
// <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">

// ─── Bar Chart Component ──────────────────────────────────────────────────────

const BAR_DATA_CONFIG = [
  { key: 'Ticket Received', label: 'Received',    fill: '#1d4ed8' },
  { key: 'In Progress',     label: 'In Progress', fill: '#b45309' },
  { key: 'Rejected',        label: 'Rejected',    fill: '#dc2626' },
  { key: 'Complete',        label: 'Complete',    fill: '#7c3aed' },
] as const;

function TicketBarChart({ tickets }: { tickets: MockTicket[] }) {
  const data = BAR_DATA_CONFIG.map(cfg => ({
    name: cfg.label,
    count: tickets.filter(t => t.status === cfg.key).length,
    fill: cfg.fill,
  }));

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)]/80 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3
            className="text-sm font-semibold text-[var(--c-text)]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Ticket Overview
          </h3>
          <p className="text-xs text-[var(--c-text3)] mt-0.5">All tickets by status</p>
        </div>
        <span className="text-xs text-[var(--c-text3)] font-mono">
          Total: {tickets.length}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          barCategoryGap="35%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--c-text3)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--c-text3)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{
              backgroundColor: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              borderRadius: '10px',
              fontSize: '12px',
              color: 'var(--c-text)',
            }}
            itemStyle={{ color: 'var(--c-text)' }}
            labelStyle={{ color: 'var(--c-text2)', marginBottom: '4px' }}
            formatter={(value: any) => [value || 0, 'Tickets']}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 flex-wrap">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-xs text-[var(--c-text3)]">{item.name}</span>
            <span className="text-xs font-mono text-[var(--c-text2)]">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Metric Cards ─────────────────────────────────────────────────────────────

const METRIC_CONFIG = [
  {
    key: 'total' as const,
    label: 'Total',
    bg: 'bg-[var(--c-card)]',
    border: 'border-[var(--c-border)]',
    titleColor: 'text-[var(--c-text2)]',
    numColor: 'text-[var(--c-text)]',
    icon: '🎫',
  },
  {
    key: 'Ticket Received' as const,
    label: 'Received',
    bg: 'bg-blue-50 dark:bg-[#0a1628]',
    border: 'border-blue-200 dark:border-blue-900',
    titleColor: 'text-blue-600 dark:text-blue-400',
    numColor: 'text-blue-700 dark:text-blue-200',
    icon: '📥',
  },
  {
    key: 'In Progress' as const,
    label: 'In Progress',
    bg: 'bg-amber-50 dark:bg-[#1c0f00]',
    border: 'border-amber-200 dark:border-amber-900',
    titleColor: 'text-amber-600 dark:text-amber-400',
    numColor: 'text-amber-700 dark:text-amber-200',
    icon: '⏳',
  },
  {
    key: 'Rejected' as const,
    label: 'Rejected',
    bg: 'bg-red-50 dark:bg-[#1c0505]',
    border: 'border-red-200 dark:border-red-900',
    titleColor: 'text-red-600 dark:text-red-400',
    numColor: 'text-red-700 dark:text-red-200',
    icon: '❌',
  },
  {
    key: 'Complete' as const,
    label: 'Complete',
    bg: 'bg-purple-50 dark:bg-[#130a1f]',
    border: 'border-purple-200 dark:border-purple-900',
    titleColor: 'text-purple-600 dark:text-purple-400',
    numColor: 'text-purple-700 dark:text-purple-200',
    icon: '🏁',
  },
];

function MetricCards({ tickets }: { tickets: MockTicket[] }) {
  const counts: Record<string, number> = {
    total: tickets.length,
    'Ticket Received': tickets.filter(t => t.status === 'Ticket Received').length,
    'In Progress': tickets.filter(t => t.status === 'In Progress').length,
    'Rejected': tickets.filter(t => t.status === 'Rejected').length,
    'Complete': tickets.filter(t => t.status === 'Complete').length,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {METRIC_CONFIG.map(cfg => (
        <div
          key={cfg.key}
          className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 hover:border-opacity-80 transition-all duration-200`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-medium ${cfg.titleColor} uppercase tracking-wider`}>
              {cfg.label}
            </p>
            <span className="text-base">{cfg.icon}</span>
          </div>
          <p className={`text-3xl font-bold ${cfg.numColor}`}>
            {counts[cfg.key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Ticket Detail Popup ──────────────────────────────────────────────────────

type ModalAction = 'approve' | 'reject' | null;

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

  const statuses: TicketStatus[] = ['Ticket Received', 'In Progress', 'Rejected', 'Complete'];

  const handleStatusDropdownChange = (newStatus: TicketStatus) => {
    setSelectedStatus(newStatus);
    setAction(null);
    setRejectValue('');
    if (newStatus === 'Complete') setAction(null);
    else if (newStatus === 'Rejected') setAction('reject');
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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--c-border)]">
          <div>
            <p className="font-semibold text-[var(--c-text)] font-mono text-sm tracking-wide">
              TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}
            </p>
            <p className="text-[var(--c-text3)] text-xs mt-0.5">{ticket.branch}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--c-text3)] hover:text-red-400 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
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
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Issues</p>
              <div className="bg-[var(--c-input)] rounded-lg px-3 py-2 text-[var(--c-text2)] text-sm">
                {ticket.issueContext}
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Sub-type</p>
              <div className="bg-[var(--c-input)] rounded-lg px-3 py-2 text-[var(--c-text2)] text-sm">
                {ticket.subType || '—'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Created</p>
              <div className="bg-[var(--c-input)] rounded-lg px-3 py-2 text-[var(--c-text2)] text-sm">
                {formatGMT8(ticket.createdAt)}
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--c-text3)] mb-1.5">Updated</p>
              <div className="bg-[var(--c-input)] rounded-lg px-3 py-2 text-[var(--c-text2)] text-sm">
                {formatGMT8(ticket.updatedAt)}
              </div>
            </div>
          </div>

          {Object.keys(fields).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest font-medium">
                Submitted Details
              </p>
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--c-border)]">
          {(ticket.status === 'Ticket Received' || ticket.status === 'In Progress') && action !== 'reject' && (
            <button
              onClick={() => {
                setAction('reject');
                setSelectedStatus('Rejected');
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--c-hover)] border border-red-800/60 text-red-400 hover:bg-red-950/60 transition-colors"
            >
              Reject
            </button>
          )}
          {ticket.status === 'In Progress' && action === null && (
            <button
              onClick={() => {
                setAction(null);
                setSelectedStatus('Complete');
                setRejectValue('');
              }}
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
          {action === null &&
            selectedStatus !== ticket.status &&
            selectedStatus !== 'Rejected' && (
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

// ─── Kanban column config ─────────────────────────────────────────────────────

const KANBAN_COLUMNS: {
  status: TicketStatus;
  label: string;
  headerColor: string;
  dot: string;
  countBg: string;
}[] = [
  { status: 'Ticket Received', label: 'New Ticket',  headerColor: 'text-sky-400',     dot: 'bg-sky-400',     countBg: 'bg-sky-400/10 text-sky-400' },
  { status: 'In Progress',     label: 'In Progress', headerColor: 'text-amber-400',   dot: 'bg-amber-400',   countBg: 'bg-amber-400/10 text-amber-400' },
  { status: 'Rejected',        label: 'Rejected',    headerColor: 'text-red-400',     dot: 'bg-red-400',     countBg: 'bg-red-400/10 text-red-400' },
  { status: 'Complete',        label: 'Complete',    headerColor: 'text-purple-400',  dot: 'bg-purple-500',  countBg: 'bg-purple-400/10 text-purple-400' },
];

// ─── Kanban Ticket Card ───────────────────────────────────────────────────────

function KanbanCard({
  ticket,
  onOpen,
  onStatusChange,
  onDelete,
  navigate,
  platform,
}: {
  ticket: MockTicket;
  onOpen: (t: MockTicket) => void;
  onStatusChange: (id: number, status: TicketStatus) => void;
  onDelete: (id: number) => void;
  navigate: (path: string) => void;
  platform: string;
}) {
  return (
    <div
      className="bg-[var(--c-card2)] border border-[var(--c-border)] rounded-xl p-3.5 cursor-pointer shadow-sm hover:shadow-md hover:border-red-400 transition-all group"
      onClick={() => onOpen(ticket)}
    >
      {/* ID + Branch */}
      <p className="font-mono text-xs font-semibold text-[var(--c-text)] tracking-wide">
        TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}
      </p>
      <p className="text-xs text-[var(--c-text3)] mt-0.5 truncate mb-2.5">{ticket.branch}</p>

      {/* Issue */}
      <p className="text-[11px] text-[var(--c-text2)] truncate mb-3 leading-snug">{ticket.issueContext}</p>

      {/* Footer */}
      <div
        className="flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[10px] text-[var(--c-text3)] tabular-nums">
          {formatGMT8(ticket.createdAt)}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/${platform}/tickets/${ticket.id}`);
            }}
            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--c-border)] text-[var(--c-text2)] hover:bg-[var(--c-border)] transition-colors"
          >
            View
          </button>

          {ticket.status === 'Ticket Received' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(ticket.id, 'In Progress');
              }}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Start
            </button>
          )}

          {ticket.status === 'Complete' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(ticket.id, 'Complete');
                }}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-700 text-white hover:bg-purple-600 transition-colors"
              >
                View
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this ticket?')) {
                    onDelete(ticket.id);
                  }
                }}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-700 text-white hover:bg-red-800 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Inline remark / reason */}
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

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { platform } = useParams<{ platform: string }>();
  const { data: platformTickets = [] } = usePlatformTickets(platform || '');
  const { updateTicketStatus, deleteTicket } = useTicketsContext();
  const { showToast } = useToast();
  const platformConfig = platform ? getPlatformConfig(platform) : null;

  const [selectedTicket, setSelectedTicket] = useState<MockTicket | null>(null);
  const [search, setSearch] = useState('');

  const filteredTickets = platformTickets.filter(ticket => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      ticket.id.toString().includes(s) ||
      ticket.branch.toLowerCase().includes(s) ||
      ticket.issueContext.toLowerCase().includes(s)
    );
  });

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
          showToast('Email failed to send.', 'error');
        }
      }
    }
  };

  const handleDeleteTicket = (ticketId: number) => {
    const deleted = deleteTicket(ticketId);
    if (deleted) {
      showToast('Ticket deleted successfully', 'success');
      setSelectedTicket(null);
    } else {
      showToast('Failed to delete ticket', 'error');
    }
  };

  return (
    <div className="space-y-5 h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--c-text)] tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {platformConfig ? `${platformConfig.name} Dashboard` : 'Dashboard'}
          </h1>
          {platformConfig && (
            <p className="text-xs text-[var(--c-text3)] mt-0.5">
              Platform:{' '}
              <span className="text-red-400 font-medium">{platformConfig.name}</span>
            </p>
          )}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ID, branch, or issue..."
          className="px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)]/80 text-[var(--c-text)] rounded-xl text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none placeholder:text-[var(--c-text3)] w-64"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>

      {/* ── Metric Cards ── */}
      <MetricCards tickets={platformTickets} />

      {/* ── Bar Chart ── */}
      <TicketBarChart tickets={platformTickets} />

      {/* ── Kanban Board ── */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(col => {
          const colTickets = ticketsByStatus(col.status);
          return (
            <div key={col.status} className="flex-shrink-0 w-64 flex flex-col">
              {/* Column Header */}
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

              {/* Divider */}
              <div className="h-px bg-[var(--c-hover)]/80 mb-3" />

              {/* Cards */}
              <div
                className="flex flex-col gap-2.5 overflow-y-auto pr-0.5"
                style={{ maxHeight: 'calc(100vh - 230px)' }}
              >
                {colTickets.length === 0 ? (
                  <div className="flex items-center justify-center h-16 rounded-xl border border-dashed border-[var(--c-border)]">
                    <p className="text-xs text-[var(--c-text3)]">Empty</p>
                  </div>
                ) : (
                  colTickets.map(ticket => (
                    <KanbanCard
                      key={ticket.id}
                      ticket={ticket}
                      onOpen={setSelectedTicket}
                      onStatusChange={handleStatusChangeWithEmail}
                      onDelete={handleDeleteTicket}
                      navigate={navigate}
                      platform={platform || ''}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

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