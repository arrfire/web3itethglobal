"use client";

import { 
  useEffect, useState,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/helpers";

export type Tab = {
  title: string;
  value: string;
  renderKey?: number;
  content?: string | React.ReactNode | any;
  step: number;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  handleMutations,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  handleMutations?: (value: Tab) => void;
}) => {
  const sortedTabs = [...propTabs].sort((a, b) => a.step - b.step);
  const instructionTab = sortedTabs.find(tab => tab.value === "instruction");
  const defaultTab = instructionTab || sortedTabs[0];

  const [active, setActive] = useState<Tab>(defaultTab);
  const [tabs, setTabs] = useState<Tab[]>(sortedTabs);

  useEffect(() => {
    const newSortedTabs = [...propTabs].sort((a, b) => a.step - b.step);
    setTabs(newSortedTabs);
    const currentActive = newSortedTabs.find(tab => tab.value === active.value);
    if (currentActive) {
      if (currentActive.renderKey !== active.renderKey) {
        setActive(currentActive);
      }
    }
  }, [propTabs, active.value, active.renderKey]);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...tabs];
    const selectedTab = newTabs.splice(idx, 1)[0];
    newTabs.unshift(selectedTab);
    setTabs(newTabs);
    setActive(selectedTab);
  };

  return (
    <>
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
          delay: 2.1,
        }}
        className={cn(
          "flex flex-row items-center mt-0 xl:mt-0 justify-start shadow-white shadow-sm [perspective:1000px] border border-white/5 rounded-full relative overflow-auto lg:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName,
        )}
      >
        {tabs.sort((a, b) => a.step - b.step).map((tab, idx) => (
          <button
            key={`${tab.value}-${tab.renderKey ?? ''}`}
            type="button"
            onClick={() => {
              moveSelectedTabToTop(idx);
              if (handleMutations) {
                handleMutations(tab);
              }
            }}
            className={cn("relative px-4 py-1.5 rounded-full", tabClassName)}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ 
                  type: "spring", 
                  bounce: 0.3, 
                  duration: 0.6,
                }}
                className={cn(
                  "absolute inset-0 bg-gradient-to-tr from-han-purple to-tulip rounded-full",
                  activeTabClassName,
                )}
              />
            )}
            <span 
              className={`relative block whitespace-nowrap text-white text-xs ${
                active.value === tab.value ? "font-medium" : ""
              }`}
            >
              {tab.title}
            </span>
          </button>
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
          delay: 2.5,
        }}
      >
        <FadeInDiv
          active={active}
          key={`${active.value}-${active.renderKey ?? Date.now()}`}
          className={cn("", contentClassName)}
        />
      </motion.div>
    </>
  );
};

export const FadeInDiv = ({
  className,
  active,
}: {
  className?: string;
  active: Tab;
}) => {
  return (
    <div className="relative w-full h-full">
      <motion.div
        layoutId={`${active.value}-content-${active.renderKey ?? Date.now()}`}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 10,
        }}
        className={cn("w-full h-full", className)}
      >
        {active.content}
      </motion.div>
    </div>
  );
};