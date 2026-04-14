/**
 * Common types and constants used across the application
 */

// User Roles
export type UserRole = 'user' | 'admin' | 'super-admin';

// Platforms
export type Platform = 'Aone' | 'GHL' | 'Process Street' | 'ClickUp' | 'Other';
export type IssueContext = Platform;

// Tickets
export type TicketStatus = 'Ticket Received' | 'In Progress' | 'Rejected' | 'Complete';

// Branch data
export interface Branch {
  name: string;
  code: string;
  branchNumber: string;
}

// User data
export interface User {
  id: number;
  email: string;
  password?: string; // Only in mock data, not in real API
  name: string;
  role: UserRole;
  platform?: Platform; // Only for admin users
}

// Ticket data
export interface TicketFields {
  studentName?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  invoiceNumber?: string;
  remarks?: string;
  stateYourIssue?: string;
  issueType?: string; // For ClickUp, GHL, Process Street
}

export interface Ticket {
  id: number;
  userId: number;
  platform: Platform;
  branch: string;
  issueContext: IssueContext;
  subType: string;
  fields: TicketFields;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  adminRemark?: string;
  rejectionReason?: string;
}

// Login form data
export interface LoginParams {
  email: string;
  password: string;
}

// Ticket creation form data
export interface CreateTicketParams {
  branchId?: string;
  issueContext: IssueContext;
  subType: string;
  fields: TicketFields;
}
