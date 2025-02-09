'use client'
import Lottie from "react-lottie";
import * as piggyData from '@/common/lottie/piggy-animation.json'

export const PiggyLottie = ({ enablePiggyAnim } : { enablePiggyAnim: boolean }) => {
  const piggyOptions = {
    loop: true,
    autoplay: false,
    animationData: piggyData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie options={piggyOptions}
      isStopped={!enablePiggyAnim}
      style={{ margin: '0' }}
      height={24}
      width={24}
    />
  )
}
