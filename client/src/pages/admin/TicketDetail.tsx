import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicketById } from '../../hooks/useTickets';
import { useTicketsContext } from '../../context/TicketsContext';
import { useToast } from '../../context/ToastContext';
import { sendStatusEmail } from '../../utils/emailUtils';
import { formatGMT8 } from '../../utils/dateUtils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MOCK_USERS, generateTicketNumber, getPlatformBranchNumber } from '../../data/mockData';
import type { TicketStatus } from '../../data/mockData';

// ── Font: add to index.html or global CSS ────────────────────────────────────
// @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

export default function AdminTicketDetail() {
  const { id, platform } = useParams<{ id: string; platform: string }>();
  const navigate = useNavigate();
  const { data: ticket } = useTicketById(parseInt(id || '0', 10));
  const { updateTicketStatus } = useTicketsContext();
  const { showToast } = useToast();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'reject';
    value: string;
  }>({ isOpen: false, type: 'reject', value: '' });

  if (!ticket) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <p className="text-[var(--c-text2)] text-sm">Ticket not found.</p>
        <Button variant="secondary" onClick={() => navigate(`/admin/${platform}/tickets`)}>
          Back to Tickets
        </Button>
      </div>
    );
  }

  const fields = ticket.fields || {};

  const handleStatusChangeWithEmail = async (
    newStatus: TicketStatus,
    adminRemark?: string,
    rejectionReason?: string
  ) => {
    const previousStatus = ticket.status;
    updateTicketStatus(ticket.id, newStatus, adminRemark, rejectionReason);

    if (previousStatus !== newStatus &&
        (newStatus === 'Complete' || newStatus === 'Rejected' || newStatus === 'In Progress')) {
      const user = MOCK_USERS.find(u => u.id === ticket.userId);
      if (user) {
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

  const handleAction = (action: 'start' | 'reject' | 'complete') => {
    if (action === 'start') {
      handleStatusChangeWithEmail('In Progress');
    } else if (action === 'complete') {
      handleStatusChangeWithEmail('Complete');
    } else {
      setModalState({
        isOpen: true,
        type: 'reject',
        value: '',
      });
    }
  };

  const handleModalConfirm = () => {
    if (!modalState.value.trim()) return;
    if (modalState.type === 'reject') {
      handleStatusChangeWithEmail('Rejected', undefined, modalState.value);
    }
    setModalState({ isOpen: false, type: 'reject', value: '' });
  };

  const FieldRow = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-[var(--c-border)]/60 last:border-b-0">
      <dt className="text-xs font-medium text-[var(--c-text3)] uppercase tracking-widest self-center">{label}</dt>
      <dd className="col-span-2 text-sm text-[var(--c-text2)]">{value || '—'}</dd>
    </div>
  );

  return (
    <div
      className="max-w-2xl mx-auto space-y-5"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[var(--c-text)] tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.01em' }}
          >
            TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}
          </h1>
          <p className="text-[var(--c-text3)] text-sm mt-0.5">{ticket.branch}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/admin/${platform}/tickets`)}>
          ← Back
        </Button>
      </div>

      {/* Status + Summary */}
      <div className="bg-[var(--c-card)] rounded-xl border border-[var(--c-border)]/80 p-5">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--c-border)]/60">
          <div>
            <p className="text-xs text-[var(--c-text3)] mb-1.5 uppercase tracking-widest">Current Status</p>
            <StatusBadge status={ticket.status} />
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--c-text3)] mb-1 uppercase tracking-widest">Platform</p>
            <p className="text-sm text-[var(--c-text2)]">{ticket.platform || '—'}</p>
          </div>
        </div>

        <dl className="space-y-0">
          <FieldRow label="Issue Context" value={ticket.issueContext} />
          <FieldRow label="Sub-type" value={ticket.subType} />
          <FieldRow label="Created" value={formatGMT8(ticket.createdAt)} />
          <FieldRow label="Updated" value={formatGMT8(ticket.updatedAt)} />
        </dl>
      </div>

      {/* Submitted Fields */}
      {Object.keys(fields).length > 0 && (
        <div className="bg-[var(--c-card)] rounded-xl border border-[var(--c-border)]/80 p-5">
          <h3 className="text-xs font-medium text-[var(--c-text3)] uppercase tracking-widest mb-3">
            Submitted Details
          </h3>
          <dl className="space-y-0">
            {Object.entries(fields).map(([key, value]) => (
              <FieldRow
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                value={value}
              />
            ))}
          </dl>
        </div>
      )}

      {/* Completion Remark — Complete */}
      {ticket.status === 'Complete' && ticket.adminRemark && (
        <div className="bg-purple-950/50 border border-purple-800/60 rounded-xl p-4">
          <p className="text-xs font-medium text-purple-400 mb-2 uppercase tracking-widest">
            ✓ Completion Remark
          </p>
          <p className="text-sm text-purple-200">{ticket.adminRemark}</p>
        </div>
      )}

      {/* Rejection Reason */}
      {ticket.status === 'Rejected' && ticket.rejectionReason && (
        <div className="bg-red-950/50 border border-red-800/60 rounded-xl p-4">
          <p className="text-xs font-medium text-red-400 mb-2 uppercase tracking-widest">
            ✕ Rejection Reason
          </p>
          <p className="text-sm text-red-200">{ticket.rejectionReason}</p>
        </div>
      )}

      {/* Complete notice */}
      {ticket.status === 'Complete' && (
        <div className="bg-[var(--c-hover)]/40 border border-[var(--c-border)]/60 rounded-xl p-4">
          <p className="text-xs font-medium text-[var(--c-text2)] mb-2 uppercase tracking-widest">
            ✔ Ticket Completed
          </p>
          {ticket.adminRemark && (
            <p className="text-sm text-[var(--c-text2)]">{ticket.adminRemark}</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        {ticket.status === 'Ticket Received' && (
          <>
            <button
              onClick={() => handleAction('start')}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Start Processing
            </button>
            <button
              onClick={() => handleAction('reject')}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--c-hover)] border border-red-800/60 text-red-400 hover:bg-red-950/60 transition-colors"
            >
              Reject
            </button>
          </>
        )}

        {ticket.status === 'In Progress' && (
          <>
            <button
              onClick={() => handleAction('complete')}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Mark as Complete
            </button>
            <button
              onClick={() => handleAction('reject')}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--c-hover)] border border-red-800/60 text-red-400 hover:bg-red-950/60 transition-colors"
            >
              Reject
            </button>
          </>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        title="Rejection Reason"
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={handleModalConfirm}
        confirmLabel="Reject"
        confirmDisabled={!modalState.value.trim()}
      >
        <textarea
          value={modalState.value}
          onChange={(e) => setModalState({ ...modalState, value: e.target.value })}
          placeholder="Enter rejection reason (required)..."
          className="w-full px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] rounded-xl focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          rows={4}
          autoFocus
        />
      </Modal>
    </div>
  );
}