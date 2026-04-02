import { useState } from 'react';
import { 
  User, Shield, Bell, Globe, Lock, CreditCard, Key, Mail, 
  Edit3, Save, X, CheckCircle2, ChevronRight, LogOut,
  Smartphone, Monitor, Trash2, Download, Upload, Eye, EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';

const SettingsPage = () => {
  // Page setup with scroll-to-top, viewport fix, and device detection
  const { isMobile, isIOS, isAndroid } = usePageSetup();
  const [activeSection, setActiveSection] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  
  // Account settings
  const [accountData, setAccountData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profession: 'Product Manager',
    bio: 'Experienced product manager with a passion for user-centered design.',
    avatar: null
  });

  // Security settings
  const [securityData, setSecurityData] = useState({
    twoFactor: true,
    recoveryEmail: 'backup@example.com',
    passwordStrength: 'Strong',
    sessions: [
      { id: 1, device: 'MacBook Pro', location: 'San Francisco, CA', active: true, lastActive: 'Now' },
      { id: 2, device: 'iPhone 15', location: 'San Francisco, CA', active: false, lastActive: '2 hours ago' },
      { id: 3, device: 'Windows PC', location: 'New York, NY', active: false, lastActive: '5 days ago' }
    ]
  });

  // Notification settings
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: { enabled: true, marketing: false, updates: true, reminders: true },
    push: { enabled: true, messages: true, mentions: true, reminders: true },
    sms: { enabled: false, security: true, reminders: false }
  });

  // Privacy settings
  const [privacyData, setPrivacyData] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    analytics: true
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === 'account') {
      setAccountData(prev => ({ ...prev, [field]: value }));
    }
  };

  const saveChanges = () => {
    setIsEditing(false);
    // Here you would typically dispatch an action to save changes
    alert('Settings saved successfully!');
  };

  const settingSections = [
    { id: 'account', name: 'Account', icon: User, description: 'Manage your profile and personal information' },
    { id: 'security', name: 'Security', icon: Shield, description: 'Password, 2FA, and security settings' },
    { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Email, push, and SMS preferences' },
    { id: 'privacy', name: 'Privacy', icon: Lock, description: 'Control your data and visibility' },
    { id: 'billing', name: 'Billing', icon: CreditCard, description: 'Payment methods and subscriptions' },
    { id: 'integrations', name: 'Integrations', icon: Globe, description: 'Connect with other tools' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-72 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-1 sticky top-8">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <section.icon className={`h-5 w-5 ${activeSection === section.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-medium text-sm">{section.name}</p>
                      <p className={`text-xs ${activeSection === section.id ? 'text-blue-600' : 'text-gray-500'}`}>
                        {section.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium text-sm">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Account Settings */}
            {activeSection === 'account' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Account Information</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Update your profile details</p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={saveChanges}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                      {accountData.firstName[0]}{accountData.lastName[0]}
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <Upload className="h-4 w-4" />
                        Change Photo
                      </button>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG. Max size 2MB.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={accountData.firstName}
                          onChange={(e) => handleInputChange('account', 'firstName', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{accountData.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={accountData.lastName}
                          onChange={(e) => handleInputChange('account', 'lastName', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{accountData.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={accountData.email}
                        disabled
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Profession</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={accountData.profession}
                          onChange={(e) => handleInputChange('account', 'profession', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{accountData.profession}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                      {isEditing ? (
                        <textarea
                          value={accountData.bio}
                          onChange={(e) => handleInputChange('account', 'bio', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{accountData.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Security & Privacy</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage account security settings</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Two-Factor Auth */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Key className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSecurityData({...securityData, twoFactor: !securityData.twoFactor})}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          securityData.twoFactor ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                          securityData.twoFactor ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* Password */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                          <Lock className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Password</h3>
                          <p className="text-sm text-gray-500">Strength: <span className="text-emerald-600 font-medium">{securityData.passwordStrength}</span></p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                        Change Password
                      </button>
                    </div>

                    {/* Recovery Email */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                          <Mail className="h-6 w-6 text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Recovery Email</h3>
                          <p className="text-sm text-gray-500">{securityData.recoveryEmail}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                        Update Email
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Active Sessions</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your logged-in devices</p>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {securityData.sessions.map((session) => (
                      <div key={session.id} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {session.device.includes('Mac') || session.device.includes('Windows') ? (
                            <Monitor className="h-10 w-10 text-gray-400" />
                          ) : (
                            <Smartphone className="h-10 w-10 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{session.device}</p>
                            <p className="text-sm text-gray-500">{session.location} • {session.lastActive}</p>
                          </div>
                        </div>
                        {session.active ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                            Current Session
                          </span>
                        ) : (
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Configure how you receive notifications</p>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                      </div>
                      <button
                        onClick={() => setNotificationPrefs({...notificationPrefs, email: {...notificationPrefs.email, enabled: !notificationPrefs.email.enabled}})}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          notificationPrefs.email.enabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                          notificationPrefs.email.enabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                    <div className="space-y-3 pl-8">
                      {[
                        { key: 'updates', label: 'Product Updates', desc: 'New features and improvements' },
                        { key: 'reminders', label: 'Reminders', desc: 'Deadlines and task reminders' },
                        { key: 'marketing', label: 'Marketing', desc: 'Promotional emails and offers' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPrefs.email[item.key as keyof typeof notificationPrefs.email]}
                            onChange={() => setNotificationPrefs({
                              ...notificationPrefs,
                              email: {
                                ...notificationPrefs.email,
                                [item.key]: !notificationPrefs.email[item.key as keyof typeof notificationPrefs.email]
                              }
                            })}
                            disabled={!notificationPrefs.email.enabled}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                      </div>
                      <button
                        onClick={() => setNotificationPrefs({...notificationPrefs, push: {...notificationPrefs.push, enabled: !notificationPrefs.push.enabled}})}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          notificationPrefs.push.enabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                          notificationPrefs.push.enabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                    <div className="space-y-3 pl-8">
                      {[
                        { key: 'messages', label: 'Messages', desc: 'Direct messages and replies' },
                        { key: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                        { key: 'reminders', label: 'Reminders', desc: 'Task and deadline reminders' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPrefs.push[item.key as keyof typeof notificationPrefs.push]}
                            onChange={() => setNotificationPrefs({
                              ...notificationPrefs,
                              push: {
                                ...notificationPrefs.push,
                                [item.key]: !notificationPrefs.push[item.key as keyof typeof notificationPrefs.push]
                              }
                            })}
                            disabled={!notificationPrefs.push.enabled}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Privacy Settings</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Control your data and visibility</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Profile Visibility */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4">Profile Visibility</h3>
                    <div className="space-y-3">
                      {[
                        { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
                        { value: 'contacts', label: 'Connections Only', desc: 'Only your connections can see your profile' },
                        { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                            privacyData.profileVisibility === option.value
                              ? 'bg-white border-2 border-blue-500'
                              : 'bg-white border-2 border-transparent hover:border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="profileVisibility"
                            value={option.value}
                            checked={privacyData.profileVisibility === option.value}
                            onChange={(e) => setPrivacyData({...privacyData, profileVisibility: e.target.value})}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-500">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Data Sharing */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Data Sharing</h3>
                        <p className="text-sm text-gray-500">Share data with partners for improved features</p>
                      </div>
                      <button
                        onClick={() => setPrivacyData({...privacyData, dataSharing: !privacyData.dataSharing})}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          privacyData.dataSharing ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                          privacyData.dataSharing ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Download Data */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Download className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Download Your Data</h3>
                        <p className="text-sm text-gray-500">Get a copy of all your data</p>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeSection === 'billing' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Billing & Plans</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your subscription</p>
                  </div>
                  
                  <div className="p-6">
                    {/* Current Plan */}
                    <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm mb-1">Current Plan</p>
                          <h3 className="text-2xl font-bold">Free Plan</h3>
                          <p className="text-blue-100 mt-1">Limited access to features</p>
                        </div>
                        <button className="px-5 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap">
                          Upgrade to Pro
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="p-4 bg-gray-50 rounded-xl mb-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Visa ending in 4242</p>
                            <p className="text-sm text-gray-500">Expires 04/2027</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap">
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeSection === 'integrations' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Integrations</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Connect with your favorite tools</p>
                </div>
                
                <div className="p-6 space-y-4">
                  {[
                    { name: 'Google', desc: 'Sync calendar and contacts', icon: 'G', color: 'bg-red-500', connected: false },
                    { name: 'Slack', desc: 'Post notifications to channels', icon: 'S', color: 'bg-purple-500', connected: true },
                    { name: 'Notion', desc: 'Sync project documents', icon: 'N', color: 'bg-gray-800', connected: false },
                    { name: 'GitHub', desc: 'Link repositories to projects', icon: 'GH', color: 'bg-gray-900', connected: false }
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                          {integration.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          <p className="text-sm text-gray-500">{integration.desc}</p>
                        </div>
                      </div>
                      {integration.connected ? (
                        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium">
                          Connected
                        </span>
                      ) : (
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                          Connect
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;