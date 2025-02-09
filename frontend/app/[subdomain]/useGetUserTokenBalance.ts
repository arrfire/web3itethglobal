import useSWR from 'swr';
import { getTokenBalanceMoralisUrl } from "@/common/utils/network/endpoints";
import { fetcher } from '@/common/utils/network/baseFetcher';
import { getChainForMoralis } from '@/common/constants';
import { useAccount } from 'wagmi';
import {
  Get_Token_Balance_Type,
} from './types';

export const getBalance = async (key: string) => {
  return fetcher(key, {
    arg: {
      method: 'GET',
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY || '',
      },
    },
  })
}

function findBalanceByAddress (tokenList: Get_Token_Balance_Type, searchAddress: string) {
  const normalizedSearchAddress = searchAddress.toLowerCase();
    
  const entries = Object.entries(tokenList).filter(([key]) => key !== 'code');
  const ourToken = entries.find((token) => token[1].token_address?.toLowerCase() === normalizedSearchAddress);
  if (ourToken) {
    return (parseInt(ourToken[1].balance) / 10 ** 18).toFixed(0);
  }
  return '0';
}

export const useGetUserTokenBalance = ({
  tokenAddress,
} : {
  tokenAddress: string;
}) => {
  const {
    address,
  } = useAccount()
  const url = getTokenBalanceMoralisUrl.replace('%userAddress%', address ? address : '').replace('%chainId%', getChainForMoralis())
  const result = useSWR<Get_Token_Balance_Type>(address ? url : null, url => getBalance(
    url,
  ), {
    revalidateOnFocus: false,
  });

  const {
    data,
    mutate,
  } = result;

  return {
    mutateTokenBalance: mutate,
    tokenBalance: data && tokenAddress ? findBalanceByAddress(data, tokenAddress) : '0',
  }
}
