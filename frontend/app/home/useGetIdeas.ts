'use client'
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  IdeaType,
  IdeaTypeWithDomains,
  TokenInfoType,
} from '@/common/types';
import { SubdomainType } from '@/middleware';
import { createClient } from '@/common/utils/supabase/client';
import { SupabaseTables } from '@/common/constants';

export const useGetIdeas = ({ ideaTokens } : { ideaTokens: Array<IdeaType> | []}) => {
  const [subdomains, setSubdomains] = useState<Array<SubdomainType>>([])
  const [tokensInfo, setTokensInfo] = useState<Array<TokenInfoType>>([])
  const supabase = createClient();
 
  useEffect(() => {
    const getSubdomains = async () => {
      const { data: subdomainsData } = await supabase.from(SupabaseTables.Subdomains).select('*')
      if (subdomainsData?.length) {
        setSubdomains(subdomainsData)
      }
    }
    const getTokensInfo = async () => {
      const { data: allTokens } = await supabase.from(SupabaseTables.NewIdeas).select('*')
      if (allTokens?.length) {
        setTokensInfo(allTokens)
      }
    }
    getSubdomains()
    getTokensInfo()
  }, [supabase])
  const ideas = useMemo<IdeaTypeWithDomains>(() => {
    if (ideaTokens && Array.isArray(ideaTokens) && subdomains?.length) {
      return ideaTokens.sort((a, b) => {
        const aFunding = parseFloat(a.fundingRaised)
        const bFunding = parseFloat(b.fundingRaised)
        return (bFunding - aFunding)
      }).map((item) => {
        const subdomain = subdomains.find((d: SubdomainType) => d.address.toLowerCase() === item.tokenAddress.toLowerCase())
        const tokenInfo = tokensInfo.find((d: TokenInfoType) => d.address?.toLowerCase() === item.tokenAddress.toLowerCase())
        return {
          idea: item as IdeaType,
          holdersCount: tokenInfo?.ownersCount || 0,
          subdomain: subdomain?.subdomain || '',
        }
      })
    }
    return []
  }, [ideaTokens, subdomains, tokensInfo])

  
  return {
    ideas,
  }
}
