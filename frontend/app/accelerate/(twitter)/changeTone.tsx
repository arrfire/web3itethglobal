import { KeyedMutator } from 'swr';
import { tones } from '@/common/constants';
import {
  Menu,
  Transition,
} from '@headlessui/react'
import { ChevronDown } from 'lucide-react';
import { 
  Fragment, useEffect, useState,
} from 'react';
import toast from 'react-hot-toast';
import { createClient } from "@/common/utils/supabase/client";
import { generateCharacter } from '../../actions';
import { 
  CharacterType, GET_CHARACTER_DTO, Settings, TokenType,
} from '../types';

export const ChangeTone = ({
  currentTone,
  tokenInfo,
  character,
  updateCharacter,
  mutateCharacter,
  twitterSettings,
  setChangingTone,
} : {
  currentTone: string;
  tokenInfo: TokenType | null;
  character: CharacterType | null;
  twitterSettings: {
    numLikes: number;
    numFollowed: number;
    numReplies: number;
    numTweets: number;
    followProfiles: boolean;
    processionActions: boolean;
    schedulingPosts: boolean;
    postInterval: number;
    twitterTargetUsers: string;
    actionInterval: number;
    followInterval: number;
  }
  updateCharacter: (character: CharacterType, settings: Settings, website: string) => Promise<void>;
  mutateCharacter: KeyedMutator<GET_CHARACTER_DTO>;
  setChangingTone: (changingTone: boolean) => void;
}) => {
  const [localTone, setLocalTone] = useState('');
  const supabase = createClient();
  
  useEffect(() => {
    if (currentTone) {
      setLocalTone(currentTone);
    }
  }, [currentTone])

  const handleChangeTone = async (tone: string) => {
    if (!tokenInfo) {
      return
    }
    try {
      setChangingTone(true)
      setLocalTone(tone)
      const newCharacter = await generateCharacter({
        ideaName: tokenInfo.name,
        ideaDescription: tokenInfo.description,
        ideaTicker: tokenInfo.ticker,
        tone: tone,
        website: tokenInfo.website,
        categories: tokenInfo.categories,
      })

      if (!character) {
        return
      }
      const updatedCharacter = {
        ...character,
        ...newCharacter,
        messageExamples: [
          [
            {
              user: "{{user1}}",
              content: {
                text: newCharacter.messageExamples[0],
              },
            },
            {
              user: tokenInfo.name,
              content: {
                text: newCharacter.messageExamples[1],
              },
            },
          ],
          [
            {
              user: "{{user1}}",
              content: {
                text: newCharacter.messageExamples[2],
              },
            },
            {
              user: tokenInfo.name,
              content: {
                text: newCharacter.messageExamples[3],
              },
            },
          ],
        ],
      }
      await updateCharacter(updatedCharacter, {
        schedulingPosts: twitterSettings.schedulingPosts,
        followProfiles: twitterSettings.followProfiles,
        twitterTargetUsers: twitterSettings.twitterTargetUsers,
        processionActions: twitterSettings.processionActions,
        postInterval: twitterSettings.postInterval * 60,
        actionInterval: twitterSettings.actionInterval * 60 * 60 * 1000,
        followInterval: twitterSettings.followInterval * 60 * 60 * 1000,
      }, tokenInfo.website)
      await supabase
        .from('Agents')
        .update({
          tone: tone,
        })
        .eq('agentId', character.id)
        .select()
      await mutateCharacter()
      setChangingTone(false)
    } catch (error) {
      console.error(error)
      toast.error("Unable to change tone. Please try again later.")
      setChangingTone(false)
    }
    
  }

  return (
    <Menu as="div" className="relative inline-block text-left w-full md:w-auto">
      <div>
        <Menu.Button
          className="flex items-center justify-center text-white rounded-full outline-none w-full md:w-auto
        transition-all duration-150 ease-in-out px-3 py-2 md:py-1 font-medium  text-xs ring-1 ring-white
        gap-2 ring-inset hover:bg-white/15"
          type="button"
        >
          <span className="">{localTone}</span>
          <ChevronDown
            strokeWidth={2.5}
            width={12}
            height={12}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-10 absolute right-0 mt-2 w-40 origin-top-right rounded-xl overflow-hidden bg-eerie-black/85 backdrop-blur-lg shadow-sm !shadow-white focus:outline-none">
          <div className="px-1 py-1">
            {tones.map((tone) => (
              <Menu.Item key={tone}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => handleChangeTone(tone)}
                    className={`${
                      active ? "bg-[#f6f6f6] text-black" : "text-neutral-400"
                    } group flex font-medium w-full items-center rounded-lg px-2 py-1 text-xs`}
                  >
                    {tone}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
