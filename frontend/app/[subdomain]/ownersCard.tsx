import {
  EnsResolver, LinkStyled,
} from "@/common/components/atoms";
import lang from "@/common/lang";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { OwnerType } from "./types";
import { getChainAddressLink } from "@/common/constants";
const StakeProgress = dynamic(() => import('@/common/components/molecules').then(m => m.StakeProgress), {
  ssr: false,
});

const { ideaPage: ideaPageCopy } = lang;

export const OwnersCard = ({
  owners,
}: {
  owners: Array<OwnerType> | []
}) => {
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
        delay: 2,
      }}
      className="w-full">
      <div className="text-neutral-200 font-semibold text-lg">
        {ideaPageCopy.stakeholders}
      </div>
      <div className="text-neutral-500 mb-2 text-sm">
        {ideaPageCopy.stakeholdersDesc}
      </div>
      <div className="border-white/15 border bg-white/5 backdrop-blur-sm p-4 rounded-3xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 opacity-50 ease-in-out transition-all duration-200 w-48 h-full blur-3xl" />
        {owners?.length ? (
          <div className="space-y-4 relative z-10">
            {owners.map((owner, index: number) => {
              if (index > 14) {
                return
              }
              return (
                <div key={owner.owner_address} className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-white text-sm">{index + 1}.</span>
                      <LinkStyled
                        href={getChainAddressLink(owner.owner_address)}
                        target="_blank"
                        className="flex items-center gap-1 !px-0 !text-sm hover:underline font-medium"
                      >
                        <EnsResolver address={owner.owner_address} />
                      </LinkStyled>
                    </div>
                    <span className="text-neutral-300 font-medium text-sm">
                      {owner.stake.toFixed(2).replace(/[.,]00$/, "")}%
                    </span>
                  </div>
                  <StakeProgress
                    value={owner.stake}
                    className="h-1 bg-white/10 group-hover:bg-white/15 transition-colors"
                  />
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};
