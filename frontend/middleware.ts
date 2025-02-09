import { 
  NextRequest, NextResponse,
} from "next/server";
import { createClient } from '@/common/utils/supabase/client';
import { SupabaseTables } from "./common/constants";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|images|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export type SubdomainType = {
  address: string;
  subdomain: string;
}

export default async function middleware (req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const hostname = req.headers.get("host");

  let response: NextResponse;

  let currentHost;
  const baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  if (process.env.NODE_ENV === "production") {
    currentHost = hostname?.replace(`.${baseDomain}`, "");
  } else {
    currentHost = hostname?.split(":")[0].replace(".localhost", "");
  }
  if (!currentHost) {
    response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'index,follow');
    return response;
  }

  const supabase = createClient();

  const { data: subdomains } = await supabase.from(SupabaseTables.Subdomains).select('*')
  if (subdomains?.length) {
    const subdomainData = subdomains.find((d: SubdomainType) => d.subdomain.toLowerCase() === currentHost);
    if (subdomainData) {
      response = NextResponse.rewrite(new URL(`/${subdomainData.subdomain}${pathname}`, req.url));
      response.headers.set('X-Robots-Tag', 'index,follow');
      return response;
    }
  }

  if (pathname === "/" && (currentHost === baseDomain)) {
    response = NextResponse.rewrite(new URL(`/home`, req.url));
    response.headers.set('X-Robots-Tag', 'index,follow');
    return response;
  }
  response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'index,follow');
  return response;
};