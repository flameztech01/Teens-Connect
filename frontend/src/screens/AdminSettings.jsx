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
  ChevronUp,
  Lock
} from 'lucide-react';
import { logout } from '../slices/authSlice';

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
const PURPLE = '#8b5cf6';
const AMBER = '#f59e0b';

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

// Helper function to convert VAPID key from base64 to Uint8Array
const urlBase64ToUint8Array = (base64String) => {
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
  const { userInfo } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('preferences');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  
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

  // Check if user is admin
  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="text-center p-8">
          <Lock className="w-16 h-16 mx-auto mb-4" style={{ color: MUTED }} />
          <h2 className="text-2xl font-bold" style={{ color: INK }}>Access Denied</h2>
          <p className="mt-2" style={{ color: MUTED }}>Please login to access this page</p>
        </div>
      </div>
    );
  }

  if (userInfo.role !== 'admin' && userInfo.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="text-center p-8">
          <Lock className="w-16 h-16 mx-auto mb-4" style={{ color: RED }} />
          <h2 className="text-2xl font-bold" style={{ color: INK }}>Access Denied</h2>
          <p className="mt-2" style={{ color: MUTED }}>You don't have admin privileges</p>
        </div>
      </div>
    );
  }
  
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
  
  const handlePreferenceChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSavePreferences = async () => {
    try {
      await updatePreferences(formData).unwrap();
      setSuccessMessage('Notification preferences saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      setErrorMessage(error.message || 'Failed to toggle push notifications');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };
  
  const handlePasswordChange = async (e) => {
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
    dispatch(logout());
    navigate('/admin/login');
  };
  
  const tabs = [
    { id: 'preferences', label: 'Notifications', icon: Bell, description: 'Manage notification alerts' },
    { id: 'appearance', label: 'Appearance', icon: Globe, description: 'Theme and display settings' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password and security' },
    { id: 'data', label: 'Data', icon: Database, description: 'Cache and data management' },
  ];
  
  const openDrawer = (setting) => {
    setSelectedSetting(setting);
    setIsDrawerOpen(true);
  };
  
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedSetting(null), 300);
  };
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <AdminSidebar />
      
      <div className="lg:ml-72 relative">
        {/* Header – dark theme */}
        <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: GOLD }} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: INK }}>Admin Settings</h1>
                <p className="text-xs sm:text-sm" style={{ color: MUTED }}>
                  Manage your account preferences and system settings
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-3 sm:px-6 py-4 sm:py-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: `1px solid ${GREEN}33` }}>
              <CheckCircle size={18} style={{ color: GREEN }} />
              <span className="text-sm font-medium" style={{ color: GREEN }}>{successMessage}</span>
            </div>
          )}
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: `1px solid ${RED}33` }}>
              <AlertCircle size={18} style={{ color: RED }} />
              <span className="text-sm font-medium" style={{ color: RED }}>{errorMessage}</span>
            </div>
          )}
          
          {/* Settings Cards - Mobile Friendly */}
          <div className="space-y-3 lg:hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <div
                  key={tab.id}
                  onClick={() => openDrawer(tab)}
                  className="rounded-2xl p-4 transition-all cursor-pointer active:bg-white/5"
                  style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                      <Icon className="w-6 h-6" style={{ color: GOLD }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: INK }}>{tab.label}</h3>
                      <p className="text-xs mt-0.5" style={{ color: MUTED }}>{tab.description}</p>
                    </div>
                    <ChevronRight size={18} style={{ color: MUTED }} />
                  </div>
                </div>
              );
            })}
            
            {/* Logout Card */}
            <div
              onClick={handleLogout}
              className="rounded-2xl p-4 transition-all cursor-pointer active:bg-white/5"
              style={{ backgroundColor: CARD, border: `1px solid ${RED}33` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}>
                  <LogOut className="w-6 h-6" style={{ color: RED }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: RED }}>Logout</h3>
                  <p className="text-xs mt-0.5" style={{ color: MUTED }}>Sign out of your admin account</p>
                </div>
                <ChevronRight size={18} style={{ color: MUTED }} />
              </div>
            </div>
          </div>
          
          {/* Desktop Settings Panel */}
          <div className="hidden lg:block">
            <CardShell glow className="p-0 overflow-hidden">
              <div className="flex">
                {/* Sidebar Tabs */}
                <div className="w-64 border-r p-4 space-y-1" style={{ borderColor: BORDER }}>
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
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl transition-all"
                    style={{ color: RED }}
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
                      <h2 className="text-xl font-bold" style={{ color: INK }}>Notification Preferences</h2>
                      
                      {prefsLoading ? (
                        <div className="text-center py-8">
                          <Loader className="w-8 h-8 animate-spin mx-auto" style={{ color: GOLD }} />
                          <p className="mt-2" style={{ color: MUTED }}>Loading preferences...</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4">
                            {/* Sound Toggle */}
                            <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                              <div className="flex items-center gap-3">
                                {formData.soundEnabled ? (
                                  <Volume2 className="w-5 h-5" style={{ color: GREEN }} />
                                ) : (
                                  <VolumeX className="w-5 h-5" style={{ color: MUTED }} />
                                )}
                                <div>
                                  <h3 className="font-semibold" style={{ color: INK }}>Notification Sound</h3>
                                  <p className="text-sm" style={{ color: MUTED }}>Play sound when new notifications arrive</p>
                                </div>
                              </div>
                              <button
                                onClick={handleToggleSound}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                                style={{
                                  backgroundColor: formData.soundEnabled ? GOLD : 'rgba(255,255,255,0.15)',
                                }}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            </div>
                            
                            {/* Push Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                              <div className="flex items-center gap-3">
                                <Smartphone className="w-5 h-5" style={{ color: BLUE }} />
                                <div>
                                  <h3 className="font-semibold" style={{ color: INK }}>Push Notifications</h3>
                                  <p className="text-sm" style={{ color: MUTED }}>Receive browser notifications</p>
                                </div>
                              </div>
                              <button
                                onClick={handleTogglePush}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                                style={{
                                  backgroundColor: formData.pushNotifications ? GOLD : 'rgba(255,255,255,0.15)',
                                }}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            </div>
                            
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                              <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5" style={{ color: PURPLE }} />
                                <div>
                                  <h3 className="font-semibold" style={{ color: INK }}>Email Notifications</h3>
                                  <p className="text-sm" style={{ color: MUTED }}>Receive notifications via email</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handlePreferenceChange('emailNotifications', !formData.emailNotifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                                style={{
                                  backgroundColor: formData.emailNotifications ? GOLD : 'rgba(255,255,255,0.15)',
                                }}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="pt-6 border-t" style={{ borderColor: BORDER }}>
                            <h3 className="font-semibold mb-4" style={{ color: INK }}>Alert Types</h3>
                            <div className="space-y-3">
                              {[
                                { key: 'anonymousPostAlerts', label: 'Anonymous Post Alerts' },
                                { key: 'responseAlerts', label: 'Response Alerts' },
                                { key: 'opportunityAlerts', label: 'Opportunity Alerts' },
                                { key: 'messageAlerts', label: 'Message Alerts' },
                                { key: 'systemAlerts', label: 'System Alerts' },
                              ].map((item) => (
                                <label key={item.key} className="flex items-center justify-between cursor-pointer">
                                  <span style={{ color: MUTED }}>{item.label}</span>
                                  <input
                                    type="checkbox"
                                    checked={formData[item.key]}
                                    onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                                    className="w-4 h-4 rounded focus:ring-2"
                                    style={{ accentColor: GOLD }}
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          <div className="pt-6 border-t" style={{ borderColor: BORDER }}>
                            <label className="block text-sm font-semibold mb-2" style={{ color: MUTED }}>
                              Email Digest Frequency
                            </label>
                            <select
                              value={formData.digestFrequency}
                              onChange={(e) => handlePreferenceChange('digestFrequency', e.target.value)}
                              className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                color: INK,
                                border: `1px solid ${BORDER}`,
                                focusRing: GOLD,
                              }}
                            >
                              <option value="instant" style={{ backgroundColor: CARD, color: INK }}>Instant (Immediately)</option>
                              <option value="daily" style={{ backgroundColor: CARD, color: INK }}>Daily Digest</option>
                              <option value="weekly" style={{ backgroundColor: CARD, color: INK }}>Weekly Digest</option>
                            </select>
                          </div>
                          
                          <button
                            onClick={handleSavePreferences}
                            disabled={isUpdating}
                            className="w-full py-3 rounded-xl font-semibold transition-colors hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{ backgroundColor: GOLD, color: BG }}
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
                      <h2 className="text-xl font-bold" style={{ color: INK }}>Appearance</h2>
                      
                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                        <div className="flex items-center gap-3">
                          {isDarkMode ? (
                            <Moon className="w-5 h-5" style={{ color: BLUE }} />
                          ) : (
                            <Sun className="w-5 h-5" style={{ color: AMBER }} />
                          )}
                          <div>
                            <h3 className="font-semibold" style={{ color: INK }}>Dark Mode</h3>
                            <p className="text-sm" style={{ color: MUTED }}>Switch between light and dark theme</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleTheme}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                          style={{
                            backgroundColor: isDarkMode ? GOLD : 'rgba(255,255,255,0.15)',
                          }}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Security Settings */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold" style={{ color: INK }}>Security</h2>
                      
                      <div className="rounded-xl p-5" style={{ border: `1px solid ${BORDER}` }}>
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
                                className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 pr-10"
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
                                className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 pr-10"
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
                              className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2"
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
                            className="px-6 py-2.5 rounded-xl font-semibold transition-colors hover:opacity-90"
                            style={{ backgroundColor: GOLD, color: BG }}
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
                      <h2 className="text-xl font-bold" style={{ color: INK }}>Data Management</h2>
                      
                      <div className="rounded-xl p-5" style={{ border: `1px solid ${RED}33`, backgroundColor: 'rgba(239,68,68,0.05)' }}>
                        <h3 className="font-semibold mb-2" style={{ color: RED }}>Clear All Data</h3>
                        <p className="text-sm mb-4" style={{ color: MUTED }}>
                          This will clear all cached data and reset your preferences. Your account will remain active.
                        </p>
                        <button
                          onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                          }}
                          className="px-4 py-2 rounded-xl font-semibold transition-colors hover:opacity-90 flex items-center gap-2"
                          style={{ backgroundColor: RED, color: '#fff' }}
                        >
                          <Trash2 size={16} />
                          Clear Cache
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardShell>
          </div>
        </div>
      </div>
      
      {/* Bottom Drawer for Mobile – dark theme */}
      {isDrawerOpen && selectedSetting && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300 lg:hidden" onClick={closeDrawer} />
          
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl transform transition-transform duration-300 animate-slide-up max-h-[85vh] overflow-y-auto lg:hidden" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <div className="sticky top-0 pt-4 pb-2 px-6 border-b" style={{ backgroundColor: CARD, borderColor: BORDER }}>
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1 rounded-full" style={{ backgroundColor: MUTED }} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {selectedSetting.icon && <selectedSetting.icon size={18} style={{ color: GOLD }} />}
                  <h2 className="text-lg font-bold" style={{ color: INK }}>{selectedSetting.label}</h2>
                </div>
                <button onClick={closeDrawer} className="transition-colors hover:opacity-80" style={{ color: MUTED }}>
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Drawer content based on selected tab */}
              {selectedSetting.id === 'preferences' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-center gap-3">
                        {formData.soundEnabled ? (
                          <Volume2 className="w-5 h-5" style={{ color: GREEN }} />
                        ) : (
                          <VolumeX className="w-5 h-5" style={{ color: MUTED }} />
                        )}
                        <div>
                          <h3 className="font-semibold" style={{ color: INK }}>Notification Sound</h3>
                          <p className="text-xs" style={{ color: MUTED }}>Play sound for new notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={handleToggleSound}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        style={{
                          backgroundColor: formData.soundEnabled ? GOLD : 'rgba(255,255,255,0.15)',
                        }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5" style={{ color: BLUE }} />
                        <div>
                          <h3 className="font-semibold" style={{ color: INK }}>Push Notifications</h3>
                          <p className="text-xs" style={{ color: MUTED }}>Receive browser notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={handleTogglePush}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        style={{
                          backgroundColor: formData.pushNotifications ? GOLD : 'rgba(255,255,255,0.15)',
                        }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5" style={{ color: PURPLE }} />
                        <div>
                          <h3 className="font-semibold" style={{ color: INK }}>Email Notifications</h3>
                          <p className="text-xs" style={{ color: MUTED }}>Receive email notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('emailNotifications', !formData.emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        style={{
                          backgroundColor: formData.emailNotifications ? GOLD : 'rgba(255,255,255,0.15)',
                        }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSavePreferences}
                    disabled={isUpdating}
                    className="w-full py-3 rounded-xl font-semibold transition-colors hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: GOLD, color: BG }}
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
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-3">
                    {isDarkMode ? (
                      <Moon className="w-5 h-5" style={{ color: BLUE }} />
                    ) : (
                      <Sun className="w-5 h-5" style={{ color: AMBER }} />
                    )}
                    <div>
                      <h3 className="font-semibold" style={{ color: INK }}>Dark Mode</h3>
                      <p className="text-xs" style={{ color: MUTED }}>Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    style={{
                      backgroundColor: isDarkMode ? GOLD : 'rgba(255,255,255,0.15)',
                    }}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}
              
              {selectedSetting.id === 'security' && (
                <div className="rounded-xl p-5" style={{ border: `1px solid ${BORDER}` }}>
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
                          className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 pr-10"
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
                          className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 pr-10"
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
                        className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2"
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
                      className="w-full py-3 rounded-xl font-semibold transition-colors hover:opacity-90"
                      style={{ backgroundColor: GOLD, color: BG }}
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              )}
              
              {selectedSetting.id === 'data' && (
                <div className="rounded-xl p-5" style={{ border: `1px solid ${RED}33`, backgroundColor: 'rgba(239,68,68,0.05)' }}>
                  <h3 className="font-semibold mb-2" style={{ color: RED }}>Clear All Data</h3>
                  <p className="text-sm mb-4" style={{ color: MUTED }}>
                    This will clear all cached data and reset your preferences.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="w-full py-3 rounded-xl font-semibold transition-colors hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: RED, color: '#fff' }}
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
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;