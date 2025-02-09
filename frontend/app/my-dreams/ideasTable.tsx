import lang from "@/common/lang";
import { UserIdea } from "./types"
import Link from "next/link";
import { SubdomainType } from "@/middleware";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { routes } from "@/common/routes";
import { 
  TooltipProvider,
} from '@/common/components/atoms';
import { getChainAddressLink } from "@/common/constants";

const { profile: { table: tableCopy } } = lang

export const IdeasTable = ({ 
  userIdeas,
  subdomains,
} : { 
  userIdeas: UserIdea[] | [];
  subdomains: Array<SubdomainType>;
}) => {
  const ideasListEnhanced = useMemo(() => {
    if (subdomains?.length && userIdeas?.length) {
      return userIdeas.map((idea) => {
        const subdomainData = subdomains.find((d: SubdomainType) => d.address.toLowerCase() === idea.address?.toLowerCase())
        if (subdomainData) {
          return {
            ...idea,
            subdomain: routes.projectDetailPath.replace('%subdomain%', subdomainData.subdomain),
          }
        }
        return {
          ...idea,
          subdomain: '',
        }
      })
    }
    return []
  }, [subdomains, userIdeas])
  return (
    <TooltipProvider>
      <motion.table
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.3,
        }}
        className="lg:table hidden w-full mt-6 ring-white/25 ring-1 text-sm text-left text-gray-400 rtl:text-right rounded-2xl overflow-hidden"
      >
        <thead className="text-xs bg-white/15 text-white border-b border-white/25">
          <tr>
            <th scope="col" className="px-6 py-3 font-semibold">
              {tableCopy.ideaName}
            </th>
            <th scope="col" className="px-6 py-3 font-semibold">
              {tableCopy.status}
            </th>
            <th scope="col" className="px-6 sm py-3 font-semibold">
              {tableCopy.ideaAddress}
            </th>
            <th scope="col" className="px-6 py-3 font-semibold">
              {tableCopy.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {ideasListEnhanced?.length
            ? ideasListEnhanced.map((idea) => (
              <tr
                className="hover:bg-zinc-800"
                key={idea.id}
              >
                <th scope="row" className="px-6 py-4 font-medium">
                  {idea.name}
                </th>
                <th scope="row" className="px-6 py-4 font-medium capitalize">
                  {idea.status}
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium hover:underline"
                >
                  <a
                    className=""
                    href={getChainAddressLink(idea.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {idea.address?.slice(2, 7)}
                  </a>
                </th>
                <th scope="row" className="px-6 py-4 flex gap-4">
                  {idea.status === "created" && (
                    <Link
                      href={idea.subdomain}
                      prefetch={true}
                      className={`flex items-center justify-center text-white rounded-full outline-none text-xs
                      transition-all duration-150 ease-in-out px-4 py-2 font-medium ring-1 ring-white
                      gap-2 ring-inset hover:bg-white/15`}
                    >
                      {tableCopy.view}
                    </Link>
                  )}
                  <Link
                    href={`${routes.newIdeaPath}?ideaId=${idea.id}`}
                    prefetch={true}
                    className={`flex items-center justify-center text-white rounded-full outline-none
                          transition-all duration-150 ease-in-out px-4 py-2 font-medium  text-xs ring-1 ring-white
                          gap-2 ring-inset hover:bg-white/15`}
                  >
                    {tableCopy.edit}
                  </Link>
                  {idea.status === "created" && (
                    <Link
                      href={`${routes.reviewPlan}?ideaId=${idea.id}`}
                      prefetch={true}
                      className={`flex items-center justify-center text-white rounded-full outline-none
                          transition-all duration-150 ease-in-out px-4 py-2 font-medium  text-xs ring-1 ring-white
                          gap-2 ring-inset hover:bg-white/15`}
                    >
                      {tableCopy.review}
                    </Link>
                  )}
                </th>
              </tr>
            ))
            : null}
        </tbody>
      </motion.table>
      <div className="flex flex-col gap-4 lg:hidden">
        {ideasListEnhanced?.length
          ? ideasListEnhanced.map((idea) => (
            <div key={idea.id} className="rounded-2xl shadow-sm shadow-white bg-eerie-black/40 py-3 px-4">
              <div className="flex justify-between items-center">
                <div className="text-neutral-200 font-semibold">{idea.name}</div>
                <div className="bg-white rounded-full text-xs px-2 py-1/2 font-semibold">
                  <span className={`bg-gradient-to-b from-indigo-500 to-purple-500 text-transparent bg-clip-text whitespace-nowrap capitalize`}>
                    {idea.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                {idea.status === "created" && (
                  <Link
                    href={idea.subdomain}
                    prefetch={true}
                    className={`flex items-center justify-center text-white rounded-full outline-none text-xs
                    transition-all duration-150 ease-in-out px-3 py-1 font-medium ring-1 ring-white
                    gap-2 ring-inset hover:bg-white/15`}
                  >
                    {tableCopy.view}
                  </Link>
                )}
                <Link
                  href={`${routes.newIdeaPath}?ideaId=${idea.id}`}
                  prefetch={true}
                  className={`flex items-center justify-center text-white rounded-full outline-none
                        transition-all duration-150 ease-in-out px-3 py-1 font-medium  text-xs ring-1 ring-white
                        gap-2 ring-inset hover:bg-white/15`}
                >
                  {tableCopy.edit}
                </Link>
                {idea.status === "created" && (
                  <Link
                    href={`${routes.reviewPlan}?ideaId=${idea.id}`}
                    prefetch={true}
                    className={`flex items-center justify-center text-white rounded-full outline-none
                        transition-all duration-150 ease-in-out px-3 py-1 font-medium  text-xs ring-1 ring-white
                        gap-2 ring-inset hover:bg-white/15`}
                  >
                    {tableCopy.review}
                  </Link>
                )}
              </div>
            </div>
          )) : null}
      </div>
    </TooltipProvider>
  );
}