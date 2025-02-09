import Lottie from "react-lottie";
import * as searchAnimData from '@/common/lottie/search-animation.json'

export const SearchLottie = ({ enableSearchAnim } : { enableSearchAnim: boolean }) => {
  const defaultOptions = {
    loop: true,
    autoplay: false,
    animationData: searchAnimData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie
      options={defaultOptions}
      isStopped={!enableSearchAnim}
      height={28}
      width={28}
    />
  )
}