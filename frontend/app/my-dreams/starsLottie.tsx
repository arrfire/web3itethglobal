'use client'
import Lottie from "react-lottie";
import * as animData from '@/common/lottie/no-ideas.json'

export const StarsLottie = () => {
  const animOptions = {
    loop: true,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie options={animOptions}
      height={200}
      width={200}
    />
  )
}
