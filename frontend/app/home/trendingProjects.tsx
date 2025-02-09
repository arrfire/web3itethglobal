'use client'

import { useState } from 'react';
import { routes } from '@/common/routes';
import Link from 'next/link';
import {
  Loader,
} from '@/common/components/atoms';
import lang from '@/common/lang';
import dynamic from 'next/dynamic';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { IdeaType } from '@/common/types';
import { useGetIdeas } from './useGetIdeas';

const GlobeLottie = dynamic(() => import('./globeLottie').then(m => m.GlobeLottie), {
  ssr: false,
});
const Grid = dynamic(() => import('./grid').then(m => m.Grid), {
  ssr: false,
  loading: () => <Loader />,
});

const { homePage: homePageCopy } = lang

export const TrendingProjects = ({
  ideaTokens,
} : {
  ideaTokens: IdeaType[]
}) => {
  const [enableGlobeAnim, setEnableGlobeAnim] = useState(false)
  const [enableSecondGlobAnim, setEnableSecondGlobAnim] = useState(false)
  const {
    ideas,
  } = useGetIdeas({
    ideaTokens,
  })

  return (
    <TooltipProvider>
      {ideas.length ?
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className='flex justify-between items-start md:items-center mb-2'>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">{homePageCopy.trendingIdeas}</h2>
              <Link
                href={routes.viewProjectsPath}
                prefetch={true}
                className="flex gap-2 text-white hover:md:bg-white/15 hover:md:border-white border border-transparent rounded-2xl md:py-2 md:px-4 items-center font-medium"
                onMouseEnter={() => setEnableGlobeAnim(true)}
                onMouseLeave={() => setEnableGlobeAnim(false)}
              >
                <span className='hidden md:block whitespace-nowrap'>
                  {homePageCopy.dreamGallery}
                </span>
                <GlobeLottie enableGlobeAnim={enableGlobeAnim} />
              </Link>
            </div>
            <div className="">
              <Grid ideas={ideas} />
            </div>
            <div className='flex flex-col items-center justify-center mt-8 md:mt-16'>
              <div className='text-neutral-300 text-sm mb-6 text-center'>You can check all our innovative and exciting dreams here</div>
              <Link
                href={routes.viewProjectsPath}
                prefetch={true}
                onMouseEnter={() => setEnableSecondGlobAnim(true)}
                onMouseLeave={() => setEnableSecondGlobAnim(false)}
                className={`flex items-center justify-center text-white md:w-auto w-full rounded-2xl outline-none px-6 py-2 text-base
                disabled:cursor-not-allowed ease-in-out transition-all gap-2 duration-150 hover:from-han-purple/70
                hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium`}
              >
                {homePageCopy.dreamGallery}
                <GlobeLottie enableGlobeAnim={enableSecondGlobAnim} />
              </Link>
            </div>
          </div>
        </section> : null}
    </TooltipProvider>
  );
};
