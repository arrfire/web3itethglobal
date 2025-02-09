'use client'
import {
  useEffect,
  useState,
} from "react";
import { routes } from "@/common/routes";
import dynamic from "next/dynamic";
import { 
  useRouter,
} from "next/navigation";
import { motion } from "framer-motion";
import { secondaryFont } from "@/common/utils/localFont";
import Link from "next/link";
import { 
  Tooltip,
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger,
} from '@/common/components/atoms';
import {
  LogoIcon,
} from "../../icons";
import {
  ConnectButton,
  Button,
} from "../../atoms";
import { SearchIdeas } from "../searchIdeas";

const SearchLottie = dynamic(() => import('./searchLottie').then(m => m.SearchLottie), { 
  ssr: false, 
});

export const Header = () => {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [navbarOpened, setNavbarOpened] = useState(false)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [enableSearchAnim, setEnableSearchAnim] = useState(false)

  const handleScroll = () => {
    if (window.pageYOffset >= 50) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const openPage = (value: string) => {
    setNavbarOpened(false)
    if (value) {
      router.push(value)
    }
  }
  return (
    <TooltipProvider>
      <SearchIdeas
        searchEnabled={searchEnabled}
        setSearchEnabled={setSearchEnabled}
      />
      <nav className={`fixed top-0 left-0 right-0 z-[70] transition-all px-2 md:px-4 duration-150 ${isScrolled ? "bg-space-cadet/30 backdrop-blur-sm" : ""} ${navbarOpened ? "bg-space-cadet bg-opacity-70 backdrop-blur-sm h-screen" : ""}`}>
        <div className={`container mx-auto pb-3 pt-3 flex items-center justify-between`}>
          <Link href={routes.homePath} prefetch={true} replace className="flex md:gap-2 items-center text-white font-semibold md:text-xl">
            <LogoIcon className="scale-75 md:scale-100"/>
            <motion.span
              initial={{
                opacity: 0,
                translateX: 20,
              }}
              animate={{
                opacity: 1,
                translateX: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 1,
              }}
              className={`text-white ${secondaryFont.className}`}
            >
              Web3It.AI
            </motion.span>
          </Link>
          <>
            <motion.div className="flex lg:mr-0 gap-4 items-center"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <Tooltip delayDuration={200}>
                <TooltipTrigger 
                  type="button"
                  onClick={() => setSearchEnabled(true)}
                  onMouseEnter={() => setEnableSearchAnim(true)}
                  onMouseLeave={() => setEnableSearchAnim(false)}
                  className="flex items-center justify-center gap-2 !p-2 hover:bg-white/15 text-white rounded-full outline-none transition-all duration-150 hover:!scale-[1.04] ease-in-out px-4 py-2 font-medium text-base"
                >
                  <SearchLottie enableSearchAnim={enableSearchAnim} />
                </TooltipTrigger>
                <TooltipContent className="isolate bg-white/15 shadow-lg border-0 outline-none rounded-lg">
                  <p className="text-xs text-white">Search Dreams</p>
                </TooltipContent>
              </Tooltip>
              <ConnectButton />
            </motion.div>
          </>
        </div>
        <div className={`absolute top-1/2 -translate-y-full h-auto left-0 w-full flex items-center justify-center flex-col`}>
          <ul className={`${navbarOpened ? "" : "hidden"} w-full pt-0 pb-[0] [list-style:none] px-4`}>
            <li className={`flex justify-center ${navbarOpened ? "scale-100 translate-y-0 opacity-100" : "scale-[1.15] -translate-y-[30px] opacity-0"} delay-[210ms] mt-[5px] [transition:transform_0.5s_cubic-bezier(0.4,_0.01,_0.165,_0.99),_opacity_0.6s_cubic-bezier(0.4,_0.01,_0.165,_0.99)]`}>
              <Button variant="primary" size="sm" type="button" onClick={() => openPage(routes.createProjectPath)} className="transition-all duration-150 hover:from-indigo-500/70 hover:to-purple-500/70 bg-gradient-to-r from-indigo-500 to-purple-500 w-full max-w-[400px]">Develop</Button>
            </li>
            <li className={`flex justify-center ${navbarOpened ? "scale-100 translate-y-0 opacity-100" : "scale-[1.15] -translate-y-[30px] opacity-0"} delay-[210ms] mt-4 [transition:transform_0.5s_cubic-bezier(0.4,_0.01,_0.165,_0.99),_opacity_0.6s_cubic-bezier(0.4,_0.01,_0.165,_0.99)]`}>
              <Button variant="primary" size="sm" type="button" onClick={() => openPage(routes.viewProjectsPath)} className="transition-all duration-150 hover:from-indigo-500/70 hover:to-purple-500/70 bg-gradient-to-r from-indigo-500 to-purple-500 w-full max-w-[400px]">Ideas</Button>
            </li>
            <li className={`flex justify-center ${navbarOpened ? "scale-100 translate-y-0 opacity-100" : "scale-[1.15] -translate-y-[30px] opacity-0"} delay-[140ms]  mt-4 [transition:transform_0.5s_cubic-bezier(0.4,_0.01,_0.165,_0.99),_opacity_0.6s_cubic-bezier(0.4,_0.01,_0.165,_0.99)]`}>
              <Button variant="primary" size="sm" type="button" onClick={() => openPage("")} className="transition-all duration-150 hover:from-indigo-500/70 hover:to-purple-500/70 bg-gradient-to-r from-indigo-500 to-purple-500 w-full max-w-[400px]">Team</Button>
            </li>
            <li className={`flex justify-center ${navbarOpened ? "scale-100 translate-y-0 opacity-100" : "scale-[1.15] -translate-y-[30px] opacity-0"} delay-[70ms] mt-4 [transition:transform_0.5s_cubic-bezier(0.4,_0.01,_0.165,_0.99),_opacity_0.6s_cubic-bezier(0.4,_0.01,_0.165,_0.99)]`}>
              <Button variant="primary" size="sm" type="button" onClick={() => openPage("")} className="transition-all duration-150 hover:from-indigo-500/70 hover:to-purple-500/70 bg-gradient-to-r from-indigo-500 to-purple-500 w-full max-w-[400px]">About us</Button>
            </li>
          </ul>
        </div>
      </nav>
    </TooltipProvider>
  );
};
