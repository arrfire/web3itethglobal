import Lottie from "react-lottie";
import * as equityAnimData from '@/common/lottie/equity-lock-animation.json'

export const EquityLottie = ({ enableEquityAnim } : { enableEquityAnim: boolean }) => {
  const equityAnimOptions = {
    loop: true,
    autoplay: false,
    animationData: equityAnimData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie options={equityAnimOptions}
      isStopped={!enableEquityAnim}
      style={{ margin: '0' }}
      height={24}
      width={24}
    /> 
  )
}