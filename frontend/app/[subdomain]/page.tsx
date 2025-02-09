import { headers } from 'next/headers';
import { createClient } from '@/common/utils/supabase/client';
import { TokenDetails } from './tokenDetails';
import { SupabaseTables } from '@/common/constants';
import NotFound from '../not-found';
import { getIdeaTokenCache } from '../actions';
import { IdeaTokenType } from '@/common/types';

export const maxDuration = 20
export const revalidate = 0;

const TokenDetail = async ({ params } : {
  params: {
    subdomain: string;
  }
}) => {
  headers();
  new Date().getTime();
  const supabase = createClient();
  const { data: subdomains } = await supabase.from(SupabaseTables.Subdomains).select('*')
  if (subdomains?.length) {
    const subdomainData = subdomains.find((d) => d.subdomain === params.subdomain)
    if (subdomainData?.address) {
      const idea = await getIdeaTokenCache(subdomainData.address)
      const ideaToken = await idea() as IdeaTokenType
      return (
        <TokenDetails tokenAddress={subdomainData.address} idea={ideaToken} />
      )
    }
  }
  return <NotFound />
};

export default TokenDetail;
