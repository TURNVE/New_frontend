/**
 * Reusable Admin Components
 * Shared components for the admin simulation form sections
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, AlertCircle, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Validation Errors Display
// ============================================================================

interface ValidationErrorsProps {
  errors: string[]
  className?: string
}

export function ValidationErrors({ errors, className }: ValidationErrorsProps) {
  if (errors.length === 0) return null

  return (
    <div className={cn('p-4 bg-red-500/10 border border-red-500/20 rounded-lg', className)}>
      <div className="flex items-center gap-2 text-red-500 mb-2">
        <AlertCircle className="w-4 h-4" />
        <span className="font-medium">Validation Errors</span>
      </div>
      <ul className="text-sm text-red-400 space-y-1">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  )
}

// ============================================================================
// Section Header
// ============================================================================

interface SectionHeaderProps {
  title: string
  description: string
  buttonLabel: string
  onAdd: () => void
  showButton?: boolean
}

export function SectionHeader({
  title,
  description,
  buttonLabel,
  onAdd,
  showButton = true,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium text-[#f7f8f8]">{title}</h3>
        <p className="text-sm text-[#8a8f98]">{description}</p>
      </div>
      {showButton && (
        <Button onClick={onAdd} className="bg-[#5e6ad2] hover:bg-[#828fff] text-white">
          <Plus className="w-4 h-4 mr-2" />
          {buttonLabel}
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// Empty State
// ============================================================================

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  buttonLabel: string
  onAdd: () => void
}

export function EmptyState({ icon: Icon, title, description, buttonLabel, onAdd }: EmptyStateProps) {
  return (
    <Card className="bg-[#1a1d21] border-[#23252a] p-12 text-center">
      <Icon className="w-12 h-12 text-[#8a8f98] mx-auto mb-4" />
      <h4 className="text-lg font-medium text-[#f7f8f8] mb-2">{title}</h4>
      <p className="text-[#8a8f98] mb-4">{description}</p>
      <Button onClick={onAdd} variant="outline" className="border-[#23252a] text-[#d0d6e0]">
        <Plus className="w-4 h-4 mr-2" />
        {buttonLabel}
      </Button>
    </Card>
  )
}

// ============================================================================
// Item Card
// ============================================================================

interface ItemCardProps {
  children: React.ReactNode
  badges?: Array<{ label: string; className?: string }>
  onRemove: () => void
  removeLabel?: string
}

export function ItemCard({ children, badges, onRemove, removeLabel = 'Remove' }: ItemCardProps) {
  return (
    <Card className="bg-[#1a1d21] border-[#23252a] p-6">
      {children}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#23252a]">
        {badges && badges.length > 0 ? (
          <div className="flex gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant="outline" className={cn('border', badge.className)}>
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : (
          <div />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {removeLabel}
        </Button>
      </div>
    </Card>
  )
}

// ============================================================================
// Section Complete Button
// ============================================================================

interface SectionCompleteButtonProps {
  onComplete: () => void
  disabled?: boolean
  label?: string
}

export function SectionCompleteButton({
  onComplete,
  disabled = false,
  label = 'Mark Section Complete',
}: SectionCompleteButtonProps) {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onComplete}
        disabled={disabled}
        className="bg-[#5e6ad2] hover:bg-[#828fff] text-white disabled:opacity-50"
      >
        {label}
      </Button>
    </div>
  )
}

// ============================================================================
// Form Field Label
// ============================================================================

interface FormFieldLabelProps {
  children: React.ReactNode
  required?: boolean
}

export function FormFieldLabel({ children, required = false }: FormFieldLabelProps) {
  return (
    <label className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider mb-2 block">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

// ============================================================================
// Select Button Group
// ============================================================================

interface SelectButtonGroupProps<T extends string> {
  options: Array<{ value: T; label: string; className?: string }>
  value: T
  onChange: (value: T) => void
  columns?: number
}

export function SelectButtonGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 3,
}: SelectButtonGroupProps<T>) {
  return (
    <div
      className={cn('grid gap-2', {
        'grid-cols-2': columns === 2,
        'grid-cols-3': columns === 3,
        'grid-cols-4': columns === 4,
      })}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-2 rounded-md text-xs font-medium border transition-colors',
            value === option.value
              ? option.className || 'bg-[#5e6ad2]/10 border-[#5e6ad2] text-[#7170ff]'
              : 'bg-[#111418] border-[#23252a] text-[#8a8f98] hover:bg-[#23252a]'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// Slider Input
// ============================================================================

interface SliderInputProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  label?: string
  formatValue?: (value: number) => string
  colorClass?: string
}

export function SliderInput({
  value,
  min,
  max,
  onChange,
  label,
  formatValue = (v) => `${v}`,
  colorClass = 'text-[#7170ff]',
}: SliderInputProps) {
  return (
    <div>
      {label && <FormFieldLabel>{label}</FormFieldLabel>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-[#5e6ad2]"
      />
      <div className="flex justify-between text-xs text-[#8a8f98] mt-1">
        <span>{min}</span>
        <span className={cn('font-medium', colorClass)}>{formatValue(value)}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
