import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export default function AdminProfile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkTheme: true,
    activityUpdates: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handleProfileUpdate = () => {
    if (!formData.name || !formData.email) {
      setErrorMessage('Name and email are required');
      return;
    }
    updateCurrentUser({ name: formData.name, email: formData.email });
    setSuccessMessage('Profile updated successfully');
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
    setEditMode(false);
  };

  const handlePasswordChange = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setErrorMessage('All password fields are required');
      return;
    }
    if (formData.currentPassword !== currentUser?.password) {
      setErrorMessage('Current password is incorrect');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }
    updateCurrentUser({ password: formData.newPassword });
    setSuccessMessage('Password changed successfully');
    setErrorMessage('');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePreferenceToggle = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const adminInitials = currentUser?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'A';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--c-text)]">Admin Profile</h1>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 flex items-center gap-3">
          <Check size={20} className="text-green-400" />
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-center gap-3">
          <X size={20} className="text-red-400" />
          <p className="text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-2xl">
            {adminInitials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--c-text)]">{currentUser?.name}</h2>
            <p className="text-[var(--c-text2)] mt-1">Platform Administrator</p>
            <p className="text-[var(--c-text3)] text-sm mt-1">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[var(--c-text)]">Account Settings</h3>
          <Button
            onClick={() => {
              if (editMode) {
                setFormData({ name: currentUser?.name || '', email: currentUser?.email || '', currentPassword: '', newPassword: '', confirmPassword: '' });
                setErrorMessage('');
                setEditMode(false);
              } else {
                setEditMode(true);
              }
            }}
            variant={editMode ? 'secondary' : 'primary'}
            size="sm"
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-[var(--c-text2)]">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full mt-2 px-4 py-2 rounded-lg border ${
                editMode
                  ? 'bg-[var(--c-hover)] border-[var(--c-border)] text-[var(--c-text)] focus:border-red-500'
                  : 'bg-[var(--c-hover)]/50 border-[var(--c-border)] text-[var(--c-text2)]'
              } outline-none transition`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-[var(--c-text2)]">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full mt-2 px-4 py-2 rounded-lg border ${
                editMode
                  ? 'bg-[var(--c-hover)] border-[var(--c-border)] text-[var(--c-text)] focus:border-red-500'
                  : 'bg-[var(--c-hover)]/50 border-[var(--c-border)] text-[var(--c-text2)]'
              } outline-none transition`}
            />
          </div>

          {editMode && (
            <Button onClick={handleProfileUpdate} className="w-full bg-red-600 hover:bg-red-700">
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Security */}
      <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[var(--c-text)] mb-6">Security</h3>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-[var(--c-text2)]">Current Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                className="w-full px-4 py-2 rounded-lg bg-[var(--c-hover)] border border-[var(--c-border)] text-[var(--c-text)] placeholder:text-[var(--c-text3)] focus:border-red-500 outline-none transition"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-text3)] hover:text-[var(--c-text2)]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-[var(--c-text2)]">New Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2 rounded-lg bg-[var(--c-hover)] border border-[var(--c-border)] text-[var(--c-text)] placeholder:text-[var(--c-text3)] focus:border-red-500 outline-none transition"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-[var(--c-text2)]">Confirm Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 rounded-lg bg-[var(--c-hover)] border border-[var(--c-border)] text-[var(--c-text)] placeholder:text-[var(--c-text3)] focus:border-red-500 outline-none transition"
              />
            </div>
          </div>

          <Button onClick={handlePasswordChange} className="w-full bg-amber-600 hover:bg-amber-700">
            Change Password
          </Button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[var(--c-text)] mb-6">Preferences</h3>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-3 bg-[var(--c-hover)]/50 rounded-lg">
            <div>
              <p className="font-medium text-[var(--c-text)]">Email Notifications</p>
              <p className="text-sm text-[var(--c-text2)]">Receive email alerts for ticket updates</p>
            </div>
            <button
              onClick={() => handlePreferenceToggle('emailNotifications')}
              className={`relative w-12 h-6 rounded-full transition ${
                preferences.emailNotifications ? 'bg-red-600' : 'bg-[var(--c-border)]'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${
                  preferences.emailNotifications ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Dark Theme */}
          <div className="flex items-center justify-between p-3 bg-[var(--c-hover)]/50 rounded-lg">
            <div>
              <p className="font-medium text-[var(--c-text)]">Dark Theme</p>
              <p className="text-sm text-[var(--c-text2)]">Currently {theme === 'dark' ? 'enabled' : 'disabled'}</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition ${
                theme === 'dark' ? 'bg-red-600' : 'bg-[var(--c-border)]'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${
                  theme === 'dark' ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Activity Updates */}
          <div className="flex items-center justify-between p-3 bg-[var(--c-hover)]/50 rounded-lg">
            <div>
              <p className="font-medium text-[var(--c-text)]">Activity Updates</p>
              <p className="text-sm text-[var(--c-text2)]">Receive updates on platform activity</p>
            </div>
            <button
              onClick={() => handlePreferenceToggle('activityUpdates')}
              className={`relative w-12 h-6 rounded-full transition ${
                preferences.activityUpdates ? 'bg-red-600' : 'bg-[var(--c-border)]'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${
                  preferences.activityUpdates ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[var(--c-text)] mb-6">Account Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Admin ID</p>
            <p className="text-[var(--c-text)] font-medium mt-2">#{String(currentUser?.id || 101).padStart(3, '0')}</p>
          </div>

          <div>
            <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Role</p>
            <p className="text-[var(--c-text)] font-medium mt-2 capitalize">Platform Administrator</p>
          </div>

          <div>
            <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Account Status</p>
            <p className="text-green-400 font-medium mt-2">● Active</p>
          </div>

          <div>
            <p className="text-xs text-[var(--c-text3)] uppercase tracking-widest">Member Since</p>
            <p className="text-[var(--c-text)] font-medium mt-2">January 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
