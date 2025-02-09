import useSWR from 'swr';
import { getOwnersFromMoralisUrl } from "@/common/utils/network/endpoints";
import { fetcher } from '@/common/utils/network/baseFetcher';
import { createClient } from '@/common/utils/supabase/client';
import { useEffect } from 'react';
import {
  getChainForMoralis, SupabaseTables,
} from '@/common/constants';
import {
  Get_Owners_Dto,
  OwnerType,
} from './types';

export const getOwners = async (key: string) => {
  return fetcher(key, {
    arg: {
      method: 'GET',
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY || '',
      },
    },
  })
}

export const useGetOwners = ({ tokenAddress } : { tokenAddress: string }) => {
  const supabase = createClient();
  const url = getOwnersFromMoralisUrl.replace('%tokenAddress%', tokenAddress).replace('%chainId%', getChainForMoralis())
  const result = useSWR<Get_Owners_Dto>(url, url => getOwners(
    url,
  ), {
    revalidateOnFocus: false,
  });

  const {
    data,
    mutate,
  } = result;

  useEffect(() => {
    const updateOwnersCount = async () => {
      if (data?.result?.length) {
        const { error: dbError } = await supabase
          .from(SupabaseTables.NewIdeas)
          .update({
            ownersCount: data.result.length,
          })
          .eq('address', tokenAddress)
          .select()

        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`);
        }
      }
    }
    updateOwnersCount()
  }, [data, supabase, tokenAddress])

  if (data?.result?.length) {
    return {
      mutateOwners: mutate,
      owners: data.result.map((o) => {
        const percentage = (parseInt(o.balance) / (parseInt(process.env.NEXT_PUBLIC_MAX_SUPPLY || '0') * 1e18)) * 100
        return {
          ...o,
          stake: percentage,
        }
      }) as Array<OwnerType>,
    }
  }
  return {
    mutateOwners: mutate,
    owners: [],
  }
}
