import React, {
  useState,
} from 'react';
import Lottie from "react-lottie";
import { createClient } from '@/common/utils/supabase/client';
import { motion } from "framer-motion";
import Image from 'next/image';
import {
  MessageCircle,
  Send,
  Image as AttachImage,
  LinkIcon,
  X,
} from 'lucide-react';
import lang from '@/common/lang';
import Link from 'next/link';
import { v4 } from 'uuid';
import {
  Button,
  CircularSpinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/common/components/atoms';
import {
  useAccount,
  useWalletClient,
} from 'wagmi';
import toast from 'react-hot-toast';
import {
  acceptedImageMimeTypes,
  FILE_SIZE_FIVE_MB,
  SupabaseTables,
} from '@/common/constants';
import {
  TelegramIcon, TokenXIcon,
} from '@/common/components/icons';
import { IdeaTokenType } from '@/common/types';
import { pinataUploadUrl } from '@/common/utils/network/endpoints';
import { usePrivy } from '@privy-io/react-auth';
import { CommentCard } from './commentCard';
import { useIdeaComments } from './useComments';
import * as animData from '@/common/lottie/chat-animation.json'

const {
  ideaPage: ideaPageCopy,
  createIdea: {
    imageUpload: imageUploadCopy,
  },
} = lang

export const Comments = ({
  idea,
}: {
  idea: IdeaTokenType;
}) => {
  const [newComment, setNewComment] = useState<string>('');
  const [newImage, setNewImage] = useState<string>('');
  const [uploadInProgress, setUploadInProgress] = useState(false)

  const supabase = createClient();
  const {
    address,
  } = useAccount();
  const { data: walletClient } = useWalletClient();
  const {
    authenticated, login,
  } = usePrivy()

  const animOptions = {
    loop: true,
    autoplay: false,
    animationData: animData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const {
    comments,
    setComments,
    isLoading,
    mutate: mutateComments,
  } = useIdeaComments({
    tokenAddress: idea.tokenAddress,
  })

  const addComment = async () => {
    if (!walletClient || !address) {
      if (!authenticated) {
        login()
      }
      return
    }

    try {
      const { error } = await supabase
        .from(SupabaseTables.IdeaFeed)
        .insert([
          {
            message: newComment,
            image: newImage || null,
            sender: address,
            likedby: [],
            ideaAddress: idea.tokenAddress,
            created_at: new Date().toISOString(),
            id: v4(),
          },
        ]);

      if (error) {
        toast.error("Unable to add new post")
      }
      setNewComment('');
      setNewImage('');
      await mutateComments();
    } catch (err) {
      toast.error("Unable to add new post")
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      if (file.size > FILE_SIZE_FIVE_MB) {
        toast.error(imageUploadCopy.imageSizeError)
        return;
      }
      if (!acceptedImageMimeTypes.includes(file.type)) {
        toast.error(imageUploadCopy.imageType)
        return;
      }
      try {
        setUploadInProgress(true)
        const data = new FormData();
        data.set("file", file);
        const uploadRequest = await fetch(pinataUploadUrl, {
          method: "POST",
          body: data,
        });
        const IPFS_URL = await uploadRequest.json();
        setNewImage(IPFS_URL)
        setUploadInProgress(false)
      } catch (e) {
        setUploadInProgress(false)
        toast.error(imageUploadCopy.uploadError)
      }
    }
  }

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
      transition={{
        delay: 1,
      }}
      className="mb-8 mt-8 xl:mt-2 relative">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 pointer-events-none">
          <Lottie options={animOptions}
            style={{ margin: '0' }}
            height={28}
            width={28}
          />
          <h2 className="font-semibold text-neutral-300">{ideaPageCopy.conversations}</h2>
        </div>
        <div className="flex gap-2 items-center">
          {idea.telegramUrl ? (
            <Tooltip delayDuration={200}>
              <TooltipTrigger>
                <Link
                  href={idea.telegramUrl}
                  target='_blank'
                  className={`flex items-center justify-center text-white rounded-full outline-none
                    transition-all duration-150 ease-in-out p-2 font-medium
                    gap-2 ring-inset hover:bg-white/15`}
                >
                  <TelegramIcon />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="isolate bg-white/75 shadow-lg border-0 outline-none rounded-lg z-[100]">
                <p className="text-xs font-normal text-neutral-800">
                  Open Telegram
                </p>
              </TooltipContent>
            </Tooltip>
          ) : null}
          {idea.twitterUrl ? (
            <Tooltip delayDuration={200}>
              <TooltipTrigger>
                <Link
                  href={idea.twitterUrl}
                  target='_blank'
                  className={`flex items-center justify-center text-white rounded-full outline-none
                    transition-all duration-150 ease-in-out p-2 font-medium
                    gap-2 ring-inset hover:bg-white/15`}
                >
                  <TokenXIcon />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="isolate bg-white/75 shadow-lg border-0 outline-none rounded-lg z-[100]">
                <p className="text-xs font-normal text-neutral-800">
                  Open X
                </p>
              </TooltipContent>
            </Tooltip>
          ) : null}
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              <Link
                href={idea.productUrl}
                target='_blank'
                className={`flex items-center justify-center text-white rounded-full outline-none
              transition-all duration-150 ease-in-out p-2 font-medium
              gap-2 ring-inset hover:bg-white/15`}
              >
                <LinkIcon width={16} height={16} />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="isolate bg-white/75 shadow-lg border-0 outline-none rounded-lg z-[100]">
              <p className="text-xs font-normal text-neutral-800">
                View website
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <label className="relative" htmlFor='new-comment'>
        <div className='bg-white/5 shadow-sm shadow-white rounded-2xl p-4'>
          <textarea
            id='new-comment'
            name='new-comment'
            rows={3}
            className='bg-transparent w-full outline-none text-white resize-none border-0'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <div className="flex items-start justify-between gap-2 mt-2">
            {uploadInProgress ? <CircularSpinner /> : (
              newImage ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    translateX: 20,
                  }}
                  animate={{
                    opacity: 1,
                    translateX: 0,
                  }}
                  exit={{
                    opacity: 0,
                    translateX: 20,
                  }}
                  className="mt-2 relative flex w-max">
                  <Image
                    src={newImage}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-auto h-32 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => setNewImage('')}
                    className="absolute -top-2 -right-2 bg-violets-are-blue rounded-full p-1"
                  >
                    <X className="text-white" height={12} width={12} />
                  </button>
                </motion.div>
              ) : <div></div>
            )}
            <div className='flex gap-2'>
              {!newImage ? (
                <Tooltip delayDuration={200}>
                  <TooltipTrigger>
                    <label className="cursor-pointer text-white hover:bg-white/15 rounded-full p-2 flex justify-center items-center">
                      <input
                        type="file"
                        accept={acceptedImageMimeTypes.join(', ')}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <AttachImage width={20} height={20} />
                    </label>
                  </TooltipTrigger>
                  <TooltipContent className="isolate bg-white/75 shadow-lg border-0 outline-none rounded-lg z-[100]">
                    <p className="text-xs font-normal text-neutral-800">
                      Attach image
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
              <Button
                size="md"
                type="button"
                variant="primary"
                onClick={addComment}
                disabled={!newComment.trim() || newComment.trim().length < 3}
                className="transition-all gap-2 !py-2 !px-4 !rounded-xl disabled:from-han-purple/40 disabled:to-tulip/40 duration-150 hover:from-han-purple/70
            hover:to-tulip/70 bg-gradient-to-tr from-han-purple text-sm to-tulip font-medium"
              >
                {authenticated ? (
                  <>
                    <span>{ideaPageCopy.post}</span>
                    <Send width={14} height={14} />
                  </>
                ) : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </label>
      <div className="space-y-4 mt-4">
        {isLoading ? (
          <div className='my-4'>
            <CircularSpinner />
          </div>
        ) : null}
        {!comments?.length ? (
          <div className="py-5 flex gap-2 md:items-center">
            <MessageCircle width={16} height={16} className="text-neutral-200 translate-y-1 md:translate-y-0" />
            <p className='text-neutral-200'>{ideaPageCopy.noComments}</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              setComments={setComments}
              comments={comments}
              mutateComments={mutateComments}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};
