import { useMemo, useState } from 'react'
import type { ElementType } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  CreditCard,
  RotateCcw,
  Save,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

type SettingsTab = 'security' | 'payments' | 'operations'

interface AdminSettingsState {
  requireMfa: boolean
  sessionTimeoutMinutes: number
  allowedAdminDomains: string
  paymentProvider: 'stripe' | 'manual'
  stripeMode: 'test' | 'live'
  monthlyPriceId: string
  annualPriceId: string
  webhookStatus: 'not_configured' | 'pending' | 'verified'
  billingAlertsEmail: string
  autoPublishSimulations: boolean
  notifyOnNewUsers: boolean
  maintenanceBanner: string
}

const STORAGE_KEY = 'turnve_admin_settings'

const defaultSettings: AdminSettingsState = {
  requireMfa: true,
  sessionTimeoutMinutes: 60,
  allowedAdminDomains: 'turnve.com',
  paymentProvider: 'stripe',
  stripeMode: 'test',
  monthlyPriceId: '',
  annualPriceId: '',
  webhookStatus: 'not_configured',
  billingAlertsEmail: '',
  autoPublishSimulations: false,
  notifyOnNewUsers: true,
  maintenanceBanner: '',
}

const tabs: Array<{ id: SettingsTab; label: string; icon: ElementType }> = [
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'operations', label: 'Operations', icon: Settings },
]

