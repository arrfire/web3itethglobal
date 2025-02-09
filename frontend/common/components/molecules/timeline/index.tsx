"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import lang from '@/common/lang';
import React, {
  useEffect, useRef, useState,
} from "react";
import Lottie from "react-lottie";
import * as animData from '@/common/lottie/rocket-animation.json'
import { useWindowDimensions } from "@/common/hooks/useWindowDimensions";

const {
  homePage: {
    timeline: timelineCopy,
  },
} = lang

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const animOptions = {
    loop: true,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 100%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const {
    windowSize,
  } = useWindowDimensions()
  return (
    <div
      className="mb-12 md:mb-0"
      ref={containerRef}
    >
      <div className="mx-auto ">
        <h2 className="text-xl md:text-3xl font-semibold mb-1 md:mb-2 text-white max-w-4xl">
          {timelineCopy.heading}
        </h2>
        <p className="text-neutral-300 text-sm">
          {timelineCopy.subHeading}
        </p>
      </div>
      <div className="shadow-sm shadow-white mt-4 md:mt-8 rounded-3xl px-8 pt-0 md:p-8 relative">
        <div className="xl:block hidden absolute top-1/2 -translate-y-1/2 right-20 2xl:right-64 w-[300px] h-[300px]">
          <Lottie options={animOptions}
            height={300}
            width={300}
          />
        </div>
        <div ref={ref} className="mx-auto pb-12 md:pb-10">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-start pt-10 md:pt-10 md:gap-10 "
            >
              <div className="flex flex-col md:flex-row z-40 items-center top-40 self-start md:w-full lg:max-w-sm">
                <div className="h-6 absolute left-7 md:left-11 w-6 rounded-full bg-gradient-to-br from-purple-600 via-pink-400 to-indigo-600 shadow-md shadow-black flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-neutral-200" />
                </div>
                <h3 className="hidden md:block text-xl md:pl-16 md:text-2xl font-semibold text-neutral-300">
                  {item.title}
                </h3>
              </div>

              <div className="relative pl-16 pr-4 md:pl-4 w-full flex flex-col justify-center">
                <h3 className="md:hidden block text-xl md:mb-4 text-left font-semibold text-neutral-300">
                  {item.title}
                </h3>
                {item.content}{" "}
              </div>
            </div>
          ))}
          <div
            style={{
              height: (windowSize === "tablet" || windowSize === "mobile") ? height - 250 + "px" : height - 150 + "px",
            }}
            className="absolute left-[40px] md:left-[55px] top-16 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-600 via-pink-400 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
