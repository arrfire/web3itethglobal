'use client'
import Lottie from "react-lottie";
import * as docData from '@/common/lottie/document-animation.json'

export const MagicLottie = ({ enableMagicAnim } : { enableMagicAnim: boolean }) => {
  const docOptions = {
    loop: true,
    autoplay: false,
    animationData: docData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie options={docOptions}
      isStopped={!enableMagicAnim}
      style={{ margin: '0' }}
      height={24}
      width={24}
    />
  )
}
