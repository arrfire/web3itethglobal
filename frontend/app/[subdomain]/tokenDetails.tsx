'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Address } from 'viem';
import {
  ContractFunctions,
  DEFAULT_POOL_ADDRESS,
  SupabaseTables,
} from '@/common/constants';
import {
  useAccount,
  useReadContract,
} from 'wagmi';
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { IdeaTokenType } from '@/common/types';
import { Loader } from '@/common/components/atoms';
import { createClient } from '@/common/utils/supabase/client';
import Link from 'next/link';
import { routes } from '@/common/routes';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import lang from '@/common/lang';
import dynamic from 'next/dynamic';
import { useWindowDimensions } from '@/common/hooks/useWindowDimensions';
import { Tab } from '@/common/components/molecules/tabs';
import { secondaryFont } from '@/common/utils/localFont';
import { Website } from './website';
import { TradeTable } from './tradeTable';
import { useGetTransfers } from './useGetTransfers';
import { useGetOwners } from './useGetOwners';
import { OwnersCard } from './ownersCard';
import { useGetUserTokenBalance } from './useGetUserTokenBalance';
import { OwnersTable } from './ownersTable';
import ideaAbi from '@/utils/abis/ideaFactory.json'

const Toaster = dynamic(() => import('@/common/components/molecules').then(m => m.Toaster), {
  ssr: false,
  loading: () => <Loader />,
});
const ShootingStars = dynamic(() => import('@/common/components/molecules').then(m => m.ShootingStars), {
  ssr: false,
  loading: () => <Loader />,
});
const BuyToken = dynamic(() => import('./buyToken').then(m => m.BuyToken), {
  ssr: false,
  loading: () => <Loader />,
});
const LPSwaps = dynamic(() => import('./lpSwaps').then(m => m.LPSwaps), {
  ssr: false,
  loading: () => <Loader />,
});
const TokenCard = dynamic(() => import('./tokenCard').then(m => m.TokenCard), {
  ssr: false,
  loading: () => <Loader />,
});
const Comments = dynamic(() => import('./comments').then(m => m.Comments), {
  ssr: false,
  loading: () => <Loader />,
});
const Tabs = dynamic(() => import('@/common/components/molecules').then(m => m.Tabs), {
  ssr: false,
  loading: () => <Loader />,
});

const Chart = dynamic(() => import("@/common/components/molecules").then(m => m.Chart), {
  ssr: false,
  loading: () => <Loader />,
});

const { ideaPage: ideaPageCopy } = lang

