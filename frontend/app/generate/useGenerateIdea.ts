import { useState } from "react";
import { v4 } from "uuid";
import { createClient } from '@/common/utils/supabase/client';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { routes } from "@/common/routes";
import {
  useAccount,
} from 'wagmi';
import lang from "@/common/lang";
import {
  createFileFormData,
  uploadToPinata,
} from "@/utils/helpers";
import { usePrivy } from "@privy-io/react-auth";
import { SupabaseTables } from "@/common/constants";
import { IntefaceAIDTO } from "./types"

const { generateIdea: { generateError } } = lang

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    toast.error(generateError);
  } else {
    toast.error(generateError);
  }
  console.error('Token creation error:', error);
};

export const useGenerateIdea = () => {
  const [isIdeaProcessing, setIsIdeaProcessing] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const {
    authenticated, login,
  } = usePrivy()

  const {
    address,
  } = useAccount();

  const authorizedTokenCreation = async (idea: IntefaceAIDTO) => {
    if (!idea?.ideaLogo || !idea?.ideaLandingPage) {
      toast.error(generateError);
      return;
    }
    try {
      setIsIdeaProcessing(true);

      const [logoFormData, landingPageFormData] = await Promise.all([
        createFileFormData(idea.ideaLogo, `${idea.ideaTicker}-logo`),
        createFileFormData(idea.ideaLandingPage, `${idea.ideaTicker}-landing-page`),
      ]);

      const [logoUrl, landingPageUrl] = await Promise.all([
        uploadToPinata(logoFormData),
        uploadToPinata(landingPageFormData),
      ]);

      const ideaData = {
        name: idea.ideaName,
        landingPage: landingPageUrl,
        logo: logoUrl,
        description: idea.ideaDescription,
        categories: '',
        website: '',
        ticker: idea.ideaTicker,
        id: v4(),
        creator: address,
        status: 'draft',
      };

      const { error: dbError } = await supabase
        .from(SupabaseTables.NewIdeas)
        .insert([ideaData])
        .select();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      router.push(`${routes.newIdeaPath}?ideaId=${ideaData.id}`);

    } catch (error) {
      handleError(error);
    } finally {
      setIsIdeaProcessing(false);
    }
  }

  const handleTokenCreation = async (idea: IntefaceAIDTO) => {
    if (!authenticated) {
      login()
    } else {
      authorizedTokenCreation(idea);
    }
  }

  return {
    handleTokenCreation,
    isIdeaProcessing,
  }
}
