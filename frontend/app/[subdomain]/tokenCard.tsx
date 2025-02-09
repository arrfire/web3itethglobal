import { 
  AnimatedText, 
  EnsResolver, 
  LinkStyled,
} from "@/common/components/atoms";
import { IdeaTokenType } from "@/common/types";
import Image from "next/image";
import { motion } from "framer-motion";
import lang from "@/common/lang";
import { secondaryFont } from "@/common/utils/localFont";
import { Progress } from "@/common/components/molecules";
import { 
  getChainAddressLink, getCurrency,
} from "@/common/constants";
import { blurDataUrl } from "@/common/utils/blurDataUrl";

const { ideaPage: ideaPageCopy } = lang

export const TokenCard = ({
  idea,
}: {
  idea: IdeaTokenType;
}) => {
  const fundingRaised = idea?.fundingRaised ? idea.fundingRaised : 0;
  const fundingGoal = parseFloat(process.env.NEXT_PUBLIC_TARGET_ETH || '0');
  const fundingRaisedPercentage = (fundingRaised / fundingGoal) * 100;
  return (
    <>
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
        <Image
          src={idea.tokenImageUrl}
          alt={idea.name}
          quality={30}
          width={300}
          height={300}
          placeholder="blur"
          blurDataURL={blurDataUrl}
          className={`h-36 md:h-48 w-min md:w-auto rounded-2xl md:rounded-3xl`}
        />
        <div className="flex flex-col gap-2">
          <div className="flex-1">
            <motion.div initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }} className="flex gap-2 items-center justify-between">
              <div className="flex items-center gap-2">
                
                <div className="text-neutral-200 text-xl font-semibold">{idea.name}</div>
              </div>
              <div className="bg-white rounded-full text-xs px-2 py-1/2 font-semibold">
                <span className={`bg-gradient-to-b from-indigo-500 to-purple-500 text-transparent bg-clip-text ${secondaryFont.className}`}>
                  {idea.symbol}
                </span>
              </div>
            </motion.div>
            <motion.h1 
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.9,
              }}
              className="text-neutral-500 text-xs md:text-sm mt-1 text-justify">
              {idea.description.replaceAll('$comma$', ',')}
            </motion.h1>
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
                delay: 1.2,
              }}
              className="flex gap-1 mt-2 flex-wrap">
              {idea.categories.split('/').map((category, index) => (
                <div key={index} className="bg-white rounded-full text-xs px-2 py-1/2 font-semibold">
                  <span className="bg-gradient-to-b from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                    {category}
                  </span>
                </div>
              ))}
            </motion.div>
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
                delay: 1.5,
              }}
              className="flex gap-4 mt-2">
              <div className="text-neutral-300 text-xs flex flex-col">
                {ideaPageCopy.createdBy}{" "}
                <LinkStyled
                  href={getChainAddressLink(idea.creatorAddress)}
                  target="_blank"
                  className="!px-0 !text-xs hover:underline font-semibold"
                >
                  <EnsResolver address={idea.creatorAddress} />
                </LinkStyled>
              </div>
              <div className="text-neutral-300 text-xs flex flex-col">
                {ideaPageCopy.tokenAddress}{" "}
                <LinkStyled
                  href={getChainAddressLink(idea.tokenAddress)}
                  target="_blank"
                  className="!px-0 !text-xs hover:underline font-semibold"
                >
                  {idea.tokenAddress.slice(2, 7)}
                </LinkStyled>
              </div>
              <div className="text-neutral-300 text-xs flex flex-col">
                <span>{ideaPageCopy.fundingRaised}{" "}</span>
                <div className="">
                  <AnimatedText text={`${fundingRaised ? fundingRaised.toFixed(3).replace(/[.,]000$/, "") : 0} `} />
                  {getCurrency()}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 1.8,
      }} className="mt-4">
        <Progress value={fundingRaisedPercentage} />
      </motion.div>
    </>
  );
};