export const TokenDetails = ({
  tokenAddress,
  idea,
} : {
  tokenAddress: string;
  idea: IdeaTokenType
}) => {
  const [tokenInfoLoading, setTokenInfoLoading] = useState(false);
  const [ideaId, setIdeaId] = useState('');

  const {
    isDesktopView,
  } = useWindowDimensions()

  const {
    address: userAddress,
  } = useAccount();

  const supabase = createClient();
  const router = useRouter()

  useEffect(() => {
    if (idea) {
      if (!idea.active) {
        toast.error("This idea is no longer active. Redirecting to homepage.")
        router.push(routes.homePath)
      }
    }
  }, [idea, router])

  const {
    data: poolAddress,
  } = useReadContract({
    abi: ideaAbi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    functionName: ContractFunctions.tokenToPool,
    args: [tokenAddress],
  });

  const {
    buyFeed,
    sellFeed,
    mutateTransfers,
    chartData,
  } = useGetTransfers({
    tokenAddress,
    poolAddress: `${poolAddress}`,
  })
  const {
    owners,
    mutateOwners,
  } = useGetOwners({
    tokenAddress,
  })

  const {
    mutateTokenBalance,
    tokenBalance,
  } = useGetUserTokenBalance({
    tokenAddress: idea?.tokenAddress || '',
  })

  useEffect(() => {
    const getIdea = async () => {
      const { data } = await supabase.from(SupabaseTables.NewIdeas).select("*").eq('address', idea.tokenAddress.toLowerCase());
      setIdeaId(data?.[0]?.id || '')
    }
    if (idea) {
      getIdea()
    }
  }, [idea, supabase])

  const tabs = useMemo(() => {
    const allTabs = []
    if (idea) {
      allTabs.push(
        {
          title: ideaPageCopy.preview,
          value: "website",
          step: 1,
          content: (
            <div className="">
              <Website idea={idea} />
            </div>
          ),
        })
    }
    if (buyFeed?.length) {
      allTabs.push({
        title: ideaPageCopy.buyFeed,
        value: "buyFeed",
        step: 2,
        content: (
          <div className="">
            <TradeTable transfers={buyFeed} buy={true} />
          </div>
        ),
      })
    }
    if (sellFeed?.length) {
      allTabs.push({
        title: ideaPageCopy.sellFeed,
        value: "sellFeed",
        step: 3,
        content: (
          <div className="">
            <TradeTable transfers={sellFeed} buy={false} />
          </div>
        ),
      })
    }
    if (owners?.length && !isDesktopView) {
      allTabs.push({
        title: ideaPageCopy.owners,
        value: "owners",
        step: 4,
        content: (
          <div className="">
            <OwnersTable owners={owners} />
          </div>
        ),
      })
    }
    if (chartData[0].data?.length > 1 && idea) {
      allTabs.push({
        title: ideaPageCopy.chart,
        step: 5,
        value: "chart",
        content: (
          <div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl md:rounded-3xl">
              <div className='pl-2 md:pl-[38px] mt-2 mb-2'>
                <div className="bg-white rounded-full text-xs md:text-base px-2 py-1/2 font-semibold w-max">
                  <span className={`bg-gradient-to-b from-indigo-500 to-purple-500 text-transparent bg-clip-text ${secondaryFont.className}`}>
                    {idea.symbol}
                  </span>
                </div>
              </div>
              <Chart chartData={chartData} />
            </div>
          </div>

        ),
      })
    }

    return allTabs
  }, [idea, buyFeed, isDesktopView, owners, sellFeed, chartData])

  const handleMutations = (tab: Tab) => {
    if (tab.value === "buyFeed" || tab.value === "sellFeed") {
      mutateTransfers()
    }
    if (tab.value === "owners") {
      mutateOwners()
    }
  }

  return (
    <TooltipProvider>
      <div>
        <div className="hidden md:block pointer-events-none">
          <ShootingStars
            minSpeed={5}
            maxSpeed={10}
          />
        </div>
        {(!idea || tokenInfoLoading) && <Loader />}
        <div className='px-4'>
          <div className="container mx-auto pt-24 lg:pt-32 pb-12">
            {idea?.creatorAddress === userAddress && (
              <div className='text-white border-b border-white/5 mb-5 pb-4 flex justify-end items-center gap-2'>
                <Link
                  href={`${routes.newIdeaPath}?ideaId=${ideaId}`}
                  prefetch={true}
                  className={`flex items-center justify-center text-white rounded-full outline-none
                        transition-all duration-150 ease-in-out px-4 py-2 font-medium  text-xs ring-1 ring-white
                        gap-2 ring-inset hover:bg-white/15`}
                >
                  {ideaPageCopy.editIdea}
                </Link>
                <Link
                  href={`${routes.reviewPlan}?ideaId=${ideaId}`}
                  prefetch={true}
                  className={`flex items-center justify-center text-white rounded-full outline-none
                      transition-all duration-150 ease-in-out px-4 py-2 font-medium  text-xs ring-1 ring-white
                      gap-2 ring-inset hover:bg-white/15`}
                >
                  {ideaPageCopy.boostIdea}
                </Link>
              </div>
            )}

            <div className='flex flex-col xl:flex-row gap-8'>
              <div className="xl:w-9/12 flex flex-col gap-4">
                {idea ? <TokenCard idea={idea} /> : null}
                {!isDesktopView && (
                  <div>
                    {Boolean(poolAddress) && DEFAULT_POOL_ADDRESS !== poolAddress ? (
                      <LPSwaps tokenBalance={tokenBalance} idea={idea} poolAddress={`${poolAddress}`} />
                    ) : (
                      <BuyToken
                        idea={idea}
                        setTokenInfoLoading={setTokenInfoLoading}
                        tokenAddress={tokenAddress}
                        mutateTransfers={mutateTransfers}
                        mutateTokenBalance={mutateTokenBalance}
                        mutateOwners={mutateOwners}
                      />
                    )}
                  </div>
                )}
                {idea ? (
                  <Tabs tabs={tabs} handleMutations={handleMutations} />
                ) : null}
                {idea ? <Comments idea={idea} /> : null}
              </div>
              {isDesktopView && (
                <div className="flex flex-col lg:flex-col gap-8 flex-1">
                  {Boolean(poolAddress) && DEFAULT_POOL_ADDRESS !== poolAddress ? (
                    <LPSwaps tokenBalance={tokenBalance} idea={idea} poolAddress={`${poolAddress}`} />
                  ) : (
                    <BuyToken
                      idea={idea}
                      setTokenInfoLoading={setTokenInfoLoading}
                      tokenAddress={tokenAddress}
                      mutateTransfers={mutateTransfers}
                      mutateOwners={mutateOwners}
                      mutateTokenBalance={mutateTokenBalance}
                    />
                  )}
                  {owners.length ? (
                    <OwnersCard owners={owners} />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
