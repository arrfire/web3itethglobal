import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Address } from 'viem';
import mql from '@microlink/mql'
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  FieldError,
  SubmitHandler, useForm,
} from "react-hook-form";
import { v4 } from "uuid";
import { createClient } from '@/common/utils/supabase/client';
import {
  ContractFunctions, SupabaseTables,
} from '@/common/constants';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  getAccount,
  getBalance,
  readContract,
} from '@wagmi/core'
import { toast } from "react-hot-toast";
import {
  pinataUploadUrl,
} from '@/common/utils/network/endpoints';
import { usePrivy } from '@privy-io/react-auth';
import lang from '@/common/lang';
import { yupResolver } from "@hookform/resolvers/yup";
import { config } from '@/config';
import { ethers } from 'ethers';
import {
  getUniqueSubdomain,
} from '@/utils/helpers';
import { routes } from '@/common/routes';
import { useGetCategories } from './useGetCategories';
import { useAddCategory } from './useAddCategory';
import { tokenSchema } from './validationSchema';
import { TokenDTO } from './types';
import { 
  revalidateTagData,
} from '../../utils/helpers';
import abi from '@/utils/abis/ideaFactory.json'


const { createIdea: createIdeaCopy } = lang
const MEME_CREATION_FEE = BigInt(parseInt(process.env.NEXT_PUBLIC_IDEA_CREATION_FEE_WEI || '0'))

type ContractIdea = {
  fundingRaised: number;
  categories: string;
  twitterUrl: string;
  telegramUrl: string;
}

