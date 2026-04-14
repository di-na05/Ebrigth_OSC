import { useParams, useNavigate } from 'react-router-dom';
import { useTicketById } from '../../hooks/useTickets';
import { formatGMT8 } from '../../utils/dateUtils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { generateTicketNumber, getPlatformBranchNumber } from '../../data/mockData';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ticket } = useTicketById(parseInt(id || '0', 10));

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--c-text2)] mb-4">Ticket not found</p>
        <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
      </div>
    );
  }

  const fields = ticket.fields || {};

  const FieldRow = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-[var(--c-border)]">
      <dt className="text-sm font-medium text-[var(--c-text)]">{label}</dt>
      <dd className="col-span-2 text-sm text-[var(--c-text2)]">{value || '—'}</dd>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--c-text)]">TKT - {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}</h1>
        <Button variant="secondary" onClick={() => navigate('/tickets')}>
          Back to Tickets
        </Button>
      </div>

      <div className="bg-[var(--c-card)] rounded-lg shadow-sm border border-[var(--c-border)] p-6 space-y-6">
        {/* Status and Basic Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[var(--c-text2)] mb-2">Status</p>
            <StatusBadge status={ticket.status} />
          </div>
          <div>
            <p className="text-sm text-[var(--c-text2)] mb-2">Branch</p>
            <p className="text-lg font-medium">{ticket.branch}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-[var(--c-input)] rounded p-4 space-y-2 border border-[var(--c-border)]">
          <FieldRow label="Created" value={formatGMT8(ticket.createdAt)} />
          <FieldRow label="Updated" value={formatGMT8(ticket.updatedAt)} />
        </div>

        {/* Issue Details */}
        <div className="bg-[var(--c-input)] rounded p-4 space-y-2 border border-[var(--c-border)]">
          <FieldRow label="Issue Context" value={ticket.issueContext} />
          <FieldRow label="Sub-type" value={ticket.subType} />
        </div>

        {/* Dynamic Fields */}
        {Object.keys(fields).length > 0 && (
          <div className="bg-[var(--c-input)] rounded p-4 space-y-2 border border-[var(--c-border)]">
            <h3 className="font-semibold text-[var(--c-text)] mb-3">Issue Details</h3>
            {Object.entries(fields).map(([key, value]) => (
              <FieldRow
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                value={value}
              />
            ))}
          </div>
        )}

        {/* Admin Remark */}
        {ticket.status === 'Complete' && ticket.adminRemark && (
          <div className="bg-purple-950 border border-purple-800 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-400 mb-2">✓ Completion Remark</p>
            <p className="text-purple-200">{ticket.adminRemark}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {ticket.status === 'Rejected' && ticket.rejectionReason && (
          <div className="bg-red-950 border border-red-800 rounded-lg p-4">
            <p className="text-sm font-medium text-red-400 mb-2">✗ Rejection Reason</p>
            <p className="text-red-200">{ticket.rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
