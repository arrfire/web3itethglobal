'use client';
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Input,
  MultiStepLoader,
  Switch,
  Tabs,
} from "@/common/components/molecules";
import {
  Controller,
} from "react-hook-form";
import {
  AnimatedText,
  Button,
  CircularSpinner,
  Loader,
  SelectTwitterUsers,
  TextArea,
} from "@/common/components/atoms";
import lang from "@/common/lang";
import { DefaultModal } from "@/common/components/organisms";
import { agentLoadingStates } from "@/common/constants";
import NumberInput from "@/common/components/atoms/numberInput";
import { getIdeas } from "@/app/actions";
import { MultiValue } from "react-select";
import { IdeaType } from "@/common/types";
import { extractTwitterUsername } from "@/utils/helpers";
import { CategoryType } from "@/app/new/types";
import { useStartAgent } from "../useStartAgent";
import { useStopAgent } from "../useStopAgent";
import { useGetCharacter } from "../useGetCharacter";
import { CharacterListInput } from "./characterListInput";
import { useUpdateCharacter } from "../useUpdateCharacter";
import { StartTwitter } from "./startTwitter";
import { ChangeTone } from "./changeTone";
import { CharacterReview } from "./characterReview";
import {
  AgentType,
  CharacterFormType, TokenType,
} from "../types";

type TabType = {
  title: string;
  value: string;
  content: JSX.Element;
  step: number;
  renderKey?: number;
}

const { manageIdea: manageIdeaCopy } = lang

