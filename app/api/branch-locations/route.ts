import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ── Fixed ordered branch list ─────────────────────────────────────────────────
// Displayed in both Summary and Report dropdowns in this exact order.

export const BRANCH_LIST = [
  'HQ',
  'Online',
  'Subang Taipan',
  'Setia Alam',
  'Sri Petaling',
  'Kota Damansara',
  'Putrajaya',
  'Ampang',
  'Cyberjaya',
  'Klang',
  'Denai Alam',
  'Bandar Baru Bangi',
  'Danau Kota',
  'Shah Alam',
  'Bandar Tun Hussein Onn',
  'Eco Grandeur',
  'Bandar Seri Putra',
  'Bandar Rimbayu',
  'Taman Sri Gombak',
  'Kota Warisan',
  'Kajang',
];

// ── Location normalisation ────────────────────────────────────────────────────
// Maps every messy raw location string stored in BranchStaff to one of the
// branch names above.

export function normalizeLocation(raw: string | null): string {
  if (!raw) return 'Unknown';
  const clean = raw.trim().replace(/[\r\n]+/g, ' ').trim();
  const key   = clean.toLowerCase();

  // HQ catches any variant: "HQ", "HQ, Ampang", "ST HQ", etc.
  if (key.includes('hq')) return 'HQ';

  const MAP: Record<string, string> = {
    'onl':                    'Online',
    'online':                 'Online',

    'st':                     'Subang Taipan',
    'subang taipan':          'Subang Taipan',
    'subang taipan & ampang': 'Subang Taipan',

    'sa':                     'Setia Alam',
    'setia alam':             'Setia Alam',
    'setia alam, denai alam': 'Setia Alam',

    'sp':                     'Sri Petaling',
    'seri petaling':          'Sri Petaling',

    'kd':                     'Kota Damansara',
    'kota damansara':         'Kota Damansara',

    'pjy':                    'Putrajaya',
    'putrajaya':              'Putrajaya',

    'amp':                    'Ampang',
    'ampang':                 'Ampang',

    'cjy':                    'Cyberjaya',
    'cyberjaya':              'Cyberjaya',

    'klg':                    'Klang',
    'klang':                  'Klang',
    'kw':                     'Klang',

    'da':                     'Denai Alam',
    'denai alam':             'Denai Alam',

    'bbb':                    'Bandar Baru Bangi',

    'dk':                     'Danau Kota',

    'sha':                    'Shah Alam',
    'shah alam':              'Shah Alam',

    'btho':                   'Bandar Tun Hussein Onn',

    'egr':                    'Eco Grandeur',

    'bsp':                    'Bandar Seri Putra',

    'rby':                    'Bandar Rimbayu',

    'tsg':                    'Taman Sri Gombak',

    'ktg':                    'Kota Warisan',
    'kota warisan':           'Kota Warisan',

    'kajang':                 'Kajang',
    'marketing':              'HQ',
  };

  return MAP[key] ?? clean;
}

// ── GET /api/branch-locations ─────────────────────────────────────────────────
// Without ?location  → returns the fixed ordered branch list
// With    ?location=X → returns Active BranchStaff at that location,
//                        sorted by nickname for Summary, name for Report

export async function GET(req: NextRequest) {
  try {
    const location = req.nextUrl.searchParams.get('location');

    if (!location) {
      return NextResponse.json({ locations: BRANCH_LIST });
    }

    const all = await prisma.branchStaff.findMany({
      select: {
        id:         true,
        name:       true,
        nickname:   true,
        employeeId: true,
        department: true,
        role:       true,
        email:      true,
        status:     true,
        location:   true,
      },
      where: { status: { in: ['Active', 'Archived'] } },
      orderBy: { name: 'asc' },
    });

    const filtered = all.filter(s => normalizeLocation(s.location) === location);

    return NextResponse.json({ staff: filtered });
  } catch (err) {
    console.error('/api/branch-locations error:', err);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
