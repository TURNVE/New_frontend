import { AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ChallengeConfigSectionProps {
  data: {
    challenge: string
    challengeDetails: string
    marketContext: string
    technicalStack: string
    projectType: string
  }
  onChange: (updates: Partial<{
    challenge: string
    challengeDetails: string
    marketContext: string
    technicalStack: string
    projectType: string
  }>) => void
  errors: string[]
}

export function ChallengeConfigSection({ data, onChange, errors }: ChallengeConfigSectionProps) {
  const getFieldError = (field: string) => {
    return errors.find((e) => e.toLowerCase().includes(field.toLowerCase()))
  }

  return (
    <div className="space-y-6">
      {/* Challenge Title */}
      <div className="space-y-2">
        <Label htmlFor="challenge" className="text-[#f7f8f8]">
          Challenge Title
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <input
          id="challenge"
          type="text"
          value={data.challenge}
          onChange={(e) => onChange({ challenge: e.target.value })}
          placeholder="e.g., Launch Day Meltdown"
          className={cn(
            'w-full px-3 py-2 bg-[#1a1d21] border rounded-md text-[#f7f8f8] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent',
            getFieldError('challenge') ? 'border-red-500' : 'border-[#23252a]'
          )}
        />
        <p className="text-xs text-[#8a8f98]">
          Short, attention-grabbing title for the challenge
        </p>
        {getFieldError('challenge') && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('challenge')}
          </p>
        )}
      </div>

      {/* Challenge Details */}
      <div className="space-y-2">
        <Label htmlFor="challengeDetails" className="text-[#f7f8f8]">
          Challenge Details
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <textarea
          id="challengeDetails"
          value={data.challengeDetails}
          onChange={(e) => onChange({ challengeDetails: e.target.value })}
          placeholder="Describe the situation, the stakes, and what the user needs to accomplish..."
          rows={8}
          className={cn(
            'w-full px-3 py-3 bg-[#1a1d21] border rounded-md text-[#f7f8f8] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent resize-none',
            getFieldError('details') ? 'border-red-500' : 'border-[#23252a]'
          )}
        />
        <div className="flex justify-between">
          <p className="text-xs text-[#8a8f98]">
            Full description of the challenge scenario
          </p>
          <p className="text-xs text-[#8a8f98]">
            {data.challengeDetails.length} characters
          </p>
        </div>
        {getFieldError('details') && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('details')}
          </p>
        )}
      </div>

      {/* Project Type */}
      <div className="space-y-2">
        <Label htmlFor="projectType" className="text-[#f7f8f8]">
          Project Type
        </Label>
        <input
          id="projectType"
          type="text"
          value={data.projectType}
          onChange={(e) => onChange({ projectType: e.target.value })}
          placeholder="e.g., Crisis Management, Growth Strategy, Platform Engineering"
          className="w-full px-3 py-2 bg-[#1a1d21] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent"
        />
        <p className="text-xs text-[#8a8f98]">
          Category of project management challenge
        </p>
      </div>

      {/* Market Context */}
      <div className="space-y-2">
        <Label htmlFor="marketContext" className="text-[#f7f8f8]">
          Market Context
        </Label>
        <textarea
          id="marketContext"
          value={data.marketContext}
          onChange={(e) => onChange({ marketContext: e.target.value })}
          placeholder="Describe the market conditions, competition, and industry landscape..."
          rows={4}
          className="w-full px-3 py-2 bg-[#1a1d21] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent resize-none"
        />
        <p className="text-xs text-[#8a8f98]">
          Background context that shapes the business environment
        </p>
      </div>

      {/* Technical Stack */}
      <div className="space-y-2">
        <Label htmlFor="technicalStack" className="text-[#f7f8f8]">
          Technical Stack
        </Label>
        <input
          id="technicalStack"
          type="text"
          value={data.technicalStack}
          onChange={(e) => onChange({ technicalStack: e.target.value })}
          placeholder="e.g., React, Node.js, PostgreSQL, AWS"
          className="w-full px-3 py-2 bg-[#1a1d21] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent"
        />
        <p className="text-xs text-[#8a8f98]">
          Technologies mentioned in the simulation (comma-separated)
        </p>
      </div>

      {/* Writing Tips */}
      <div className="p-4 bg-[#1a1d21] border border-[#23252a] rounded-lg">
        <h4 className="text-sm font-medium text-[#f7f8f8] mb-2">Writing Tips</h4>
        <ul className="text-xs text-[#8a8f98] space-y-1 list-disc list-inside">
          <li>Set clear stakes - what happens if they fail?</li>
          <li>Include time pressure - most simulations have deadlines</li>
          <li>Introduce key stakeholders early</li>
          <li>Balance ambiguity with enough context to decide</li>
          <li>Make it relatable to real PM challenges</li>
        </ul>
      </div>
    </div>
  )
}
