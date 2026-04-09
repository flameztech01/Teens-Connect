import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from "../components/DashbordSidebar"
import { useUpdateProfileMutation, useDeleteAccountMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import {
  User,
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  Shield,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Save,
  Key,
  Mail,
  Phone,
  MapPin,
  Smartphone
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.auth);
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  
  // Tab state
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
    opportunityAlerts: true,
    newsletterSubscription: false
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
  
  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  
  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Load user data
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
  
  // Load theme preference
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
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
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
      
      const result = await updateProfile(formData).unwrap();
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'Failed to update profile');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
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
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'Failed to change password');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  const handleNotificationUpdate = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Save to backend (implement endpoint if needed)
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      setSuccessMessage('Notification settings saved!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      
      <div className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1d2b4f] dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} />
            {successMessage}
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {errorMessage}
          </div>
        )}
        
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${activeTab === tab.id 
                        ? 'bg-[#f4a825] text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <h2 className="text-xl font-bold text-[#1d2b4f] dark:text-white mb-4">Profile Settings</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825]"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825]"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.whatsappNumber}
                      onChange={(e) => setProfileData({ ...profileData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825]"
                      placeholder="+234 123 456 7890"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                      Portfolio Link
                    </label>
                    <input
                      type="url"
                      value={profileData.portfolioLink}
                      onChange={(e) => setProfileData({ ...profileData, portfolioLink: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825]"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825] resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[#f4a825] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                  <h2 className="text-xl font-bold text-[#1d2b4f] dark:text-white mb-4">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-[#1d2b4f] dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({ ...notificationSettings, emailNotifications: !notificationSettings.emailNotifications })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.emailNotifications ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-[#1d2b4f] dark:text-white">Push Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications in browser</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({ ...notificationSettings, pushNotifications: !notificationSettings.pushNotifications })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.pushNotifications ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-[#1d2b4f] dark:text-white">Message Alerts</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when you receive messages</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({ ...notificationSettings, messageAlerts: !notificationSettings.messageAlerts })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.messageAlerts ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.messageAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-[#1d2b4f] dark:text-white">Opportunity Alerts</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new opportunities</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({ ...notificationSettings, opportunityAlerts: !notificationSettings.opportunityAlerts })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.opportunityAlerts ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.opportunityAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleNotificationUpdate}
                    className="bg-[#f4a825] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors"
                  >
                    Save Notification Settings
                  </button>
                </div>
              )}
              
              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-[#1d2b4f] dark:text-white mb-4">Privacy Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825]"
                    >
                      <option value="public">Public - Everyone can see your profile</option>
                      <option value="registered">Registered Users Only</option>
                      <option value="private">Private - Only you can see</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-[#1d2b4f] dark:text-white">Show Email</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your email address</p>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({ ...privacySettings, showEmail: !privacySettings.showEmail })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacySettings.showEmail ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacySettings.showEmail ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-[#1d2b4f] dark:text-white">Show Phone Number</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your phone number</p>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({ ...privacySettings, showPhone: !privacySettings.showPhone })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacySettings.showPhone ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacySettings.showPhone ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-[#1d2b4f] dark:text-white">Show WhatsApp</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to contact you on WhatsApp</p>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({ ...privacySettings, showWhatsapp: !privacySettings.showWhatsapp })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacySettings.showWhatsapp ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacySettings.showWhatsapp ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePrivacyUpdate}
                    className="bg-[#f4a825] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors"
                  >
                    Save Privacy Settings
                  </button>
                </div>
              )}
              
              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1d2b4f] dark:text-white mb-4">Security Settings</h2>
                  
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-[#1d2b4f] dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    >
                      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>
                  
                  {/* Change Password */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-[#1d2b4f] dark:text-white mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825] pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825] pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-[#1d2b4f] dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825]"
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-[#f4a825] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors disabled:opacity-50"
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
                  <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
                  
                  <div className="border border-red-300 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                      Once you delete your account, there is no going back. This action is permanent and will:
                    </p>
                    <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300 mb-4 space-y-1">
                      <li>Remove all your profile information</li>
                      <li>Delete all your anonymous posts</li>
                      <li>Remove you from all communities</li>
                      <li>Permanently delete all your data</li>
                    </ul>
                    
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete My Account
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                          Type <span className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded">DELETE MY ACCOUNT</span> to confirm:
                        </p>
                        <input
                          type="text"
                          value={deleteConfirmationText}
                          onChange={(e) => setDeleteConfirmationText(e.target.value)}
                          className="w-full px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg focus:outline-none focus:border-red-500"
                          placeholder="DELETE MY ACCOUNT"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isDeleting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;