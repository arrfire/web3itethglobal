'use client'
import { useState } from 'react';
import {
  Loader,
  MultiSelectAndCustomTags,
} from '@/common/components/atoms';
import Image from 'next/image';
import {
  Controller,
} from "react-hook-form";
import { MultiValue } from "react-select";
import { Input } from '@/common/components/molecules';
import { v4 } from "uuid";
import Lottie from "react-lottie";
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  abbreviateNumber,
} from '@/utils/helpers';
import {
  Button,
  TextArea,
} from '@/common/components/atoms';
import { blurDataUrl } from '@/common/utils/blurDataUrl';
import lang from '@/common/lang';
import {
  DefaultModal,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTriggerCreateToken as ModalTrigger,
} from "@/common/components/organisms";
import toast from 'react-hot-toast';
import Link from 'next/link';
import { routes } from '@/common/routes';
import { usePrivy } from '@privy-io/react-auth';
import { ImageSelectionAndUpload } from './imageSelectionAndUpload';
import { useCreateToken } from './useCreateToken';
import { AIEditor } from './aIEditor';
import {
  getCurrency, SupabaseTables,
} from '@/common/constants';
import { createClient } from '@/common/utils/supabase/client';
import { CategoryType } from './types';
import * as coinAnimData from '@/common/lottie/coin-animation.json'
import * as docData from '@/common/lottie/restart-animation.json'
import * as piggyData from '@/common/lottie/piggy-animation.json'

const { createIdea: {
  form: formCopy,
  validationErrors,
  tokenCreationFeeLabel,
  maxSupplyLabel,
  initialMintLabel,
  tokensSuffix,
  targetInfoPart1,
  targetInfoPart2,
} } = lang

