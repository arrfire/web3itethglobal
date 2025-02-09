'use client'
import Lottie from "react-lottie";
import * as globeData from '@/common/lottie/globe-animation.json'

export const GlobeLottie = ({ enableGlobeAnim } : { enableGlobeAnim: boolean }) => {
  const animOptions = {
    loop: true,
    autoplay: false,
    animationData: globeData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie options={animOptions}
      isStopped={!enableGlobeAnim}
      style={{ margin: '0' }}
      height={32}
      width={32}
    />
  )
}
