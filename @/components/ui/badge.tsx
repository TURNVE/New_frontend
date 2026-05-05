import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:ring-offset-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#5e6ad2] text-white rounded-[2px] px-2 py-0.5 text-micro",
        secondary:
          "bg-[rgba(255,255,255,0.04)] text-[#d0d6e0] rounded-[2px] px-2 py-0.5 text-micro",
        success:
          "bg-[#10b981] text-[#f7f8f8] rounded-full px-2 py-0.5 text-micro",
        outline:
          "bg-transparent border border-[#23252a] text-[#d0d6e0] rounded-full px-2.5 py-0.5 text-label",
        subtle:
          "bg-[rgba(255,255,255,0.05)] text-[#f7f8f8] border border-[rgba(255,255,255,0.05)] rounded-[2px] px-2 py-0.5 text-micro",
        ghost:
          "bg-transparent text-[#8a8f98] hover:text-[#d0d6e0] text-label",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
