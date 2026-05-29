import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface SimulationFormData {
  key: string
  name: string
  route: string
  industry: string
  archetype: 'crisis' | 'growth' | 'platform' | 'zero_to_one' | 'creative'
  difficulty: 'intro' | 'intermediate' | 'advanced'
  durationHours: number
  totalWeeks: number
  teamSize: number
}

interface BasicInfoSectionProps {
  data: SimulationFormData
  onChange: (updates: Partial<SimulationFormData>) => void
  errors: string[]
}

const ARCHEYPES = [
  { value: 'crisis', label: 'Crisis', description: 'High-pressure scenarios requiring quick decisions' },
  { value: 'growth', label: 'Growth', description: 'Scaling and expansion challenges' },
  { value: 'platform', label: 'Platform', description: 'Technical infrastructure and system design' },
  { value: 'zero_to_one', label: 'Zero to One', description: 'New product discovery and validation' },
  { value: 'creative', label: 'Creative', description: 'Brand and creative project management' },
]

const DIFFICULTIES = [
  { value: 'intro', label: 'Intro', description: 'Beginner-friendly with clear guidance' },
  { value: 'intermediate', label: 'Intermediate', description: 'Moderate complexity with some ambiguity' },
  { value: 'advanced', label: 'Advanced', description: 'High complexity with multiple stakeholders' },
]

export function BasicInfoSection({ data, onChange, errors }: BasicInfoSectionProps) {
  const getFieldError = (field: string) => {
    return errors.find((e) => e.toLowerCase().includes(field.toLowerCase()))
  }

  return (
    <div className="space-y-6">
      {/* Simulation Key */}
      <div className="space-y-2">
        <Label htmlFor="key" className="text-[#f7f8f8]">
          Simulation Key
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="key"
          value={data.key}
          onChange={(e) => {
            const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
            onChange({
              key: value,
              route: `/simulation/${value}`,
            })
          }}
          placeholder="e.g., sim-pm-001"
          className={cn(
            'bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]',
            getFieldError('key') && 'border-red-500 focus-visible:ring-red-500'
          )}
        />
        <p className="text-xs text-[#8a8f98]">
          Unique identifier, lowercase letters, numbers, and hyphens only
        </p>
        {getFieldError('key') && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('key')}
          </p>
        )}
      </div>

      {/* Simulation Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#f7f8f8]">
          Simulation Name
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., 72-Hour Launch Crisis"
          className={cn(
            'bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]',
            getFieldError('name') && 'border-red-500 focus-visible:ring-red-500'
          )}
        />
        <p className="text-xs text-[#8a8f98]">
          Display name shown to users
        </p>
        {getFieldError('name') && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('name')}
          </p>
        )}
      </div>

      {/* Route */}
      <div className="space-y-2">
        <Label htmlFor="route" className="text-[#f7f8f8]">
          Route Path
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="route"
          value={data.route}
          onChange={(e) => onChange({ route: e.target.value })}
          placeholder="e.g., /simulation/sim-pm-001"
          className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]"
        />
        <p className="text-xs text-[#8a8f98]">
          URL path for accessing this simulation (auto-generated from key)
        </p>
      </div>

      {/* Archetype */}
      <div className="space-y-2">
        <Label htmlFor="archetype" className="text-[#f7f8f8]">
          Archetype
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select
          value={data.archetype}
          onValueChange={(value) => onChange({ archetype: value as SimulationFormData['archetype'] })}
        >
          <SelectTrigger className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]">
            <SelectValue placeholder="Select archetype" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1d21] border-[#23252a]">
            {ARCHEYPES.map((arch) => (
              <SelectItem
                key={arch.value}
                value={arch.value}
                className="text-[#f7f8f8] focus:bg-[#23252a] focus:text-[#f7f8f8]"
              >
                <div className="flex flex-col">
                  <span>{arch.label}</span>
                  <span className="text-xs text-[#8a8f98]">{arch.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-[#8a8f98]">
          Determines the simulation category and visual style
        </p>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <Label htmlFor="difficulty" className="text-[#f7f8f8]">
          Difficulty Level
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select
          value={data.difficulty}
          onValueChange={(value) => onChange({ difficulty: value as SimulationFormData['difficulty'] })}
        >
          <SelectTrigger className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1d21] border-[#23252a]">
            {DIFFICULTIES.map((diff) => (
              <SelectItem
                key={diff.value}
                value={diff.value}
                className="text-[#f7f8f8] focus:bg-[#23252a] focus:text-[#f7f8f8]"
              >
                <div className="flex flex-col">
                  <span>{diff.label}</span>
                  <span className="text-xs text-[#8a8f98]">{diff.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="industry" className="text-[#f7f8f8]">
          Industry
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="industry"
          value={data.industry}
          onChange={(e) => onChange({ industry: e.target.value })}
          placeholder="e.g., Fintech/Payments"
          className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]"
        />
        <p className="text-xs text-[#8a8f98]">
          Industry context for the simulation
        </p>
      </div>

      {/* Duration Configuration */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="durationHours" className="text-[#f7f8f8]">
            Duration (Hours)
          </Label>
          <Input
            id="durationHours"
            type="number"
            value={data.durationHours}
            onChange={(e) => onChange({ durationHours: parseInt(e.target.value) || 40 })}
            min={1}
            className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]"
          />
          <p className="text-xs text-[#8a8f98]">In-simulation hours</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalWeeks" className="text-[#f7f8f8]">
            Total Weeks
          </Label>
          <Input
            id="totalWeeks"
            type="number"
            value={data.totalWeeks}
            onChange={(e) => onChange({ totalWeeks: parseInt(e.target.value) || 8 })}
            min={1}
            max={52}
            className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamSize" className="text-[#f7f8f8]">
            Team Size
          </Label>
          <Input
            id="teamSize"
            type="number"
            value={data.teamSize}
            onChange={(e) => onChange({ teamSize: parseInt(e.target.value) || 5 })}
            min={1}
            max={50}
            className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]"
          />
        </div>
      </div>
    </div>
  )
}
