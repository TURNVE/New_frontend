import { useRef } from 'react'
import { AlertCircle, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface CompanyBrandingSectionProps {
  data: {
    companyName: string
    logoUrl: string
    primaryColor: string
    description: string
    founded: string
    employees: string
    headquarters: string
  }
  onChange: (updates: Partial<{
    companyName: string
    logoUrl: string
    primaryColor: string
    description: string
    founded: string
    employees: string
    headquarters: string
  }>) => void
  errors: string[]
}

const ARCHEYTPE_COLORS: Record<string, string[]> = {
  crisis: ['#ef4444', '#dc2626', '#991b1b', '#f87171'],
  growth: ['#8b5cf6', '#7c3aed', '#5b21b6', '#a78bfa'],
  platform: ['#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa'],
  zero_to_one: ['#14b8a6', '#0d9488', '#0f766e', '#2dd4bf'],
  creative: ['#f97316', '#ea580c', '#c2410c', '#fb923c'],
}

const PRESET_COLORS = [
  '#5e6ad2', // TURNVE primary
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#f43f5e', // Rose
]

export function CompanyBrandingSection({ data, onChange, errors }: CompanyBrandingSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFieldError = (field: string) => {
    return errors.find((e) => e.toLowerCase().includes(field.toLowerCase()))
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Upload to server and get URL
      // For now, simulate with a local preview
      const reader = new FileReader()
      reader.onload = (event) => {
        onChange({ logoUrl: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-[#f7f8f8]">
          Company Name
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="companyName"
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          placeholder="e.g., PayLink"
          className={cn(
            'bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]',
            getFieldError('company') && 'border-red-500 focus-visible:ring-red-500'
          )}
        />
        <p className="text-xs text-[#8a8f98]">
          The fictional company name for this simulation
        </p>
        {getFieldError('company') && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('company')}
          </p>
        )}
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-[#f7f8f8]">Company Logo</Label>
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-lg border-2 border-dashed border-[#23252a] flex items-center justify-center bg-[#1a1d21] overflow-hidden cursor-pointer hover:border-[#7170ff] transition-colors"
            onClick={handleFileUpload}
          >
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt="Company logo"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-[#8a8f98] mx-auto mb-1" />
                <span className="text-xs text-[#8a8f98]">Upload logo</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleFileUpload}
              className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
            >
              Choose file
            </Button>
            <p className="text-xs text-[#8a8f98] mt-2">
              Recommended: 200x200px, PNG or SVG with transparent background
            </p>
          </div>
        </div>
      </div>

      {/* Primary Color */}
      <div className="space-y-2">
        <Label className="text-[#f7f8f8]">Primary Color</Label>
        <div className="grid grid-cols-8 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange({ primaryColor: color })}
              className={cn(
                'w-8 h-8 rounded-lg transition-all',
                data.primaryColor === color
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111418] scale-110'
                  : 'hover:scale-105'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div
            className="w-10 h-10 rounded-lg border border-[#23252a]"
            style={{ backgroundColor: data.primaryColor }}
          />
          <Input
            value={data.primaryColor}
            onChange={(e) => onChange({ primaryColor: e.target.value })}
            placeholder="#5e6ad2"
            className="w-28 bg-[#1a1d21] border-[#23252a] text-[#f7f8f8] font-mono text-sm"
          />
          <p className="text-xs text-[#8a8f98]">
            Used for buttons, accents, and key UI elements
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-[#f7f8f8]">
          Company Description
        </Label>
        <textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Brief description of the company and its mission..."
          rows={4}
          className="w-full px-3 py-2 bg-[#1a1d21] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent resize-none"
        />
        <p className="text-xs text-[#8a8f98]">
          Shown in the company profile panel during simulation
        </p>
      </div>

      {/* Company Details Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="founded" className="text-[#f7f8f8]">
            Founded
          </Label>
          <Input
            id="founded"
            value={data.founded}
            onChange={(e) => onChange({ founded: e.target.value })}
            placeholder="e.g., 2022"
            className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employees" className="text-[#f7f8f8]">
            Employees
          </Label>
          <Input
            id="employees"
            value={data.employees}
            onChange={(e) => onChange({ employees: e.target.value })}
            placeholder="e.g., 45"
            className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="headquarters" className="text-[#f7f8f8]">
            Headquarters
          </Label>
          <Input
            id="headquarters"
            value={data.headquarters}
            onChange={(e) => onChange({ headquarters: e.target.value })}
            placeholder="e.g., San Francisco, CA"
            className="bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]"
          />
        </div>
      </div>
    </div>
  )
}

// Import Button component
import { Button } from '@/components/ui/button'
