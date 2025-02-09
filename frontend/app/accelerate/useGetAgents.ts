import {
  useSearchParams,
} from 'next/navigation';
import { createClient } from "@/common/utils/supabase/client";
import {
  useCallback,
  useEffect, useState,
} from "react";
import { useAccount } from "wagmi";
import { 
  adminAddress, adminAddress2, SupabaseTables,
} from '@/common/constants';
import {
  AgentType,
  TokenType,
} from './types';

export const useGetAgents = ({ setTokenInfo } : { setTokenInfo: (value: TokenType | null) => void}) => {
  const searchParams = useSearchParams()
  const supabase = createClient();

  const {
    address: userAddress,
  } = useAccount();

  const [twitterAgent, setTwitterAgent] = useState<AgentType | null>(null);
  const [isFetchingAgents, setIsFetchingAgents] = useState(false);

  const getAgents = useCallback(async () => {
    const createdIdeaId = searchParams.get('ideaId');
    if (!createdIdeaId || !userAddress) {
      return;
    }
    setIsFetchingAgents(true)
    const { data: ideas } = await supabase
      .from(SupabaseTables.NewIdeas)
      .select("*")
      .eq('id', createdIdeaId);
    if (ideas?.length) {
      setTokenInfo(ideas[0])
      if (userAddress?.toLowerCase() === adminAddress2.toLowerCase() || userAddress?.toLowerCase() === adminAddress.toLowerCase()) {
        const { data: agents } = await supabase
          .from('Agents')
          .select('*')
          .eq('tokenAddress', ideas[0].address);
        setTwitterAgent(agents?.find((agent) => agent.type === 'twitter') || null)
      } else {
        const { data: agents } = await supabase
          .from('Agents')
          .select('*')
          .eq('owner', userAddress)
          .eq('tokenAddress', ideas[0].address);
        setTwitterAgent(agents?.find((agent) => agent.type === 'twitter') || null)
      }
    }
    setIsFetchingAgents(false)
  }, [searchParams, supabase, userAddress, setTokenInfo])

  useEffect(() => {
    getAgents()
  }, [supabase, userAddress, searchParams, getAgents])


  return {
    isFetchingAgents,
    getAgents,
    twitterAgent,
  }
}
