"use client";

import { cn } from "@/utils/helpers";
import { 
  AnimatePresence, motion,
} from "framer-motion";
import React, { 
  ReactNode, useEffect,
} from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: ReactNode;
  className?: string;
  footerContent?: ReactNode;
}

export const DefaultModal = ({ 
  isOpen, onClose, children, className, footerContent, maxWidth = "md:max-w-[820px]",
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const Overlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(10px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      className="fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50"
    />
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(10px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full flex items-center justify-center z-50"
        >
          <Overlay />
          <motion.div
            className={cn(
              "max-w-[calc(100%-40px)]  bg-neutral-800/50 shadow-sm shadow-white rounded-3xl relative z-50 flex flex-col flex-1 overflow-hidden",
              className,
              maxWidth,
            )}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
          >
            <button
              onClick={onClose}
              type="button"
              className="absolute top-4 right-4 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col flex-1">
              {children}
            </div>

            {footerContent && (
              <div className="flex justify-center p-4">
                {footerContent}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};