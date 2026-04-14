import { normalizePlatformName } from '../utils/platformUtils';

export type TicketStatus = 'Ticket Received' | 'In Progress' | 'Rejected' | 'Complete';
export type Platform = 'Aone' | 'GHL' | 'Process Street' | 'ClickUp' | 'Other';
export type IssueContext = 'Aone' | 'ClickUp' | 'GHL' | 'Process Street' | 'Other';

export interface MockUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'super-admin';
  platform?: Platform;
}

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

export interface MockTicket {
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

// Mock branches (alphabetically sorted with numeric codes 01-26)
export const MOCK_BRANCHES = [
  { name: 'Ampang', code: 'AMP', branchNumber: '01' },
  { name: 'Anggun City Rawang', code: 'ACR', branchNumber: '02' },
  { name: 'Bandar Baru Bangi', code: 'BBB', branchNumber: '03' },
  { name: 'Bandar Seri Putra', code: 'BSP', branchNumber: '04' },
  { name: 'Bandar Tun Hussein Onn', code: 'BTHO', branchNumber: '05' },
  { name: 'Cyberjaya', code: 'CJY', branchNumber: '06' },
  { name: 'Danau Kota', code: 'DK', branchNumber: '07' },
  { name: 'Dataran Puchong Utama', code: 'DPU', branchNumber: '08' },
  { name: 'Desa Sri Hartamas', code: 'DSH', branchNumber: '09' },
  { name: 'Denai Alam', code: 'DA', branchNumber: '10' },
  { name: 'Eco Grandeur', code: 'EGR', branchNumber: '11' },
  { name: 'Kajang TTDI Grove', code: 'KTG', branchNumber: '12' },
  { name: 'Kota Armada', code: 'KAR', branchNumber: '13' },
  { name: 'Klang', code: 'KLG', branchNumber: '14' },
  { name: 'Kota Damansara', code: 'KD', branchNumber: '15' },
  { name: 'Kota Warisan', code: 'KW', branchNumber: '16' },
  { name: 'Online', code: 'ONL', branchNumber: '18' },
  { name: 'Putrajaya', code: 'PJY', branchNumber: '19' },
  { name: 'Rimbayu', code: 'RBY', branchNumber: '20' },
  { name: 'Setia Alam', code: 'SA', branchNumber: '21' },
  { name: 'Shah Alam', code: 'SHA', branchNumber: '22' },
  { name: 'Sri Petaling', code: 'SP', branchNumber: '23' },
  { name: 'Subang Taipan', code: 'ST', branchNumber: '24' },
  { name: 'Sunway Mentari', code: 'SWM', branchNumber: '25' },
  { name: 'Taman Sri Gombak', code: 'TSG', branchNumber: '26' },
];

// Mock users (2 per platform)
export const MOCK_USERS: MockUser[] = [
  { id: 1, email: 'ahmad.faris@example.com', password: 'password123', name: 'Ahmad Faris', role: 'user' },
  { id: 2, email: 'nurul.aina@example.com', password: 'password123', name: 'Nurul Aina', role: 'user' },
  { id: 3, email: 'rajesh.kumar@example.com', password: 'password123', name: 'Rajesh Kumar', role: 'user' },
  { id: 4, email: 'sarah.wong@example.com', password: 'password123', name: 'Sarah Wong', role: 'user' },
  { id: 5, email: 'azlan.ahmed@example.com', password: 'password123', name: 'Azlan Ahmed', role: 'user' },
  { id: 6, email: 'siti.nordin@example.com', password: 'password123', name: 'Siti Nordin', role: 'user' },
  { id: 7, email: 'ravi.murthy@example.com', password: 'password123', name: 'Ravi Murthy', role: 'user' },
  { id: 8, email: 'tan.mei.lin@example.com', password: 'password123', name: 'Tan Mei Lin', role: 'user' },
  { id: 9, email: 'ali.hassan@example.com', password: 'password123', name: 'Ali Hassan', role: 'user' },
  { id: 10, email: 'lisa.ang@example.com', password: 'password123', name: 'Lisa Ang', role: 'user' },

  // Super Admin (1)
  { id: 200, email: 'superadmin@example.com', password: 'superadmin123', name: 'Super Admin', role: 'super-admin' },

  // Mock admins (1 per platform)
  { id: 101, email: 'admin.aone@example.com', password: 'admin123', name: 'Admin Aone', role: 'admin', platform: 'Aone' },
  { id: 102, email: 'admin.ghl@example.com', password: 'admin123', name: 'Admin GHL', role: 'admin', platform: 'GHL' },
  { id: 103, email: 'admin.ps@example.com', password: 'admin123', name: 'Admin PS', role: 'admin', platform: 'Process Street' },
  { id: 104, email: 'admin.clickup@example.com', password: 'admin123', name: 'Admin ClickUp', role: 'admin', platform: 'ClickUp' },
  { id: 105, email: 'admin.other@example.com', password: 'admin123', name: 'Admin Other', role: 'admin', platform: 'Other' },
];

// Initial mock tickets
const generateInitialTickets = (): MockTicket[] => {
  const now = new Date();
  const branches = MOCK_BRANCHES.map(b => b.name);
  
  return [
    {
      id: 1,
      userId: 1,
      platform: 'Aone',
      branch: branches[0],
      issueContext: 'Aone',
      subType: 'Freeze Student',
      fields: { studentName: 'John Doe', startDate: '2026-04-05', endDate: '2026-04-15', reason: 'Medical leave' },
      status: 'Ticket Received',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      userId: 2,
      platform: 'Aone',
      branch: branches[1],
      issueContext: 'Aone',
      subType: 'Archive Student',
      fields: { studentName: 'Jane Smith', reason: 'Graduation' },
      status: 'In Progress',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      userId: 1,
      platform: 'Aone',
      branch: branches[2],
      issueContext: 'Aone',
      subType: 'Delete Invoice',
      fields: { studentName: 'Bob Johnson', invoiceNumber: 'INV-001', reason: 'Duplicate entry' },
      status: 'Complete',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      adminRemark: 'Invoice successfully deleted from system.',
    },
    {
      id: 4,
      userId: 3,
      platform: 'GHL',
      branch: branches[3],
      issueContext: 'GHL',
      subType: 'Tally',
      fields: { issueType: 'Tally', remarks: 'Numbers not matching in reports' },
      status: 'Rejected',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      rejectionReason: 'Please contact finance department directly for tally discrepancies.',
    },
    {
      id: 5,
      userId: 4,
      platform: 'GHL',
      branch: branches[4],
      issueContext: 'GHL',
      subType: 'Login',
      fields: { issueType: 'Login', remarks: 'Cannot access dashboard' },
      status: 'Ticket Received',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 6,
      userId: 5,
      platform: 'Process Street',
      branch: branches[5],
      issueContext: 'Process Street',
      subType: 'Extend',
      fields: { issueType: 'Extend', remarks: 'Need to extend workflow deadline by 2 weeks' },
      status: 'In Progress',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 7,
      userId: 6,
      platform: 'Process Street',
      branch: branches[6],
      issueContext: 'Process Street',
      subType: 'Others',
      fields: { issueType: 'Others', remarks: 'Custom workflow setup needed' },
      status: 'Complete',
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      adminRemark: 'Workflow configured as requested.',
    },
    {
      id: 8,
      userId: 7,
      platform: 'ClickUp',
      branch: branches[7],
      issueContext: 'ClickUp',
      subType: 'Missing',
      fields: { issueType: 'Missing', remarks: 'Project tasks are missing from view' },
      status: 'Ticket Received',
      createdAt: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 9,
      userId: 8,
      platform: 'ClickUp',
      branch: branches[8],
      issueContext: 'ClickUp',
      subType: 'Duplicate',
      fields: { issueType: 'Duplicate', remarks: 'Two identical tasks created' },
      status: 'In Progress',
      createdAt: new Date(now.getTime() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 10,
      userId: 9,
      platform: 'Other',
      branch: branches[9],
      issueContext: 'Other',
      subType: 'General',
      fields: { stateYourIssue: 'I need assistance with integrating the new API endpoint into the existing system.' },
      status: 'Complete',
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      adminRemark: 'Integration completed. API documentation has been shared with your team.',
    },
  ];
};

// In-memory store for tickets
let ticketStore: MockTicket[] = generateInitialTickets();
let nextTicketId = 11;

export const ticketDataStore = {
  getTickets: () => [...ticketStore],
  
  getTicketById: (id: number) => {
    return ticketStore.find(t => t.id === id);
  },
  
  getTicketsByUserId: (userId: number) => {
    return ticketStore.filter(t => t.userId === userId);
  },
  
  getTicketsByPlatform: (platform: Platform | string) => {
    const normalizedPlatform = normalizePlatformName(platform as string);
    return ticketStore.filter(t => t.platform === normalizedPlatform);
  },
  
  createTicket: (ticket: Omit<MockTicket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTicket: MockTicket = {
      ...ticket,
      id: nextTicketId++,
      createdAt: now,
      updatedAt: now,
    };
    ticketStore.push(newTicket);
    return newTicket;
  },
  
  updateTicket: (id: number, updates: Partial<Omit<MockTicket, 'id' | 'createdAt'>>) => {
    const ticket = ticketStore.find(t => t.id === id);
    if (ticket) {
      Object.assign(ticket, updates, { updatedAt: new Date().toISOString() });
      return ticket;
    }
    return null;
  },
  
  updateTicketStatus: (id: number, status: TicketStatus, adminRemark?: string, rejectionReason?: string) => {
    const ticket = ticketStore.find(t => t.id === id);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
      if (adminRemark !== undefined) ticket.adminRemark = adminRemark;
      if (rejectionReason !== undefined) ticket.rejectionReason = rejectionReason;
      return ticket;
    }
    return null;
  },
  
  deleteTicket: (id: number) => {
    const index = ticketStore.findIndex(t => t.id === id);
    if (index !== -1) {
      ticketStore.splice(index, 1);
      return true;
    }
    return false;
  },
};

/**
 * Generate ticket number in format: YYMM-BBII-TTKT
 * YY = 2-digit year, MM = 2-digit month
 * BB = branch number (01-26), II = issue type code (01-05 for platforms)
 * TT = ticket type code, KT = sequence (4 digits)
 * Example: 2604-0102-0001 (April 2026, Ampang branch, Aone platform, ticket 1)
 */
export const getPlatformIssueCode = (platform: Platform | string): number => {
  const platformMap: Record<string, number> = {
    'aone': 1,
    'ghl': 2,
    'process street': 3,
    'clickup': 4,
    'other': 5,
  };
  const code = platformMap[(platform as string).toLowerCase()];
  return code || 5; // Default to 5 (Other) if not found
};

export const getPlatformBranchNumber = (branch: string): string => {
  const branchObj = MOCK_BRANCHES.find(b => b.name === branch);
  return branchObj?.branchNumber || '00';
};

export const generateTicketNumber = (branchNumber: string, platform: Platform | string) => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2); // Last 2 digits of year
  const mm = String(now.getMonth() + 1).padStart(2, '0'); // Month (01-12)
  const ii = String(getPlatformIssueCode(platform)).padStart(2, '0'); // Issue code (01-05)
  const tt = '00'; // Ticket type code (reserved for future use)
  const kt = String(nextTicketId).padStart(4, '0'); // Sequence number
  
  return `${yy}${mm}-${branchNumber}${ii}-${tt}${kt}`;
};

// Export ticketDataStore as MOCK_DATA for convenience
export const MOCK_DATA = ticketDataStore;

/**
 * Check if a completed ticket is still visible (within 7 days)
 * Completed tickets are hidden after 7 days but remain searchable
 */
export const isTicketVisible = (ticket: MockTicket): boolean => {
  if (ticket.status !== 'Complete') {
    return true; // Non-completed tickets are always visible
  }
  
  const now = new Date();
  const completedAt = new Date(ticket.updatedAt);
  const daysSinceCompletion = (now.getTime() - completedAt.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysSinceCompletion <= 7;
};
