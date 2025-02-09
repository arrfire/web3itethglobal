import Lottie from "react-lottie";
import * as animData from '@/common/lottie/buy-cart-animation.json'

export const BuyCartLottie = ({ enableAnim } : { enableAnim: boolean }) => {
  const animOptions = {
    loop: true,
    autoplay: false,
    animationData: animData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie options={animOptions}
      isStopped={!enableAnim}
      style={{ margin: '0' }}
      height={28}
      width={28}
    /> 
  )
}