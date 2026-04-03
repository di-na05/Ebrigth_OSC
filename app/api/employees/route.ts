import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

const dataFilePath = path.join(process.cwd(), 'data', 'employees.json');

// Helper to read employees from file
function readEmployees(): any[] {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Helper to write employees to file
function writeEmployees(employees: any[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(employees, null, 2));
}

// Helper to generate employee ID based on branch
function generateEmployeeId(employees: any[], branch: string): string {
  const branchPrefix = branch === "HQ" ? "HQ" : branch.substring(0, 2).toUpperCase();
  const branchEmployees = employees.filter((e) => e.employeeId.startsWith(branchPrefix));
  const nextNumber = branchEmployees.length + 1;
  return `${branchPrefix}-${String(nextNumber).padStart(3, "0")}`;
}

// Helper to generate unique ID
function generateId(employees: any[]): string {
  return (employees.length + 1).toString();
}

export async function GET() {
  try {
    const employees = await (prisma as any).employee.findMany({
      select: { id: true, name: true, nickname: true, branch: true, position: true },
      orderBy: { branch: 'asc' },
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    let employees = readEmployees();
    const employeeIndex = employees.findIndex((e) => e.id === id);

    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Remove employee from the array
    const deletedEmployee = employees.splice(employeeIndex, 1)[0];
    
    // Save to file
    writeEmployees(employees);

    return NextResponse.json({
      message: "Employee deleted successfully",
      data: deletedEmployee,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    let employees = readEmployees();
    const employeeIndex = employees.findIndex((e) => e.id === id);

    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Update employee
    employees[employeeIndex] = {
      ...employees[employeeIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Save to file
    writeEmployees(employees);

    return NextResponse.json({
      message: "Employee updated successfully",
      data: employees[employeeIndex],
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { firstName, lastName, email, phone, branch, role, gender, nickName, nric, dob, homeAddress, contract, startDate, probation } = body;

    if (!firstName || !lastName || !email || !phone || !branch || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let employees = readEmployees();

    // Check if email already exists
    if (employees.some((e) => e.email === email)) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Create new employee object
    const newEmployee = {
      id: generateId(employees),
      employeeId: generateEmployeeId(employees, branch),
      firstName,
      lastName,
      gender: gender || "MALE",
      nickName: nickName || "",
      phone,
      nric: nric || "",
      dob: dob || "",
      homeAddress: homeAddress || "",
      branch,
      role,
      contract: contract || "PERMANENT",
      startDate: startDate || "",
      probation: probation || "",
      biometricTemplate: null,
      accessStatus: "AUTHORIZED",
      email,
      registeredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to employees array
    employees.push(newEmployee);

    // Save to file
    writeEmployees(employees);

    return NextResponse.json(
      {
        message: "Employee registered successfully",
        data: newEmployee,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering employee:", error);
    return NextResponse.json(
      { error: "Failed to register employee" },
      { status: 500 }
    );
  }
}