function loadSettings(): AdminSettingsState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export function AdminSettingsPage() {
  const { user, role } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') as SettingsTab | null
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    initialTab && tabs.some((tab) => tab.id === initialTab) ? initialTab : 'security'
  )
  const [settings, setSettings] = useState<AdminSettingsState>(() => loadSettings())
  const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle')

  const paymentReadiness = useMemo(() => {
    const hasPrices = Boolean(settings.monthlyPriceId.trim() && settings.annualPriceId.trim())
    if (settings.paymentProvider !== 'stripe') return 'Manual billing'
    if (hasPrices && settings.webhookStatus === 'verified') return 'Ready'
    if (hasPrices) return 'Webhook pending'
    return 'Setup required'
  }, [settings])

  const updateSetting = <K extends keyof AdminSettingsState>(field: K, value: AdminSettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSaveState('idle')
  }

  const handleSave = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaveState('saved')
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    window.localStorage.removeItem(STORAGE_KEY)
    setSaveState('idle')
  }

  const selectTab = (tab: SettingsTab) => {
    setActiveTab(tab)
    setSearchParams(tab === 'security' ? {} : { tab })
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#f7f8f8]">Admin Settings</h1>
          <p className="mt-1 text-[#8a8f98]">
            Configure admin access, payment readiness, and platform operating controls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} className="bg-[#5e6ad2] text-white hover:bg-[#828fff]">
            <Save className="mr-2 h-4 w-4" />
            {saveState === 'saved' ? 'Saved' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <Card className="h-fit border-[#23252a] bg-[#111418] p-3">
          <div className="mb-3 rounded-lg bg-[#0d0f11] p-4">
            <p className="text-sm font-medium text-[#f7f8f8]">{user?.email ?? 'Admin'}</p>
            <p className="mt-1 text-xs text-[#8a8f98]">{role} access</p>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border border-[#5e6ad2]/20 bg-[#5e6ad2]/10 text-[#828fff]'
                      : 'text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </Card>

        <div className="space-y-6">
          {activeTab === 'security' && (
            <>
              <Card className="border-[#23252a] bg-[#111418] p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium text-[#f7f8f8]">Admin Authentication</h2>
                    <p className="mt-1 text-sm text-[#8a8f98]">Frontend policy settings for privileged sessions.</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500">Role gated</Badge>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="flex items-start gap-3 rounded-lg border border-[#23252a] bg-[#0d0f11] p-4">
                    <input
                      type="checkbox"
                      checked={settings.requireMfa}
                      onChange={(e) => updateSetting('requireMfa', e.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-medium text-[#f7f8f8]">Require MFA for admins</span>
                      <span className="mt-1 block text-xs leading-5 text-[#8a8f98]">Use this as the UI source of truth before backend enforcement is added.</span>
                    </span>
                  </label>

                  <div className="space-y-2">
                    <Label className="text-[#d0d6e0]">Session timeout</Label>
                    <Input
                      type="number"
                      min={15}
                      max={480}
                      value={settings.sessionTimeoutMinutes}
                      onChange={(e) => updateSetting('sessionTimeoutMinutes', Number(e.target.value))}
                      className="border-[#23252a] bg-[#1a1d21] text-[#f7f8f8]"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#d0d6e0]">Allowed admin email domains</Label>
                    <Input
                      value={settings.allowedAdminDomains}
                      onChange={(e) => updateSetting('allowedAdminDomains', e.target.value)}
                      placeholder="turnve.com, example.com"
                      className="border-[#23252a] bg-[#1a1d21] text-[#f7f8f8]"
                    />
                  </div>
                </div>
              </Card>

              <Card className="border-yellow-500/20 bg-yellow-500/10 p-5">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
                  <div>
                    <h3 className="font-medium text-yellow-300">Security review note</h3>
                    <p className="mt-1 text-sm leading-6 text-yellow-100/80">
                      These controls prepare the admin UI, but privileged enforcement still belongs on the server side. Treat frontend-only settings as advisory until backend policy is wired.
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'payments' && (
            <Card className="border-[#23252a] bg-[#111418] p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-[#f7f8f8]">Payment Controls</h2>
                  <p className="mt-1 text-sm text-[#8a8f98]">Track the payment provider and plan IDs the admin team expects to manage.</p>
                </div>
                <Badge className={paymentReadiness === 'Ready' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}>
                  {paymentReadiness}
                </Badge>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[#d0d6e0]">Provider</Label>
                  <select
                    value={settings.paymentProvider}
                    onChange={(e) => updateSetting('paymentProvider', e.target.value as AdminSettingsState['paymentProvider'])}
                    className="h-10 w-full rounded-md border border-[#23252a] bg-[#1a1d21] px-3 text-sm text-[#f7f8f8]"
                  >
                    <option value="stripe">Stripe</option>
                    <option value="manual">Manual billing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#d0d6e0]">Stripe mode</Label>
                  <select
                    value={settings.stripeMode}
                    onChange={(e) => updateSetting('stripeMode', e.target.value as AdminSettingsState['stripeMode'])}
                    className="h-10 w-full rounded-md border border-[#23252a] bg-[#1a1d21] px-3 text-sm text-[#f7f8f8]"
                  >
                    <option value="test">Test</option>
                    <option value="live">Live</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#d0d6e0]">Monthly price ID</Label>
                  <Input
                    value={settings.monthlyPriceId}
                    onChange={(e) => updateSetting('monthlyPriceId', e.target.value)}
                    placeholder="price_..."
                    className="border-[#23252a] bg-[#1a1d21] text-[#f7f8f8]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#d0d6e0]">Annual price ID</Label>
                  <Input
                    value={settings.annualPriceId}
                    onChange={(e) => updateSetting('annualPriceId', e.target.value)}
                    placeholder="price_..."
                    className="border-[#23252a] bg-[#1a1d21] text-[#f7f8f8]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#d0d6e0]">Webhook status</Label>
                  <select
                    value={settings.webhookStatus}
                    onChange={(e) => updateSetting('webhookStatus', e.target.value as AdminSettingsState['webhookStatus'])}
                    className="h-10 w-full rounded-md border border-[#23252a] bg-[#1a1d21] px-3 text-sm text-[#f7f8f8]"
                  >
                    <option value="not_configured">Not configured</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#d0d6e0]">Billing alerts email</Label>
                  <Input
                    type="email"
                    value={settings.billingAlertsEmail}
                    onChange={(e) => updateSetting('billingAlertsEmail', e.target.value)}
                    placeholder="billing@turnve.com"
                    className="border-[#23252a] bg-[#1a1d21] text-[#f7f8f8]"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'operations' && (
            <Card className="border-[#23252a] bg-[#111418] p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-[#f7f8f8]">Platform Operations</h2>
                <p className="mt-1 text-sm text-[#8a8f98]">Common admin controls that should later sync to a durable backend config.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 rounded-lg border border-[#23252a] bg-[#0d0f11] p-4">
                  <input
                    type="checkbox"
                    checked={settings.autoPublishSimulations}
                    onChange={(e) => updateSetting('autoPublishSimulations', e.target.checked)}
                    className="mt-1"
                  />
                  <span>
                    <span className="flex items-center gap-2 text-sm font-medium text-[#f7f8f8]">
                      <Users className="h-4 w-4 text-[#828fff]" />
                      Auto-publish validated simulations
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#8a8f98]">New simulations become visible after all required sections validate.</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-[#23252a] bg-[#0d0f11] p-4">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnNewUsers}
                    onChange={(e) => updateSetting('notifyOnNewUsers', e.target.checked)}
                    className="mt-1"
                  />
                  <span>
                    <span className="flex items-center gap-2 text-sm font-medium text-[#f7f8f8]">
                      <Bell className="h-4 w-4 text-[#828fff]" />
                      Notify admins on new users
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#8a8f98]">Useful once admin notifications are wired to email or an internal inbox.</span>
                  </span>
                </label>

                <div className="space-y-2">
                  <Label className="text-[#d0d6e0]">Maintenance banner</Label>
                  <Input
                    value={settings.maintenanceBanner}
                    onChange={(e) => updateSetting('maintenanceBanner', e.target.value)}
                    placeholder="Optional message shown to users during maintenance"
                    className="border-[#23252a] bg-[#1a1d21] text-[#f7f8f8]"
                  />
                </div>
              </div>
            </Card>
          )}

          <Card className="border-[#23252a] bg-[#111418] p-6">
            <h2 className="mb-4 text-lg font-medium text-[#f7f8f8]">Recommended Admin Pages</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ['Payments', 'Subscriptions, invoices, coupons, refunds, failed payments'],
                ['Audit Log', 'Admin sign-ins, role changes, deletes, exports'],
                ['Feature Flags', 'Launch controls for simulations and experiments'],
                ['Content Review', 'Approval queue before simulations go live'],
                ['Support Inbox', 'User issues tied to account and billing state'],
                ['System Health', 'Webhook status, auth errors, API latency, job failures'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-lg border border-[#23252a] bg-[#0d0f11] p-4">
                  <p className="font-medium text-[#f7f8f8]">{title}</p>
                  <p className="mt-1 text-sm leading-5 text-[#8a8f98]">{description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminSettingsPage
