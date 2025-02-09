import {
  ReactNode,
  useRef,
  useState,
} from "react"
import {
  AIBot,
  CircularSpinner,
} from "@/common/components/atoms";
import { Input } from "@/common/components/molecules";
import { useOutsideClick } from "@/common/hooks";
import {
  motion,
} from "framer-motion";
import toast from "react-hot-toast";
import { 
  Tooltip,
  TooltipContent, 
  TooltipTrigger,
} from '@/common/components/atoms';
import { UseFormSetValue } from "react-hook-form";
import { useProjectGenerator } from "./useProjectGenerator";
import {
  Field,
  TokenDTO,
} from "./types";

export const AIEditor = ({
  isGeneratedThroughAI,
  setValue,
  children,
  id,
  state,
  handleNewImage,
} : {
  isGeneratedThroughAI: boolean;
  children: ReactNode;
  id: string;
  setValue?: UseFormSetValue<TokenDTO>;
  handleNewImage?: (url: string) => void;
  state: TokenDTO;
}) => {
  const [isPromptEnabled, setIsPromptEnabled] = useState(false)
  const [prompt, setPrompt] = useState("")
  const promptRef = useRef<HTMLDivElement>(null)
  useOutsideClick({
    isVisible: true,
    ref: promptRef,
    callback: () => {
      if (isRegenerating) {
        return
      }
      setIsPromptEnabled(false)
    },
  });
  const {
    loading: isRegenerating,
    generateSuggestion,
  } = useProjectGenerator(
    state,
    setValue,
    setIsPromptEnabled,
    handleNewImage,
  );
  const handleRegenerate = async () => {
    try {
      await generateSuggestion(id as Field, prompt);
    } catch (error) {
      toast.error("Failed to regenerate content. Please try again.")
    } finally {
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prompt.length) {
      e.preventDefault()
      handleRegenerate();
    }
  };
  return (
    <div className="relative w-full">
      {isGeneratedThroughAI && (
        <>
          {!isPromptEnabled && (
            <div className="absolute right-0 -top-2">
              <Tooltip delayDuration={200}>
                <TooltipTrigger type="button" onClick={() => setIsPromptEnabled(true)} className="flex gap-2 items-center text-white">
                  <AIBot />
                </TooltipTrigger>
                <TooltipContent className="isolate bg-white/15 shadow-lg border-0 outline-none rounded-lg">
                  <p className="text-xs text-white">What do you want to improve?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </>
      )}
      {isPromptEnabled ? (
        <div className="w-full" ref={promptRef}>
          <Input
            id={id}
            labelText="What do you want to improve?"
            name="prompt"
            disabled={isRegenerating}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your suggestion"
            width="w-full"
          />
          {isRegenerating && (
            <span className="absolute right-2 top-9 z-50 h-6 w-6 rounded-full transition duration-200 flex items-center justify-center">
              <CircularSpinner />
            </span>
          )}
          {!isRegenerating && (
            <button
              type="button"
              onClick={() => setIsPromptEnabled(false)}
              className="absolute right-10 top-9 z-50 h-6 w-6 rounded-full bg-violets-are-blue hover:bg-violets-are-blue/90 transition duration-200 flex items-center justify-center"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  fill="white"
                  d="M15 9L9 15"
                  initial={{
                    pathLength: 0,
                    opacity: 0,
                  }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.15,
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d="M9 9L15 15"
                  initial={{
                    pathLength: 0,
                    opacity: 0,
                  }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3,
                    ease: "easeInOut",
                  }}
                />
              </motion.svg>
            </button>
          )}
          {!isRegenerating && (
            <button
              disabled={!prompt}
              type="button"
              onClick={handleRegenerate}
              className="absolute right-2 top-9 z-50 h-6 w-6 rounded-full disabled:bg-violets-are-blue/60 bg-violets-are-blue hover:bg-violets-are-blue/90 transition duration-200 flex items-center justify-center"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300 h-4 w-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <motion.path
                  d="M5 12l14 0"
                  initial={{
                    strokeDasharray: "50%",
                    strokeDashoffset: "50%",
                  }}
                  animate={{
                    strokeDashoffset: prompt ? 0 : "50%",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "linear",
                  }}
                />
                <path d="M13 18l6 -6" />
                <path d="M13 6l6 6" />
              </motion.svg>
            </button>
          )}
        </div>
      ) : children}
    </div>
  )
}
