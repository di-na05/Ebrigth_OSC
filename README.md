# Ebright Ticketing System - Frontend Only

A production-ready ticketing system frontend built with React, Vite, React Query, React Router, and Tailwind CSS.

> **Note:** This is a frontend-only implementation with mock data. No backend or database required.

## Tech Stack

- **React** (Vite)
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **React Hook Form + Zod** - Form validation

## Project Structure

```
ebright_ticketing_system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks (useAuth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/        # API routes
│   │   ├── schemas/       # Zod validation schemas
│   │   ├── services/      # Business logic
│   │   ├── scripts/       # Database initialization
│   │   ├── utils/         # JWT utilities
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── .env               # Environment variables
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE ebright_ticketing;
```

2. Update the `.env` file in `server/` with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ebright_ticketing
DB_USER=postgres
DB_PASSWORD=your_password
```

3. Initialize the database:
```bash
cd server
npm run db:init
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

The server will start on http://localhost:5000

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The client will start on http://localhost:5173

### Default Login

After running the database initialization script, you can login with:
- Email: admin@ebright.com
- Password: admin123

## Features

### Issue Contexts

The system supports the following issue contexts with conditional fields:

**Aone:**
- Freeze Student: Student Name, Start Date, End Date, Reason
- Archive Student: Student Name, Reason
- Delete Invoice: Student Name, Invoice Number, Reason
- Login Issue: Remarks
- Others: Remarks

**ClickUp:**
- Missing, Duplicate, Linkage, Others → Remarks

**GHL:**
- Leads, Tally, Organizing Leads, Booking, Workflow, Others → Remarks

**Process Street:**
- Extend, Others → Remarks

**Other:**
- State Your Issue (free text)

### Branches

The following branches are available (sorted alphabetically):
- Ampang (AMP)
- Bandar Baru Bangi (BBB)
- Bandar Seri Putra (BSP)
- Bandar Tun Hussein Onn (BTHO)
- Cyberjaya (CJY)
- Denai Alam (DA)
- Danau Kota (DK)
- Dataran Puchong Utama (DPU)
- Eco Grandeur (EGR)
- Kota Damansara (KD)
- Klang (KLG)
- Kajang TTDI Grove (KTG)
- Kota Warisan (KW)
- Online (ONL)
- Putrajaya (PJY)
- Rimbayu (RBY)
- Setia Alam (SA)
- Shah Alam (SHA)
- Sri Petaling (SP)
- Subang Taipan (ST)
- Taman Sri Gombak (TSG)

### Dashboard

The dashboard displays:
- Total tickets count
- Open tickets count
- In Progress tickets count
- Resolved tickets count
- Recent tickets table

### Ticket Management

- Create new tickets with conditional form fields
- Filter tickets by status, branch, and issue context
- Pagination support
- Ticket history tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile (requires auth)
- `GET /api/auth/users` - Get all users (admin only)

### Tickets
- `POST /api/tickets` - Create new ticket (requires auth)
- `GET /api/tickets` - Get all tickets (requires auth)
- `GET /api/tickets/stats` - Get ticket statistics (requires auth)
- `GET /api/tickets/:id` - Get ticket by ID (requires auth)
- `PATCH /api/tickets/:id/status` - Update ticket status (admin only)
- `GET /api/tickets/:id/history` - Get ticket history (requires auth)

### Branches
- `GET /api/branches` - Get all branches (requires auth)
- `GET /api/branches/:id` - Get branch by ID (requires auth)

## Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ebright_ticketing
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## License

MIT