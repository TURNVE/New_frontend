import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[6px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-body text-[#d0d6e0] ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#f7f8f8] placeholder:text-[#62666d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7170ff] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
