'use client'

import {
  ReactNode,
  useEffect,
} from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { config } from "@/config";
import { 
  arbitrum, sepolia,
} from "viem/chains";
import { isMobileDevice } from "./helpers";

const queryClient = new QueryClient()
const isArbitrum = process.env.NEXT_PUBLIC_CURRENT_CHAIN === "ARBITRUM_MAIN"

export function Providers ({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, []);

  return (
    <PrivyProvider
      appId="cm5e1jvec04vlc6i7cy790b36"
      config={{
        supportedChains: isArbitrum ? [arbitrum] : [sepolia],
        appearance: {
          landingHeader: 'Connect to your Dreams',
          loginMessage: 'Connect using Web2 and Web3 login methods',
          theme: isMobileDevice ? '#0e1111' : '#0e1111',
          showWalletLoginFirst: true,
          walletList: ['wallet_connect', 'rainbow', 'metamask'],
          accentColor: '#7E5EF2',
          logo: 'https://bronze-deep-gazelle-81.mypinata.cloud/ipfs/bafkreic7bpkufqn2q3k6tfnj255dgwfg43jm6cg2ldn4i4mqaep6tqszxa',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: true,
          showWalletUIs: true,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
