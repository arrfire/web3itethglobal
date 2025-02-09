'use client'

import { 
  useCallback,
  useEffect, useState,
} from "react";
import { TokenXIcon } from "@/common/components/icons"
import lang from "@/common/lang";
import { 
  AIBot, Loader,
} from "@/common/components/atoms";
import dynamic from "next/dynamic";
import relativeTime from "dayjs/plugin/relativeTime"
import { createClient } from "@/common/utils/supabase/client";
import Link from "next/link";
import { routes } from "@/common/routes";
import { ChevronLeft } from "lucide-react";
import dayjs from 'dayjs';
import { 
  useSearchParams,
} from "next/navigation";
import { SupabaseTables } from "@/common/constants";
import { useGetAgents } from "./useGetAgents";
import { 
  SandboxType, TokenType,
} from "./types";

dayjs.extend(relativeTime)

const Toaster = dynamic(() => import('@/common/components/molecules').then(m => m.Toaster), { 
  ssr: false, 
  loading: () => <Loader />,
});
const AccordionTrigger = dynamic(() => import('@/common/components/molecules').then(m => m.AccordionTrigger), { 
  ssr: false, 
  loading: () => <Loader />,
});
const AccordionContent = dynamic(() => import('@/common/components/molecules').then(m => m.AccordionContent), { 
  ssr: false, 
  loading: () => <Loader />,
});
const Accordion = dynamic(() => import('@/common/components/molecules').then(m => m.Accordion), { 
  ssr: false, 
  loading: () => <Loader />,
});
const AccordionItem = dynamic(() => import('@/common/components/molecules').then(m => m.AccordionItem), { 
  ssr: false, 
  loading: () => <Loader />,
});
const TwitterAgent = dynamic(() => import('./(twitter)/twitterAgent').then(m => m.TwitterAgent), { 
  ssr: false, 
  loading: () => <Loader />,
});
const DevAgent = dynamic(() => import('./(sandbox)/devAgent').then(m => m.DevAgent), { 
  ssr: false, 
  loading: () => <Loader />,
});

const { manageIdea: manageIdeaCopy } = lang

export const Agents = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenType | null>(null);
  const [sandboxState, setSandboxState] = useState<SandboxType | null>(null);
  const [subdomain, setSubdomain] = useState('');
  const searchParams = useSearchParams()
  const createdIdeaId = searchParams.get('ideaId');
  const supabase = createClient();

  const {
    twitterAgent,
    getAgents,
    isFetchingAgents,
  } = useGetAgents({
    setTokenInfo,
  })

  const getSandboxes = useCallback(async () => {
    const { data: sandboxes } = await supabase
      .from(SupabaseTables.Sandboxes)
      .select("*")
      .eq('id', createdIdeaId);
    setSandboxState(sandboxes?.[0])
    if (tokenInfo?.address) {
      const { data: subdomains } = await supabase
        .from(SupabaseTables.Subdomains)
        .select("*")
        .eq('address', tokenInfo?.address);
      setSubdomain(subdomains?.[0].subdomain)
    }
  }, [createdIdeaId, supabase, tokenInfo])

  useEffect(() => {
    getSandboxes()
  }, [createdIdeaId, supabase, getSandboxes])
  
  const agents = [
    {
      id: 1,
      name: 'Twitter Agent',
      description: manageIdeaCopy.twitterDescription,
    },
  ]

  return (
    <div className="text-white w-full md:max-w-5xl mt-10 px-4 md:px-0">
      <Accordion type="single" collapsible className="w-full">
        {agents.map((agent) => (
          <AccordionItem key={agent.id} value={`item-${agent.id}`}>
            <AccordionTrigger>
              <div className="flex justify-between gap-2 items-center flex-1 pr-2 py-1">
                <span className="flex items-center gap-4 text-sm md:text-base font-semibold"><TokenXIcon width={18} height={18} /> {agent.name} </span> 
                {twitterAgent?.status === "started" ? (
                  <span className="text-neutral-400 text-sm flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-green-700 animate-pulse"></span>
                    <span className="hidden md:inline">{manageIdeaCopy.twitterForm.agentRunning} {dayjs().from(dayjs(twitterAgent.created_at), true)}</span>
                  </span> 
                ) : null}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {(!twitterAgent || twitterAgent?.status === "stopped") && (
                <div>{agent.description}</div>
              )}
              <TwitterAgent 
                getAgents={getAgents}
                isFetchingAgents={isFetchingAgents}
                tokenInfo={tokenInfo}
                twitterAgent={twitterAgent}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
        <AccordionItem value={`item-dev`}>
          <AccordionTrigger>
            <div className="flex justify-between gap-2 items-center flex-1 pr-2">
              <span className="flex items-center gap-2 text-sm md:text-base font-semibold -ml-1.5"><AIBot /> {manageIdeaCopy.devAgent}</span> 
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <DevAgent 
              sandboxState={sandboxState} 
              tokenInfo={tokenInfo}
              getSandboxes={getSandboxes}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-end mt-8">
        <Link
          href={routes.projectDetailPath.replace('%subdomain%', subdomain)}
          prefetch={true}
          className={`flex items-center justify-center text-white rounded-2xl outline-none
          transition-all duration-150 ease-in-out px-4 py-3 font-medium text-base ring-1 ring-white
          gap-1 ring-inset hover:bg-white/15`}
        >
          <ChevronLeft width={18} height={18} />
          {manageIdeaCopy.back}
        </Link>
      </div>
      <Toaster />
    </div>
  )
}