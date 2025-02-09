import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { pinataUploadUrl } from "@/common/utils/network/endpoints";
import { generateFieldSuggestion } from "../actions";
import {
  Field,
  TokenDTO,
} from "./types";
import toast from "react-hot-toast";

export function useProjectGenerator (
  state: TokenDTO,
  setValue: UseFormSetValue<TokenDTO> | undefined,
  setIsPromptEnabled: (value: boolean) => void,
  handleNewImage?: (url: string) => void,
) {
  const [loading, setLoading] = useState(false);

  const generateSuggestion = async (field: Field, userInput: string) => {
    try {
      setLoading(true);
      const suggestion = await generateFieldSuggestion(field, state, userInput);
      if (field === "website") {
        const landingPageBlob = new Blob([suggestion], {
          type: 'image/svg+xml',
        });
        const landingPageFormData = new FormData();
        const landingPageFile = new File([landingPageBlob], `${state.ticker}-ux`);
        landingPageFormData.set('file', landingPageFile);
        const landingPageResponse = await fetch(pinataUploadUrl, {
          method: "POST",
          body: landingPageFormData,
        });
        const landingPageUrl = await landingPageResponse.json();
        if (landingPageUrl?.startsWith("https://") && handleNewImage) {
          handleNewImage(landingPageUrl)
        } else {
          toast.error('Unable to regenerate from suggestion. Please try again.')
        }
      } else if (field === "imageUrl") {
        const logoBlob = new Blob([suggestion], {
          type: 'image/svg+xml',
        });
        const logoFormData = new FormData();
        const logoFile = new File([logoBlob], `${state.ticker}-logo`);
        logoFormData.set('file', logoFile);
        const logoResponse = await fetch(pinataUploadUrl, {
          method: "POST",
          body: logoFormData,
        });
        const logoUrl = await logoResponse.json();
        if (logoUrl?.startsWith("https://") && setValue) {
          setValue(field, logoUrl)
        } else {
          toast.error('Unable to regenerate from suggestion. Please try again.')
        }
      } else {
        if (setValue) {
          setValue(field, suggestion)
        }
      }
      setIsPromptEnabled(false)
    } catch (error) {
      toast.error('Unable to regenerate from suggestion. Please try again.')
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    generateSuggestion,
  };
}
