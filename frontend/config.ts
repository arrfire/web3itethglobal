import { createPublicClient } from 'viem'
import {
  http,
} from 'wagmi'
import { 
  createConfig,
} from '@privy-io/wagmi';
import {
  arbitrum,
  sepolia,
} from 'wagmi/chains'

const isArbitrum = process.env.NEXT_PUBLIC_CURRENT_CHAIN === "ARBITRUM_MAIN"

export const config = createConfig({
  chains: [
    isArbitrum ? arbitrum : sepolia,
  ],
  transports: {
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
})


export const publicClient = createPublicClient({
  chain: isArbitrum ? arbitrum : sepolia,
  transport: isArbitrum ? http() : http(`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_RPC_URL}`),
})
