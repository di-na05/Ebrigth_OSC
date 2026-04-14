import emailjs from '@emailjs/browser';
import { formatGMT8 } from './dateUtils';
import type { MockTicket, TicketStatus } from '../data/mockData';

interface User {
  id: number;
  email: string;
  name: string;
}

// ── config check ─────────────────────────────────────────────────────────────

function getEmailConfig() {
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const configured =
    serviceId  && serviceId  !== 'your_service_id_here'  &&
    templateId && templateId !== 'your_template_id_here' &&
    publicKey  && publicKey  !== 'your_public_key_here';

  return { serviceId, templateId, publicKey, configured };
}

// ── status label helper ───────────────────────────────────────────────────────

function statusLabel(status: TicketStatus): string {
  switch (status) {
    case 'Ticket Received': return 'Received';
    case 'In Progress':     return 'In Progress';
    case 'Rejected':        return 'Rejected';
    case 'Complete':        return 'Complete';
  }
}

// ── generic status-change email ───────────────────────────────────────────────

export async function sendStatusEmail(
  ticket: MockTicket,
  user: User,
  newStatus: TicketStatus,
  adminRemark?: string,
  rejectionReason?: string
) {
  const { serviceId, templateId, publicKey, configured } = getEmailConfig();
  if (!configured) {
    console.warn('EmailJS not configured. Skipping email.');
    return { success: false, reason: 'not_configured' as const };
  }

  const templateParams = {
    to_email:         user.email,
    to_name:          user.name,
    ticket_id:        ticket.id,
    branch:           ticket.branch,
    platform:         ticket.platform,
    issue_context:    ticket.issueContext + (ticket.subType ? ' — ' + ticket.subType : ''),
    status:           statusLabel(newStatus),
    updated_at:       formatGMT8(new Date().toISOString()),
    admin_remark:     adminRemark     || ticket.adminRemark     || '',
    rejection_reason: rejectionReason || ticket.rejectionReason || '',
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return { success: true, response };
  } catch (error) {
    console.error('EmailJS send failed:', error);
    return { success: false, error };
  }
}

// ── backward-compat alias (used by existing code) ────────────────────────────

export async function sendCompletionEmail(ticket: MockTicket, user: User) {
  return sendStatusEmail(ticket, user, 'Complete');
}
