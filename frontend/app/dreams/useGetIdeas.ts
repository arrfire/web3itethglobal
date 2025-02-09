import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  IdeaType,
  IdeaTypeWithDomains,
  TokenInfoType,
} from '@/common/types';
import { createClient } from "@/common/utils/supabase/client";
import { SubdomainType } from "@/middleware";
import { SupabaseTables } from "@/common/constants";
import { useGetCategories } from "./useGetCategories";
import { CategoryType } from "./types";

export const useGetIdeas = ({ ideaTokens } : { ideaTokens: Array<IdeaType> | []}) => {
  const [subdomains, setSubdomains] = useState<Array<SubdomainType>>([])
  const [tokensInfo, setTokensInfo] = useState<Array<TokenInfoType>>([])
  const supabase = createClient();

  const {
    categories,
    setCategories,
    isCategoriesLoading,
    currentCategory,
    setCurrentCategory,
  } = useGetCategories()

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
    if (ideaTokens && Array.isArray(ideaTokens) && ideaTokens.length && subdomains?.length) {
      return ideaTokens.toReversed().map((item) => {
        const subdomain = subdomains.find((d: SubdomainType) => d.address.toLowerCase() === item.tokenAddress.toLowerCase())
        const tokenInfo = tokensInfo.find((d: TokenInfoType) => d.address?.toLowerCase() === item.tokenAddress.toLowerCase())
        return {
          idea: item as IdeaType,
          subdomain: subdomain?.subdomain || '',
          holdersCount: tokenInfo?.ownersCount || 0,
        }
      }).filter((item) =>
        item.idea.categories.includes(currentCategory) || currentCategory === 'All',
      )
    }
    return []
  }, [ideaTokens, subdomains, currentCategory, tokensInfo])

  const handleCategoryChange = (c: CategoryType) => {
    setCurrentCategory(c.value)
    setCategories(categories.map((category) => {
      if (category.id === c.id) {
        return {
          ...category,
          active: true,
        }
      }
      return {
        ...category,
        active: false,
      }
    }))
  }

  return {
    categories,
    setCategories,
    isLoading: isCategoriesLoading,
    ideas,
    currentCategory,
    handleCategoryChange,
  }
}
