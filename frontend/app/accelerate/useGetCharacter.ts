import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchCharacterUrl } from "@/common/utils/network/endpoints";
import { fetcher } from '@/common/utils/network/baseFetcher';
import { yupResolver } from "@hookform/resolvers/yup";
import { characterSchema } from "./validationSchema";
import { 
  AgentType, 
  GET_CHARACTER_DTO, 
  CharacterFormType,
} from "./types";

export const getCharacter = async (key: string) => {
  return fetcher(key, {
    arg: {
      method: 'GET',
    },
  })
}

export const useGetCharacter = ({
  twitterAgent,
  handleStopAgent,
} : {
  twitterAgent: AgentType | null;
  handleStopAgent: () => void;
}) => {
  const url = fetchCharacterUrl.replace('%agentId%', twitterAgent ? twitterAgent.agentId.toString() : '')
  const result = useSWR<GET_CHARACTER_DTO>(twitterAgent?.status === "started" ? url : null, url => getCharacter(
    url,
  ), {
    revalidateOnFocus: true,
  });
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    register,
    watch,
    trigger,
    formState: {
      isValid,
      isDirty,
    },
  } = useForm<CharacterFormType>({
    resolver: yupResolver(characterSchema),
    mode: 'onBlur',
    defaultValues: {
      systemFrontend: '',
      website: '',
      bio: [],
      adjectives: [],
      topics: [],
      lore: [],
      favUsers: [],
      twitterQuery: [],
      postExamples: [],
      styleAll: [],
      styleChat: [],
      stylePost: [],
      messageExampleOneUser: '',
      messageExampleOneAgent: '',
      messageExampleTwoUser: '',
      messageExampleTwoAgent: '',
    },
  });

  const {
    data,
    mutate,
  } = result;
  useEffect(() => {
    if (data?.character) {
      const { 
        systemFrontend, 
        bio, 
        adjectives,
        topics,
        lore,
        postExamples,
        style,
        messageExamples,
        twitterQuery,
        website,
      } = data.character
      const twitterUsers = data?.twitter?.twitterTargetUsers?.length ? data.twitter.twitterTargetUsers.split(',') : []
      setValue('favUsers', twitterUsers)
      setValue('systemFrontend', systemFrontend)
      setValue('systemFrontend', systemFrontend)
      setValue('bio', bio.map((value, index) => {
        return {
          value,
          id: index.toString(),
        }
      }))
      setValue('website', website)
      setValue('adjectives', adjectives.map((value, index) => {
        return {
          value,
          id: index.toString(),
        }
      }))
      setValue('topics', topics.map((value, index) => {
        return {
          value,
          id: index.toString(),
        }
      }))
      setValue('lore', lore.map((value, index) => {
        return {
          value,
          id: index.toString(),
        }
      }))
      setValue('postExamples', postExamples.map((value, index) => {
        return {
          value,
          id: index.toString(),
        }
      }))
      setValue('styleAll', style.all.map((value, index) => {
        return {
          value,
          id: index.toString(),
        }
      }))
      setValue('styleChat', style.chat.map((value, index) => {
        return {
          value,
          id: index.toString(),
        }
      }))
      setValue('stylePost', style.post.map((value, index) => {
        return {
          value,
          id: index.toString(),
        }
      }))
      setValue('messageExampleOneUser', messageExamples[0][0].content.text)
      setValue('messageExampleOneAgent', messageExamples[0][1].content.text)
      setValue('messageExampleTwoUser', messageExamples[1][0].content.text)
      setValue('messageExampleTwoAgent', messageExamples[1][1].content.text)
      setValue('twitterQuery', twitterQuery.map((value, index) => {
        return {
          value,
          id: index.toString(),
        }
      }))
    }

  }, [data, setValue, handleStopAgent])
  return {
    character: data?.character || null,
    twitterSettings: {
      numLikes: data?.twitter?.numLikes || 0,
      numFollowed: data?.twitter?.numFollowed || 0,
      numRetweets: data?.twitter?.numRetweets || 0,
      numReplies: data?.twitter?.numReplies || 0,
      numTweets: data?.twitter?.numTweets || 0,
      followProfiles: data?.twitter?.followProfiles || false,
      processionActions: data?.twitter?.processionActions || false,
      schedulingPosts: data?.twitter?.schedulingPosts || false,
      twitterTargetUsers: data?.twitter?.twitterTargetUsers || '',
      postInterval: data?.twitter?.postInterval ? (data.twitter.postInterval / 60) : 0,
      followInterval: data?.twitter?.followInterval ? (data.twitter.followInterval / (60 * 60 * 1000)) : 0,
      actionInterval: data?.twitter?.actionInterval ? (data.twitter.actionInterval / (60 * 60 * 1000)) : 0,
    },
    handleSubmit,
    control,
    setValue: setValue,
    getValues: getValues,
    isValid,
    watch,
    isDirty,
    register,
    trigger,
    mutateCharacter: mutate,
  }
}