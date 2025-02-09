"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/utils/helpers"

const ReviewProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({
  className, value, ...props
}, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-8 w-full p-0.5",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-0.5 w-full flex-1  transition-all bg-transparent animate-rotatingGradient duration-500 ease-in-out absolute top-1/2 left-0 -translate-y-1/2 flex justify-end rounded-[10px]"
      style={{
        width: `${value}%`,
      }}
    >
      <span className="h-1 w-[calc(100%-12px)] z-[-9999] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-sm bg-gradient-to-r opacity-70 from-tulip to-han-purple
        animate-progressAnimation"  style={{ backgroundSize: '200% 200%' }} />
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))
ReviewProgress.displayName = ProgressPrimitive.Root.displayName

export { ReviewProgress }
