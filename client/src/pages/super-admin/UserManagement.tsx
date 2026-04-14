import { useState, useEffect } from 'react';
import { MOCK_USERS } from '../../data/mockData';
import { Trash2, Edit2 } from 'lucide-react';
import type { MockUser } from '../../data/mockData';

export default function SuperAdminUserManagement() {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<MockUser>>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setUsers(MOCK_USERS);
  }, []);

  const handleAddUser = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditUser = (user: MockUser) => {
    setFormData(user);
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleSaveUser = () => {
    if (editingId !== null) {
      // Update existing user
      setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } as MockUser : u));
    } else {
      // Add new user
      const newUser: MockUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
      } as MockUser;
      setUsers([...users, newUser]);
    }
    setShowForm(false);
    setFormData({});
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'text-purple-400 bg-purple-950/30';
      case 'admin':
        return 'text-blue-400 bg-blue-950/30';
      case 'user':
        return 'text-green-400 bg-green-950/30';
      default:
        return 'text-[var(--c-text2)] bg-[var(--c-input)]/30';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--c-text)] mb-2">User Management</h1>
        <p className="text-[var(--c-text2)]">Add, edit, and manage system users</p>
      </div>

      <button
        onClick={handleAddUser}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        + Add New User
      </button>

      {/* User Table */}
      <div className="bg-[var(--c-input)] rounded-lg border border-[var(--c-border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--c-border)] bg-[var(--c-hover)]/50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--c-text2)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[var(--c-border)] hover:bg-[var(--c-hover)]/30 transition-colors">
                <td className="px-6 py-3 text-sm text-[var(--c-text)]">{user.name}</td>
                <td className="px-6 py-3 text-sm text-[var(--c-text2)]">{user.email}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role === 'super-admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-[var(--c-text2)]">
                  {user.platform || (user.role === 'user' ? 'General' : '-')}
                </td>
                <td className="px-6 py-3 text-sm flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-1 text-[var(--c-text2)] hover:text-blue-400 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-1 text-[var(--c-text2)] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--c-input)] rounded-lg border border-[var(--c-border)] p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-[var(--c-text)] mb-4">
              {editingId ? 'Edit User' : 'Add New User'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--c-text2)] mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)] placeholder:text-[var(--c-text3)]"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--c-text2)] mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)] placeholder:text-[var(--c-text3)]"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--c-text2)] mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)] placeholder:text-[var(--c-text3)]"
                  placeholder="Password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--c-text2)] mb-1">Role</label>
                <select
                  value={formData.role || ''}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)]"
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>

              {formData.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--c-text2)] mb-1">Platform</label>
                  <select
                    value={formData.platform || ''}
                    onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                    className="w-full px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)]"
                  >
                    <option value="">Select Platform</option>
                    <option value="Aone">Aone</option>
                    <option value="GHL">GHL</option>
                    <option value="Process Street">Process Street</option>
                    <option value="ClickUp">ClickUp</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {formData.role === 'user' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--c-text2)] mb-1">Branch Assignment</label>
                  <select
                    value={formData.platform || ''}
                    onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                    className="w-full px-3 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)]"
                  >
                    <option value="">Select Branch</option>
                    <option value="Ampang">Ampang</option>
                    <option value="Anggun City Rawang">Anggun City Rawang</option>
                    <option value="Bandar Baru Bangi">Bandar Baru Bangi</option>
                    <option value="Bandar Seri Putra">Bandar Seri Putra</option>
                    <option value="Bandar Tun Hussein Onn">Bandar Tun Hussein Onn</option>
                    <option value="Cyberjaya">Cyberjaya</option>
                    <option value="Danau Kota">Danau Kota</option>
                    <option value="Dataran Puchong Utama">Dataran Puchong Utama</option>
                    <option value="Desa Sri Hartamas">Desa Sri Hartamas</option>
                    <option value="Denai Alam">Denai Alam</option>
                    <option value="Eco Grandeur">Eco Grandeur</option>
                    <option value="Kajang TTDI Grove">Kajang TTDI Grove</option>
                    <option value="Kota Armada">Kota Armada</option>
                    <option value="Klang">Klang</option>
                    <option value="Kota Damansara">Kota Damansara</option>
                    <option value="Kota Warisan">Kota Warisan</option>
                    <option value="Online">Online</option>
                    <option value="Putrajaya">Putrajaya</option>
                    <option value="Rimbayu">Rimbayu</option>
                    <option value="Setia Alam">Setia Alam</option>
                    <option value="Shah Alam">Shah Alam</option>
                    <option value="Sri Petaling">Sri Petaling</option>
                    <option value="Subang Taipan">Subang Taipan</option>
                    <option value="Sunway Mentari">Sunway Mentari</option>
                    <option value="Taman Sri Gombak">Taman Sri Gombak</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveUser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-[var(--c-hover)] text-[var(--c-text)] rounded-lg hover:bg-[var(--c-border)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