export const useCreateToken = ({
  ideaStatusCreated,
  setIdeaStatusCreated,
  setIsFundingReached,
  setOpenConfirmation,
  setShowSuccess,
} : {
  ideaStatusCreated: boolean;
  setIdeaStatusCreated: (status: boolean) => void;
  setIsFundingReached: (status: boolean) => void;
  setOpenConfirmation: (status: boolean) => void;
  setShowSuccess: (status: boolean) => void;
}) => {
  const router = useRouter()
  const {
    authenticated, login,
  } = usePrivy()
  const supabase = createClient();
  const searchParams = useSearchParams()
  const runOnceFetchIdeaRef = useRef(true)
  const runConfirmTransactionRef = useRef(false)

  const {
    address: userAddress,
    chainId,
  } = useAccount();

  const [isSupabaseSubmitting, setIsSupabaseSubmitting] = useState(false);
  const [isIdeaFetching, setIsIdeaFetching] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [txnHash, setTxnHash] = useState('');
  const [minBalanceSatisfied, setMinBalanceSatisfied] = useState(false);
  const [creatorAddress, setCreatorAddress] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [redirectId, setRedirectId] = useState('');
  const [redirectSubdomain, setRedirectSubdomain] = useState('');

  const { connector } = getAccount(config)

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    setFocus,
    getValues,
    trigger,
    formState: {
      isValid,
      errors,
    },
  } = useForm<TokenDTO>({
    resolver: yupResolver(tokenSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      categories: [],
      ticker: '',
      imageUrl: '',
      description: '',
      website: '',
      twitter: '',
      address: '',
      telegram: '',
    },
  });

  const {
    writeContractAsync,
    isPending,
  } = useWriteContract();

  const {
    data: categories,
    isCategoriesLoading,
    mutateCategories,
  } = useGetCategories();
  const {
    isAddingCategory,
    onSubmit: addCategory,
  } = useAddCategory();

  const {
    data: tokenData,
    isLoading,
    error,
  } = useWaitForTransactionReceipt({
    hash: txnHash as Address,
    query: { enabled: !!txnHash },
  });

  const highlightError = () => {
    const findFirstError = (errors: Record<keyof TokenDTO, FieldError | undefined>) => {
      const fields = Object.keys(errors) as Array<keyof TokenDTO>;
      return fields.find(key => errors[key]);
    };
    const firstErrorField = findFirstError(errors as Record<keyof TokenDTO, FieldError | undefined>);
    if (!firstErrorField) {
      return;
    }
    setFocus(firstErrorField, { shouldSelect: true });
    const element = document.getElementById(firstErrorField);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: y - 500,
        behavior: 'smooth',
      });
    }
  }

  useEffect(() => {
    const getBal = async () => {
      if (userAddress) {
        const bal = await getBalance(config, {
          address: userAddress as `0x${string}`,
          chainId: chainId as any,
        })
        setMinBalanceSatisfied(parseFloat(bal.formatted) >= (parseFloat(process.env.NEXT_PUBLIC_IDEA_CREATION_FEE_WEI || '0') / 1e18))
      }
    }
    getBal()
  }, [userAddress, chainId])

  useEffect(() => {
    const createdIdeaId = searchParams.get('ideaId');
    if (!createdIdeaId || categories.length === 0 || !runOnceFetchIdeaRef.current) {
      return;
    }
    if (!authenticated) {
      toast.error("Please connect with your account to edit this dream")
    }

    const fetchAIGeneratedIdea = async () => {
      setIsIdeaFetching(true);
      try {
        runOnceFetchIdeaRef.current = false
        const { data: newIdea } = await supabase
          .from(SupabaseTables.NewIdeas)
          .select("*")
          .eq('id', createdIdeaId);
        if (newIdea?.[0]) {
          const idea = newIdea[0];
          if (idea.status === 'created') {
            const result = await readContract(config, {
              abi,
              address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
              functionName: ContractFunctions.getIdea,
              args: [idea.address],
            })
            const resultData = result as ContractIdea;
            if (resultData.twitterUrl) {
              setValue('twitter', resultData.twitterUrl)
            }
            if (resultData.telegramUrl) {
              setValue('telegram', resultData.telegramUrl)
            }
            if (resultData.categories) {
              const categoriesArray = resultData.categories.split('/');
              const categoryIds = categoriesArray.map((category: string) => {
                const foundCategory = categories.find((c) => c.value.toLowerCase() === category.toLowerCase());
                if (foundCategory) {
                  return foundCategory.id;
                }
                return '0'
              });
              setValue('categories', categoryIds);
            }
            if (resultData.fundingRaised) {
              const fundingRaised = parseFloat(ethers.formatUnits(resultData.fundingRaised, 'ether'));
              const targetFunding = parseFloat(process.env.NEXT_PUBLIC_TARGET_ETH || '0')
              setIsFundingReached(fundingRaised >= targetFunding)
            }
          }

          setValue('name', idea.name);
          setValue('description', idea.description);
          setValue('website', idea.website || '');
          setValue('imageUrl', idea.logo);
          setValue('ticker', idea.ticker);
          setValue('address', idea.address);
          if (idea.landingPage.includes("mypinata.cloud")) {
            setWebsiteUrl(idea.landingPage)
            setCreatorAddress(idea.creator)
            setIsIdeaFetching(false)
          } else {
            setCreatorAddress(idea.creator)
            setIsIdeaFetching(false)
          }
          setIdeaStatusCreated(idea.status === 'created');
        } else {
          toast.error(createIdeaCopy.ideaNotFound);
        }
      } catch {
        toast.error(createIdeaCopy.ideaNotFound);
        setIsIdeaFetching(false)
      }
    };

    fetchAIGeneratedIdea();
  }, [
    searchParams,
    supabase,
    setValue,
    setIdeaStatusCreated,
    authenticated,
    setIsFundingReached,
    categories,
    userAddress,
    creatorAddress,
  ]);

  useEffect(() => {
    const createdIdeaId = searchParams.get('ideaId');

    if (error) {
      toast.error(createIdeaCopy.errorOccurred);
      return;
    }

    if (!tokenData || tokenData.status !== "success" || runConfirmTransactionRef.current) {
      if (tokenData?.status === "reverted") {
        toast.error("Transaction reverted. Please try again.");
      }
      return;
    }
    runConfirmTransactionRef.current = true
    const websiteInfo = getValues('website')
    const link = websiteInfo.includes("mypinata.cloud") ? '' : websiteInfo

    const addTokenAddressToJSON = async () => {
      setIsSupabaseSubmitting(true);
      try {
        const ticker = getValues('ticker');
        const tokenAddressFromLog = tokenData.logs.find(l => !l.address.startsWith('0x00'));

        if (!tokenAddressFromLog) {
          return;
        }
        setOpenConfirmation(false)
        const uniqueSubdomain = await getUniqueSubdomain(supabase, ticker);
        await supabase.from(SupabaseTables.Subdomains).insert([{
          subdomain: uniqueSubdomain,
          address: tokenAddressFromLog.address.toLowerCase(),
          name: getValues('name'),
        }]);
        setRedirectSubdomain(uniqueSubdomain);
        const selectedCategories = getValues('categories');
        let categoryValues = [""]
        if (selectedCategories) {
          categoryValues = selectedCategories
            .map(category => categories.find(c => c.id === category)?.name || '')
            .filter(Boolean);
        }
        toast.success(createIdeaCopy.ideaCreatedMessage);
        if (createdIdeaId) {
          const { error: dbError } = await supabase
            .from(SupabaseTables.NewIdeas)
            .update({
              status: 'created',
              name: getValues('name'),
              website: link,
              landingPage: websiteUrl,
              logo: getValues('imageUrl'),
              description: getValues('description'),
              ticker: getValues('ticker'),
              categories: categoryValues.join('/'),
              address: tokenAddressFromLog.address.toLowerCase(),
            })
            .eq('id', createdIdeaId)
            .select()

          if (dbError) {
            throw new Error(`Database error: ${dbError.message}`);
          }
          await revalidateTagData('getIdeas')
          await revalidateTagData(`ideaToken-${tokenAddressFromLog.address.toLowerCase()}`)
          setRedirectId(createdIdeaId)
          setShowSuccess(true)
        } else {
          const ideaData = {
            name: getValues('name'),
            landingPage: websiteUrl,
            logo: getValues('imageUrl'),
            description: getValues('description'),
            website: link,
            ticker: getValues('ticker'),
            id: v4(),
            creator: userAddress,
            categories: categoryValues.join('/'),
            status: 'created',
            address: tokenAddressFromLog.address.toLowerCase(),
          };

          const { error: dbError } = await supabase
            .from(SupabaseTables.NewIdeas)
            .insert([ideaData])
            .select();
          if (dbError) {
            throw new Error(`Database error: ${dbError.message}`);
          }
          await revalidateTagData('getIdeas')
          await revalidateTagData(`ideaToken-${tokenAddressFromLog.address.toLowerCase()}`)
          setRedirectId(ideaData.id)
          setShowSuccess(true)
        }
      } catch {
        toast.error(createIdeaCopy.errorOccurred);
        setIsSupabaseSubmitting(false);
      }
    };

    const updateTokenAddressToJSON = async () => {
      setIsSupabaseSubmitting(true);
      try {
        const subdomainData = await supabase.from(SupabaseTables.Subdomains).select('*').eq('address', getValues('address'));
        const selectedCategories = getValues('categories');
        let categoryValues = [""]
        if (selectedCategories) {
          categoryValues = selectedCategories
            .map(category => categories.find(c => c.id === category)?.name || '')
            .filter(Boolean);
        }
        const { error: dbError } = await supabase
          .from(SupabaseTables.NewIdeas)
          .update({
            description: getValues('description'),
            landingPage: websiteUrl,
            logo: getValues('imageUrl'),
            website: link,
            categories: categoryValues.join('/'),
          })
          .eq('id', createdIdeaId)
          .select()

        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`);
        }
        toast.success(createIdeaCopy.ideaDetailsUpdated);
        await revalidateTagData('getIdeas')
        await revalidateTagData(`ideaToken-${getValues('address')?.toLowerCase()}`)
        if (subdomainData?.data?.length) {
          const subdomain = subdomainData.data[0].subdomain
          router.push(routes.projectDetailPath.replace('%subdomain%', subdomain));
        }
      } catch {
        toast.error(createIdeaCopy.errorOccurred);
      } finally {
        setIsSupabaseSubmitting(false);
      }
    };

    if (ideaStatusCreated) {
      updateTokenAddressToJSON()
    } else {
      addTokenAddressToJSON();
    }
  }, [
    tokenData,
    error,
    router,
    reset,
    getValues,
    supabase,
    categories,
    searchParams,
    ideaStatusCreated,
    userAddress,
    setOpenConfirmation,
    websiteUrl,
    setShowSuccess,
  ]);

  const processWebsiteScreenshot = async (data: TokenDTO) => {
    setImageProcessing(true)

    try {
      const { data: websiteData } = await mql(data.website, { screenshot: true });
      if (!websiteData?.screenshot?.url) {
        return null;
      }
      const response = await fetch(websiteData.screenshot.url);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpeg', { type: blob.type });

      const formData = new FormData();
      formData.set("file", file);

      const uploadResponse = await fetch(pinataUploadUrl, {
        method: "POST",
        body: formData,
      });

      const pinataUrl = await uploadResponse.json();
      setImageProcessing(false)
      return pinataUrl?.startsWith("https://") ? pinataUrl : null;
    } catch {
      setImageProcessing(false)
      return '';
    }
  };

  const updateToken = async (data: TokenDTO) => {
    if (!data.categories?.length || !categories) {
      return;
    }
    if (userAddress !== creatorAddress) {
      toast.error(createIdeaCopy.cantEditError)
      return
    }
    try {
      const categoryValues = data.categories
        .map(category => categories.find(c => c.id === category)?.name || '')
        .filter(Boolean);

      const websiteUrlLocal = websiteUrl.includes("mypinata.cloud")
        ? websiteUrl
        : await processWebsiteScreenshot(data);

      if (!websiteUrlLocal) {
        toast.error(createIdeaCopy.errorOccurred);
        return;
      }
      setWebsiteUrl(websiteUrlLocal)

      const payload = {
        tokenImageUrl: data.imageUrl,
        description: data.description.replaceAll(",", "$comma$"),
        categories: categoryValues.join('/'),
        productScreenshotUrl: websiteUrlLocal,
        productUrl: data.website,
        twitterUrl: data.twitter || '',
        telegramUrl: data.telegram || '',
      }

      const transaction = await writeContractAsync({
        abi,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
        functionName: ContractFunctions.updateIdeaToken,
        args: [
          getValues('address'),
          payload,
        ],
        connector,
      });
      setTxnHash(transaction)
    } catch {
      toast.error(createIdeaCopy.errorOccurred);
    }
  }
  const createToken = async (data: TokenDTO) => {
    if (!data.categories?.length || !categories) {
      return;
    }
    try {
      const categoryValues = data.categories
        .map(category => categories.find(c => c.id === category)?.name || '')
        .filter(Boolean);
      const websiteUrlLocal = websiteUrl.includes("mypinata.cloud")
        ? websiteUrl
        : await processWebsiteScreenshot(data);

      if (!websiteUrlLocal) {
        toast.error(createIdeaCopy.errorOccurred);
        router.refresh()
        return;
      }
      setWebsiteUrl(websiteUrlLocal)

      const payload = {
        name: data.name,
        symbol: data.ticker,
        imageUrl: data.imageUrl,
        description: data.description.replaceAll(",", "$comma$"),
        categories: categoryValues.join('/'),
        productScreenshotUrl: websiteUrlLocal,
        productUrl: data.website || '',
        twitterUrl: data.twitter || '',
        telegramUrl: data.telegram || '',
      }

      const transaction = await writeContractAsync({
        abi,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
        functionName: ContractFunctions.createIdeaToken,
        value: MEME_CREATION_FEE,
        args: [payload],
        connector,
      });
      setTxnHash(transaction)
    } catch {
      toast.error(createIdeaCopy.errorOccurred);
    }
  };
  const onSubmit: SubmitHandler<TokenDTO> = async (data) => {
    if (!authenticated) {
      login()
    } else {
      if (ideaStatusCreated) {
        updateToken(data)
        return
      }
      if (data.ticker.toLowerCase() === "api" || data.ticker.toLowerCase() === "www" || data.ticker.toLowerCase() === "dev") {
        toast.error(createIdeaCopy.reservedDomain);
        return
      }
      if (minBalanceSatisfied) {
        createToken(data);
      } else {
        toast.error(createIdeaCopy.insufficientBalance);
      }
    }
  };

  const handleNewImage = (image: string) => {
    setWebsiteUrl(image);
  }
  return {
    isSupabaseSubmitting,
    setError,
    isIdeaFetching,
    imageProcessing,
    txnHash,
    minBalanceSatisfied,
    creatorAddress,
    websiteUrl,
    handleSubmit,
    handleNewImage,
    control,
    isLoading,
    isPending,
    onSubmit,
    setValue,
    redirectId,
    redirectSubdomain,
    getValues,
    isCategoriesLoading,
    mutateCategories,
    categories,
    isAddingCategory,
    trigger,
    isValid,
    addCategory,
    highlightError,
  }
}
