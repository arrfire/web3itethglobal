import { ReactNode } from "react";
import {
  Footer, 
  Header,
} from "@/common/components/organisms";
import { createClient } from '@/common/utils/supabase/client';
import { Metadata } from "next";
import { readContract } from '@wagmi/core'
import { SupabaseTables } from "@/common/constants";
import { config } from '@/config';
import { Address } from 'viem';
import { ContractFunctions } from '@/common/constants';
import { IdeaType } from '@/common/types';
import ideaAbi from '@/utils/abis/ideaFactory.json'

export const dynamic = 'force-dynamic'
export async function generateMetadata ({ params } : {
  params: {
    subdomain: string;
  }
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: subdomains } = await supabase.from(SupabaseTables.Subdomains).select('*')
  if (subdomains?.length) {
    const subdomainData = subdomains.find((d) => d.subdomain === params.subdomain)
    if (subdomainData?.address) {
      const ideaToken = await readContract(config, {
        abi: ideaAbi,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
        functionName: ContractFunctions.getIdea,
        args: [subdomainData.address],
      });
      const idea = ideaToken as IdeaType
      const canonicalUrl = `https://${subdomainData.subdomain}.web3it.ai`
      return {
        metadataBase: new URL(`https://${subdomainData.subdomain}.web3it.ai`),
        title: `${idea.name} | Web3It.AI`,
        description: `${idea.description}`,
        alternates: {
          canonical: canonicalUrl,
        },
        openGraph: {
          title: `${idea.name} | Web3It.AI`,
          description: `${idea.description}`,
          url: `https://${subdomainData.subdomain}.web3it.ai`,
          siteName: 'Web3It.AI',
          images: [
            {
              url: idea.tokenImageUrl,
              width: 1200,
              height: 630,
              alt: idea.name,
            },
          ],
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${idea.name}`,
          description: `${idea.description}`,
          images: [idea.tokenImageUrl],
        },
      }
    }
  }
  return {}
}

export async function generateStaticParams () {
  const supabase = createClient();
  const { data: subdomains } = await supabase.from(SupabaseTables.Subdomains).select('subdomain')
  if (subdomains?.length) {
    return subdomains.map((subdomain) => ({
      subdomain: subdomain.subdomain,
    }))
  }
  return []
}

export default function Layout ({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
