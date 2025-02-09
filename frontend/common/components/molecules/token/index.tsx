import {
  useMemo,
  useState,
} from "react";
import {
  cn,
  getAverageColor,
} from "@/utils/helpers";
import Image from "next/image";
import lang from '@/common/lang';
import { motion } from "framer-motion";
import { routes } from '@/common/routes';
import Link from "next/link";
import { IdeaTypeWithDomain } from "@/common/types";
import { secondaryFont } from "@/common/utils/localFont";
import { getCurrency } from "@/common/constants";
import { 
  ExternalLink, User2,
} from "lucide-react";
import { 
  AnimatedText,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../atoms";
const {
  ideas: {
    ideaCard: ideaCardCopy,
  },
} = lang

export const Token = ({
  data,
}: {
  data: IdeaTypeWithDomain;
}) => {
  const [primaryColor, setPrimaryColor] = useState('#7E5EF2')
  const [isHovered, setIsHovered] = useState(false)
  const [isColorLoading, setIsColorLoading] = useState(true)

  const {
    idea,
    subdomain,
    holdersCount,
  } = data

  const fundingRaised = idea ? parseFloat(idea.fundingRaised) : 0;

  const tokenLink = useMemo(() => {
    return routes.projectDetailPath.replace('%subdomain%', subdomain)
  }, [subdomain])
  const targetFunding = parseFloat(process.env.NEXT_PUBLIC_TARGET_ETH || '0')
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }} 
      transition={{
        delay: 0.5,
      }}
    >
      <Link
        href={tokenLink}
        prefetch={true}
        style={{
          background: isHovered ? `${primaryColor}D9` : primaryColor,
        }}
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          isColorLoading && "opacity-0",
          "rounded-3xl group border border-eerie-black/25 h-auto w-full relative shadow-md hover:-translate-y-1 delay-75 overflow-hidden ease-in-out transition-transform duration-500 text-left justify-between group flex flex-col",
        )}
      >
        <div
          className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))]  sm:mx-0 sm:rounded-2xl overflow-hidden"
          style={{
            boxShadow:
              "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
          }}
        >
          <div
            className={`absolute inset-0 w-full h-full scale-[1.2] transform ${isHovered ? "opacity-[.03]" : "opacity-5"} [mask-image:radial-gradient(#fff,transparent,75%)]`}
            style={{
              backgroundImage: "url(/noise.png)",
              backgroundSize: "30%",
            }}
          ></div>
          <div 
            className="absolute top-0 left-0 group-hover:opacity-0 
            ease-in-out transition-all duration-500 w-full h-full bg-gradient-to-tr opacity-30 from-black via-eerie-black to-transparent">
          </div>
          <div className={`transition duration-200 px-4 py-4 z-10 relative w-full`}>
            <div className="flex justify-between items-center">
              <Image
                src={idea.tokenImageUrl}
                alt={idea.symbol}
                width={200}
                height={200}
                quality={40}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  const color = getAverageColor(img)
                  setPrimaryColor(color)
                  setIsColorLoading(false)
                }}
                className={`h-10 w-auto rounded-md`}
              />
              <div className="bg-white rounded-full text-xs px-2 py-1/2 font-semibold">
                <span style={{ color: primaryColor }} className={` whitespace-nowrap ${secondaryFont.className}`}>
                  {idea.symbol}
                </span>
              </div>
            </div>
            <div className="flex justify-between flex-1 items-center mt-4">
              <div className="flex text-neutral-200 justify-between w-full items-center">
                <div className="font-semibold mr-1 text-xl">
                  {idea.name}
                </div>
              </div>
            </div>
            <div className="text-neutral-300 text-sm mt-2 leading-4">
              {idea.description.replaceAll('$comma$', ',')}
            </div>
            <div className="mt-2 flex gap-4 items-center">
              <div className="flex gap-4 items-center">
                <div className="flex flex-col w-max">
                  <span className="text-xs text-neutral-300">{ideaCardCopy.raised}</span>
                  <span className="text-xs text-neutral-200 font-medium"><AnimatedText text={`${fundingRaised ? fundingRaised.toFixed(3).replace(/[.,]000$/, "") : 0}`} /> {getCurrency()}</span>
                </div>
                <div className="flex flex-col w-max">
                  <span className="text-xs text-neutral-300">{ideaCardCopy.holders}</span>
                  <span className="text-xs text-neutral-200 font-bold flex gap-0.5 items-center">
                    {holdersCount}
                    <User2 width={12} height={12} />
                  </span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {fundingRaised >= targetFunding && (
                  <div className="flex flex-col">
                    <div className="text-xs text-neutral-300">
                      Trade
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger>
                          <Link
                            href={`https://app.uniswap.org/explore/tokens/polygon/${idea.tokenAddress}`}
                            onClick={(e) => e.stopPropagation()}
                            target='_blank'
                            className={`flex items-center justify-center text-neutral-200 outline-none text-xs font-semibold gap-1`}
                          >
                            UNI
                            <ExternalLink width={12} height={12} />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent className="isolate bg-black/75 shadow-lg border-0 outline-none rounded-lg z-[100]">
                          <p className="text-xs font-normal text-neutral-300">
                            Open Uniswap
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger>
                          <Link
                            href={`https://dexscreener.com/polygon/${idea.tokenAddress}`}
                            onClick={(e) => e.stopPropagation()}
                            target='_blank'
                            className={`flex items-center justify-center text-neutral-200 outline-none text-xs font-semibold gap-1`}
                          >
                            DEX
                            <ExternalLink width={12} height={12} />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent className="isolate bg-black/75 shadow-lg border-0 outline-none rounded-lg z-[100]">
                          <p className="text-xs font-normal text-neutral-300">
                            Open Dex Screener
                          </p>
                        </TooltipContent>
                      </Tooltip>
                     
                     
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
