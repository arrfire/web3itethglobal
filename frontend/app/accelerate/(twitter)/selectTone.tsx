import { KeyedMutator } from 'swr';
import { 
  useEffect, useState,
} from 'react';
import toast from 'react-hot-toast';
import { createClient } from "@/common/utils/supabase/client";
import { Button } from '@/common/components/atoms';
import { 
  ChevronLeft, 
  ChevronRight, 
  SkipForward,
} from 'lucide-react';
import lang from '@/common/lang';
import { generateCharacter } from '../../actions';
import { 
  CharacterType, GET_CHARACTER_DTO, Settings, TokenType,
} from '../types';

const { manageIdea: manageIdeaCopy } = lang

export const tones = [
  {
    title: "👨 Professional",
    value: "Professional",
  },
  {
    title: "🧑‍💻 Gen-Z",
    value: "Gen-Z",
  },
  {
    title: "🤙 Casual",
    value: "Casual",
  },
  {
    title: "👨‍🏫 Academic",
    value: "Academic",
  },
  {
    title: "🧑‍🏫 Mentor",
    value: "Mentor",
  },
  {
    title: "👨‍🎨 Creative",
    value: "Creative",
  },
]
export const SelectTone = ({
  currentTone,
  tokenInfo,
  character,
  updateCharacter,
  mutateCharacter,
  twitterSettings,
  setChangingTone,
  currentStep,
  setCurrentStep,
  stepsCount,
} : {
  currentTone: string;
  tokenInfo: TokenType | null;
  character: CharacterType | null;
  currentStep: number;
  setCurrentStep: (value: number) => void;
  stepsCount: number;
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
  updateCharacter: (character: CharacterType, settings: Settings) => Promise<void>;
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

  const handleChangeTone = async () => {
    if (!tokenInfo) {
      return
    }
    if (currentTone === localTone) {
      setCurrentStep(currentStep + 1)
      return
    }
    try {
      setChangingTone(true)
      const newCharacter = await generateCharacter({
        ideaName: tokenInfo.name,
        ideaDescription: tokenInfo.description,
        ideaTicker: tokenInfo.ticker,
        tone: localTone,
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
      })
      await supabase
        .from('Agents')
        .update({
          tone: localTone,
        })
        .eq('agentId', character.id)
        .select()
      await mutateCharacter()
      setChangingTone(false)
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error(error)
      toast.error("Unable to change tone. Please try again later.")
      setChangingTone(false)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {tones.map((tone) => (
          <Button variant='secondary' onClick={() => setLocalTone(tone.value)} size='sm' key={tone.value} type="button" className={`flex gap-2  py-1 !px-2 md:!px-6 md:py-2.5 font-medium ${localTone === tone.value ? "hover:enabled:from-han-purple/70 hover:enabled:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip" : " ring-white ring-inset ring-1 hover:bg-white/15"} !text-sm md:!text-base`}>
            {tone.title}
          </Button>
        ))}
      </div>
      <div className='flex items-center gap-2 justify-end mt-4'>
        <button
          type="button"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
          className={`flex items-center justify-center text-white rounded-full outline-none
              transition-all duration-150 ease-in-out px-4 py-1.5 font-medium disabled:bg-white/50 disabled:cursor-not-allowed ring-1 ring-white
              gap-1 ring-inset hover:bg-white/15`}
        >
          <ChevronLeft width={16} height={16} />
          {manageIdeaCopy.prev}
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={currentStep === stepsCount - 1}
          className={`flex items-center justify-center text-white rounded-full outline-none
              transition-all duration-150 ease-in-out px-4 py-1.5 font-medium disabled:bg-white/50 disabled:cursor-not-allowed ring-1 ring-white
              gap-1 ring-inset hover:bg-white/15`}
        >
          <SkipForward width={16} height={16} />
          {manageIdeaCopy.skip}
        </button>
        <button
          type="button"
          onClick={() => handleChangeTone()}
          disabled={currentStep === stepsCount - 1}
          className={`flex items-center justify-center text-white rounded-full outline-none
              transition-all duration-150 ease-in-out px-4 py-1.5 font-medium disabled:bg-white/50 disabled:cursor-not-allowed ring-1 ring-white
              gap-1 ring-inset hover:bg-white/15`}
        >
          <ChevronRight width={16} height={16} />
          {manageIdeaCopy.next}
        </button>
      </div>
    </div>
  );
};