export const CreateToken = ({
  setIdeaStatusCreated,
  ideaStatusCreated,
  isFundingReached,
  setIsFundingReached,
} : {
    setIdeaStatusCreated: (status: boolean) => void;
    isFundingReached: boolean;
    setIsFundingReached: (status: boolean) => void;
    ideaStatusCreated: boolean;
}) => {
  const searchParams = useSearchParams()
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [enableDocAnim, setEnableDocAnim] = useState(false)
  const createdIdeaId = searchParams.get('ideaId')
  const supabase = createClient();
  const {
    authenticated, login,
  } = usePrivy()
  const docOptions = {
    loop: true,
    autoplay: false,
    animationData: docData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const [enablePiggyAnim, setEnablePiggyAnim] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const piggyOptions = {
    loop: true,
    autoplay: false,
    animationData: piggyData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const {
    control,
    handleSubmit,
    onSubmit,
    setValue,
    getValues,
    imageProcessing,
    isIdeaFetching,
    isLoading,
    redirectId,
    redirectSubdomain,
    isPending,
    websiteUrl,
    isSupabaseSubmitting,
    categories,
    isCategoriesLoading,
    mutateCategories,
    addCategory,
    isAddingCategory,
    isValid,
    trigger,
    highlightError,
    setError,
    handleNewImage,
  } = useCreateToken({
    ideaStatusCreated,
    setShowSuccess,
    setIdeaStatusCreated,
    setIsFundingReached,
    setOpenConfirmation,
  })

  const coinAnimOptions = {
    loop: true,
    autoplay: true,
    animationData: coinAnimData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const onCreateOption = async (option:string) => {
    const newCategory = {
      value: option,
      id: v4(),
    }
    await addCategory(newCategory);
    setValue("categories", [...getValues("categories") || [], newCategory.id.toString()]);
    mutateCategories();
  }

  const createOptionValue = (field: string[]) => {
    const ans = categories?.flatMap((category) => field?.includes(category.id.toString()) ? category : []);
    return ans;
  }
  return (
    <div className='flex-1 w-full max-w-[1280px]'>
      {(isPending || isLoading || isSupabaseSubmitting || imageProcessing || isIdeaFetching) && !showSuccess && <Loader />}

      <DefaultModal
        isOpen={showSuccess}
        maxWidth="max-w-[420px]"
        onClose={() => {
          router.push(routes.projectDetailPath.replace('%subdomain%', redirectSubdomain))
        }}      
      >
        <div className='px-6 py-4'>
          <h4 className="text-white font-semibold text-xl md:text-2xl">Congrats</h4>
          <h5 className="text-white/80 text-sm md:text-base mt-2 mb-2">You are the proud owner of this fab Dream.<br/> Check out your Dream or Accelerate your Dream.</h5>
          <div className='flex items-center md:flex-row flex-col gap-2 mt-6'>
            <Link
              href={routes.projectDetailPath.replace('%subdomain%', redirectSubdomain)}
              prefetch={true}
              className={`flex items-center justify-center flex-1 w-full text-white rounded-2xl outline-none px-6 py-3 text-base
              disabled:cursor-not-allowed ease-in-out transition-all gap-2 duration-150 hover:from-han-purple/70
              hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium`}
            >
              View Dream
            </Link>
            <Link
              href={`${routes.reviewPlan}?ideaId=${redirectId}`}
              prefetch={true}
              className={`flex items-center justify-center flex-1 w-full text-white rounded-2xl outline-none
              transition-all duration-150 ease-in-out px-6 py-3 font-medium text-base ring-1 ring-white
              gap-2 ring-inset hover:bg-white/15`}
            >
              Accelerate Dream
            </Link>
          </div>
        </div>
      </DefaultModal>

      <form onSubmit={handleSubmit(onSubmit)} className='relative w-full rounded-3xl pt-5'>
        <div className='flex flex-col xl:flex-row gap-6 xl:gap-12'>
          <div className='flex-1 flex flex-col gap-4'>
            <div className='text-lg text-neutral-300 font-semibold'>{formCopy.dreamDetails}</div>
            <div className="relative flex gap-4 flex-col md:flex-row">
              <Controller
                name="name"
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
                    <AIEditor
                      state={getValues()}
                      setValue={setValue}
                      id={field.name}
                      isGeneratedThroughAI={!isFundingReached && !ideaStatusCreated}
                    >
                      <Input
                        id={field.name}
                        labelText={formCopy.name}
                        disabled={isFundingReached || ideaStatusCreated}
                        placeholder="Dream Title"
                        error={!!error}
                        errorMessage={error?.message}
                        {...fieldProperties}
                        width="w-full"
                      />
                    </AIEditor>
                  )
                }}
              />
              <Controller
                name="ticker"
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
                    <AIEditor
                      state={getValues()}
                      setValue={setValue}
                      id={field.name}
                      isGeneratedThroughAI={!isFundingReached && !ideaStatusCreated}
                    >
                      <Input
                        id={field.name}
                        labelText={formCopy.ticker}
                        disabled={isFundingReached || ideaStatusCreated}
                        placeholder="Token Symbol"
                        error={!!error}
                        errorMessage={error?.message}
                        {...fieldProperties}
                        width="w-full"
                      />
                    </AIEditor>
                  )
                }}
              />
            </div>
            {getValues('address') ? (
              <div className="relative">
                <Controller
                  name="address"
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
                        labelText={formCopy.address}
                        placeholder="Address"
                        disabled={true}
                        error={!!error}
                        errorMessage={error?.message}
                        {...fieldProperties}
                        width="w-full"
                      />
                    )
                  }}
                />
              </div>
            ) : null}
            <div className="relative">
              <Controller
                name="description"
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
                    <AIEditor
                      state={getValues()}
                      setValue={setValue}
                      id={field.name}
                      isGeneratedThroughAI={true}
                    >
                      <TextArea
                        id={field.name}
                        labelText={formCopy.description}
                        placeholder="Describe your project's vision, goals, and how it solves real problems"
                        error={!!error}
                        errorMessage={error?.message}
                        {...fieldProperties}
                        width="w-full"
                      />
                    </AIEditor>
                  )
                }}
              />
            </div>
            <div className="relative">
              <Controller
                name="categories"
                control={control}
                rules={{ required: true }}
                render={({
                  field, fieldState,
                }) => {
                  const { error } = fieldState;
                  const onChangeMulti = (selected: MultiValue<CategoryType> | null) => {
                    field.onChange(selected?.map((category) => category.id.toString()) || []);
                    trigger('categories')
                  };
                  return (
                    <MultiSelectAndCustomTags
                      id={field.name}
                      labelText={formCopy.category}
                      placeholder="Choose your project category"
                      disabled={false}
                      isLoading={isCategoriesLoading || isAddingCategory}
                      onCreateOption={onCreateOption}
                      onChange={onChangeMulti}
                      value={createOptionValue(field.value || [])}
                      options={categories}
                      error={!!error}
                      errorMessage={error?.message}
                    />
                  )
                }}
              />
            </div>
            <div className='text-lg text-neutral-300 font-semibold mt-6 xl:mt-12'>{formCopy.brandingDetails}</div>
            <div className="relative">
              <Controller
                name="imageUrl"
                control={control}
                rules={{ required: true }}
                render={({
                  field, fieldState,
                }) => {
                  const { error } = fieldState;
                  const {
                    ref, value,
                  } = field;
                  return (
                    <AIEditor
                      state={getValues()}
                      setValue={setValue}
                      id={field.name}
                      isGeneratedThroughAI={true}
                    >
                      <ImageSelectionAndUpload
                        trigger={trigger}
                        disabled={false}
                        id={field.name}
                        errorField={!!error}
                        errorMessage={error?.message}
                        setValue={setValue}
                        value={value}
                      />
                    </AIEditor>
                  )
                }}
              />
            </div>
            <div className="relative flex gap-4 flex-col md:flex-row">
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
                      labelText={formCopy.website}
                      placeholder="https://dream.xyz"
                      error={!!error}
                      errorMessage={error?.message}
                      {...fieldProperties}
                      width="w-full"
                    />
                  )
                }}
              />
            </div>
            <div className="relative">
              {websiteUrl.includes("bronze-deep-gazelle-81") ? (
                <AIEditor
                  state={getValues()}
                  handleNewImage={handleNewImage}
                  id="website"
                  isGeneratedThroughAI={true}
                >
                  <label className={`block text-sm font-medium text-white`}>
                    {formCopy.websitePreview}
                  </label>
                  <div className="w-full h-auto rounded-2xl overflow-hidden mt-2 bg-eerie-black shadow-sm shadow-white">
                    <Image
                      src={websiteUrl}
                      alt="pinata"
                      width={400}
                      height={200}
                      placeholder="blur"
                      blurDataURL={blurDataUrl}
                      className="w-full h-auto"
                      quality={50}
                    />
                  </div>
                </AIEditor>
              ) : null}
            </div>
          </div>
          <div className='flex-1 flex flex-col gap-4'>
            <div className='text-lg text-neutral-300 font-semibold'>{formCopy.communityChannels}</div>
            <Controller
              name="twitter"
              control={control}
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
                    labelText={formCopy.twitter}
                    placeholder="https://x.com/DreamStarterXYZ"
                    error={!!error}
                    errorMessage={error?.message}
                    optionalText={(
                      <div className="text-neutral-500 text-xs font-medium">{formCopy.optional}</div>
                    )}
                    {...fieldProperties}
                    width="w-full"
                  />
                )
              }}
            />
            <Controller
              name="telegram"
              control={control}
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
                    labelText={formCopy.telegram}
                    placeholder="https://t.me/dreamstarterxyz"
                    error={!!error}
                    errorMessage={error?.message}
                    optionalText={(
                      <div className="text-neutral-500 text-xs font-medium">{formCopy.optional}</div>
                    )}
                    {...fieldProperties}
                    width="w-full"
                  />
                )
              }}
            />
          </div>
        </div>
        <div className='flex md:px-0 justify-center flex-col md:flex-row gap-4 mt-12 pb-8 relative'>
          {Boolean(createdIdeaId) && (
            <Link
              href={routes.createProjectPath}
              prefetch={true}
              onMouseEnter={() => setEnableDocAnim(true)}
              onMouseLeave={() => setEnableDocAnim(false)}
              className={`flex items-center justify-center text-white rounded-2xl outline-none
              transition-all duration-150 ease-in-out px-6 !py-2.5 font-medium text-base ring-1 ring-white
              gap-2 ring-inset hover:bg-white/15`}
            >
              {formCopy.generateButtonLabel}
              <Lottie options={docOptions}
                isStopped={!enableDocAnim}
                style={{ margin: '0' }}
                height={20}
                width={20}
              />
            </Link>
          )}
          <Modal>
            <ModalTrigger setIsModalOpen={setOpenConfirmation} onClick={async () => {
              if (!isValid) {
                await trigger()
                highlightError()
                return false
              }
              if (getValues('website').trim() === '' && !Boolean(createdIdeaId)) {
                setError('website', {
                  type: 'required',
                  message: validationErrors.websiteRequired,
                })
                highlightError()
                return false
              }
              if (!authenticated) {
                login()
                return false
              }
              if (ideaStatusCreated) {
                onSubmit(getValues())
                return false
              }
              const baseTicker = getValues('ticker').toLowerCase().replace(/[^a-z0-9]/g, '');
              const { data: existingDomains } = await supabase
                .from(SupabaseTables.Subdomains)
                .select('subdomain')
                .ilike('subdomain', `${baseTicker}%`);
              if (existingDomains?.length) {
                toast.success(formCopy.subdomainExisting);
              }
              setOpenConfirmation(true)
              return true
            }}>
              {authenticated ? formCopy.submitLabel : (isValid ? formCopy.connectWallet : formCopy.submitLabel)}
            </ModalTrigger>
            <ModalBody isModalOpen={openConfirmation} setIsModalOpen={setOpenConfirmation}>
              <ModalContent>
                <h4 className="text-white font-semibold text-xl md:text-2xl ml-6 pt-4">{formCopy.createIdea}</h4>
                <div className='pointer-events-none md:block hidden'>
                  <Lottie
                    options={coinAnimOptions}
                    height={100}
                    width={100}
                  />
                </div>
                <div className='flex flex-col items-center px-6'>
                  <div className='flex gap-8 mt-4 sm:justify-center justify-between'>
                    <p className="text-neutral-200 text-xs md:text-sm font-semibold flex flex-col items-center">
                      <span className='font-normal'>{tokenCreationFeeLabel}</span>
                      <span>{process.env.NEXT_PUBLIC_IDEA_CREATION_FEE || ''} {getCurrency()}</span>
                    </p>
                    <p className="text-neutral-200 text-xs md:text-sm font-semibold flex flex-col items-center">
                      <span className='font-normal'>{maxSupplyLabel}</span>
                      <span>
                        {abbreviateNumber(process.env.NEXT_PUBLIC_MAX_SUPPLY || '0')}
                        {tokensSuffix}
                      </span>
                    </p>
                    <p className="text-neutral-200 text-xs md:text-sm font-semibold flex flex-col items-center">
                      <span className='font-normal'>{initialMintLabel}</span>
                      <span>
                        {abbreviateNumber(process.env.NEXT_PUBLIC_INITIAL_SUPPLY || '0')}
                        {tokensSuffix}
                      </span>
                    </p>
                  </div>
                  <p className="text-neutral-200 mt-4 text-xs md:text-sm text-center">
                    <span>{targetInfoPart1}</span>
                    <span className='font-semibold'>{parseFloat(process.env.NEXT_PUBLIC_TARGET_ETH || '0').toFixed(3)} </span>
                    <span className='font-semibold'>{getCurrency()} </span>
                    <span>{targetInfoPart2}</span>
                  </p>
                </div>
              </ModalContent>
              <ModalFooter className="gap-4 pb-6 mt-5">
                <Button
                  size="md"
                  variant="primary"
                  type='submit'
                  onMouseEnter={() => setEnablePiggyAnim(true)}
                  onMouseLeave={() => setEnablePiggyAnim(false)}
                  className="!px-8 transition-all gap-2 duration-150 hover:from-han-purple/70 hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-semibold"
                >
                  {formCopy.confirm}
                  <Lottie options={piggyOptions}
                    isStopped={!enablePiggyAnim}
                    style={{ margin: '0' }}
                    height={24}
                    width={24}
                  />
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </div>
      </form>
    </div>
  )
}
