import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Edit2, Save, X } from 'lucide-react';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
        checked ? 'bg-red-600' : 'bg-[var(--c-border)]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function UserProfile() {
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityUpdates, setActivityUpdates] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    department: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !formData.email.includes('@')) newErrors.email = 'Invalid email';
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (passwordData.currentPassword && passwordData.currentPassword !== currentUser?.password)
      newErrors.currentPassword = 'Current password is incorrect';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSaveProfile = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    updateCurrentUser({ name: formData.name, email: formData.email });
    setMessage('Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChangePassword = () => {
    const newErrors = validatePassword();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    updateCurrentUser({ password: passwordData.newPassword });
    setMessage('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordChange(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const inputClass = (active: boolean) =>
    `w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
      active
        ? 'bg-[var(--c-input)] border-[var(--c-border)] text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent'
        : 'bg-[var(--c-hover)] border-[var(--c-border)] text-[var(--c-text2)] cursor-not-allowed'
    }`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--c-text)]">Account Settings</h1>
          <p className="text-[var(--c-text2)] text-sm mt-1">Manage your profile and preferences</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="bg-green-950 border border-green-800 text-green-200 px-4 py-3 rounded-xl">
          {message}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-[var(--c-card)] rounded-xl shadow-sm border border-[var(--c-border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--c-text)]">Profile Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--c-hover)] hover:bg-[var(--c-border)] text-[var(--c-text2)] rounded-lg text-sm transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* User Avatar & Basic Info */}
          <div className="flex gap-6 mb-6 pb-6 border-b border-[var(--c-border)]">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--c-text2)]">User ID</p>
              <p className="text-lg font-medium text-[var(--c-text)]">#{currentUser?.id}</p>
              <p className="text-sm text-[var(--c-text2)] mt-2">Role</p>
              <p className="text-[var(--c-text)] capitalize">{currentUser?.role}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={inputClass(isEditing)}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={inputClass(isEditing)}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="+1 (555) 000-0000"
                className={inputClass(isEditing)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., Engineering, Support"
                className={inputClass(isEditing)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-[var(--c-card)] rounded-xl shadow-sm border border-[var(--c-border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--c-text)]">Security</h2>
          {!showPasswordChange && (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Change Password
            </button>
          )}
        </div>

        {showPasswordChange ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
              {errors.currentPassword && <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
              {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-text)] rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setErrors({});
                }}
                className="flex-1 px-4 py-2 bg-[var(--c-hover)] hover:bg-[var(--c-border)] text-[var(--c-text2)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--c-input)] rounded-xl p-4 border border-[var(--c-border)]">
            <p className="text-sm text-[var(--c-text2)]">Password last changed 90 days ago</p>
            <p className="text-xs text-[var(--c-text3)] mt-2">For security, we recommend changing your password regularly.</p>
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className="bg-[var(--c-card)] rounded-xl shadow-sm border border-[var(--c-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--c-text)] mb-6">Preferences</h2>

        <div className="space-y-4">
          {/* Notifications */}
          <div className="flex items-center justify-between p-4 bg-[var(--c-input)] rounded-xl border border-[var(--c-border)]">
            <div>
              <p className="text-[var(--c-text)] font-medium">Email Notifications</p>
              <p className="text-sm text-[var(--c-text2)]">Receive updates about your tickets</p>
            </div>
            <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
          </div>

          {/* Dark Mode — wired to ThemeContext */}
          <div className="flex items-center justify-between p-4 bg-[var(--c-input)] rounded-xl border border-[var(--c-border)]">
            <div>
              <p className="text-[var(--c-text)] font-medium">Dark Theme</p>
              <p className="text-sm text-[var(--c-text2)]">
                Currently {theme === 'dark' ? 'enabled' : 'disabled'}
              </p>
            </div>
            <Toggle checked={theme === 'dark'} onChange={() => toggleTheme()} />
          </div>

          {/* Activity Updates */}
          <div className="flex items-center justify-between p-4 bg-[var(--c-input)] rounded-xl border border-[var(--c-border)]">
            <div>
              <p className="text-[var(--c-text)] font-medium">Activity Updates</p>
              <p className="text-sm text-[var(--c-text2)]">Get notified of ticket updates</p>
            </div>
            <Toggle checked={activityUpdates} onChange={setActivityUpdates} />
          </div>
        </div>
      </div>

      {/* Account Info Section */}
      <div className="bg-[var(--c-card)] rounded-xl shadow-sm border border-[var(--c-border)] p-6">
        <h2 className="text-xl font-semibold text-[var(--c-text)] mb-6">Account Information</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-[var(--c-input)] rounded-xl border border-[var(--c-border)]">
            <span className="text-[var(--c-text2)]">Account Type</span>
            <span className="text-[var(--c-text)] font-medium capitalize">{currentUser?.role}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-[var(--c-input)] rounded-xl border border-[var(--c-border)]">
            <span className="text-[var(--c-text2)]">Account Status</span>
            <span className="inline-block px-3 py-1 bg-green-950 text-green-200 rounded-full text-sm font-medium">
              Active
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-[var(--c-input)] rounded-xl border border-[var(--c-border)]">
            <span className="text-[var(--c-text2)]">Member Since</span>
            <span className="text-[var(--c-text)] font-medium">January 2024</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-[var(--c-input)] rounded-xl border border-[var(--c-border)]">
            <span className="text-[var(--c-text2)]">Last Login</span>
            <span className="text-[var(--c-text)] font-medium">Today at 10:30 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
