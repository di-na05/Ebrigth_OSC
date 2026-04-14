# Ticket ID Generation & Display Analysis

## Overview
This document provides detailed information about how ticket IDs/numbers are created, generated, and displayed throughout the Ebright Ticketing System.

---

## 1. TICKET ID GENERATION IN MockData.ts

### Location: `client/src/data/mockData.ts`

#### A. Ticket Number Format Definition
The system is designed to use the format: **YYMM-BBII-TTKT**
- **YY** = 2-digit year
- **MM** = 2-digit month
- **BB** = branch number (01-26)
- **II** = platform issue code (01-05 for platforms)
- **TT** = ticket type code (reserved for future use)
- **KT** = sequence number (4 digits)

**Example**: `2604-0102-0001` (April 2026, Ampang branch, Aone platform, ticket 1)

#### B. Ticket Sequence Counter
```typescript
let nextTicketId = 11;
```
Starts at 11, incremented with each new ticket created.

#### C. Platform Issue Code Mapping
```typescript
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
```

#### D. Ticket Number Generation Function
```typescript
export const generateTicketNumber = (branchNumber: string, platform: Platform | string) => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2); // Last 2 digits of year
  const mm = String(now.getMonth() + 1).padStart(2, '0'); // Month (01-12)
  const ii = String(getPlatformIssueCode(platform)).padStart(2, '0'); // Issue code (01-05)
  const tt = '00'; // Ticket type code (reserved for future use)
  const kt = String(nextTicketId).padStart(4, '0'); // Sequence number
  
  return `${yy}${mm}-${branchNumber}${ii}-${tt}${kt}`;
};
```

#### E. Branch Number Reference
Branches are defined with numeric codes (01-26):
```typescript
export const MOCK_BRANCHES = [
  { name: 'Ampang', code: 'AMP', branchNumber: '01' },
  { name: 'Anggun City Rawang', code: 'ACR', branchNumber: '02' },
  { name: 'Bandar Baru Bangi', code: 'BBB', branchNumber: '03' },
  // ... continues through 26 branches
];
```

#### F. Ticket Visibility Rule
```typescript
export const isTicketVisible = (ticket: MockTicket): boolean => {
  if (ticket.status !== 'Complete') {
    return true; // Non-completed tickets are always visible
  }
  
  const now = new Date();
  const completedAt = new Date(ticket.updatedAt);
  const daysSinceCompletion = (now.getTime() - completedAt.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysSinceCompletion <= 7;
};
```

---

## 2. MOCK TICKET CREATION

### Location: `client/src/data/mockData.ts`

Initial mock tickets are created with:
```typescript
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
    // ... more tickets
  ];
};
```

---

## 3. API TICKET GENERATION

### Location: `client/src/services/api.ts`

#### Current Implementation (Temporary Format)
The current API uses a temporary ticket number format (not YYMM-BBII-TTKT):

