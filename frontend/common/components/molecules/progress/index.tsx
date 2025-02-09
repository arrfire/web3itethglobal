"use client"

import * as React from "react"
import Lottie from "react-lottie";
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/utils/helpers"
import * as piggyData from '@/common/lottie/piggy-animation.json'

const piggyOptions = {
  loop: true,
  autoplay: false,
  animationData: piggyData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({
  className, value, ...props
}, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-8 w-[calc(100%-16px)] ml-2 p-0.5",
      className,
    )}
    {...props}
  >
    <div className="w-full bg-white/5 h-0.5 rounded-full absolute top-1/2 left-0 -translate-y-1/2"></div>
    <div className="h-3 w-3 rounded-full bg-transparent animate-rotatingGradient absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-10 border border-white"></div>
    <div className="h-4 w-4 rounded-full blur-sm bg-gradient-to-r opacity-70 from-tulip to-han-purple
        animate-progressAnimation absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-10" style={{ backgroundSize: '200% 200%' }}></div>
    <div className="h-3 w-3 rounded-full bg-transparent animate-rotatingGradient absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10 border border-white"></div>
    <div className="h-4 w-4 rounded-full blur-sm bg-gradient-to-r opacity-70 from-tulip to-han-purple
        animate-progressAnimation absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10" style={{ backgroundSize: '200% 200%' }}></div>
    <ProgressPrimitive.Indicator
      className="h-0.5 w-full flex-1  transition-all bg-transparent animate-rotatingGradient duration-500 ease-in-out absolute top-1/2 left-0 -translate-y-1/2 flex justify-end rounded-[10px]"
      style={{
        width: `${value}%`,
      }}
    >
      <span className="h-1 w-[calc(100%-12px)] z-[-9999] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-sm bg-gradient-to-r opacity-70 from-tulip to-han-purple
        animate-progressAnimation"  style={{ backgroundSize: '200% 200%' }} />
      {value ? (
        <span className="text-white absolute right-0 translate-x-1/2 -translate-y-8 z-[9999] text-xs font-bold pointer-events-none">
          <Lottie options={piggyOptions}
            style={{ margin: '0' }}
            height={24}
            width={24}
          />
        </span>
      ) : null}
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