export const TwitterAgent = ({
  getAgents,
  tokenInfo,
  twitterAgent,
  isFetchingAgents,
} : {
  isFetchingAgents: boolean;
  getAgents: () => void;
  tokenInfo: TokenType | null;
  twitterAgent: AgentType | null;
}) => {
  const [viewCharacter, setViewCharacter] = useState(false);
  const [changingTone, setChangingTone] = useState(false);
  const [reviewAgenda, setReviewAgenda] = useState(false);
  const [postInterval, setPostInterval] = useState(1);
  const [followInterval, setFollowInterval] = useState(1);
  const [actionInterval, setActionInterval] = useState(1);
  const [dreamTwitterAccounts, setDreamTwitterAccounts] = useState<Array<CategoryType> | []>([]);
  const [otherUsers, setOtherUsers] = useState<Array<CategoryType> | []>([]);
  const [renderKey, setRenderKey] = useState(0);
  
  const {
    handleStopAgent,
    isStopping,
  } = useStopAgent({
    twitterAgent,
    getAgents,
  })

  const {
    mutateCharacter,
    control,
    handleSubmit,
    isValid,
    isDirty,
    character,
    trigger,
    register,
    setValue,
    getValues,
    twitterSettings,
  } = useGetCharacter({
    twitterAgent,
    handleStopAgent,
  })

  useEffect(() => {
    const getTwitterUsers = async () => {
      const ideas = await getIdeas()
      const tokens = ideas as Array<IdeaType> | []
      const twitterAccounts: Array<CategoryType> = []
      tokens.forEach((token) => {
        const username = extractTwitterUsername(token.twitterUrl)
        if (username) {
          twitterAccounts.push({
            label: `@${username}`,
            value: username,
            id: username,
            name: username,
          })
        }
      })
      setDreamTwitterAccounts(twitterAccounts)
    }
    getTwitterUsers()
  }, [])

  useEffect(() => {
    if (twitterSettings) {
      setPostInterval(twitterSettings.postInterval)
      setFollowInterval(twitterSettings.followInterval)
      setActionInterval(twitterSettings.actionInterval)
    }
  }, [twitterSettings, dreamTwitterAccounts])

  const {
    onStartAgent,
    isSubmitting,
  } = useStartAgent({
    tokenInfo,
    twitterAgent,
    setReviewAgenda,
    getAgents,
  })

  const {
    isUpdatingCharacter,
    updateCharacter,
  } = useUpdateCharacter({
    agentId: twitterAgent?.agentId || '',
    getAgents,
    twitterAgent,
    tokenInfo,
  })

  const updateTargetUsers = useCallback(async (value: string) => {
    const newCategory = {
      value: value.replace(/@/g, ""),
      id: value.replace(/@/g, ""),
      name: value.replace(/@/g, ""),
      label: `@${value.replace(/@/g, "")}`,
    }
    const allUsers = [...getValues("favUsers") || [], newCategory.id.toString()]
    setValue("favUsers", allUsers);
    if (character) {
      await updateCharacter(character, {
        schedulingPosts: twitterSettings.schedulingPosts,
        twitterTargetUsers: allUsers.join(","),
        followProfiles: twitterSettings.followProfiles,
        processionActions: twitterSettings.processionActions,
        postInterval: twitterSettings.postInterval * 60,
        actionInterval: twitterSettings.actionInterval * 60 * 60 * 1000,
        followInterval: twitterSettings.followInterval * 60 * 60 * 1000,
      })
      await mutateCharacter()

      const formUsers = allUsers
      const users: Array<CategoryType> = []
      if (formUsers?.length) {
        formUsers.forEach((user) => {
          if (!dreamTwitterAccounts.some((account) => account.name === user)) {
            users.push({
              label: `@${user}`,
              value: user,
              id: user,
              name: user,
            })
          }
        })
      }
      setOtherUsers(users)
      
      setTimeout(() => {
        setRenderKey(renderKey + 1)
        trigger('favUsers')
      }, 1000)
    }
  }, [character, getValues, setValue, twitterSettings, updateCharacter, mutateCharacter, dreamTwitterAccounts, trigger, renderKey])
  
  useEffect(() => {
    const formUsers = getValues("favUsers")
    const users: Array<CategoryType> = []
    if (formUsers?.length) {
      formUsers.forEach((user) => {
        if (!dreamTwitterAccounts.some((account) => account.name === user)) {
          users.push({
            label: `@${user}`,
            value: user,
            id: user,
            name: user,
          })
        }
      })
    }
    setOtherUsers(users)
  }, [dreamTwitterAccounts, getValues])
 
  const createOptionValue = useCallback((field: string[]) => {
    const ans = [...dreamTwitterAccounts, ...otherUsers]?.flatMap((account) => field?.includes(account.name.toString()) ? account : []);
    return ans;
  }, [dreamTwitterAccounts, otherUsers])
  const tabs = () => {
    const allTabs: Array<TabType> = []
    if (character) {
      Object.keys(character).forEach((key) => {
        if (key === 'systemFrontend') {
          allTabs.push(
            {
              title: 'Instruction',
              value: "systemFrontend",
              step: 1,
              content: (
                <div className="pt-2 w-full">
                  <div className='text-white font-medium text-sm mt-2'>What is the objective of this agent?</div>
                  <div className="w-full">
                    <Controller
                      name="systemFrontend"
                      control={control}
                      rules={{ required: true }}
                      render={({
                        field, fieldState,
                      }) => {
                        const { error } = fieldState;
                        const {
                          ref, ...fieldProperties
                        } = field;
                        return (
                          <TextArea
                            id={field.name}
                            labelText={""}
                            width="w-full"
                            placeholder="Provide an instruction"
                            error={!!error}
                            errorMessage={error?.message}
                            {...fieldProperties}
                          />
                        )
                      }}
                    />
                  </div>
                  <div>
                    <div className='text-white font-medium text-sm mt-2 mb-2'>Product Link</div>
                    <Controller
                      name="website"
                      control={control}
                      rules={{ required: true }}
                      render={({
                        field, fieldState,
                      }) => {
                        const { error } = fieldState;
                        const {
                          ref, ...fieldProperties
                        } = field;
                        return (
                          <Input
                            id={field.name}
                            labelText={""}
                            width="w-full"
                            type="text"
                            placeholder="https://dreamstarter.xyz"
                            error={!!error}
                            errorMessage={error?.message}
                            {...fieldProperties}
                          />
                        )
                      }}
                    />
                  </div>
                </div>
              ),
            })
        }
        if (key === 'twitterQuery') {
          allTabs.push(
            {
              title: 'Twitter Query',
              value: "twitter-query",
              step: 6,
              content: (
                <div className="pt-4 w-full">
                  <div className='text-white font-medium text-sm mt-2 mb-2'>Provide hashtags or keywords that the agent will use to follow relevant accounts</div>
                  <CharacterListInput
                    control={control}
                    register={register}
                    name="twitterQuery"
                  />
                </div>
              ),
            })
        }
        if (key === 'bio') {
          allTabs.push(
            {
              title: 'Bio',
              value: "bio",
              step: 2,
              content: (
                <div className="pt-4 w-full">
                  <div className='text-white font-medium text-sm mt-2 mb-2'>Create a compelling backstory that defines your character's identity</div>
                  <CharacterListInput
                    control={control}
                    register={register}
                    name="bio"
                  />
                </div>
              ),
            })
        }
        if (key === 'adjectives') {
          allTabs.push(
            {
              title: 'Adjectives',
              value: "adjectives",
              step: 4,
              content: (
                <div className="pt-4 w-full">
                  <div className='text-white font-medium text-sm mt-2 mb-2'>Add characteristics that embody the essence of your vision</div>
                  <CharacterListInput
                    control={control}
                    register={register}
                    name="adjectives"
                  />
                </div>
              ),
            })
        }
        if (key === 'lore') {
          allTabs.push(
            {
              title: 'Lore',
              value: "lore",
              step: 3,
              content: (
                <div className="pt-4 w-full">
                  <div className='text-white font-medium text-sm mt-2 mb-2'>Build the foundational journey that reveals your vision's roots</div>
                  <CharacterListInput
                    control={control}
                    register={register}
                    name="lore"
                  />
                </div>
              ),
            })
        }
        if (key === 'postExamples') {
          allTabs.push(
            {
              title: 'Post Examples',
              step: 9,
              value: "postExamples",
              content: (
                <div className="pt-4 w-full">
                  <div className='text-white font-medium text-sm mt-2 mb-2'>Provide examples of posts that your character would make</div>
                  <CharacterListInput
                    control={control}
                    register={register}
                    name="postExamples"
                  />
                </div>
              ),
            })
        }
        if (key === 'topics') {
          allTabs.push(
            {
              title: 'Topics',
              value: "topics",
              step: 5,
              content: (
                <div className="pt-4 w-full">
                  <div className='text-white text-sm font-medium mt-2 mb-2'>Add key topics and areas of expertise that will help achieve your vision</div>
                  <CharacterListInput
                    control={control}
                    register={register}
                    name="topics"
                  />
                </div>
              ),
            })
        }
     
        if (key === "style") {
          allTabs.push(
            {
              title: 'Style',
              value: "style",
              step: 8,
              content: (
                <div className="pt-4 w-full flex flex-col">
                  <div className="text-white text-sm font-medium mt-2 mb-2">Define General Interaction Style</div>
                  <CharacterListInput
                    control={control}
                    register={register}
                    name="styleAll"
                  />
                  <div className="text-white text-sm font-medium mt-8 mb-2">Define Chat Interaction Style</div>
                  <CharacterListInput
                    control={control}
                    register={register}
                    name="styleChat"
                  />
                  <div className="text-white text-sm font-medium mt-8 mb-2">Define Post Interaction Style</div>
                  <CharacterListInput
                    control={control}
                    register={register}
                    name="stylePost"
                  />
                </div>
              ),
            })
        }
        if (key === "messageExamples") {
          allTabs.push(
            {
              title: 'Reply Examples',
              value: "messageExamples",
              step: 10,
              content: (
                <div className="pt-4 w-full">
                  <div className="bg-white px-1.5 mb-2 font-semibold rounded-full text-violets-are-blue text-xs flex justify-center items-center w-max">{manageIdeaCopy.character.exampleOne}</div>
                  <div>
                    <Controller
                      name="messageExampleOneUser"
                      control={control}
                      rules={{ required: true }}
                      render={({
                        field, fieldState,
                      }) => {
                        const { error } = fieldState;
                        const {
                          ref, ...fieldProperties
                        } = field;
                        return (
                          <TextArea
                            id={field.name}
                            labelText={manageIdeaCopy.character.exampleUserLabel}
                            width="w-full"
                            placeholder="Provide an example"
                            error={!!error}
                            errorMessage={error?.message}
                            {...fieldProperties}
                          />
                        )
                      }}
                    />
                  </div>
                  <div>
                    <Controller
                      name="messageExampleOneAgent"
                      control={control}
                      rules={{ required: true }}
                      render={({
                        field, fieldState,
                      }) => {
                        const { error } = fieldState;
                        const {
                          ref, ...fieldProperties
                        } = field;
                        return (
                          <TextArea
                            id={field.name}
                            labelText={manageIdeaCopy.character.exampleAgentLabel}
                            width="w-full"
                            placeholder="Provide an example"
                            error={!!error}
                            errorMessage={error?.message}
                            {...fieldProperties}
                          />
                        )
                      }}
                    />
                  </div>
                  <div className="bg-white px-1.5 mb-2 font-semibold rounded-full text-violets-are-blue text-xs flex justify-center items-center w-max mt-8">{manageIdeaCopy.character.exampleTwo}</div>
                  <div>
                    <Controller
                      name="messageExampleTwoUser"
                      control={control}
                      rules={{ required: true }}
                      render={({
                        field, fieldState,
                      }) => {
                        const { error } = fieldState;
                        const {
                          ref, ...fieldProperties
                        } = field;
                        return (
                          <TextArea
                            id={field.name}
                            labelText={manageIdeaCopy.character.exampleUserLabel}
                            width="w-full"
                            placeholder="Provide an example"
                            error={!!error}
                            errorMessage={error?.message}
                            {...fieldProperties}
                          />
                        )
                      }}
                    />
                  </div>
                  <div>
                    <Controller
                      name="messageExampleTwoAgent"
                      control={control}
                      rules={{ required: true }}
                      render={({
                        field, fieldState,
                      }) => {
                        const { error } = fieldState;
                        const {
                          ref, ...fieldProperties
                        } = field;
                        return (
                          <TextArea
                            id={field.name}
                            labelText={manageIdeaCopy.character.exampleAgentLabel}
                            width="w-full"
                            placeholder="Provide an example"
                            error={!!error}
                            errorMessage={error?.message}
                            {...fieldProperties}
                          />
                        )
                      }}
                    />
                  </div>
                </div>
              ),
            })
        }
      })
      allTabs.push(
        {
          title: 'Auto Like Tweets',
          value: "twitterTargetUsers",
          step: 7,
          renderKey: renderKey,
          content: (
            <div className="pt-4 w-full">
              <div className='text-white text-sm font-medium mt-2 mb-2'>Automatically like recent tweets of selected users</div>
              <Controller
                name="favUsers"
                control={control}
                key={renderKey}
                rules={{ required: true }}
                render={({
                  field,
                }) => {
                  const onChangeMulti = async (selected: MultiValue<CategoryType> | null) => {
                    const newValue = selected?.map((category) => category.name.toString().replace(/@/g, "")) || []
                    field.onChange(newValue);
                    if (character && newValue) {
                      await updateCharacter(character, {
                        schedulingPosts: twitterSettings.schedulingPosts,
                        twitterTargetUsers: newValue.join(","),
                        followProfiles: twitterSettings.followProfiles,
                        processionActions: twitterSettings.processionActions,
                        postInterval: twitterSettings.postInterval * 60,
                        actionInterval: twitterSettings.actionInterval * 60 * 60 * 1000,
                        followInterval: twitterSettings.followInterval * 60 * 60 * 1000,
                      })
                      await mutateCharacter()
                    }

                  };
                  return (
                    <SelectTwitterUsers
                      id={field.name}
                      labelText=""
                      key={renderKey}
                      placeholder="Choose your favorite users"
                      disabled={false}
                      onChange={onChangeMulti}
                      value={createOptionValue(field.value || [])}
                      onCreateOption={updateTargetUsers}
                      options={[
                        ...dreamTwitterAccounts,
                        ...otherUsers,
                      ]}
                    />
                  )
                }}
              />
            </div>
          ),
        })
    }

    return allTabs
  }

  const onUpdateCharacter = async (data: CharacterFormType) => {
    if (!character) {
      return
    }
    const updatedCharacter = {
      ...character,
      ...data,
      bio: data.bio.map((bio) => {
        return bio.value
      }),
      adjectives: data.adjectives.map((adjective) => {
        return adjective.value
      }),
      lore: data.lore.map((lore) => {
        return lore.value
      }),
      postExamples: data.postExamples.map((postExample) => {
        return postExample.value
      }),
      topics: data.topics.map((topic) => {
        return topic.value
      }),
      style: {
        all: data.styleAll.map((style) => {
          return style.value
        }),
        chat: data.styleChat.map((style) => {
          return style.value
        }),
        post: data.stylePost.map((style) => {
          return style.value
        }),
      },
      twitterQuery: data.twitterQuery.map((query) => {
        return query.value
      }),
      messageExamples: [
        [
          {
            "user": "{{user1}}",
            "content": {
              "text": data.messageExampleOneUser,
            },
          },
          {
            "user": tokenInfo?.name || "",
            "content": {
              "text": data.messageExampleOneAgent,
            },
          },
        ],
        [
          {
            "user": "{{user1}}",
            "content": {
              "text": data.messageExampleTwoUser,
            },
          },
          {
            "user": tokenInfo?.name || "",
            "content": {
              "text": data.messageExampleTwoAgent,
            },
          },
        ],
      ],
      website: data.website,
    }
    await updateCharacter(updatedCharacter, {
      twitterTargetUsers: twitterSettings.twitterTargetUsers,
      schedulingPosts: twitterSettings.schedulingPosts,
      followProfiles: twitterSettings.followProfiles,
      processionActions: twitterSettings.processionActions,
      postInterval: twitterSettings.postInterval * 60,
      actionInterval: twitterSettings.actionInterval * 60 * 60 * 1000,
      followInterval: twitterSettings.followInterval * 60 * 60 * 1000,
    })
    await mutateCharacter()
  }

  const onUpdateSettings = async (value: boolean, key: string) => {
    if (character) {
      if (key === "schedulingPosts") {
        await updateCharacter(character, {
          schedulingPosts: value,
          twitterTargetUsers: twitterSettings.twitterTargetUsers,
          followProfiles: twitterSettings.followProfiles,
          processionActions: twitterSettings.processionActions,
          postInterval: twitterSettings.postInterval * 60,
          actionInterval: twitterSettings.actionInterval * 60 * 60 * 1000,
          followInterval: twitterSettings.followInterval * 60 * 60 * 1000,
        })
      }
      if (key === "followProfiles") {
        await updateCharacter(character, {
          schedulingPosts: twitterSettings.schedulingPosts,
          twitterTargetUsers: twitterSettings.twitterTargetUsers,
          followProfiles: value,
          processionActions: twitterSettings.processionActions,
          postInterval: twitterSettings.postInterval * 60,
          actionInterval: twitterSettings.actionInterval * 60 * 60 * 1000,
          followInterval: twitterSettings.followInterval * 60 * 60 * 1000,
        })
      }
      if (key === "processionActions") {
        await updateCharacter(character, {
          schedulingPosts: twitterSettings.schedulingPosts,
          twitterTargetUsers: twitterSettings.twitterTargetUsers,
          followProfiles: twitterSettings.followProfiles,
          processionActions: value,
          postInterval: twitterSettings.postInterval * 60,
          actionInterval: twitterSettings.actionInterval * 60 * 60 * 1000,
          followInterval: twitterSettings.followInterval * 60 * 60 * 1000,
        })
      }
      await mutateCharacter()
    }
  }

  const updateDuration = async (type: string, value: number) => {
    if (character) {
      if (type === "postInterval") {
        setPostInterval(value)
        await updateCharacter(character, {
          schedulingPosts: twitterSettings.schedulingPosts,
          twitterTargetUsers: twitterSettings.twitterTargetUsers,
          followProfiles: twitterSettings.followProfiles,
          processionActions: twitterSettings.processionActions,
          postInterval: value * 60,
          actionInterval: twitterSettings.actionInterval * 60 * 60 * 1000,
          followInterval: twitterSettings.followInterval * 60 * 60 * 1000,
        })
      }
      if (type === "followInterval") {
        setFollowInterval(value)
        await updateCharacter(character, {
          schedulingPosts: twitterSettings.schedulingPosts,
          twitterTargetUsers: twitterSettings.twitterTargetUsers,
          followProfiles: twitterSettings.followProfiles,
          processionActions: twitterSettings.processionActions,
          postInterval: twitterSettings.postInterval * 60,
          actionInterval: twitterSettings.actionInterval * 60 * 60 * 1000,
          followInterval: value * 60 * 60 * 1000,
        })
      }
      if (type === "actionInterval") {
        setActionInterval(value)
        await updateCharacter(character, {
          schedulingPosts: twitterSettings.schedulingPosts,
          twitterTargetUsers: twitterSettings.twitterTargetUsers,
          followProfiles: twitterSettings.followProfiles,
          processionActions: twitterSettings.processionActions,
          postInterval: twitterSettings.postInterval * 60,
          actionInterval: value * 60 * 60 * 1000,
          followInterval: twitterSettings.followInterval * 60 * 60 * 1000,
        })
      }
      await mutateCharacter()
    }
  }

  return (
    <div>
      {(isFetchingAgents || isStopping || isUpdatingCharacter) && <Loader />}
      <MultiStepLoader
        loadingStates={agentLoadingStates}
        loading={isSubmitting || changingTone}
        duration={3000}
      />
      {twitterAgent && (
        <DefaultModal
          isOpen={reviewAgenda}
          onClose={() => setReviewAgenda(false)}      
        >
          <CharacterReview 
            currentTone={twitterAgent?.tone || ''}
            tokenInfo={tokenInfo}
            character={character}
            postInterval={postInterval}
            followInterval={followInterval}
            actionInterval={actionInterval}
            setFollowInterval={setFollowInterval}
            setActionInterval={setActionInterval}
            setPostInterval={setPostInterval}
            updateCharacter={updateCharacter}
            dreamTwitterAccounts={dreamTwitterAccounts}
            mutateCharacter={mutateCharacter}
            setReviewAgenda={setReviewAgenda}
            twitterSettings={twitterSettings}
            setChangingTone={setChangingTone}
            onUpdateCharacter={onUpdateCharacter}
            onUpdateSettings={onUpdateSettings}
            updateDuration={updateDuration}
          />
        </DefaultModal>
      )}
      {twitterAgent?.status === "started" ? (
        <>
          <div className="mb-1 font-medium text-violets-are-blue">{manageIdeaCopy.engagement}</div>
          <div className="grid grid-cols-2 md:flex gap-1 md:flex-row md:gap-2 w-full">
            <div className="col-span-2 flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 md:p-4 flex items-center flex-col border border-white/5">
              <div className="text-lg text-neutral-200 font-medium"><AnimatedText text={twitterSettings.numTweets.toString()} /></div>
              <div className="text-xs md:text-sm text-neutral-300 text-center">{twitterSettings.numTweets > 1 ? manageIdeaCopy.tweets : manageIdeaCopy.tweetsSingular}</div>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 md:p-4 flex items-center flex-col border border-white/5">
              <div className="text-lg text-neutral-200 font-medium"><AnimatedText text={twitterSettings.numReplies.toString()} /></div>
              <div className="text-xs md:text-sm text-neutral-300 text-center">{twitterSettings.numReplies > 1 ? manageIdeaCopy.replies : manageIdeaCopy.repliesSingular}</div>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 md:p-4 flex items-center flex-col border border-white/5">
              <div className="text-lg text-neutral-200 font-medium"><AnimatedText text={twitterSettings.numFollowed.toString()} /></div>
              <div className="text-xs md:text-sm text-neutral-300 text-center">{twitterSettings.numFollowed > 1 ? manageIdeaCopy.followers : manageIdeaCopy.followersSingular}</div>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 md:p-4 flex items-center flex-col border border-white/5">
              <div className="text-lg text-neutral-200 font-medium"><AnimatedText text={twitterSettings.numLikes.toString()} /></div>
              <div className="text-xs md:text-sm text-neutral-300 text-center">{twitterSettings.numLikes > 1 ? manageIdeaCopy.likes : manageIdeaCopy.likesSingular}</div>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 md:p-4 flex items-center flex-col border border-white/5">
              <div className="text-lg text-neutral-200 font-medium"><AnimatedText text={twitterSettings.numRetweets.toString()} /></div>
              <div className="text-xs md:text-sm text-neutral-300 text-center">{twitterSettings.numRetweets > 1 ? manageIdeaCopy.retweets : manageIdeaCopy.retweetsSingular}</div>
            </div>
          </div>
          <div className="text-violets-are-blue mb-1 font-medium mt-8">{manageIdeaCopy.manageAgent}</div>
          <div className="flex gap-2 mt-2 md:flex-row flex-col">
            <button
              type="button"
              onClick={() => setViewCharacter(!viewCharacter)}
              className={`flex items-center justify-center text-white rounded-full outline-none
                  transition-all duration-150 ease-in-out px-3 py-2 md:py-1 font-medium  text-xs ring-1 ring-white
                  gap-2 ring-inset hover:bg-white/15`}
            >
              {viewCharacter ? manageIdeaCopy.twitterForm.hideCharacter : manageIdeaCopy.twitterForm.viewCharacter}
            </button>
            <ChangeTone
              currentTone={twitterAgent.tone || ''}
              tokenInfo={tokenInfo}
              character={character}
              updateCharacter={updateCharacter}
              mutateCharacter={mutateCharacter}
              twitterSettings={twitterSettings}
              setChangingTone={setChangingTone}
            />
            <button
              type="button"
              onClick={handleStopAgent}
              className={`flex items-center justify-center text-white rounded-full outline-none
                  transition-all duration-150 ease-in-out px-3 py-2 md:py-1 font-medium  text-xs ring-1 ring-white
                  gap-2 ring-inset hover:bg-white/15`}
            >
              {manageIdeaCopy.twitterForm.stopAgent}
            </button>
          </div>
          <form onSubmit={handleSubmit(onUpdateCharacter)} className={`${viewCharacter ? "max-h-[3000px] opacity-100" : "opacity-0 max-h-0 overflow-hidden"} w-full transition-all duration-300 ease-in-out`}>
            <div className="text-violets-are-blue mt-6 mb-1 font-medium">{manageIdeaCopy.agentSettings}</div>
            <div className="flex gap-2 flex-col">
              <div className="rounded-2xl px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/5">
                <div className="flex gap-2 items-center justify-between">
                  <div>
                    <div className="text-neutral-200 font-medium">{manageIdeaCopy.enablePosts}</div>
                    <div className="text-neutral-400 text-xs">{manageIdeaCopy.enablePostsDescription}</div>
                  </div>
                  <Switch checked={twitterSettings.schedulingPosts} onCheckedChange={(value) => onUpdateSettings(value, 'schedulingPosts')} />
                </div>
                <div className="flex  gap-2 items-center justify-between mt-2">
                  <div>
                    <div className="text-neutral-200 font-medium">{manageIdeaCopy.postInterval}</div>
                    <div className="text-neutral-400 text-xs">{manageIdeaCopy.postIntervalDesc}</div>
                  </div>
                  <NumberInput
                    min={1}
                    step={1}
                    value={postInterval}
                    setValue={setPostInterval}
                    onChange={(value) => updateDuration("postInterval", value)}
                    placeholder="1"
                  />
                </div>
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/5">
                <div className="flex gap-2 items-center justify-between">
                  <div>
                    <div className="text-neutral-200 font-medium">{manageIdeaCopy.enableActions}</div>
                    <div className="text-neutral-400 text-xs">{manageIdeaCopy.enableActionsDescription}</div>
                  </div>
                  <Switch checked={twitterSettings.processionActions} onCheckedChange={(value) => onUpdateSettings(value, 'processionActions')} />
                </div>
                <div className="flex  gap-2 items-center justify-between mt-2">
                  <div>
                    <div className="text-neutral-200 font-medium">{manageIdeaCopy.interactionInterval}</div>
                    <div className="text-neutral-400 text-xs">{manageIdeaCopy.interactionIntervalDesc}</div>
                  </div>
                  <NumberInput
                    min={1}
                    step={1}
                    value={actionInterval}
                    setValue={setActionInterval}
                    onChange={(value) => updateDuration("actionInterval", value)}
                    placeholder="1"
                  />
                </div>
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/5">
                <div className="flex gap-2 items-center justify-between ">
                  <div>
                    <div className="text-neutral-200 font-medium">{manageIdeaCopy.enableFollowing}</div>
                    <div className="text-neutral-400 text-xs">{manageIdeaCopy.enableFollowDescription}</div>
                  </div>
                  <Switch checked={twitterSettings.followProfiles} onCheckedChange={(value) => onUpdateSettings(value, 'followProfiles')} />
                </div>
                <div className="flex  gap-2 items-center justify-between mt-2">
                  <div>
                    <div className="text-neutral-200 font-medium">{manageIdeaCopy.followInterval}</div>
                    <div className="text-neutral-400 text-xs">{manageIdeaCopy.followIntervalDesc}</div>
                  </div>
                  <NumberInput
                    min={1}
                    step={1}
                    value={followInterval}
                    setValue={setFollowInterval}
                    onChange={(value) => updateDuration("followInterval", value)}
                    placeholder="1"
                  />
                </div>
              </div>
            </div>
            <div className="text-violets-are-blue mt-6 mb-2 font-medium">{manageIdeaCopy.modifyCharacter}</div>
            {character ?
              <Tabs tabs={tabs()} />
              : <div className="pt-8 flex justify-center"><CircularSpinner /></div>
            }
            <div className="flex justify-end mt-4">
              <Button
                size="sm"
                type="submit"
                disabled={!isValid || !isDirty}
                variant="secondary"
                className="transition-all disabled:cursor-not-allowed gap-2 !px-4 disabled:from-han-purple/50 disabled:to-tulip/50 !py-2 !rounded-xl !text-xs w-full md:w-auto duration-150 hover:enabled:from-han-purple/70
                hover:enabled:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium"
              >
                {manageIdeaCopy.twitterForm.updateCharacter}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <StartTwitter onStartAgent={onStartAgent} />
      )}
    </div>
  );
}
