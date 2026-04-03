"use client";

import { useCallback, useEffect, useState } from "react";
import { getRoleLabel, getBranchLabel } from "@/lib/constants";

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  gender: string;
  nickName: string;
  email: string;
  phone: string;
  nric: string;
  dob: string;
  homeAddress: string;
  branch: string;
  role: string;
  contract: string;
  startDate: string;
  probation: string;
  accessStatus: string;
  biometricTemplate: string | null;
  registeredAt: string;
}

interface EmployeeTableProps {
  refreshTrigger?: number;
  onBiometricEnroll?: (employeeId: string) => void;
}

export default function EmployeeTable({
  refreshTrigger,
  onBiometricEnroll,
}: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (branchFilter !== "all") params.append("branch", branchFilter);
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (accessFilter !== "all") params.append("accessStatus", accessFilter);

      const response = await fetch(`/api/employees?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch employees");

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, branchFilter, roleFilter, accessFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, refreshTrigger]);

  const handleAccessToggle = async (employeeId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "AUTHORIZED" ? "UNAUTHORIZED" : "AUTHORIZED";

      const response = await fetch("/api/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: employeeId, accessStatus: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update access status");

      // Update local state
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId ? { ...emp, accessStatus: newStatus } : emp
        )
      );

      alert(`Access ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDelete = async (employeeId: string) => {
    if (!confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/employees?id=${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete employee");
      }

      // Remove employee from local state
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
      alert("Employee deleted successfully");
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Management</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Branches</option>
          <option value="HQ">Headquarters</option>
          <option value="BR">Branch 1</option>
          <option value="BR2">Branch 2</option>
          <option value="BR3">Branch 3</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="HUMAN_RESOURCES">Human Resources</option>
          <option value="FINANCE">Finance</option>
          <option value="REGIONAL_MANAGER">Regional Manager</option>
          <option value="OPTIMISATION_DEPARTMENT">Optimisation Department</option>
          <option value="MARKETING">Marketing</option>
          <option value="HQ_OPERATION">HQ Operation</option>
          <option value="CEO">CEO</option>
          <option value="ACADEMY">Academy</option>
          <option value="INDUSTRIAL_PSYCHOLOGY">Industrial Psychology</option>
        </select>

        <select
          value={accessFilter}
          onChange={(e) => setAccessFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Access Status</option>
          <option value="AUTHORIZED">Authorized</option>
          <option value="UNAUTHORIZED">Unauthorized</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No employees found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Employee ID</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Full Name</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Gender</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Nick Name</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Phone</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">NRIC</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">DOB</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Home Address</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Role</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Contract</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Branch/Dept</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Start Date</th>
                <th className="px-2 py-3 text-left font-semibold text-gray-700 text-xs">Probation</th>
                <th className="px-2 py-3 text-center font-semibold text-gray-700 text-xs">Biometrics</th>
                <th className="px-2 py-3 text-center font-semibold text-gray-700 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-3 font-medium text-gray-900 text-xs">
                    {employee.employeeId}
                  </td>
                  <td className="px-2 py-3 text-gray-900 text-xs">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="px-2 py-3 text-gray-600 text-xs">
                    {employee.gender === "MALE" ? "Male" : employee.gender === "FEMALE" ? "Female" : "-"}
                  </td>
                  <td className="px-2 py-3 text-gray-600 text-xs">{employee.nickName || "-"}</td>
                  <td className="px-2 py-3 text-gray-600 text-xs">{employee.phone}</td>
                  <td className="px-2 py-3 text-gray-600 text-xs">{employee.nric || "-"}</td>
                  <td className="px-2 py-3 text-gray-600 text-xs">{employee.dob || "-"}</td>
                  <td className="px-2 py-3 text-gray-600 text-xs max-w-[150px] truncate" title={employee.homeAddress}>
                    {employee.homeAddress || "-"}
                  </td>
                  <td className="px-2 py-3 text-gray-600 text-xs">{getRoleLabel(employee.role)}</td>
                  <td className="px-2 py-3 text-gray-600 text-xs">
                    {employee.contract === "PERMANENT" ? "Permanent" : employee.contract === "CONTRACT" ? "Contract" : employee.contract === "PART_TIME" ? "Part Time" : employee.contract === "INTERN" ? "Intern" : "-"}
                  </td>
                  <td className="px-2 py-3 text-gray-600 text-xs">{getBranchLabel(employee.branch)}</td>
                  <td className="px-2 py-3 text-gray-600 text-xs">{employee.startDate || "-"}</td>
                  <td className="px-2 py-3 text-gray-600 text-xs">{employee.probation || "-"}</td>
                  <td className="px-2 py-3 text-center">
                    {employee.biometricTemplate ? (
                      <span className="text-green-600 font-semibold text-xs">✓</span>
                    ) : (
                      <span className="text-red-600 font-semibold text-xs">✗</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-center space-x-1">
                    <button
                      onClick={() => onBiometricEnroll?.(employee.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium"
                      disabled={!!employee.biometricTemplate}
                    >
                      Bio
                    </button>
                    <button
                      onClick={() =>
                        handleAccessToggle(employee.id, employee.accessStatus)
                      }
                      className={`px-2 py-1 rounded text-xs font-medium text-white ${
                        employee.accessStatus === "AUTHORIZED"
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {employee.accessStatus === "AUTHORIZED" ? "Revoke" : "Grant"}
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Total Employees: <span className="font-bold text-gray-900">{employees.length}</span>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Authorized:{" "}
          <span className="font-bold text-green-600">
            {employees.filter((e) => e.accessStatus === "AUTHORIZED").length}
          </span>{" "}
          | Unauthorized:{" "}
          <span className="font-bold text-red-600">
            {employees.filter((e) => e.accessStatus === "UNAUTHORIZED").length}
          </span>
        </p>
      </div>
    </div>
  );
}
