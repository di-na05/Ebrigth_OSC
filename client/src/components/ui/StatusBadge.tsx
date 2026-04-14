import { Badge } from './Badge';
import type { TicketStatus } from '../../data/mockData';

interface StatusBadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    'Ticket Received': { variant: 'blue' as const, label: 'Ticket Received' },
    'In Progress': { variant: 'amber' as const, label: 'In Progress' },
    'Rejected': { variant: 'red' as const, label: 'Rejected' },
    'Complete': { variant: 'purple' as const, label: 'Complete' },
  };

  const config = statusConfig[status] || { variant: 'slate' as const, label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
