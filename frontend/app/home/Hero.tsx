'use client'
import { 
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  ShaderGradient,
  TypewriterEffect,
} from "@/common/components/atoms";
import { heroWords } from "@/common/constants";
import lang from "@/common/lang";
import Link from "next/link";
import { secondaryFont } from "@/common/utils/localFont";
import { routes } from "@/common/routes";
import dynamic from "next/dynamic";

const PiggyLottie = dynamic(() => import('./piggyLottie').then(m => m.PiggyLottie), { 
  ssr: false, 
});
const MagicLottie = dynamic(() => import('./magicLottie').then(m => m.MagicLottie), { 
  ssr: false, 
});

const { homePage: homePageCopy } = lang

export const Hero = () => {
  const [enablePiggyAnim, setEnablePiggyAnim] = useState(false)
  const [enableMagicAnim, setEnableMagicAnim] = useState(false)

  return (
    <div className="pt-24 px-4 max-w-[100vw] relative min-h-screen">
      <ShaderGradient />
      <div className='w-full container mx-auto'>
        <div className="pt-12 sm:pt-48">
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <TypewriterEffect words={heroWords} className={`font-semibold ${secondaryFont.className} text-center sm:text-left text-4xl sm:text-5xl mt-4`} />
          </motion.div>
          <h1 className='sr-only'>
            {homePageCopy.h1}
          </h1>
          <motion.div
            className="max-w-[700px]"
            initial={{
              opacity: 0,
              transform: 'translateY(20px)',
            }}
            animate={{
              opacity: 1,
              transform: 'translateY(0)',
            }}
            transition={{
              delay: 1.5,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <h2 className='text-white/70 mt-4 md:mt-8 w-full text-center sm:text-left'>
              {homePageCopy.subHeading1}
              <br />
              {homePageCopy.subHeading2}
              <br />
              <br />
              {homePageCopy.subHeading3}
            </h2>
          </motion.div>
          <motion.h2
            initial={{
              opacity: 0,
              transform: 'translateY(20px)',
            }}
            animate={{
              opacity: 1,
              transform: 'translateY(0)',
            }}
            transition={{
              delay: 2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className='font-medium mt-8 text-white text-center sm:text-left'>{homePageCopy.subHeading}</motion.h2>
          <div className='mt-24 sm:mt-8'>
            <motion.div
              className="flex gap-4 sm:items-center flex-col sm:flex-row"
              initial={{
                opacity: 0,
                translateY: 20,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{
                delay: 2.5,
                duration: 1,
              }}
            >
              <Link
                href={routes.newIdeaPath}
                prefetch={true}
                onMouseEnter={() => setEnablePiggyAnim(true)}
                onMouseLeave={() => setEnablePiggyAnim(false)}
                className={`flex items-center justify-center text-white rounded-2xl outline-none px-6 py-3 text-base
                disabled:cursor-not-allowed ease-in-out transition-all gap-2 duration-150 hover:from-han-purple/70
                hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium`}
              >
                {homePageCopy.fundButtonLabel}
                <PiggyLottie enablePiggyAnim={enablePiggyAnim} />
              </Link>
              <Link
                href={routes.createProjectPath}
                prefetch={true}
                onMouseEnter={() => setEnableMagicAnim(true)}
                onMouseLeave={() => setEnableMagicAnim(false)}
                className={`flex items-center justify-center text-white rounded-2xl outline-none
                transition-all duration-150 ease-in-out px-6 py-3 font-medium text-base ring-1 ring-white
                gap-2 ring-inset hover:bg-white/15`}
              >
                {homePageCopy.generateButtonLabel}
                <MagicLottie enableMagicAnim={enableMagicAnim} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
