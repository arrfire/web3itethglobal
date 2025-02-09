'use client'
import {
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";
import { motion } from "framer-motion";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ClaudeAIIcon } from "@/common/components/icons";
import lang from "@/common/lang";
import { Loader } from "@/common/components/atoms";
import dynamic from "next/dynamic";
import { useGreeting } from "./useGreeting";
import { useGenerateIdea } from "./useGenerateIdea";

const ShootingStars = dynamic(() => import('@/common/components/molecules').then(m => m.ShootingStars), { 
  ssr: false, 
  loading: () => <Loader />,
});
const Toaster = dynamic(() => import('@/common/components/molecules').then(m => m.Toaster), { 
  ssr: false, 
  loading: () => <Loader />,
});
const Prompt = dynamic(() => import('./Prompt').then(m => m.Prompt), { 
  ssr: false, 
  loading: () => <Loader />,
});

const { generateIdea: {
  greeting: greetingCopy,
  whatsYourDream: whatsYourDreamCopy,
  poweredBy: poweredByCopy,
  readyTo: readyToCopy,
  h1: h1Copy,
} } = lang


export const ClientWrapper = () => {
  const {
    greeting,
  } = useGreeting()

  const {
    handleTokenCreation,
    isIdeaProcessing,
  } = useGenerateIdea()

  const getIcon = () => {
    if (greeting === greetingCopy.morning) {
      return <Sunrise strokeWidth={1.5} />
    } else if (greeting === greetingCopy.afternoon) {
      return <Sun strokeWidth={1.5} />
    } else {
      return <Sunset strokeWidth={1.5} />
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <div className="hidden md:block pointer-events-none">
          <ShootingStars />
        </div>
        <h1 className='sr-only'>
          {h1Copy}
        </h1>
        <div className="text-white absolute bottom-2 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 flex gap-1 items-center font-medium text-xs md:text-sm">{poweredByCopy} <ClaudeAIIcon /></div>
        <div className={`pt-72 delay-300 transition-all ease-in-out duration-300 pb-12 px-4`}>
          <div className="container mx-auto flex justify-center flex-col items-center">
            <motion.div
              initial={{
                opacity: 0,
                translateY: 20,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <h2 className="hidden text-white font-medium text-2xl md:flex items-center gap-2">
                {getIcon()}
                {greeting}
              </h2>
              <h2 className="flex text-white font-medium text-2xl md:hidden items-center gap-2">
                {whatsYourDreamCopy}
              </h2>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                translateY: 20,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <h2 className="text-neutral-500 font-medium text-sm md:text-base text-center mt-2">
                {readyToCopy}
              </h2>
            </motion.div>
            <Prompt
              handleTokenCreation={handleTokenCreation}
              isIdeaProcessing={isIdeaProcessing}
            />
          </div>
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
