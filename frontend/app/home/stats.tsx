'use client'
import {
  useEffect,
  useMemo,
  useState,
} from "react"
import dynamic from "next/dynamic"
import { AnimatedText } from "@/common/components/atoms"
import { getCurrency } from "@/common/constants"
import lang from "@/common/lang"
import { IdeaType } from "@/common/types"
import { 
  createDevAgentUrl, getAllAgentsUrl,
} from "@/common/utils/network/endpoints"
import toast from "react-hot-toast"

const Toaster = dynamic(() => import('@/common/components/molecules').then(m => m.Toaster), {
  ssr: false,
});

const { homePage: homePageCopy } = lang

export const Stats = ({
  ideaTokens,
} : {
  ideaTokens: IdeaType[]
}) => {
  const [xAgentsCount, setXAgentsCount] = useState(0);
  const [devAgentsCount, setDevAgentsCount] = useState(0);

  const dreamsInfo = useMemo(() => {
    if (ideaTokens?.length) {
      const totalRaised = ideaTokens.reduce((acc, idea) => {
        return acc + parseFloat(idea.fundingRaised)
      }, 0)

      return {
        count: ideaTokens.length,
        totalRaised: totalRaised,
      }
    }
    return {
      count: 0,
      totalRaised: 0,
    }
  }, [ideaTokens])
  useEffect(() => {
    const getAgents = async () => {
      try {
        const devAgentsResponse = await fetch(createDevAgentUrl)
        const devAgentsJson = await devAgentsResponse.json()
        if (devAgentsJson) {
          const uniqueNames = [...new Set(devAgentsJson.data.map((item: any) => item.name))];
          setDevAgentsCount(() => uniqueNames.length)
        }
        const response = await fetch(getAllAgentsUrl)
        const json = await response.json()

        if (json?.agents) {
          setXAgentsCount(json.agents.length)
        }
       
      } catch (error) {
        toast.error("Unable to fetch agents")
      }
    }
    getAgents();
  }, []);
  return (
    <section className="md:py-12 px-4 mb-12">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-3xl font-semibold text-white mb-1 md:mb-2">{homePageCopy.stats.heading}</h2>
        <p className="text-neutral-300 text-sm mb-4 md:mb-8">
          {homePageCopy.stats.description}
        </p>
        <div className="flex gap-2 flex-col lg:flex-row lg:gap-4 w-full">
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-3 lg:p-8 shadow-white shadow-sm">
            <div className="text-xl lg:text-3xl text-neutral-200 font-medium text-center md:text-left"><AnimatedText text={`${dreamsInfo.count} ${dreamsInfo.count > 1 ? "Dreams" : "Dream"}`} /></div>
            <div className="text-xs lg:text-base text-neutral-400 font-medium text-center md:text-left">{homePageCopy.stats.dreamsLaunched}</div>
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-3 lg:p-8 shadow-white shadow-sm">
            <div className="text-xl lg:text-3xl text-neutral-200 font-medium text-center md:text-left"><AnimatedText text={`${dreamsInfo.totalRaised.toFixed(3).replace(/[.,]000$/, "")}  ${getCurrency()}`} /></div>
            <div className="text-xs lg:text-base text-neutral-400 font-medium text-center md:text-left">{homePageCopy.stats.fundsRaised}</div>
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-3 lg:p-8 shadow-white shadow-sm">
            <div className="text-xl lg:text-3xl text-neutral-200 font-medium text-center md:text-left"><AnimatedText text={`${xAgentsCount} ${xAgentsCount > 1 ? "X Agents" : "X Agent"}`} /></div>
            <div className="text-xs lg:text-base text-neutral-400 font-medium text-center md:text-left">{homePageCopy.stats.activeAgents}</div>
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-3 lg:p-8 shadow-white shadow-sm">
            <div className="text-xl lg:text-3xl text-neutral-200 font-medium text-center md:text-left"><AnimatedText text={`${devAgentsCount} ${devAgentsCount > 1 ? "Dev Agents" : "Dev Agent"}`} /></div>
            <div className="text-xs lg:text-base text-neutral-400 font-medium text-center md:text-left">{homePageCopy.stats.activeAgents}</div>
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  )
}
