'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Loader, 
  Tooltip,
  TooltipContent, 
  TooltipTrigger,
} from '@/common/components/atoms';
import {
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import lang from "@/common/lang";
import Link from "next/link";
import { routes } from "@/common/routes";
import Carousel  from "@/common/components/molecules/carousel";
import { IdeaType } from "@/common/types";
import { useGetIdeas } from "./useGetIdeas";
import dynamic from "next/dynamic";

const Grid = dynamic(() => import('./grid').then(m => m.Grid), { 
  ssr: false, 
  loading: () => <Loader />,
});
const TokenListItem = dynamic(() => import('@/common/components/molecules').then(m => m.TokenListItem), { 
  ssr: false, 
  loading: () => <Loader />,
});
const PiggyLottie = dynamic(() => import('../home/piggyLottie').then(m => m.PiggyLottie), { 
  ssr: false, 
});
const StarsLottie = dynamic(() => import('../my-dreams/starsLottie').then(m => m.StarsLottie), { 
  ssr: false, 
});
const MagicLottie = dynamic(() => import('../home/magicLottie').then(m => m.MagicLottie), { 
  ssr: false, 
});

const { ideas: ideasCopy } = lang

export const Ideas = ({
  ideaTokens,
} : {
  ideaTokens: IdeaType[]
}) => {
  const [isListView, setIsListView] = useState(true)
  const [enablePiggyAnim, setEnablePiggyAnim] = useState(false)
  const [enableDocAnim, setEnableDocAnim] = useState(false)

  const {
    ideas,
    isLoading,
    categories,
    currentCategory,
    handleCategoryChange,
  } = useGetIdeas({
    ideaTokens,
  })

  const carouselItems = categories.map((c) => {
    return (
      <button
        onClick={() => handleCategoryChange(c)}
        key={c.id}
        type="button"
        className={`${c.active ? "bg-white shadow-sm  shadow-violets-are-blue" : ""} capitalize hover:bg-white rounded-full transition-all duration-200 ease-in-out px-4 py-1 font-semibold`}
      >
        <span className="bg-gradient-to-t from-indigo-500 to-purple-500 whitespace-nowrap text-transparent bg-clip-text">
          {c.value}
        </span>
      </button>
    )
  })

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-8">
      <div className='container mx-auto flex items-center flex-col w-full relative'>
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
            delay: 0.5,
          }}
          className="text-2xl md:text-3xl font-semibold mb-2 text-center text-white">{ideasCopy.currentIdeas}</motion.h2>
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
            delay: 1,
          }} className="text-center text-neutral-200 text-sm pb-4 max-w-[200px] md:max-w-max">
          {ideasCopy.currentIdeasSubHeading}
        </motion.h1>
        <div className="absolute top-6 right-4">
          <Tooltip delayDuration={200}>
            <TooltipTrigger 
              type="button" 
              onClick={() => setIsListView(!isListView)} 
              className="flex items-center justify-center text-white rounded-full outline-none gap-2 !p-2 hover:bg-white/15 transition-all duration-150 hover:!scale-[1.04] ease-in-out"
            >
              {isListView ? (
                <LayoutList />
              ) : (
                <LayoutGrid />
              )}
            </TooltipTrigger>
            <TooltipContent className="isolate bg-white/15 shadow-lg border-0 outline-none rounded-lg">
              <p className="text-xs text-white">{isListView ? "Detailed view" : "Compact view"}</p>
            </TooltipContent>
          </Tooltip>
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
          delay: 1,
        }} className="w-[calc(100%-32px)] mx-auto md:w-full h-px bg-white/10 mb-6"></motion.div>
        <motion.div initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }} 
        transition={{
          delay: 1.3,
        }} className="w-[calc(100%-32px)] mx-auto md:w-full mb-6 flex justify-center">
          <Carousel items={carouselItems} />
        </motion.div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="px-4 md:px-0 w-full">
            {ideas.length ? (
              isListView ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {ideas.map((idea, index) => (
                    <TokenListItem key={index} data={idea} />
                  ))}
                </div>
              ) : (
                <Grid 
                  ideas={ideas}
                  key={currentCategory}
                />
              )
            ) : (
              <div className="flex justify-center items-center md:mt-16 mb-16 flex-col">
                <div className="pointer-events-none">
                  <StarsLottie />
                </div>
                <div className="text-xl md:text-2xl font-semibold text-white text-center">{ideasCopy.noIdeasHeading}</div>
                <div className="text-neutral-200 text-sm  mt-2 mb-6 text-center">{ideasCopy.noIdeasSubHeading}</div>
                <div className="flex gap-4 md:flex-row flex-col">
                  <Link
                    href={routes.newIdeaPath}
                    prefetch={true}
                    onMouseEnter={() => setEnablePiggyAnim(true)}
                    onMouseLeave={() => setEnablePiggyAnim(false)}
                    className={`flex items-center justify-center text-white rounded-2xl outline-none px-6 py-3 text-base
                    disabled:cursor-not-allowed ease-in-out transition-all gap-2 duration-150 hover:from-han-purple/70
                    hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium`}
                  >
                    {ideasCopy.registerIdea}
                    <PiggyLottie enablePiggyAnim={enablePiggyAnim} />
                  </Link>
                  <Link
                    href={routes.createProjectPath}
                    prefetch={true}
                    onMouseEnter={() => setEnableDocAnim(true)}
                    onMouseLeave={() => setEnableDocAnim(false)}
                    className={`flex items-center justify-center text-white rounded-2xl outline-none
                    transition-all duration-150 ease-in-out px-6 py-3 font-medium text-base ring-1 ring-white
                    gap-2 ring-inset hover:bg-white/15`}
                  >
                    {ideasCopy.launchNew}
                    <MagicLottie enableMagicAnim={enableDocAnim} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
};