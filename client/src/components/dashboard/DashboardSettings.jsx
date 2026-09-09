import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell,
  Lock,
  Globe,
  Eye,
  Mail,
  Shield,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { apiconnector } from '../../services/apiconnector';
import { authEndpoints } from '../../services/apis';
import { setUser } from '../../store/slices/authSlice';

const DashboardSettings = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      email: {
        orderUpdates: true,
        promotions: true,
        newsletter: false
      },
      push: {
        orderUpdates: true,
        messages: true
      }
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false
    },
    language: 'en',
    timezone: 'UTC',
    currency: 'USD'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiconnector(
        'GET',
        authEndpoints.GET_SETTINGS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);

    try {
      const response = await apiconnector(
        'PUT',
        authEndpoints.UPDATE_SETTINGS_API,
        settings,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );
      
      if (response.data.success) {
        
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    if (passwordData.newPassword.length < 6) {
      return;
    }
    
    setPasswordLoading(true);

    try {
      const response = await apiconnector(
        'PUT',
        authEndpoints.UPDATE_PASSWORD_API,
        passwordData,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );
if (response.data.success) {
        
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {

    } finally {
      setPasswordLoading(false);
}
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="animate-[slideInLeft_0.5s_ease-out]">
        <h1 className="text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs - Horizontal at Top */}
      <div className="animate-[fadeInUp_0.6s_ease-out]">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <nav className="flex gap-2 flex-wrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Bell className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Notification Preferences</h2>
                    <p className="text-sm text-gray-500">Manage how you receive notifications</p>
                  </div>
                </div>

                {/* Email Notifications */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Mail size={18} className="text-blue-600" />
                    Email Notifications
                  </h3>
                  
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-gray-900">Order Updates</p>
                      <p className="text-sm text-gray-500">Get notified about order status changes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications?.email?.orderUpdates ?? true}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: {
                            ...settings.notifications?.email,
                            orderUpdates: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-gray-900">Promotions</p>
                      <p className="text-sm text-gray-500">Receive promotional offers and deals</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications?.email?.promotions ?? true}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: {
                            ...settings.notifications?.email,
                            promotions: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-gray-900">Newsletter</p>
                      <p className="text-sm text-gray-500">Get weekly newsletter with updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications?.email?.newsletter ?? false}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: {
                            ...settings.notifications?.email,
                            newsletter: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                {/* Push Notifications */}
                <div className="space-y-4 mt-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Bell size={18} className="text-purple-600" />
                    Push Notifications
                  </h3>
                  
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-gray-900">Order Updates</p>
                      <p className="text-sm text-gray-500">Push notifications for orders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications?.push?.orderUpdates ?? true}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          push: {
                            ...settings.notifications?.push,
                            orderUpdates: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-gray-900">Messages</p>
                      <p className="text-sm text-gray-500">Get notified of new messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications?.push?.messages ?? true}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          push: {
                            ...settings.notifications?.push,
                            messages: e.target.checked
                          }
                        }
                      })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Eye className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Privacy Settings</h2>
                    <p className="text-sm text-gray-500">Control your privacy preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="font-semibold text-gray-900 mb-3 block">Profile Visibility</label>
                    <select
                      value={settings.privacy?.profileVisibility ?? 'public'}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          profileVisibility: e.target.value
                        }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                    >
                      <option value="public">Public - Anyone can see your profile</option>
                      <option value="private">Private - Only you can see your profile</option>
                    </select>
                  </div>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-gray-900">Show Email Address</p>
                      <p className="text-sm text-gray-500">Display email on your public profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy?.showEmail ?? false}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          showEmail: e.target.checked
                        }
                      })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-500">Manage your account security</p>
                  </div>
                </div>

                {/* Change Password */}
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Lock size={18} className="text-red-600" />
                    Change Password
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg shadow-red-500/30 hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Save Button */}
            {activeTab !== 'security' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
