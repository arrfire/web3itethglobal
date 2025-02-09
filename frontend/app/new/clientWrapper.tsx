'use client'

import { 
  useMemo, 
  useState,
} from 'react';
import lang from '@/common/lang';
import { motion } from "framer-motion";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import dynamic from 'next/dynamic';
import { Footer } from '@/common/components/organisms';
import { Loader } from '@/common/components/atoms';

const ShootingStars = dynamic(() => import('@/common/components/molecules').then(m => m.ShootingStars), { 
  ssr: false, 
});
const Toaster = dynamic(() => import('@/common/components/molecules').then(m => m.Toaster), { 
  ssr: false, 
  loading: () => <Loader />,
});
const CreateToken = dynamic(() => import('./createToken').then(m => m.CreateToken), { 
  ssr: false, 
  loading: () => <Loader />,
});

const { createIdea: createIdeaCopy } = lang

const ClientWrapper = () => {
  const [ideaStatusCreated, setIdeaStatusCreated] = useState(false)
  const [isFundingReached, setIsFundingReached] = useState(false)

  const getHeading = useMemo(() => {
    if (isFundingReached) {
      return createIdeaCopy.subHeadingFundingReached
    }
    if (ideaStatusCreated) {
      return createIdeaCopy.subHeadingCreated
    }
    return createIdeaCopy.subHeading
  }, [ideaStatusCreated, isFundingReached])
  const getSubHeading = useMemo(() => {
    if (isFundingReached) {
      return createIdeaCopy.subHeading2FundingReached
    }
    return createIdeaCopy.subHeading2
  }, [isFundingReached])
  return (
    <TooltipProvider>
      <div className="min-h-screen pt-20 md:pt-32 relative overflow-hidden">
        <div className="hidden md:block pointer-events-none">
          <ShootingStars />
        </div>
        <div className='container mx-auto flex flex-col px-4 mb-10'>
          <div className='flex-1 flex flex-col'>
            <motion.h1
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }} 
              transition={{
                delay: 0.5,
              }} className="font-semibold text-center text-neutral-200 w-full text-2xl md:text-3xl pb-2 md:pb-4">
              {getHeading}
            </motion.h1>
            <motion.h2
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }} 
              transition={{
                delay: 1,
              }} className="text-xs md:text-sm text-center text-neutral-200 w-full md:mb-6">
              {getSubHeading}
            </motion.h2>
          </div>
          <motion.div initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }} 
          transition={{
            delay: 1.2,
          }} className='flex w-full flex-1 flex-col items-center'>
            <CreateToken
              setIdeaStatusCreated={setIdeaStatusCreated}
              ideaStatusCreated={ideaStatusCreated}
              isFundingReached={isFundingReached}
              setIsFundingReached={setIsFundingReached}
            />
          </motion.div>
        </div>
        <Footer />
        <Toaster />
      </div>
    </TooltipProvider>
  )
};

export default ClientWrapper
