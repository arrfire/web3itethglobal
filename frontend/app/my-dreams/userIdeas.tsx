'use client'

import {
  useEffect,
  useState,
} from "react"
import {
  Loader,
} from "@/common/components/atoms"
import { motion } from "framer-motion";
import lang from "@/common/lang"
import { routes } from "@/common/routes"
import Link from "next/link"
import {
  useAccount,
} from 'wagmi'
import { SubdomainType } from "@/middleware"
import dynamic from "next/dynamic";
import { createClient } from '@/common/utils/supabase/client';
import {
  adminAddress, adminAddress2, SupabaseTables,
} from "@/common/constants";
import { usePrivy } from "@privy-io/react-auth";
import { IdeasTable } from "./ideasTable"
import { useHandleStartAll } from "./useHandleStartAll";
import { UserIdea } from "./types"

const PiggyLottie = dynamic(() => import('../home/piggyLottie').then(m => m.PiggyLottie), {
  ssr: false,
});
const StarsLottie = dynamic(() => import('./starsLottie').then(m => m.StarsLottie), {
  ssr: false,
});
const MagicLottie = dynamic(() => import('../home/magicLottie').then(m => m.MagicLottie), {
  ssr: false,
});

const { profile: profileCopy } = lang

export const UserIdeas = () => {
  const [enablePiggyAnim, setEnablePiggyAnim] = useState(false)
  const [enableDocAnim, setEnableDocAnim] = useState(false)
  const [userIdeas, setUserIdeas] = useState<UserIdea[] | []>([])
  const [isLoading, setIsLoading] = useState(false)
  const [subdomains, setSubdomains] = useState<Array<SubdomainType>>([])

  const supabase = createClient();

  const {
    address,
  } = useAccount();

  const {
    authenticated,
  } = usePrivy()

  useEffect(() => {
    const getSubdomains = async () => {
      const { data: subdomainsData } = await supabase.from(SupabaseTables.Subdomains).select('*')
      if (subdomainsData?.length) {
        setSubdomains(subdomainsData)
      }
    }
    getSubdomains()
  }, [supabase])

  useEffect(() => {
    const getUserIdeas = async () => {
      setIsLoading(true)
      if (address?.toLowerCase() === adminAddress2.toLowerCase() || address?.toLowerCase() === adminAddress.toLowerCase()) {
        const { data: subdomains } = await supabase
          .from(SupabaseTables.NewIdeas)
          .select('*')

        if (subdomains?.length) {
          setUserIdeas(subdomains)
        }
      } else {
        const { data: subdomains } = await supabase
          .from(SupabaseTables.NewIdeas)
          .select('*')
          .eq('creator', address)

        if (subdomains?.length) {
          setUserIdeas(subdomains)
        }
      }
     
      setIsLoading(false)
    }
    if (authenticated) {
      getUserIdeas()
    }
  }, [address, supabase, authenticated])

  const {
    handleStartAll,
  } = useHandleStartAll()

  return (
    <div className="pt-20 md:pt-32 pb-8">
      <div className="container mx-auto relative">
        <div className="flex justify-end px-3">
          {(address && address.toLowerCase() === adminAddress.toLowerCase()) ? (
            <button
              type="button"
              onClick={handleStartAll}
              className={`flex items-center justify-center text-white rounded-full outline-none text-xs
              transition-all duration-150 ease-in-out px-4 py-2 font-medium ring-1 ring-white
              gap-2 ring-inset hover:bg-white/15`}
            >
              {profileCopy.startAllAgents}
            </button>
          ) : null}
        </div>
        <div className="px-4">
          {userIdeas.length ? (
            <>
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
                }} className="text-2xl md:text-3xl font-semibold mb-2 text-center text-white">{profileCopy.heading}</motion.h2>
              <motion.h1 initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1,
              }}  className="text-center text-neutral-200 text-sm pb-4">
                {profileCopy.subheading}
              </motion.h1>
            </>
          ) : null}
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="px-4 md:px-0 w-full">
            {userIdeas.length ? (
              <IdeasTable userIdeas={userIdeas} subdomains={subdomains} />
            ) : (
              <div className="flex justify-center items-center md:mt-16 mb-16 flex-col">
                <div className="pointer-events-none">
                  <StarsLottie />
                </div>
                <div className="text-xl md:text-2xl font-semibold text-white text-center">{profileCopy.noIdeasHeading}</div>
                <div className="text-neutral-200 text-sm  mt-2 mb-6 text-center">{profileCopy.noIdeasSubHeading}</div>
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
                    {profileCopy.registerIdea}
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
                    {profileCopy.launchNew}
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
}
