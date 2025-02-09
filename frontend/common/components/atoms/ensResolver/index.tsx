import { mainnet } from 'wagmi/chains'
import { 
  createConfig, http, useEnsName,
} from 'wagmi';
import { formatAddress } from '@/utils/helpers';
import { Address } from 'viem';
  
export function EnsResolver ({ 
  address,
  defaultStyle = true,
} : {
  address: string;
  defaultStyle?: boolean;
}) {

  const config = createConfig({
    chains: [
      mainnet,
    ],
    transports: {
      [mainnet.id]: http(),
    },
  })
  const viemAddress = address as Address
  const { 
    data: ensName, isError, isLoading,
  } = useEnsName({
    address: viemAddress,
    config: config,
    chainId: mainnet.id,
  })
  if (isLoading || !ensName || isError) {
    if (defaultStyle) {
      return <span>{address.slice(2, 7)}</span>
    }
    return <span>{formatAddress(address)}</span>
  }
  return <span>{ensName}</span>
}
