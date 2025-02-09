import useSWR from 'swr';
import { getTransfersFromMoralisUrl } from "@/common/utils/network/endpoints";
import { fetcher } from '@/common/utils/network/baseFetcher';
import { getChainForMoralis } from '@/common/constants';
import { Serie } from '@nivo/line';
import {
  Get_Transfers_Dto,
  TransferType,
} from './types';

export const getTransfers = async (key: string) => {
  return fetcher(key, {
    arg: {
      method: 'GET',
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY || '',
      },
    },
  })
}

export const useGetTransfers = ({
  tokenAddress,
  poolAddress,
} : {
  tokenAddress: string;
  poolAddress: string;
}) => {
  const url = getTransfersFromMoralisUrl.replace('%tokenAddress%', tokenAddress).replace('%chainId%', getChainForMoralis())
  const result = useSWR<Get_Transfers_Dto>(url, url => getTransfers(
    url,
  ), {
    revalidateOnFocus: false,
  });

  const {
    data,
    mutate,
  } = result;

  if (data?.result?.length) {
    return {
      mutateTransfers: mutate,
      chartData: [{
        id: "buy-chart",
        data: data.result.filter((item) => {
          return item.to_address.toLowerCase() !== (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '').toLowerCase()
        }).map((item) => {
          return {
            x: new Date(item.block_timestamp),
            y: parseFloat(item.value_decimal),
          }
        }).sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()),
      }] as Serie[],
      buyFeed: data.result.filter((result) => result.to_address.toLowerCase() !== poolAddress.toLowerCase()) as Array<TransferType>,
      sellFeed: data.result.filter((result) => result.to_address.toLowerCase() === poolAddress.toLowerCase()) as Array<TransferType>,
    }
  }

  return {
    mutateTransfers: mutate,
    buyFeed: [],
    sellFeed: [],
    chartData: [{
      id: "buy-chart",
      data: [],
    }] as Serie[],
  }
}
