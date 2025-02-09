import { 
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
import { KeyedMutator } from 'swr';
import { 
  Controller, useForm,
} from 'react-hook-form';
import { 
  ChevronLeft, 
  ChevronRight, 
  SkipForward,
} from 'lucide-react';
import { 
  Input, ReviewProgress, Switch,
} from '@/common/components/molecules';
import { 
  SelectTwitterUsers,
  TextArea,
} from '@/common/components/atoms';
import { yupResolver } from "@hookform/resolvers/yup";
import lang from '@/common/lang';
import NumberInput from '@/common/components/atoms/numberInput';
import { MultiValue } from 'react-select';
import { CategoryType } from '@/app/new/types';
import { SelectTone } from './selectTone';
import { characterSchema } from "../validationSchema";
import { CharacterListInput } from './characterListInput';
import { 
  CharacterFormType, CharacterType, GET_CHARACTER_DTO, Settings, TokenType,
} from "../types";


const { manageIdea: manageIdeaCopy } = lang

export const CharacterReview = ({
  currentTone,
  tokenInfo,
  character,
  updateCharacter,
  setReviewAgenda,
  mutateCharacter,
  twitterSettings,
  onUpdateCharacter,
  onUpdateSettings,
  setChangingTone,
  updateDuration,
  postInterval,
  setPostInterval,
  actionInterval,
  setActionInterval,
  followInterval,
  dreamTwitterAccounts,
  setFollowInterval,
} : {
  currentTone: string;
  tokenInfo: TokenType | null;
  dreamTwitterAccounts: Array<CategoryType> | [];
  character: CharacterType | null;
  onUpdateCharacter: (data: CharacterFormType) => void;
  setReviewAgenda: (value: boolean) => void;
  onUpdateSettings: (value: boolean, key: string) => void;
  updateDuration: (type: string, value: number) => void;
  postInterval: number;
  setPostInterval: (value: number) => void;
  actionInterval: number;
  setActionInterval: (value: number) => void;
  followInterval: number;
  setFollowInterval: (value: number) => void;
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
  const [currentStep, setCurrentStep] = useState(0);
  const [otherUsers, setOtherUsers] = useState<Array<CategoryType> | []>([]);
  const stepsCount = 13;

  const {
    handleSubmit,
    control,
    setValue,
    register,
    trigger,
    getValues,
  } = useForm<CharacterFormType>({
    resolver: yupResolver(characterSchema),
    mode: 'onBlur',
    defaultValues: {
      systemFrontend: '',
      website: '',
      bio: [],
      adjectives: [],
      favUsers: [],
      topics: [],
      lore: [],
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

  useEffect(() => {
    if (character && twitterSettings) {
      const { 
        systemFrontend, 
        website,
        bio, 
        adjectives,
        topics,
        lore,
        postExamples,
        style,
        messageExamples,
        twitterQuery,
      } = character
      setValue('systemFrontend', systemFrontend.trim())
      const twitterUsers = twitterSettings.twitterTargetUsers ? twitterSettings.twitterTargetUsers.split(',') : []
      setValue('favUsers', twitterUsers)
      setValue('website', website)
      setValue('bio', bio.map((value, index) => {
        return {
          value: value.trim(),
          id: index.toString(),
        }
      }).filter((value, index) => index < 3))
      setValue('adjectives', adjectives.map((value, index) => {
        return {
          value: value.trim(),
          id: index.toString(),
        }
      }).filter((value, index) => index < 6))
      setValue('topics', topics.map((value, index) => {
        return {
          value: value.trim(),
          id: index.toString(),
        }
      }).filter((value, index) => index < 6))
      setValue('lore', lore.map((value, index) => {
        return {
          value: value.trim(),
          id: index.toString(),
        }
      }).filter((value, index) => index < 4))
      setValue('postExamples', postExamples.map((value, index) => {
        return {
          value: value.trim(),
          id: index.toString(),
        }
      }).filter((value, index) => index < 5))
      setValue('styleAll', style.all.map((value, index) => {
        return {
          value: value.trim(),
          id: index.toString(),
        }
      }).filter((value, index) => index < 5))
      setValue('styleChat', style.chat.map((value, index) => {
        return {
          value: value.trim(),
          id: index.toString(),
        }
      }).filter((value, index) => index < 5))
      setValue('stylePost', style.post.map((value, index) => {
        return {
          value: value.trim(),
          id: index.toString(),
        }
      }).filter((value, index) => index < 5))
      setValue('messageExampleOneUser', messageExamples[0][0].content.text.trim())
      setValue('messageExampleOneAgent', messageExamples[0][1].content.text.trim())
      setValue('messageExampleTwoUser', messageExamples[1][0].content.text.trim())
      setValue('messageExampleTwoAgent', messageExamples[1][1].content.text.trim())
      setValue('twitterQuery', twitterQuery.map((value, index) => {
        return {
          value: value.trim(),
          id: index.toString(),
        }
      }).filter((value, index) => index < 5))
    }

  }, [character, setValue, twitterSettings])

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
        trigger('favUsers')
      }, 1000)
    }
  }, [character, getValues, setValue, twitterSettings, updateCharacter, mutateCharacter, dreamTwitterAccounts, trigger])
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

  const currentItem = useMemo(() => {
    const steps = [
      {
        id: 1,
        title: "Define Your Character's Voice",
        description: 'Select a distinct personality and communication style that will shape how your character interacts with others and responds to different situations',
        content: (
          <SelectTone
            currentTone={currentTone || ''}
            tokenInfo={tokenInfo}
            character={character}
            updateCharacter={updateCharacter}
            mutateCharacter={mutateCharacter}
            twitterSettings={twitterSettings}
            setChangingTone={setChangingTone}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            stepsCount={stepsCount}
          />
        ),
      },
      {
        id: 2,
        title: 'Set Your Mission',
        description: "Define your character's core drives, values and goals to shape their decisions. Please add relevant links to support your dreams's development and backstory",
        content: (
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
            <div>
              <div className='text-white/60 text-sm mt-4 mb-2'>Product Link</div>
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
                      placeholder="https://web3it.ai"
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
      },
      {
        id: 3,
        title: 'Configure Capabilities',
        description: "Customize your character's permissions and behavioral boundaries to determine how they can interact with the world",
        content: (
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
        ),
      },
      {
        id: 4,
        title: 'Craft Your Background',
        description: "Create a compelling backstory that defines your character's identity",
        content: (
          <div className="w-full">
            <CharacterListInput
              control={control}
              key="bio"
              register={register}
              name="bio"
            />
          </div>
        ),
      },
      {
        id: 5,
        title: 'Establish Your Origin Story',
        description: "Build the foundational journey that reveals your vision's roots",
        content: (
          <div className="pt-4 w-full overflow-y-auto md:overflow-visible max-h-[50vh] md:max-h-full px-2 md:p-0 py-2">
            <CharacterListInput
              control={control}
              key="lore"
              register={register}
              name="lore"
            />
          </div>
        ),
      },
      {
        id: 6,
        title: 'Define Knowledge Areas',
        description: "Add key topics and areas of expertise that will help achieve your vision",
        content: (
          <div className="pt-4 w-full">
            <CharacterListInput
              key="topics"
              control={control}
              register={register}
              name="topics"
            />
          </div>
        ),
      },
      {
        id: 7,
        title: 'Define Core Traits',
        description: "Add characteristics that embody the essence of your vision",
        content: (
          <div className="pt-4 w-full">
            <CharacterListInput
              control={control}
              key="adjectives"
              register={register}
              name="adjectives"
            />
          </div>
        ),
      },
      {
        id: 8,
        title: 'Twitter Query',
        description: "Provide hashtags or keywords that the agent will use to follow relevant accounts",
        content: (
          <div className="pt-4 w-full">
            <CharacterListInput
              control={control}
              key="twitterQuery"
              register={register}
              name="twitterQuery"
            />
          </div>
        ),
      },
      {
        id: 9,
        title: 'Auto Like Tweets',
        description: "Automatically like recent tweets of selected users",
        content: (
          <div className="pt-4 w-full">
            <Controller
              name="favUsers"
              control={control}
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
                    key="modal-favUsers"
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
      },
      {
        id: 10,
        title: 'Define General Interaction Style',
        description: "Add characteristics to your conversations and replies",
        content: (
          <div className="pt-4 w-full overflow-y-auto md:overflow-visible max-h-[50vh] md:max-h-full px-2 md:p-0 py-2">
            <CharacterListInput
              control={control}
              key="styleAll"
              register={register}
              name="styleAll"
            />
          </div>
        ),
      },
      {
        id: 11,
        title: 'Define Chat Interaction Style',
        description: "Add characteristics to your conversations and replies",
        content: (
          <div className="pt-4 w-full overflow-y-auto md:overflow-visible max-h-[50vh] md:max-h-full px-2 md:p-0 py-2">
            <CharacterListInput
              control={control}
              key="styleChat"
              register={register}
              name="styleChat"
            />
          </div>
        ),
      },
      {
        id: 12,
        title: 'Define Post Interaction Style',
        description: "Add characteristics to your conversations and replies",
        content: (
          <div className="pt-4 w-full overflow-y-auto md:overflow-visible max-h-[50vh] md:max-h-full px-2 md:p-0 py-2">
            <CharacterListInput
              control={control}
              key="stylePost"
              register={register}
              name="stylePost"
            />
          </div>
        ),
      },
      {
        id: 13,
        title: 'Post Examples',
        description: "Provide examples of posts that your character would make",
        content: (
          <div className="pt-4 w-full overflow-y-auto md:overflow-visible max-h-[50vh] md:max-h-full px-2 md:p-0 py-2">
            <CharacterListInput
              control={control}
              key="postExamples"
              register={register}
              name="postExamples"
            />
          </div>
        ),
      },
      {
        id: 14,
        title: 'Conversation Examples',
        description: "Provide examples of conversations that your character would have",
        content: (
          <div className="pt-4 w-full overflow-y-auto md:overflow-visible max-h-[50vh] md:max-h-full px-2 md:p-0 py-2">
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
      },
    ]
    return steps[currentStep];
  }, [
    currentStep, 
    character, 
    control, 
    currentTone, 
    mutateCharacter, 
    register, 
    actionInterval, 
    followInterval, 
    setChangingTone, 
    tokenInfo, 
    twitterSettings, 
    updateCharacter,
    onUpdateSettings,
    postInterval,
    setActionInterval,
    setFollowInterval,
    setPostInterval,
    updateDuration,
    createOptionValue,
    dreamTwitterAccounts,
    otherUsers,
    updateTargetUsers,
  ])
  
  const handleNext = async (data: CharacterFormType) => {
    await onUpdateCharacter(data);
    if (currentStep === stepsCount - 1) {
      setReviewAgenda(false)
    } else {
      setCurrentStep(currentStep + 1);
    }
  }

  return (
    <form className='px-6 py-4' onSubmit={handleSubmit(handleNext)}>
      <h4 className="text-white font-semibold text-xl md:text-2xl">{currentItem.title}</h4>
      <h5 className="text-white/60 text-sm md:text-base mt-2 mb-2">{currentItem.description}</h5>
      {currentItem.content}
      {currentStep === 0 ? null : (
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
            onClick={() => {
              if (currentStep === stepsCount - 1) {
                setReviewAgenda(false)
              } else {
                setCurrentStep(currentStep + 1)
              }
            }}
            className={`flex items-center justify-center text-white rounded-full outline-none
                transition-all duration-150 ease-in-out px-4 py-1.5 font-medium disabled:bg-white/50 disabled:cursor-not-allowed ring-1 ring-white
                gap-1 ring-inset hover:bg-white/15`}
          >
            <SkipForward width={16} height={16} />
            {manageIdeaCopy.skip}
          </button>
          <button
            type="submit"
            className={`flex items-center justify-center text-white rounded-full outline-none
                transition-all duration-150 ease-in-out px-4 py-1.5 font-medium disabled:bg-white/50 disabled:cursor-not-allowed ring-1 ring-white
                gap-1 ring-inset hover:bg-white/15`}
          >
            <ChevronRight width={16} height={16} />
            {manageIdeaCopy.next}
          </button>
        </div>
      )}
      <div className='mt-4'>
        <ReviewProgress
          value={(currentStep / stepsCount) * 100}
          className="h-1 bg-white/10 group-hover:bg-white/15 transition-colors"
        />
      </div>
    </form>
  );  
}