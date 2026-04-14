/**
 * Zod validation schemas for form data
 */

import { z } from 'zod';

// Login form validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Ticket creation form validation
export const createTicketSchema = z.object({
  issueContext: z.string().min(1, 'Issue context is required'),
  subType: z.string().min(1, 'Issue type is required'),
  studentName: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reason: z.string().optional(),
  invoiceNumber: z.string().optional(),
  remarks: z.string().optional(),
  stateYourIssue: z.string().optional(),
  issueType: z.string().optional(),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;

// Ticket status update validation
export const updateTicketStatusSchema = z.object({
  status: z.enum(['Ticket Received', 'In Progress', 'Rejected', 'Complete']),
  adminRemark: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type UpdateTicketStatusData = z.infer<typeof updateTicketStatusSchema>;

// Profile update validation (optional - can be expanded)
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