```typescript
export const ticketsApi = {
  create: async (data: CreateTicketInput): Promise<Ticket> => {
    await delay(500);
    const branch = MOCK_BRANCHES.find(b => b.id === data.branchId);
    const newTicket: Ticket = {
      id: ticketIdCounter++,
      ticketNumber: `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      userId: 1,
      userName: 'Admin User',
      userEmail: 'admin@ebright.com',
      branchId: data.branchId,
      branchName: branch?.name || '',
      branchCode: branch?.code || '',
      issueContext: data.issueContext,
      issueSubType: data.issueSubType || '',
      status: 'open',
      priority: data.priority || 'normal',
      // ... other fields
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTickets = [newTicket, ...mockTickets];
    return newTicket;
  },
};
```

**Example**: `TKT-1H7SN8Q-K9XZ` (temporary format)

```typescript
const generateMockTickets = (): Ticket[] => {
  return Array.from({ length: 15 }, (_, i) => {
    const context = contexts[i % contexts.length];
    const branch = MOCK_BRANCHES[i % MOCK_BRANCHES.length];
    const status = statuses[i % statuses.length];
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - i);

    return {
      id: i + 1,
      ticketNumber: `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      userId: 1,
      userName: 'Admin User',
      // ... other properties
    };
  });
};
```

---

## 4. TICKET TYPE INTERFACE

### Location: `client/src/types/index.ts`

```typescript
export interface Ticket {
  id: number;
  ticketNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  branchId: number;
  branchName: string;
  branchCode: string;
  issueContext: string;
  issueSubType: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: string;
  studentName?: string;
  startDate?: string;
  endDate?: string;
  invoiceNumber?: string;
  reason?: string;
  remarks?: string;
  stateYourIssue?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
```

---

## 5. TICKET ID DISPLAY IN COMPONENTS

### A. Super Admin Ticket List
**File**: `client/src/pages/super-admin/TicketList.tsx`

Uses the `generateTicketNumber()` function to display YYMM-BBII-TTKT format:

```typescript
// Gets platform branch number from branch name
const getPlatformBranchNumber = (branch: string) => {
  const branchObj = MOCK_BRANCHES.find(b => b.name === branch);
  return branchObj?.branchNumber || '00';
};

// Displays in table
{filteredTickets.map((ticket) => (
  <tr key={ticket.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
    <td className="px-4 py-3 font-medium text-zinc-100">
      {generateTicketNumber(getPlatformBranchNumber(ticket.branch), ticket.platform)}
    </td>
    {/* ... other columns ... */}
  </tr>
))}
```

**Example Output**: `2604-0102-0001` (April 2026, Ampang, Aone, ticket 1)

### B. User Ticket List
**File**: `client/src/pages/user/TicketList.tsx`

Uses simple ID display format:

```typescript
{filteredTickets.map(ticket => (
  <tr key={ticket.id} className="hover:bg-zinc-800 cursor-pointer text-zinc-100">
    <td className="px-6 py-4 text-sm text-white font-medium">#{ticket.id}</td>
    <td className="px-6 py-4 text-sm text-white">{ticket.branch}</td>
    <td className="px-6 py-4 text-sm text-white">{ticket.issueContext}</td>
    <td className="px-6 py-4">
      <StatusBadge status={ticket.status} />
    </td>
    <td className="px-6 py-4 text-sm text-zinc-400">{formatGMT8(ticket.createdAt)}</td>
  </tr>
))}
```

**Example Output**: `#1`, `#2`, `#3` (simple numeric IDs)

### C. User Ticket Detail
**File**: `client/src/pages/user/TicketDetail.tsx`

```typescript
return (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-white">Ticket #{ticket.id}</h1>
      <Button variant="secondary" onClick={() => navigate('/tickets')}>
        Back to Tickets
      </Button>
    </div>
    {/* ... ticket details ... */}
  </div>
);
```

### D. Admin Ticket Detail Modal (Kanban)
**File**: `client/src/pages/admin/TicketList.tsx`

```typescript
function TicketDetailPopup({ ticket, onClose, onStatusChange }: TicketDetailPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-700/60 bg-[#161616]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <p className="font-semibold text-white font-mono text-sm tracking-wide">
              TKT-{String(ticket.id).padStart(10, '0')}
            </p>
            <p className="text-zinc-500 text-xs mt-0.5">{ticket.branch}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-red-400 transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1.5">Ticket</p>
              <div className="bg-zinc-900 rounded-lg px-3 py-2 text-zinc-300 text-xs font-mono">
                TKT-{String(ticket.id).padStart(10, '0')} · {ticket.branch}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Example Output**: `TKT-0000000001` (padded with zeros)

---

## 6. TICKET ID DISPLAY PATTERNS SUMMARY

| Location | Format | Example | Notes |
|----------|--------|---------|-------|
| Super Admin TicketList | YYMM-BBII-TTKT | 2604-0102-0001 | Uses generateTicketNumber() function |
| User TicketList | Simple ID | #1, #2, #3 | Simple numeric ID with # prefix |
| User TicketDetail | Simple ID | Ticket #1 | Simple numeric ID in header |
| Admin Kanban Modal | Padded ID | TKT-0000000001 | 10-digit padded format |
| Initial Mock Data | ID only | 1, 2, 3... | Numeric ID from array |
| API Created Tickets | Random Code | TKT-1H7SN8Q-K9XZ | Temporary format (needs update) |

---

## 7. KEY FINDINGS

### Current State
- **Super Admin area**: ✅ Uses YYMM-BBII-TTKT format (generateTicketNumber function exists and works)
- **Admin Kanban**: Uses temporary TKT-xxxxxxxxxx format (10-digit padded)
- **User area**: Uses simple numeric ID format (#1, #2, etc.)
- **API**: Uses temporary TKT-RANDOM-CODE format

### Issues to Address
1. **Inconsistency**: Not all components use YYMM-BBII-TTKT format consistently
2. **API Integration**: API creates tickets with temporary TKT-RANDOM-CODE format, should use YYMM-BBII-TTKT
3. **Ticket Counter**: `nextTicketId` variable is local to mockData.ts and doesn't sync with API's `ticketIdCounter`

### Recommendations
1. Update API ticket creation to use `generateTicketNumber()` function
2. Standardize all components to display YYMM-BBII-TTKT format
3. Ensure counter synchronization between mockData and API layer
4. Update Admin Kanban modal to use consistent format
