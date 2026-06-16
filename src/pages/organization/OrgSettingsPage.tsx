import React, { useEffect, useState } from 'react';
import { OrgLayout } from '../../components/organization/layout/OrgLayout';
import { OrgSidebar } from '../../components/organization/layout/OrgSidebar';
import { OrgHeader } from '../../components/organization/layout/OrgHeader';
import {
  Building2,
  Palette,
  Bell,
  Shield,
  CreditCard,
  Upload,
  Save,
  Check,
} from 'lucide-react';
import { cn } from '../../lib/organization/utils';
import { useOrganization } from '../../hooks/organization';

const tabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function OrgSettingsPage() {
  const { organization, updateOrganization } = useOrganization();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: 'My Organization',
    slug: 'my-org',
    description: 'We help professionals develop management skills through realistic simulations.',
    website: 'https://example.com',
    primaryColor: '#3B82F6',
    emailNotifications: true,
    weeklyReports: true,
    clientActivityAlerts: true,
  });

  useEffect(() => {
    if (!organization) return;
    setFormData({
      name: organization.name,
      slug: organization.slug,
      description: organization.description || '',
      website: organization.website || '',
      primaryColor: organization.branding?.primaryColor || '#3B82F6',
      emailNotifications: organization.settings.emailNotifications,
      weeklyReports: organization.settings.weeklyReports,
      clientActivityAlerts: true,
    });
  }, [organization]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateOrganization({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        website: formData.website,
        branding: {
          ...(organization?.branding || { secondaryColor: '#0f172a' }),
          primaryColor: formData.primaryColor,
        },
        settings: {
          ...(organization?.settings || {
            allowClientInvites: true,
            requireApproval: false,
            defaultSimulationAccess: 'immediate' as const,
            emailNotifications: true,
            weeklyReports: true,
          }),
          emailNotifications: formData.emailNotifications,
          weeklyReports: formData.weeklyReports,
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const sidebar = <OrgSidebar />;
  const header = <OrgHeader organizationName={organization?.name} organizationLogo={organization?.logoUrl} />;

  return (
    <OrgLayout sidebar={sidebar} header={header}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Organization Settings</h1>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">General Information</h2>
                  <p className="text-gray-600 text-sm">Update your organization's basic details</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <div className="flex items-center">
                      <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                        turnve.com/org/
                      </span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-r-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Branding</h2>
                  <p className="text-gray-600 text-sm">Customize how your organization appears to clients</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag and drop your logo here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or SVG up to 2MB
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Preview</h3>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: formData.primaryColor }}
                        >
                          {formData.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900">{formData.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Notifications</h2>
                  <p className="text-gray-600 text-sm">Choose what notifications you receive</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get a weekly summary of organization activity' },
                    { key: 'clientActivityAlerts', label: 'Client Activity Alerts', description: 'Get notified when clients complete simulations' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData[item.key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Security</h2>
                  <p className="text-gray-600 text-sm">Manage your organization's security settings</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">API Keys</h3>
                    <p className="text-sm text-gray-600 mb-4">Manage API access for integrations</p>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Manage API Keys
                    </button>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-600 mb-4">Irreversible actions for your organization</p>
                    <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                      Delete Organization
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing</h2>
                  <p className="text-gray-600 text-sm">Manage your subscription and payment methods</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <p className="text-sm font-medium text-blue-100 mb-1">Current Plan</p>
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-blue-100 text-sm">All features included - no credit card required</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Payment Methods</h3>
                    <p className="text-sm text-gray-600">No payment methods on file</p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Billing History</h3>
                    <p className="text-sm text-gray-600">No billing history available</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors',
                  saving
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </OrgLayout>
  );
}
