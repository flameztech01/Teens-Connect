import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashbordSidebar';
import { useUpdateProfileMutation, useDeleteAccountMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import {
  User,
  Bell,
  Lock,
  Shield,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Save,
  Moon,
  Sun,
  Settings as SettingsIcon
} from 'lucide-react';

// ---- design tokens ----
const BG = '#0c0c0d';
const CARD = '#141416';
const INK = '#ffffff';
const MUTED = 'rgba(255,255,255,0.4)';
const BORDER = 'rgba(255,255,255,0.06)';
const GOLD = '#f4a825';
const GOLD_DEEP = '#d4911f';
const GOLD_TINT = 'rgba(244,168,37,0.12)';
const GOLD_GLOW = 'rgba(244,168,37,0.25)';
const GREEN = '#22c55e';
const RED = '#ef4444';
const BLUE = '#3b82f6';

// ---- styled components ----
const CardShell = ({ children, className = '', glow = false }) => (
  <div
    className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 ${glow ? 'hover:border-gold/30' : ''} ${className}`}
    style={{
      backgroundColor: CARD,
      border: `1px solid ${BORDER}`,
      boxShadow: glow ? `0 0 40px -8px ${GOLD_GLOW}` : '0 4px 24px rgba(0,0,0,0.3)',
    }}
  >
    {children}
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    whatsappNumber: '',
    portfolioLink: ''
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    messageAlerts: true,
    opportunityAlerts: true
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showWhatsapp: true
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  
  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    if (userInfo) {
      setProfileData({
        name: userInfo.name || '',
        username: userInfo.username || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        location: userInfo.location || '',
        bio: userInfo.bio || '',
        whatsappNumber: userInfo.whatsappNumber || '',
        portfolioLink: userInfo.portfolioLink || ''
      });
    }
  }, [userInfo]);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('username', profileData.username);
      formData.append('phone', profileData.phone);
      formData.append('location', profileData.location);
      formData.append('bio', profileData.bio);
      formData.append('whatsappNumber', profileData.whatsappNumber);
      formData.append('portfolioLink', profileData.portfolioLink);
      
      await updateProfile(formData).unwrap();
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.data?.message || 'Failed to update profile');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('currentPassword', passwordData.currentPassword);
      formData.append('newPassword', passwordData.newPassword);
      
      await updateProfile(formData).unwrap();
      setSuccessMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.data?.message || 'Failed to change password');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  const handleNotificationUpdate = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      setSuccessMessage('Notification settings saved!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to save settings');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  const handlePrivacyUpdate = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
      setSuccessMessage('Privacy settings saved!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to save settings');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE MY ACCOUNT') {
      setErrorMessage('Please type DELETE MY ACCOUNT to confirm');
      return;
    }
    
    try {
      await deleteAccount().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      setErrorMessage(error.data?.message || 'Failed to delete account');
    }
  };
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: AlertCircle },
  ];
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <DashboardSidebar />
      
      <div className="lg:ml-72 relative">
        {/* Header – dark theme */}
        <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                <SettingsIcon className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold leading-tight" style={{ color: INK }}>Settings</h1>
                <p className="text-[11px] sm:text-xs" style={{ color: MUTED }}>
                  Manage your account preferences and settings
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-3 sm:px-6 py-4 sm:py-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: `1px solid rgba(34,197,94,0.2)` }}>
              <CheckCircle size={18} style={{ color: GREEN }} />
              <span className="text-sm font-medium" style={{ color: GREEN }}>{successMessage}</span>
            </div>
          )}
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: `1px solid rgba(239,68,68,0.2)` }}>
              <AlertCircle size={18} style={{ color: RED }} />
              <span className="text-sm font-medium" style={{ color: RED }}>{errorMessage}</span>
            </div>
          )}
          
          <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <CardShell className="p-2 sticky top-24">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200`}
                      style={{
                        backgroundColor: isActive ? GOLD_TINT : 'transparent',
                        color: isActive ? GOLD : MUTED,
                      }}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </CardShell>
            </div>
            
            {/* Content Area */}
            <div className="lg:col-span-3">
              <CardShell glow>
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    <h2 className="text-xl font-bold" style={{ color: INK }}>Profile Settings</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            color: INK,
                            border: `1px solid ${BORDER}`,
                            focusRing: GOLD,
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                          Username
                        </label>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            color: INK,
                            border: `1px solid ${BORDER}`,
                            focusRing: GOLD,
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl cursor-not-allowed opacity-50"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            color: MUTED,
                            border: `1px solid ${BORDER}`,
                          }}
                        />
                        <p className="text-xs mt-1" style={{ color: MUTED }}>Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            color: INK,
                            border: `1px solid ${BORDER}`,
                            focusRing: GOLD,
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.whatsappNumber}
                        onChange={(e) => setProfileData({ ...profileData, whatsappNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                        placeholder="+234 123 456 7890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                        Portfolio Link
                      </label>
                      <input
                        type="url"
                        value={profileData.portfolioLink}
                        onChange={(e) => setProfileData({ ...profileData, portfolioLink: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                        placeholder="https://your-portfolio.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: GOLD, color: BG }}
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: BG, borderTopColor: 'transparent' }} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </form>
                )}
                
                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold" style={{ color: INK }}>Notification Preferences</h2>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                        { key: 'messageAlerts', label: 'Message Alerts', desc: 'Get notified when you receive messages' },
                        { key: 'opportunityAlerts', label: 'Opportunity Alerts', desc: 'Get notified about new opportunities' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl" style={{ border: `1px solid ${BORDER}` }}>
                          <div>
                            <h3 className="font-semibold" style={{ color: INK }}>{item.label}</h3>
                            <p className="text-sm" style={{ color: MUTED }}>{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setNotificationSettings({ ...notificationSettings, [item.key]: !notificationSettings[item.key] })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                            style={{
                              backgroundColor: notificationSettings[item.key] ? GOLD : 'rgba(255,255,255,0.15)',
                            }}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={handleNotificationUpdate}
                      className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: GOLD, color: BG }}
                    >
                      Save Notification Settings
                    </button>
                  </div>
                )}
                
                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold" style={{ color: INK }}>Privacy Settings</h2>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                        Profile Visibility
                      </label>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                      >
                        <option value="public" style={{ backgroundColor: CARD, color: INK }}>Public - Everyone can see your profile</option>
                        <option value="registered" style={{ backgroundColor: CARD, color: INK }}>Registered Users Only</option>
                        <option value="private" style={{ backgroundColor: CARD, color: INK }}>Private - Only you can see</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'showEmail', label: 'Show Email', desc: 'Allow others to see your email address' },
                        { key: 'showPhone', label: 'Show Phone Number', desc: 'Allow others to see your phone number' },
                        { key: 'showWhatsapp', label: 'Show WhatsApp', desc: 'Allow others to contact you on WhatsApp' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl" style={{ border: `1px solid ${BORDER}` }}>
                          <div>
                            <h3 className="font-semibold" style={{ color: INK }}>{item.label}</h3>
                            <p className="text-sm" style={{ color: MUTED }}>{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setPrivacySettings({ ...privacySettings, [item.key]: !privacySettings[item.key] })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                            style={{
                              backgroundColor: privacySettings[item.key] ? GOLD : 'rgba(255,255,255,0.15)',
                            }}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacySettings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={handlePrivacyUpdate}
                      className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: GOLD, color: BG }}
                    >
                      Save Privacy Settings
                    </button>
                  </div>
                )}
                
                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold" style={{ color: INK }}>Security Settings</h2>
                    
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ border: `1px solid ${BORDER}` }}>
                      <div>
                        <h3 className="font-semibold" style={{ color: INK }}>Dark Mode</h3>
                        <p className="text-sm" style={{ color: MUTED }}>Switch between light and dark theme</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                        }}
                      >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                      </button>
                    </div>
                    
                    {/* Change Password */}
                    <div className="rounded-xl p-4" style={{ border: `1px solid ${BORDER}` }}>
                      <h3 className="font-semibold mb-4" style={{ color: INK }}>Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all pr-10"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                color: INK,
                                border: `1px solid ${BORDER}`,
                                focusRing: GOLD,
                              }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              style={{ color: MUTED }}
                            >
                              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all pr-10"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                color: INK,
                                border: `1px solid ${BORDER}`,
                                focusRing: GOLD,
                              }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              style={{ color: MUTED }}
                            >
                              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.04)',
                              color: INK,
                              border: `1px solid ${BORDER}`,
                              focusRing: GOLD,
                            }}
                            required
                          />
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                          style={{ backgroundColor: GOLD, color: BG }}
                        >
                          Change Password
                        </button>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Danger Zone */}
                {activeTab === 'danger' && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold" style={{ color: RED }}>Danger Zone</h2>
                    
                    <div className="rounded-xl p-5" style={{ border: `1px solid ${RED}33`, backgroundColor: 'rgba(239,68,68,0.05)' }}>
                      <h3 className="font-semibold mb-2" style={{ color: RED }}>Delete Account</h3>
                      <p className="text-sm mb-4" style={{ color: MUTED }}>
                        Once you delete your account, there is no going back. This action is permanent.
                      </p>
                      
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center gap-2"
                          style={{ backgroundColor: RED, color: '#fff' }}
                        >
                          <Trash2 size={16} />
                          Delete My Account
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm font-semibold" style={{ color: RED }}>
                            Type <span className="px-2 py-1 rounded" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: RED }}>DELETE MY ACCOUNT</span> to confirm:
                          </p>
                          <input
                            type="text"
                            value={deleteConfirmationText}
                            onChange={(e) => setDeleteConfirmationText(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.04)',
                              color: INK,
                              border: `1px solid ${RED}33`,
                              focusRing: RED,
                            }}
                            placeholder="DELETE MY ACCOUNT"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={isDeleting}
                              className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                              style={{ backgroundColor: RED, color: '#fff' }}
                            >
                              {isDeleting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 size={16} />
                                  Confirm Delete
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteConfirmationText('');
                              }}
                              className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-80"
                              style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED, border: `1px solid ${BORDER}` }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardShell>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;