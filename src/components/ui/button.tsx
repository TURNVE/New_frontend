import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-label font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7170ff] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#5e6ad2] text-white hover:bg-[#828fff]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[rgba(255,255,255,0.08)] bg-transparent text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f7f8f8]",
        secondary:
          "bg-[rgba(255,255,255,0.04)] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.06)]",
        ghost: "bg-[rgba(255,255,255,0.02)] border border-[rgb(36,40,44)] text-[#e2e4e7] hover:bg-[rgba(255,255,255,0.04)]",
        link: "text-[#7170ff] underline-offset-4 hover:underline hover:text-[#828fff]",
        pill: "bg-transparent border border-[#23252a] text-[#d0d6e0] rounded-full hover:bg-[rgba(255,255,255,0.02)]",
        icon: "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-full text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.05)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[6px] px-3 text-micro",
        lg: "h-10 rounded-[6px] px-6",
        icon: "h-9 w-9",
        pill: "h-7 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
