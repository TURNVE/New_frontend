import { useState } from 'react';
import { 
  User, Shield, Bell, Globe, Lock, CreditCard, Key, Mail, 
  Edit3, Save, X, CheckCircle2, LogOut,
  Smartphone, Monitor, Trash2, Download, Upload, Eye, EyeOff,
  Building2, Loader2
} from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { profiles } from '../lib/supabase';

const SettingsPage = () => {
  const { isMobile, isIOS, isAndroid } = usePageSetup();
  const { role, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  
  const [accountData, setAccountData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profession: 'Product Manager',
    bio: 'Experienced product manager with a passion for user-centered design.',
    avatar: null
  });

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

  const [notificationPrefs, setNotificationPrefs] = useState({
    email: { enabled: true, marketing: false, updates: true, reminders: true },
    push: { enabled: true, messages: true, mentions: true, reminders: true },
    sms: { enabled: false, security: true, reminders: false }
  });

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

  const showOrgSwitch = true;

  const handleUpgradeToOrganization = async () => {
    setIsUpgrading(true);
    setUpgradeError(null);
    try {
      const { error } = await profiles.updateProfile({ role: 'COMPANY' });
      if (error) {
        setUpgradeError('Failed to upgrade account. Please try again.');
        console.error('Upgrade error:', error);
        return;
      }
      await refreshSession();
      navigate('/company');
    } catch (err) {
      setUpgradeError('An unexpected error occurred.');
      console.error('Upgrade error:', err);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-72 flex-shrink-0">
          <nav className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-1 sticky top-8">
            {settingSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className={`h-5 w-5 ${activeSection === section.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="font-medium text-sm">{section.name}</p>
                    <p className={`text-xs ${activeSection === section.id ? 'text-primary' : 'text-muted-foreground'}`}>
                      {section.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-border">
              {showOrgSwitch && (
                <button 
                  onClick={() => role === 'COMPANY' ? navigate('/company') : handleUpgradeToOrganization()}
                  disabled={isUpgrading}
                  className="w-full text-left px-4 py-3 rounded-xl text-primary hover:bg-primary/10 transition-colors flex items-center gap-3 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpgrading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Building2 className="h-5 w-5" />
                  )}
                  <span className="font-medium text-sm">
                  {role === 'COMPANY' ? 'Organization Dashboard' : isUpgrading ? 'Upgrading...' : 'Upgrade to Organization'}
                  </span>
                </button>
              )}
              <button className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center gap-3">
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
            <div className="bg-card rounded-2xl border border-border shadow-sm">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Account Information</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Update your profile details</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveChanges}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
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
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                    {accountData.firstName[0]}{accountData.lastName[0]}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2 whitespace-nowrap">
                      <Upload className="h-4 w-4" />
                      Change Photo
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={accountData.firstName}
                        onChange={(e) => handleInputChange('account', 'firstName', e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      />
                    ) : (
                      <p className="text-foreground">{accountData.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={accountData.lastName}
                        onChange={(e) => handleInputChange('account', 'lastName', e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      />
                    ) : (
                      <p className="text-foreground">{accountData.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      value={accountData.email}
                      disabled
                      className="w-full px-3 py-2.5 border border-border rounded-xl bg-secondary text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Profession</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={accountData.profession}
                        onChange={(e) => handleInputChange('account', 'profession', e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      />
                    ) : (
                      <p className="text-foreground">{accountData.profession}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={accountData.bio}
                        onChange={(e) => handleInputChange('account', 'bio', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      />
                    ) : (
                      <p className="text-foreground">{accountData.bio}</p>
                    )}
                  </div>
                </div>

                {/* Organization Section */}
                {showOrgSwitch && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Organization
                    </h3>
                    {upgradeError && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm">
                        {upgradeError}
                      </div>
                    )}
                    <div className="p-4 bg-secondary rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {role === 'COMPANY' ? 'Organization Dashboard' : 'Upgrade to Organization Account'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {role === 'COMPANY' 
                              ? 'Manage your company simulations and settings' 
                              : 'Create a company profile and manage simulations for your organization'
                            }
                          </p>
                        </div>
                        <button
                          onClick={() => role === 'COMPANY' ? navigate('/company') : handleUpgradeToOrganization()}
                          disabled={isUpgrading}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpgrading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : role === 'COMPANY' ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Open Dashboard
                            </>
                          ) : (
                            <>
                              <Building2 className="h-4 w-4" />
                              Upgrade Account
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border shadow-sm">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-lg font-bold text-foreground">Security & Privacy</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Manage account security settings</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Two-Factor Auth */}
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Key className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSecurityData({...securityData, twoFactor: !securityData.twoFactor})}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        securityData.twoFactor ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-card rounded-full shadow transition-transform ${
                        securityData.twoFactor ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {/* Password */}
                  <div className="p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Password</h3>
                        <p className="text-sm text-muted-foreground">Strength: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{securityData.passwordStrength}</span></p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap">
                      Change Password
                    </button>
                  </div>

                  {/* Recovery Email */}
                  <div className="p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-violet-50 dark:bg-violet-500/20 rounded-xl flex items-center justify-center">
                        <Mail className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Recovery Email</h3>
                        <p className="text-sm text-muted-foreground">{securityData.recoveryEmail}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap">
                      Update Email
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-card rounded-2xl border border-border shadow-sm">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-lg font-bold text-foreground">Active Sessions</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Manage your logged-in devices</p>
                </div>
                
                <div className="divide-y divide-border">
                  {securityData.sessions.map((session) => (
                    <div key={session.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {session.device.includes('Mac') || session.device.includes('Windows') ? (
                          <Monitor className="h-10 w-10 text-muted-foreground" />
                        ) : (
                          <Smartphone className="h-10 w-10 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{session.device}</p>
                          <p className="text-sm text-muted-foreground">{session.location} • {session.lastActive}</p>
                        </div>
                      </div>
                      {session.active ? (
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                          Current Session
                        </span>
                      ) : (
                        <button className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors">
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
            <div className="bg-card rounded-2xl border border-border shadow-sm">
              <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Configure how you receive notifications</p>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Email Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">Email Notifications</h3>
                    </div>
                    <button
                      onClick={() => setNotificationPrefs({...notificationPrefs, email: {...notificationPrefs.email, enabled: !notificationPrefs.email.enabled}})}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        notificationPrefs.email.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-card rounded-full shadow transition-transform ${
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
                      <div key={item.key} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
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
                          className="w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">Push Notifications</h3>
                    </div>
                    <button
                      onClick={() => setNotificationPrefs({...notificationPrefs, push: {...notificationPrefs.push, enabled: !notificationPrefs.push.enabled}})}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        notificationPrefs.push.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-card rounded-full shadow transition-transform ${
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
                      <div key={item.key} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
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
                          className="w-5 h-5 text-primary rounded focus:ring-primary"
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
            <div className="bg-card rounded-2xl border border-border shadow-sm">
              <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Privacy Settings</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Control your data and visibility</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Profile Visibility */}
                <div className="p-4 bg-secondary rounded-xl">
                  <h3 className="font-semibold text-foreground mb-4">Profile Visibility</h3>
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
                            ? 'bg-card border-2 border-primary'
                            : 'bg-card border-2 border-transparent hover:border-border'
                        }`}
                      >
                        <input
                          type="radio"
                          name="profileVisibility"
                          value={option.value}
                          checked={privacyData.profileVisibility === option.value}
                          onChange={(e) => setPrivacyData({...privacyData, profileVisibility: e.target.value})}
                          className="w-5 h-5 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-medium text-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Data Sharing */}
                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Data Sharing</h3>
                      <p className="text-sm text-muted-foreground">Share data with partners for improved features</p>
                    </div>
                    <button
                      onClick={() => setPrivacyData({...privacyData, dataSharing: !privacyData.dataSharing})}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        privacyData.dataSharing ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-card rounded-full shadow transition-transform ${
                        privacyData.dataSharing ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Download Data */}
                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Download Your Data</h3>
                      <p className="text-sm text-muted-foreground">Get a copy of all your data</p>
                    </div>
                    <button className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap">
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
              <div className="bg-card rounded-2xl border border-border shadow-sm">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-lg font-bold text-foreground">Billing & Plans</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Manage your subscription</p>
                </div>
                
                <div className="p-6">
                  {/* Current Plan */}
                  <div className="p-6 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl text-white mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm mb-1">Current Plan</p>
                        <h3 className="text-2xl font-bold">Free Plan</h3>
                        <p className="text-white/80 mt-1">Limited access to features</p>
                      </div>
                      <button className="px-5 py-2.5 bg-card text-primary rounded-xl font-semibold hover:bg-secondary transition-colors whitespace-nowrap">
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="p-4 bg-secondary rounded-xl mb-4">
                    <h3 className="font-semibold text-foreground mb-3">Payment Method</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 04/2027</p>
                        </div>
                      </div>
                      <button className="text-primary hover:text-primary/80 font-medium text-sm whitespace-nowrap">
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
            <div className="bg-card rounded-2xl border border-border shadow-sm">
              <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Integrations</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Connect with your favorite tools</p>
              </div>
              
              <div className="p-6 space-y-4">
                {[
                  { name: 'Google', desc: 'Sync calendar and contacts', icon: 'G', color: 'bg-red-500', connected: false },
                  { name: 'Slack', desc: 'Post notifications to channels', icon: 'S', color: 'bg-purple-500', connected: true },
                  { name: 'Notion', desc: 'Sync project documents', icon: 'N', color: 'bg-gray-800', connected: false },
                  { name: 'GitHub', desc: 'Link repositories to projects', icon: 'GH', color: 'bg-gray-900', connected: false }
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.desc}</p>
                      </div>
                    </div>
                    {integration.connected ? (
                      <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-medium">
                        Connected
                      </span>
                    ) : (
                      <button className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap">
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
    </div>
  );
};

export default SettingsPage;
