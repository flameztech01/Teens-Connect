import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useToggleSoundMutation,
  useTogglePushNotificationsMutation,
  useSubscribeToPushMutation,
  useUnsubscribeFromPushMutation,
} from '../slices/notificationApiSlice';
import {
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Mail,
  Smartphone,
  Volume2,
  VolumeX,
  Save,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  RefreshCw,
  Database,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  Key,
  X,
  ChevronUp
} from 'lucide-react';
import { adminLogout } from '../slices/adminAuthSlice';

// Helper function to convert VAPID key from base64 to Uint8Array
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const AdminSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminInfo } = useSelector((state: any) => state.adminAuth);
  
  const [activeTab, setActiveTab] = useState('preferences');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<any>(null);
  
  const { data: preferences, isLoading: prefsLoading, refetch: refetchPrefs } = useGetNotificationPreferencesQuery();
  const [updatePreferences, { isLoading: isUpdating }] = useUpdateNotificationPreferencesMutation();
  const [toggleSound] = useToggleSoundMutation();
  const [togglePush] = useTogglePushNotificationsMutation();
  const [subscribeToPush] = useSubscribeToPushMutation();
  const [unsubscribeFromPush] = useUnsubscribeFromPushMutation();
  
  const [formData, setFormData] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    anonymousPostAlerts: true,
    responseAlerts: true,
    opportunityAlerts: true,
    messageAlerts: true,
    systemAlerts: true,
    digestFrequency: 'instant'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  useEffect(() => {
    if (preferences) {
      setFormData({
        emailNotifications: preferences.emailNotifications ?? true,
        pushNotifications: preferences.pushNotifications ?? true,
        soundEnabled: preferences.soundEnabled ?? true,
        anonymousPostAlerts: preferences.anonymousPostAlerts ?? true,
        responseAlerts: preferences.responseAlerts ?? true,
        opportunityAlerts: preferences.opportunityAlerts ?? true,
        messageAlerts: preferences.messageAlerts ?? true,
        systemAlerts: preferences.systemAlerts ?? true,
        digestFrequency: preferences.digestFrequency || 'instant'
      });
    }
  }, [preferences]);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adminTheme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adminTheme', 'dark');
      setIsDarkMode(true);
    }
  };
  
  const handlePreferenceChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSavePreferences = async () => {
    try {
      await updatePreferences(formData).unwrap();
      setSuccessMessage('Notification preferences saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'Failed to save preferences');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  const handleToggleSound = async () => {
    try {
      const result = await toggleSound().unwrap();
      setFormData(prev => ({ ...prev, soundEnabled: result.soundEnabled }));
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage('Failed to toggle sound');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  const handleTogglePush = async () => {
    try {
      const result = await togglePush().unwrap();
      setFormData(prev => ({ ...prev, pushNotifications: result.pushNotifications }));
      
      if (result.pushNotifications) {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          throw new Error('Push notifications not supported');
        }
        
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Notification permission denied');
        }
        
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        const readyRegistration = await navigator.serviceWorker.ready;
        const existingSubscription = await readyRegistration.pushManager.getSubscription();
        
        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          throw new Error('VAPID public key not configured');
        }
        
        let subscription;
        if (existingSubscription) {
          subscription = existingSubscription;
        } else {
          subscription = await readyRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
          });
        }
        
        await subscribeToPush({
          subscription: subscription.toJSON(),
          deviceInfo: navigator.userAgent
        }).unwrap();
        
        setSuccessMessage('Push notifications enabled successfully!');
      } else {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
        await unsubscribeFromPush().unwrap();
        setSuccessMessage('Push notifications disabled');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to toggle push notifications');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    setSuccessMessage('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };
  
  const tabs = [
    { id: 'preferences', label: 'Notifications', icon: Bell, description: 'Manage notification alerts' },
    { id: 'appearance', label: 'Appearance', icon: Globe, description: 'Theme and display settings' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password and security' },
    { id: 'data', label: 'Data', icon: Database, description: 'Cache and data management' },
  ];
  
  const openDrawer = (setting: any) => {
    setSelectedSetting(setting);
    setIsDrawerOpen(true);
  };
  
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedSetting(null), 300);
  };
  
  if (!adminInfo) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <div className="lg:ml-72">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-[#f4a825]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Manage your account preferences and system settings
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 lg:px-8 py-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}
          
          {/* Settings Cards - Mobile Friendly */}
          <div className="space-y-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <div
                  key={tab.id}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      openDrawer(tab);
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 active:bg-gray-50 dark:active:bg-gray-700 transition-all cursor-pointer lg:hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#f4a825]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{tab.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tab.description}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
            
            {/* Logout Card */}
            <div
              onClick={handleLogout}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-red-100 dark:border-red-800 p-4 active:bg-red-50 dark:active:bg-red-900/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Logout</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Sign out of your admin account</p>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Desktop Settings Panel */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex">
              {/* Sidebar Tabs */}
              <div className="w-64 border-r border-gray-100 dark:border-gray-700 p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
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
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 p-6">
                {/* Notification Preferences */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                    
                    {prefsLoading ? (
                      <div className="text-center py-8">
                        <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto" />
                        <p className="text-gray-500 mt-2">Loading preferences...</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {/* Sound Toggle */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              {formData.soundEnabled ? (
                                <Volume2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <VolumeX className="w-5 h-5 text-gray-500" />
                              )}
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notification Sound</h3>
                                <p className="text-sm text-gray-500">Play sound when new notifications arrive</p>
                              </div>
                            </div>
                            <button
                              onClick={handleToggleSound}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                formData.soundEnabled ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formData.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                          
                          {/* Push Notifications */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Smartphone className="w-5 h-5 text-blue-600" />
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Push Notifications</h3>
                                <p className="text-sm text-gray-500">Receive browser notifications</p>
                              </div>
                            </div>
                            <button
                              onClick={handleTogglePush}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                formData.pushNotifications ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formData.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                          
                          {/* Email Notifications */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-purple-600" />
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
                                <p className="text-sm text-gray-500">Receive notifications via email</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handlePreferenceChange('emailNotifications', !formData.emailNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                formData.emailNotifications ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Alert Types</h3>
                          <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-gray-700 dark:text-gray-300">Anonymous Post Alerts</span>
                              <input
                                type="checkbox"
                                checked={formData.anonymousPostAlerts}
                                onChange={(e) => handlePreferenceChange('anonymousPostAlerts', e.target.checked)}
                                className="w-4 h-4 text-[#f4a825] rounded focus:ring-[#f4a825]"
                              />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-gray-700 dark:text-gray-300">Response Alerts</span>
                              <input
                                type="checkbox"
                                checked={formData.responseAlerts}
                                onChange={(e) => handlePreferenceChange('responseAlerts', e.target.checked)}
                                className="w-4 h-4 text-[#f4a825] rounded focus:ring-[#f4a825]"
                              />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-gray-700 dark:text-gray-300">Opportunity Alerts</span>
                              <input
                                type="checkbox"
                                checked={formData.opportunityAlerts}
                                onChange={(e) => handlePreferenceChange('opportunityAlerts', e.target.checked)}
                                className="w-4 h-4 text-[#f4a825] rounded focus:ring-[#f4a825]"
                              />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-gray-700 dark:text-gray-300">Message Alerts</span>
                              <input
                                type="checkbox"
                                checked={formData.messageAlerts}
                                onChange={(e) => handlePreferenceChange('messageAlerts', e.target.checked)}
                                className="w-4 h-4 text-[#f4a825] rounded focus:ring-[#f4a825]"
                              />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-gray-700 dark:text-gray-300">System Alerts</span>
                              <input
                                type="checkbox"
                                checked={formData.systemAlerts}
                                onChange={(e) => handlePreferenceChange('systemAlerts', e.target.checked)}
                                className="w-4 h-4 text-[#f4a825] rounded focus:ring-[#f4a825]"
                              />
                            </label>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Email Digest Frequency
                          </label>
                          <select
                            value={formData.digestFrequency}
                            onChange={(e) => handlePreferenceChange('digestFrequency', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#f4a825]"
                          >
                            <option value="instant">Instant (Immediately)</option>
                            <option value="daily">Daily Digest</option>
                            <option value="weekly">Weekly Digest</option>
                          </select>
                        </div>
                        
                        <button
                          onClick={handleSavePreferences}
                          disabled={isUpdating}
                          className="w-full bg-[#f4a825] text-white py-3 rounded-xl font-semibold hover:bg-[#e09e1a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isUpdating ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save Preferences
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {isDarkMode ? (
                          <Moon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Sun className="w-5 h-5 text-orange-600" />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                          <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isDarkMode ? 'bg-[#f4a825]' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security</h2>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#f4a825] pr-10"
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
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#f4a825] pr-10"
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
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#f4a825]"
                            required
                          />
                        </div>
                        
                        <button
                          type="submit"
                          className="bg-[#f4a825] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#e09e1a] transition-colors"
                        >
                          Change Password
                        </button>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Data Management */}
                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Management</h2>
                    
                    <div className="border border-red-300 dark:border-red-700 rounded-xl p-5 bg-red-50 dark:bg-red-900/20">
                      <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Clear All Data</h3>
                      <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                        This will clear all cached data and reset your preferences. Your account will remain active.
                      </p>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Clear Cache
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Drawer for Mobile */}
      {isDrawerOpen && selectedSetting && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden"
            onClick={closeDrawer}
          />
          
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl transform transition-transform duration-300 animate-slide-up max-h-[85vh] overflow-y-auto lg:hidden">
            <div className="sticky top-0 bg-white dark:bg-gray-800 pt-4 pb-2 px-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {selectedSetting.icon && <selectedSetting.icon size={18} className="text-[#f4a825]" />}
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedSetting.label}</h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Drawer content based on selected tab */}
              {selectedSetting.id === 'preferences' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {formData.soundEnabled ? (
                          <Volume2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <VolumeX className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                          <h3 className="font-semibold">Notification Sound</h3>
                          <p className="text-xs text-gray-500">Play sound for new notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={handleToggleSound}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.soundEnabled ? 'bg-[#f4a825]' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">Push Notifications</h3>
                          <p className="text-xs text-gray-500">Receive browser notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={handleTogglePush}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.pushNotifications ? 'bg-[#f4a825]' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-purple-600" />
                        <div>
                          <h3 className="font-semibold">Email Notifications</h3>
                          <p className="text-xs text-gray-500">Receive email notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('emailNotifications', !formData.emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.emailNotifications ? 'bg-[#f4a825]' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSavePreferences}
                    disabled={isUpdating}
                    className="w-full bg-[#f4a825] text-white py-3 rounded-xl font-semibold hover:bg-[#e09e1a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Preferences
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {selectedSetting.id === 'appearance' && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? (
                      <Moon className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Sun className="w-5 h-5 text-orange-600" />
                    )}
                    <div>
                      <h3 className="font-semibold">Dark Mode</h3>
                      <p className="text-xs text-gray-500">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDarkMode ? 'bg-[#f4a825]' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              )}
              
              {selectedSetting.id === 'security' && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#f4a825] pr-10"
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#f4a825] pr-10"
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#f4a825]"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-[#f4a825] text-white py-3 rounded-xl font-semibold hover:bg-[#e09e1a] transition-colors"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              )}
              
              {selectedSetting.id === 'data' && (
                <div className="border border-red-300 dark:border-red-700 rounded-xl p-5 bg-red-50 dark:bg-red-900/20">
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Clear All Data</h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                    This will clear all cached data and reset your preferences.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear Cache
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;