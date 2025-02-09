import {
  useMemo,
  useState,
} from "react";
import Image from "next/image"
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import dayjs from 'dayjs';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalDeleteCommentTrigger as ModalTrigger,
} from "@/common/components/organisms";
import {
  useAccount,
  useWalletClient,
} from 'wagmi';
import { createClient } from '@/common/utils/supabase/client';
import { usePrivy } from "@privy-io/react-auth";
import { KeyedMutator } from "swr";
import {
  getChainAddressLink, SupabaseTables,
} from "@/common/constants";
import lang from "@/common/lang";
import {
  Button,
  EnsResolver,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/common/components/atoms';
import { Comment } from "./types";
import * as heartAnimData from '@/common/lottie/heart-animation.json'

const {
  ideaPage: ideaPageCopy,
} = lang

export const CommentCard = ({
  comment,
  comments,
  mutateComments,
  setComments,
} : {
  setComments: (value: Comment[]) => void;
  comment: Comment;
  comments: Array<Comment>;
  mutateComments: KeyedMutator<Comment[]>;
}) => {
  const supabase = createClient();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const {
    authenticated, login,
  } = usePrivy()
  const [heartAnim, setHeartAnim] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const heartAnimOptions = {
    loop: true,
    autoplay: false,
    animationData: heartAnimData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const avatarGradient = useMemo(() => {
    const colorArr = [
      "linear-gradient(-225deg, #00c3ff 0%, #ffff1c 100%)",
      "linear-gradient(-225deg, #A770EF 0%, #CF8BF3 50% , #FDB99B 100%)",
      "linear-gradient(-225deg, #FDFC47 0%, #24FE41 100%)",
      "linear-gradient(-225deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)",
      "linear-gradient(-225deg, #00c6ff 0%, #0072ff 100%)",
    ];
    return colorArr[Math.floor(Math.random() * colorArr.length)];
  }, []);

  const handleLike = async (commentId: number) => {
    if (!walletClient || !address) {
      if (!authenticated) {
        login()
      }
      return
    }
    const originalComments = [...comments]
    try {
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          const isLiked = comment.likedby.includes('user');
          const updatedLikedBy = isLiked
            ? comment.likedby.filter(user => user !== 'user')
            : [...comment.likedby, 'user'];

          return {
            ...comment,
            likedby:
            updatedLikedBy,
          };
        }
        return comment;
      });
      setComments(updatedComments)

      const updatedLikedby = updatedComments.find(
        comment => comment.id === commentId,
      )?.likedby

      await supabase
        .from(SupabaseTables.IdeaFeed)
        .update({ likedby: updatedLikedby })
        .eq('id', commentId);

      await mutateComments()
    } catch (err) {
      setComments(originalComments)
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await supabase.from(SupabaseTables.IdeaFeed).delete().eq('id', commentId);
      await mutateComments()
    } catch (err) {
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        translateY: 20,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
      }}
      className="bg-white/5 border-white/15 border rounded-2xl py-2 px-4 transition-all hover:shadow-lg">
      <div className='flex items-center justify-between mb-4'>
        <div className="gap-2 items-center flex">
          <div className='w-4 h-4 md:w-5 md:h-5 rounded-full' style={{ background: avatarGradient }}></div>
          <a
            className="text-neutral-400 font-medium text-sm hover:underline"
            href={getChainAddressLink(comment.sender)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <EnsResolver address={comment.sender} />
          </a>
        </div>
        <span className='text-neutral-300 text-xs font-medium'>
          {dayjs().to(dayjs(comment.created_at))}
        </span>
      </div>
      {comment.image && (
        <Image
          width={128}
          height={128}
          quality={70}
          src={comment.image}
          alt="post"
          className="h-32 w-auto rounded-md"
        />
      )}
      <div className='flex gap-4 mt-2 items-center'>
        <p className="text-white text-sm flex-1">{comment.message}</p>
        <div className="flex flex-col items-center justify-end text-sm text-gray-400">
          <div className="flex items-center gap-0.5">
            <div className="flex items-center gap-2">
              {comment.likedby.length ? (
                <span className="text-neutral-300 text-sm font-medium">{comment.likedby.length}</span>
              ) : null}
              <Tooltip delayDuration={200}>
                <TooltipTrigger
                  type="button"
                  onMouseEnter={() => setHeartAnim(true)}
                  onMouseLeave={() => setHeartAnim(false)}
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center justify-center gap-2 !p-2 hover:bg-white/15 text-white rounded-full outline-none transition-all duration-150 hover:!scale-[1.04] ease-in-out px-4 py-2 font-medium text-base"
                >
                  <Lottie
                    options={heartAnimOptions}
                    isStopped={!heartAnim}
                    height={20}
                    width={20}
                  />
                </TooltipTrigger>
                <TooltipContent className="isolate bg-black/65 shadow-lg border-0 outline-none rounded-lg">
                  <p className="text-xs text-white">Like comment</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {address === comment.sender && (
              <Modal>
                <ModalTrigger setIsModalOpen={setIsDeleteOpen} />
                <ModalBody isModalOpen={isDeleteOpen} setIsModalOpen={setIsDeleteOpen}>
                  <ModalContent>
                    <h4 className="text-white font-semibold text-xl md:text-2xl ml-6 pt-4">{ideaPageCopy.deleteComment}</h4>
                    <div className="text-center font-medium md:text-xl text-white mt-10 flex gap-2 flex-col md:flex-row items-center justify-center">
                      {ideaPageCopy.areYouSureToDelete}
                    </div>
                  </ModalContent>
                  <ModalFooter className="gap-4 pb-6 mt-5">
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(comment.id)}
                      type="button"
                      size="sm"
                      className={`flex items-center justify-center text-white rounded-2xl outline-none
                      transition-all duration-150 ease-in-out px-6 !py-2.5 font-medium text-base ring-1 ring-white
                      gap-2 ring-inset hover:bg-white/15`}
                    >
                      {ideaPageCopy.confirm}
                    </Button>
                  </ModalFooter>
                </ModalBody>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
