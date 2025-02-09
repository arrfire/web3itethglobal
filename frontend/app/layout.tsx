import {
  ReactNode,
} from "react";
import { Providers } from "@/utils/providers";
import {
  primaryFont,
} from "@/common/utils/localFont";
import { Metadata } from "next";
import './globals.css'

export const metadata: Metadata = {
  title: 'Web3It.AI | Transforming Ideas into Reality in the Blockchain Space',
  description: "A home for ideas to get discovered, funded, and championed by the communities they serve. Time to launch something meaningful.",
  metadataBase: new URL("https://web3it.ai"),
  alternates: {
    canonical: '/',
  },
  keywords: 'crowdfunding blockchain, startup financing, early-stage blockchain, blockchain funding, startup blockchain support, blockchain for startups, blockchain investment platform, early-phase development blockchain, startup crowdfunding solution, blockchain funding innovation, blockchain equity crowdfunding, crypto fundraising, blockchain development funding, startup growth blockchain, blockchain accelerator for startups, innovative funding blockchain, blockchain startup ecosystem, digital currency crowdfunding, blockchain venture capital, blockchain seed funding',
}

export default async function RootLayout ({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${primaryFont.className}`}>
      <body className={`bg-eerie-black`}>
        <div className="pointer-events-none fixed -z-10 inset-0">
          <div
            style={{
              backgroundSize: '109px',
              backgroundImage: 'url(/noise.png)',
            }}
            className="w-full h-full opacity-5 bg-repeat"></div>
        </div>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
