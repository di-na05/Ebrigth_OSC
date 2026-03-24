"use client";

import { useState, useEffect } from "react";

interface User {
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
  updatedAt: string;
}

interface UserManagementProps {
  userRole?: string;
}

export default function UserManagement({ userRole = "SUPER_ADMIN" }: UserManagementProps) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);

  // Check if user has permission
  const isAuthorized = userRole === "SUPER_ADMIN";

  // Fetch users when authorized
  useEffect(() => {
    if (!isAuthorized) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/employees");
        const employees = await response.json();
        setUsers(Array.isArray(employees) ? employees : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthorized]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditData({ ...user });
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!editData) return;
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedUsers = users.map((u) => (u.id === editData.id ? editData : u));
        setUsers(updatedUsers);
        setEditMode(false);
        setSelectedUser(null);
      } else {
        setError("Failed to save user");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Failed to save user");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editData) {
      setEditData({ ...editData, [name]: value });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center py-12">
          <div className="spinner inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-lg font-semibold text-gray-900 mb-2">Access Denied</p>
          <p className="text-gray-600 mb-6">You do not have permission to access User Management. This feature is only available for Super Administrators.</p>
          <a
            href="/dashboard-employee-management"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">👥 User Management</h2>
        
        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            🔍 Search
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
              <h3 className="font-bold text-lg">Users ({filteredUsers.length})</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">No users found</p>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      setEditMode(false);
                    }}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                      selectedUser?.id === user.id ? "border-blue-600 bg-blue-50" : "border-transparent"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user.employeeId}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editMode ? "Edit User" : `${selectedUser.firstName} ${selectedUser.lastName}`}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedUser.accessStatus === "AUTHORIZED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedUser.accessStatus === "AUTHORIZED" ? "✓ Authorized" : "✗ Unauthorized"}
                </span>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editData?.firstName || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editData?.lastName || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={editData?.gender || "MALE"}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nick Name</label>
                      <input
                        type="text"
                        name="nickName"
                        value={editData?.nickName || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData?.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={editData?.phone || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">NRIC</label>
                      <input
                        type="text"
                        name="nric"
                        value={editData?.nric || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={editData?.dob || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Branch/Dept</label>
                      <input
                        type="text"
                        name="branch"
                        value={editData?.branch || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address</label>
                    <input
                      type="text"
                      name="homeAddress"
                      value={editData?.homeAddress || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={editData?.role || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contract</label>
                      <select
                        name="contract"
                        value={editData?.contract || "PERMANENT"}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PERMANENT">Permanent</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="INTERN">Intern</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={editData?.startDate || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Probation</label>
                      <input
                        type="date"
                        name="probation"
                        value={editData?.probation || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Access Status</label>
                    <select
                      name="accessStatus"
                      value={editData?.accessStatus || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AUTHORIZED">AUTHORIZED</option>
                      <option value="UNAUTHORIZED">UNAUTHORIZED</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditData(selectedUser);
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Employee ID</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.employeeId}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Full Name</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Gender</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.gender === "MALE" ? "Male" : selectedUser.gender === "FEMALE" ? "Female" : "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Nick Name</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.nickName || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.phone}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">NRIC</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.nric || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Date of Birth</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.dob || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Home Address</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.homeAddress || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Role</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.role}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Contract</label>
                      <p className="text-lg font-medium text-gray-900">
                        {selectedUser.contract === "PERMANENT" ? "Permanent" : selectedUser.contract === "CONTRACT" ? "Contract" : selectedUser.contract === "PART_TIME" ? "Part Time" : selectedUser.contract === "INTERN" ? "Intern" : "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Branch/Dept</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.branch}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Start Date</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.startDate || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Probation</label>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.probation || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Biometrics</label>
                      <p className="text-lg font-medium text-gray-900">
                        {selectedUser.biometricTemplate ? "✓ Enrolled" : "✗ Not Enrolled"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Email</label>
                      <p className="text-lg font-medium text-gray-900 break-all">{selectedUser.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <label className="text-sm font-semibold text-gray-600">Registered On</label>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(selectedUser.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEdit(selectedUser)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    ✏️ Edit User
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center text-gray-500">
                <p className="text-lg">Select a user to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
