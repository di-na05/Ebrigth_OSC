import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/attendance-logs
//   ?empNo=44080014&month=4&year=2026           → exact empNo lookup
//   ?staffName=MOHAMD FAIQ SOUDAGAR&month=4&year=2026 → name-based lookup for BranchStaff

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const empNo     = searchParams.get('empNo');
    const staffName = searchParams.get('staffName'); // full BranchStaff name
    const month     = searchParams.get('month');
    const year      = searchParams.get('year') ?? new Date().getFullYear().toString();

    if (!month) {
      return NextResponse.json({ error: 'month is required' }, { status: 400 });
    }

    const prefix = `${year}-${String(month).padStart(2, '0')}`;

    // ── Exact empNo lookup ─────────────────────────────────────────────────────
    if (empNo) {
      const logs = await prisma.attendanceLog.findMany({
        where: { empNo, date: { startsWith: prefix } },
        orderBy: { date: 'asc' },
        select: { date: true, empName: true, clockInTime: true, clockOutTime: true },
      });
      return NextResponse.json(logs);
    }

    // ── Name-based lookup (BranchStaff full name → scanner short empName) ─────
    // Scanner stores short names (e.g. "FAIQ"); BranchStaff has full names
    // (e.g. "MOHAMD FAIQ SOUDAGAR"). Extract meaningful tokens and match any.
    if (staffName) {
      const SKIP = new Set(['BIN', 'BINTI', 'A/L', 'A/P', 'BTE', 'AP', 'NIK', 'NUR', 'NURUL', 'MUHAMMAD', 'MOHD', 'BINTI', 'ABD']);
      const tokens = staffName
        .toUpperCase()
        .split(/\s+/)
        .filter(t => t.length > 2 && !SKIP.has(t));

      if (tokens.length === 0) return NextResponse.json([]);

      const logs = await prisma.attendanceLog.findMany({
        where: {
          date: { startsWith: prefix },
          OR: tokens.map(token => ({
            empName: { contains: token, mode: 'insensitive' as const },
          })),
        },
        orderBy: { date: 'asc' },
        select: { date: true, empName: true, empNo: true, clockInTime: true, clockOutTime: true },
      });

      // De-duplicate by date+empNo in case multiple tokens matched
      const seen = new Set<string>();
      const unique = logs.filter(l => {
        const key = `${l.date}-${l.empNo}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return NextResponse.json(unique);
    }

    return NextResponse.json({ error: 'empNo or staffName is required' }, { status: 400 });
  } catch (error) {
    console.error('GET /api/attendance-logs error:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance logs' }, { status: 500 });
  }
}
