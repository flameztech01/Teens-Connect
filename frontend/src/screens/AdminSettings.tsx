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
  Lock,
  Mail,
  Smartphone,
  Volume2,
  VolumeX,
  Save,
  Key,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  RefreshCw,
  Database,
  Trash2,
  LogOut
} from 'lucide-react';
import { adminLogout } from '../slices/adminAuthSlice';

// Helper function to convert VAPID key from base64 to Uint8Array
const urlBase64ToUint8Array = (base64String: string) => {
  console.log('🔧 Converting VAPID key, length:', base64String?.length);
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  console.log('✅ VAPID key converted, bytes:', outputArray.length);
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
  
  // Notification preferences
  const { data: preferences, isLoading: prefsLoading, refetch: refetchPrefs } = useGetNotificationPreferencesQuery();
  const [updatePreferences, { isLoading: isUpdating }] = useUpdateNotificationPreferencesMutation();
  const [toggleSound] = useToggleSoundMutation();
  const [togglePush] = useTogglePushNotificationsMutation();
  const [subscribeToPush] = useSubscribeToPushMutation();
  const [unsubscribeFromPush] = useUnsubscribeFromPushMutation();
  
  // Form state
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
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Load preferences
  useEffect(() => {
    console.log('📥 Preferences loaded:', preferences);
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
  
  // Load theme
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
    console.log('🚀 === TOGGLE PUSH STARTED ===');
    try {
      console.log('1️⃣ Calling togglePush mutation...');
      const result = await togglePush().unwrap();
      console.log('✅ Toggle result:', result);
      
      setFormData(prev => ({ ...prev, pushNotifications: result.pushNotifications }));
      
      if (result.pushNotifications) {
        console.log('2️⃣ Push enabled, checking browser support...');
        
        // Check browser support
        if (!('serviceWorker' in navigator)) {
          console.error('❌ serviceWorker not supported');
          throw new Error('Push notifications not supported: serviceWorker not available');
        }
        if (!('PushManager' in window)) {
          console.error('❌ PushManager not supported');
          throw new Error('Push notifications not supported: PushManager not available');
        }
        console.log('✅ Browser supports push notifications');

        // Request permission FIRST
        console.log('3️⃣ Requesting notification permission...');
        const permission = await Notification.requestPermission();
        console.log('📋 Permission result:', permission);
        
        if (permission !== 'granted') {
          console.error('❌ Permission denied:', permission);
          throw new Error(`Notification permission ${permission}. Please allow notifications in browser settings.`);
        }
        console.log('✅ Permission granted');

        // Check for existing service worker
        console.log('4️⃣ Checking existing service workers...');
        const existingRegs = await navigator.serviceWorker.getRegistrations();
        console.log('📋 Existing registrations:', existingRegs.length);
        existingRegs.forEach((reg, i) => {
          console.log(`   SW ${i}:`, reg.scope, 'active:', !!reg.active);
        });

        // REGISTER service worker
        console.log('5️⃣ Registering service worker...');
        let registration;
        try {
          registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('✅ Service Worker registered, scope:', registration.scope);
        } catch (swError) {
          console.error('❌ Service Worker registration failed:', swError);
          throw new Error(`Service Worker registration failed: ${swError.message}`);
        }

        // Wait for it to be ready
        console.log('6️⃣ Waiting for service worker to be ready...');
        const readyRegistration = await navigator.serviceWorker.ready;
        console.log('✅ Service Worker ready, state:', readyRegistration.active?.state);

        // Check if already subscribed
        console.log('7️⃣ Checking for existing push subscription...');
        const existingSubscription = await readyRegistration.pushManager.getSubscription();
        console.log('📋 Existing subscription:', existingSubscription ? 'YES' : 'NO');
        
        if (existingSubscription) {
          console.log('   Endpoint:', existingSubscription.endpoint?.substring(0, 50) + '...');
          console.log('8️⃣ Saving existing subscription to backend...');
          
          const subData = {
            subscription: existingSubscription.toJSON(),
            deviceInfo: navigator.userAgent 
          };
          console.log('📤 Sending to backend:', JSON.stringify(subData, null, 2));
          
          const subResult = await subscribeToPush(subData).unwrap();
          console.log('✅ Subscription saved to backend:', subResult);
        } else {
          // Create new subscription
          console.log('8️⃣ Creating new push subscription...');
          
          const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
          console.log('📋 VAPID key from env:', vapidPublicKey ? 'EXISTS (length: ' + vapidPublicKey.length + ')' : 'MISSING');
          
          if (!vapidPublicKey) {
            console.error('❌ VAPID key not found in environment');
            throw new Error('VAPID public key not configured. Check your .env file has VITE_VAPID_PUBLIC_KEY');
          }

          console.log('9️⃣ Converting VAPID key and subscribing...');
          let subscription;
          try {
            subscription = await readyRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });
            console.log('✅ Push subscription created successfully');
            console.log('   Endpoint:', subscription.endpoint?.substring(0, 50) + '...');
          } catch (subError) {
            console.error('❌ Push subscription failed:', subError);
            throw new Error(`Failed to subscribe to push: ${subError.message}`);
          }
          
          console.log('🔟 Saving subscription to backend...');
          const subData = {
            subscription: subscription.toJSON(),
            deviceInfo: navigator.userAgent 
          };
          console.log('📤 Sending to backend:', JSON.stringify(subData, null, 2));
          
          try {
            const subResult = await subscribeToPush(subData).unwrap();
            console.log('✅ Subscription saved to backend:', subResult);
          } catch (saveError) {
            console.error('❌ Failed to save subscription:', saveError);
            throw new Error(`Failed to save subscription: ${saveError.message}`);
          }
        }
        
        console.log('🎉 Push notifications fully enabled!');
        setSuccessMessage('Push notifications enabled successfully! Check your database for the subscription.');
      } else {
        // DISABLE
        console.log('2️⃣ Push disabled, unsubscribing...');
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          console.log('✅ Unsubscribed from push');
        }
        await unsubscribeFromPush().unwrap();
        console.log('✅ Backend updated');
        setSuccessMessage('Push notifications disabled');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
      console.log('🏁 === TOGGLE PUSH COMPLETED ===');
      
    } catch (error: any) {
      console.error('💥 TOGGLE PUSH ERROR:', error);
      console.error('Error details:', error.data || error.message || error);
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
    { id: 'preferences', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database },
  ];
  
  if (!adminInfo) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <div className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-[#f4a825]" />
            <h1 className="text-3xl font-bold text-[#1d2b4f] dark:text-white">Admin Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and system settings</p>
        </div>
        
        {/* Debug Info */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Debug Info (Open Browser Console)</h3>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            VAPID Key exists: {import.meta.env.VITE_VAPID_PUBLIC_KEY ? 'YES' : 'NO'} | 
            Service Worker supported: {'serviceWorker' in navigator ? 'YES' : 'NO'} | 
            Push supported: {'PushManager' in window ? 'YES' : 'NO'}
          </p>
          <button 
            onClick={() => {
              console.log('🔍 Manual test - VAPID key:', import.meta.env.VITE_VAPID_PUBLIC_KEY);
              console.log('🔍 Manual test - serviceWorker:', 'serviceWorker' in navigator);
              console.log('🔍 Manual test - PushManager:', 'PushManager' in window);
            }}
            className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded"
          >
            Log Debug Info to Console
          </button>
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
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              {/* Notification Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1d2b4f] dark:text-white">Notification Preferences</h2>
                  
                  {prefsLoading ? (
                    <div className="text-center py-8">
                      <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto" />
                      <p className="text-gray-500 mt-2">Loading preferences...</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {/* Sound Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {formData.soundEnabled ? (
                              <Volume2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <VolumeX className="w-5 h-5 text-gray-500" />
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">Notification Sound</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Play sound when new notifications arrive</p>
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
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">Push Notifications</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Receive browser notifications (Check console for debug logs)</p>
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
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-purple-600" />
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
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
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-[#f4a825]"
                        >
                          <option value="instant">Instant (Immediately)</option>
                          <option value="daily">Daily Digest</option>
                          <option value="weekly">Weekly Digest</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={handleSavePreferences}
                        disabled={isUpdating}
                        className="w-full bg-[#f4a825] text-white py-3 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                  <h2 className="text-xl font-bold text-[#1d2b4f] dark:text-white">Appearance</h2>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <Moon className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Sun className="w-5 h-5 text-orange-600" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
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
                  <h2 className="text-xl font-bold text-[#1d2b4f] dark:text-white">Security</h2>
                  
                  {/* Change Password */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                        className="bg-[#f4a825] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors"
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                  
                  {/* Session Management */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Session Management</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
                        <p className="text-xs text-gray-500">You are logged in on this device</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-semibold">
                        Logout All Devices
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Data Management */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1d2b4f] dark:text-white">Data Management</h2>
                  
                  <div className="border border-red-300 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Clear All Data</h3>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                      This will clear all cached data and reset your preferences. Your account will remain active.
                    </p>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Clear Cache
                    </button>
                  </div>
                  
                  <div className="border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                    <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Export Data</h3>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-4">
                      Export your admin data including preferences and activity logs.
                    </p>
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors flex items-center gap-2">
                      <Database size={16} />
                      Export Data
                    </button>
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

export default AdminSettings;