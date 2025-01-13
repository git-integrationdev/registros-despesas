import { cn } from "@/lib/utils"
import React from "react"

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "pink" | "green" | "purple" | "cyan"
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = "blue", ...props }, ref) => {
    const variantStyles = {
      blue: "bg-[#D3E4FD] text-[#3B82F6]",
      pink: "bg-[#FFDEE2] text-[#EC4899]",
      green: "bg-[#F2FCE2] text-[#22C55E]",
      purple: "bg-[#E5DEFF] text-[#8B5CF6]",
      cyan: "bg-[#D3F7FC] text-[#06B6D4]",
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Tag.displayName = "Tag"

export { Tag }