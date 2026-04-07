import prisma from "@/lib/prisma";

export async function generateEmployeeId(branch: string): Promise<string> {
  const branchCode = branch;

  // For SQLite, we'll use a simple approach by reading and updating
  const existing = await prisma.employeeIdSequence.findUnique({
    where: { branch: branch as any },
  });

  let sequence = 1;
  if (existing) {
    sequence = existing.sequence + 1;
    await prisma.employeeIdSequence.update({
      where: { branch: branch as any },
      data: { sequence },
    });
  } else {
    await prisma.employeeIdSequence.create({
      data: { branch: branch as any, sequence: 1 },
    });
  }

  // Format the ID
  const paddedSequence = String(sequence).padStart(3, "0");
  return `${branchCode}-${paddedSequence}`;
}

export async function validateEmployeeData(
  email: string,
  phone: string,
  existingId?: string
): Promise<{ valid: boolean; error?: string }> {
  // Check if email already exists
  const existingEmail = await prisma.employee.findUnique({
    where: { email },
  });

  if (existingEmail && existingEmail.id !== existingId) {
    return { valid: false, error: "Email already registered" };
  }

  // Check if phone already exists
  const existingPhone = await prisma.employee.findUnique({
    where: { phone },
  });

  if (existingPhone && existingPhone.id !== existingId) {
    return { valid: false, error: "Phone number already registered" };
  }

  return { valid: true };
}

// Format employee name for consistent display
export function formatEmployeeName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

// Get branch display name
export function getBranchDisplayName(branch: string): string {
  const branchNames: Record<string, string> = {
    HQ: "Headquarters",
    BR: "Branch 1",
    BR2: "Branch 2",
    BR3: "Branch 3",
  };
  return branchNames[branch] || branch;
}
