import Lottie from "react-lottie";
import * as deleteAnimData from '@/common/lottie/delete-animation.json'

export const DeleteLottie = ({ deleteAnim } : { deleteAnim: boolean }) => {
  const deleteAnimOptions = {
    loop: true,
    autoplay: false,
    animationData: deleteAnimData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie
      options={deleteAnimOptions}
      isStopped={!deleteAnim}
      height={20}
      width={20}
    />
  )
}