import { useState } from 'react'
import { DollarSign, Info, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FinancialConfigSectionProps {
  data: {
    budget: number
    fundingStatus: string
    passThreshold: number
    strongPassThreshold: number
  }
  onChange: (updates: Partial<{
    budget: number
    fundingStatus: string
    passThreshold: number
    strongPassThreshold: number
  }>) => void
  errors: string[]
}

const FUNDING_STATUSES = [
  { value: '', label: 'Select funding status...' },
  { value: 'Pre-seed', label: 'Pre-seed' },
  { value: 'Seed ($1M-$3M)', label: 'Seed ($1M-$3M)' },
  { value: 'Series A ($3M-$15M)', label: 'Series A ($3M-$15M)' },
  { value: 'Series B ($15M-$50M)', label: 'Series B ($15M-$50M)' },
  { value: 'Series C+ ($50M+)', label: 'Series C+ ($50M+)' },
  { value: 'Profitable (Bootstrapped)', label: 'Profitable (Bootstrapped)' },
  { value: 'Client Project', label: 'Client Project' },
]

export function FinancialConfigSection({ data, onChange, errors }: FinancialConfigSectionProps) {
  const [budgetDisplay, setBudgetDisplay] = useState(
    data.budget ? data.budget.toLocaleString() : ''
  )

  const getFieldError = (field: string) => {
    return errors.find((e) => e.toLowerCase().includes(field.toLowerCase()))
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setBudgetDisplay(value ? parseInt(value).toLocaleString() : '')
    onChange({ budget: value ? parseInt(value) : 0 })
  }

  const passRate = data.passThreshold
  const strongPassRate = data.strongPassThreshold
  const failRate = 100 - strongPassRate

  return (
    <div className="space-y-6">
      {/* Budget Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-[#f7f8f8] flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#7170ff]" />
          Budget Configuration
        </h4>

        {/* Budget Amount */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-[#f7f8f8]">
            Project Budget
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8f98]" />
            <Input
              id="budget"
              value={budgetDisplay}
              onChange={handleBudgetChange}
              placeholder="250,000"
              className="pl-10 bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]"
            />
          </div>
          <p className="text-xs text-[#8a8f98]">
            Total budget available for the simulation (shown in briefing)
          </p>
        </div>

        {/* Funding Status */}
        <div className="space-y-2">
          <Label htmlFor="fundingStatus" className="text-[#f7f8f8]">
            Funding Status
          </Label>
          <select
            id="fundingStatus"
            value={data.fundingStatus}
            onChange={(e) => onChange({ fundingStatus: e.target.value })}
            className="w-full px-3 py-2 bg-[#1a1d21] border border-[#23252a] rounded-md text-[#f7f8f8] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent"
          >
            {FUNDING_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-[#8a8f98]">
            Current funding stage of the fictional company
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#23252a]" />

      {/* Scoring Thresholds Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-[#f7f8f8] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#7170ff]" />
          Scoring Thresholds
        </h4>

        {/* Pass Threshold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="passThreshold" className="text-[#f7f8f8]">
              Pass Threshold
            </Label>
            <span className="text-sm font-medium text-[#f7f8f8]">
              {data.passThreshold}%
            </span>
          </div>
          <input
            id="passThreshold"
            type="range"
            min={50}
            max={80}
            value={data.passThreshold}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              onChange({
                passThreshold: value,
                strongPassThreshold: Math.max(value + 10, data.strongPassThreshold),
              })
            }}
            className="w-full h-2 bg-[#1a1d21] rounded-lg appearance-none cursor-pointer accent-[#7170ff]"
          />
          <p className="text-xs text-[#8a8f98]">
            Minimum score required to pass the simulation
          </p>
        </div>

        {/* Strong Pass Threshold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="strongPassThreshold" className="text-[#f7f8f8]">
              Strong Pass Threshold
            </Label>
            <span className="text-sm font-medium text-[#f7f8f8]">
              {data.strongPassThreshold}%
            </span>
          </div>
          <input
            id="strongPassThreshold"
            type="range"
            min={data.passThreshold + 10}
            max={100}
            value={data.strongPassThreshold}
            onChange={(e) => onChange({ strongPassThreshold: parseInt(e.target.value) })}
            className="w-full h-2 bg-[#1a1d21] rounded-lg appearance-none cursor-pointer accent-[#7170ff]"
          />
          <p className="text-xs text-[#8a8f98]">
            Minimum score required for distinction/strong pass
          </p>
        </div>

        {/* Score Distribution Visualization */}
        <Card className="bg-[#1a1d21] border-[#23252a] p-4">
          <h5 className="text-xs font-medium text-[#f7f8f8] mb-3">Score Distribution</h5>
          <div className="space-y-3">
            {/* Strong Pass */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-green-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Strong Pass
                </span>
                <span className="text-[#8a8f98]">{strongPassRate}% - 100%</span>
              </div>
              <div className="h-2 bg-[#0d0f11] rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${failRate}%` }}
                />
              </div>
            </div>

            {/* Pass */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-yellow-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Pass
                </span>
                <span className="text-[#8a8f98]">{passRate}% - {strongPassRate - 1}%</span>
              </div>
              <div className="h-2 bg-[#0d0f11] rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${strongPassRate - passRate}%` }}
                />
              </div>
            </div>

            {/* Fail */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-red-500 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Fail
                </span>
                <span className="text-[#8a8f98]">0% - {passRate - 1}%</span>
              </div>
              <div className="h-2 bg-[#0d0f11] rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${passRate}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Guidelines */}
      <div className="p-4 bg-[#1a1d21] border border-[#23252a] rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-[#7170ff] flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-[#f7f8f8] mb-1">Scoring Guidelines</h5>
            <ul className="text-xs text-[#8a8f98] space-y-1">
              <li>• Intro simulations: 55% pass, 75% strong pass</li>
              <li>• Intermediate: 60% pass, 80% strong pass</li>
              <li>• Advanced: 65% pass, 85% strong pass</li>
              <li>• Consider completion rate when setting thresholds</li>
            </ul>
          </div>
        </div>
      </div>

      {getFieldError('threshold') && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {getFieldError('threshold')}
        </p>
      )}
    </div>
  )
}
