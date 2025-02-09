
"use client";
import { useOutsideClick } from "@/common/hooks";
import { cn } from "@/utils/helpers";
import {
  AnimatePresence, motion,
} from "framer-motion";
import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { 
  Tooltip,
  TooltipContent, 
  TooltipTrigger,
} from '@/common/components/atoms';
import dynamic from "next/dynamic";
import { 
  Button, 
} from "../../atoms";

const DeleteLottie = dynamic(() => import('./deleteLottie').then(m => m.DeleteLottie), { 
  ssr: false, 
});

const EquityLottie = dynamic(() => import('./equityLottie').then(m => m.EquityLottie), { 
  ssr: false, 
});
const BuyCartLottie = dynamic(() => import('./buyCartLottie').then(m => m.BuyCartLottie), { 
  ssr: false, 
});

export function Modal ({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const ModalTrigger = ({
  children,
  disabled = false,
  onClick,
  setIsModalOpen,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const [enableAnim, setEnableAnim] = useState(false)

  return (
    <Button
      size="md"
      type="button"
      variant="primary"
      disabled={disabled}
      onMouseEnter={() => setEnableAnim(true)}
      onMouseLeave={() => setEnableAnim(false)}
      onClick={async () => {
        if (onClick) {
          await onClick()
        }
        setIsModalOpen(true)
      }}
      className="transition-all gap-2 !px-6 mt-1 disabled:from-han-purple/40 disabled:to-tulip/40 w-full duration-150 hover:from-han-purple/70
  hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium"
    >
      {children}
      <div className="pointer-events-none">
        <BuyCartLottie enableAnim={enableAnim} />
      </div>
    </Button>
  );
};

export const ModalDeleteCommentTrigger = ({
  setIsModalOpen,
}: {
  setIsModalOpen: (value: boolean) => void;
}) => {
  const [deleteAnim, setDeleteAnim] = useState(false)
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger 
        type="button"
        onMouseEnter={() => setDeleteAnim(true)}
        onMouseLeave={() => setDeleteAnim(false)}
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center gap-2 !p-2 hover:bg-white/15 text-white rounded-full outline-none transition-all duration-150 hover:!scale-[1.04] ease-in-out px-4 py-2 font-medium text-base"
      >
        <DeleteLottie deleteAnim={deleteAnim} />
      </TooltipTrigger>
      <TooltipContent className="isolate bg-black/65 shadow-lg border-0 outline-none rounded-lg">
        <p className="text-xs text-white">Delete comment</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const ModalTriggerCreateToken = ({
  children,
  disabled = false,
  onClick,
  setIsModalOpen,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => Promise<boolean | undefined>;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const [enableEquityAnim, setEnableEquityAnim] = useState(false)

 
  return (
    <Button
      size="md"
      type="button"
      variant="primary"
      disabled={disabled}
      onMouseEnter={() => setEnableEquityAnim(true)}
      onMouseLeave={() => setEnableEquityAnim(false)}
      onClick={async () => {
        if (onClick) {
          const shouldContinue = await onClick()
          if (!shouldContinue) {
            return
          }
        }
        setIsModalOpen(true)
      }}
      className="transition-all gap-2 !px-6 !py-2.5 w-full md:w-auto duration-150 hover:enabled:from-han-purple/70
     hover:enabled:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium"
    >
      {children}
      <span className="pointer-events-none">
        <EquityLottie enableEquityAnim={enableEquityAnim} />
      </span>
    </Button>
  );
};

export const ModalTriggerFooter = ({
  children,
  setIsModalOpen,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => Promise<boolean | undefined>;
  setIsModalOpen: (value: boolean) => void;
}) => {

  return (
    <Button onClick={() => setIsModalOpen(true)} size="md" variant="secondary" className="flex items-center justify-center text-white rounded-2xl outline-none
    transition-all duration-150 ease-in-out px-6 py-3 font-medium text-base ring-1 ring-white
    gap-2 ring-inset hover:bg-white/15">
      {children}
    </Button>
  );
};

export const ModalBody = ({
  children,
  className,
  isModalOpen,
  setIsModalOpen,
}: {
  children: ReactNode;
  className?: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}) => {

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  const modalRef = useRef(null);

  useOutsideClick({
    isVisible: false,
    ref: modalRef,
    callback: () => setIsModalOpen(false),
  });

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(10px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50"
        >
          <Overlay />

          <motion.div
            ref={modalRef}
            className={cn(
              "max-w-[calc(100%-40px)] md:max-w-[820px] bg-neutral-800/50 shadow-sm shadow-white rounded-3xl relative z-50 flex flex-col flex-1 overflow-hidden",
              className,
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
            <CloseIcon setIsModalOpen={setIsModalOpen} />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col flex-1 ", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-center p-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(10px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
    ></motion.div>
  );
};

const CloseIcon = ({ setIsModalOpen } : { setIsModalOpen: (value: boolean) => void }) => {
  return (
    <button
      onClick={() => setIsModalOpen(false)}
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
  );
};
