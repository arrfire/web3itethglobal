import { useState } from "react";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";

import {
  updateCharacterUrl,
} from "@/common/utils/network/endpoints";
import { createClient } from "@/common/utils/supabase/client";
import { usePrivy } from "@privy-io/react-auth";
import {
  AgentType,
  CharacterType,
  Settings,
  TokenType,
} from "./types";
import { getSystemPrompt } from "../actions";


const baseHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetcher (
  key: string,
  options?: Readonly<{ arg: RequestInit }>,
) {
  try {
    const requestHeaders = {
      ...baseHeaders,
      ...options?.arg.headers,
    };

    const response = await fetch(key, {
      ...options?.arg,
      ...(options?.arg?.body ? { body: options.arg.body } : {}),
      headers: requestHeaders,
    });
    const responseJson = await response.json();
    return {
      ...responseJson,
      code: response.status,
    };
  } catch (error) {
  }
}


export const useUpdateCharacter = ({
  agentId,
  tokenInfo,
  twitterAgent,
  getAgents,
} : {
  agentId: string;
  tokenInfo: TokenType | null;
  getAgents: () => void;
  twitterAgent: AgentType | null;
}) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const {
    authenticated, login,
  } = usePrivy()
  const {
    trigger,
  } = useSWRMutation(updateCharacterUrl.replace('%agentId%', agentId.toString()), fetcher);
  const supabase = createClient();

  const onSubmit = async (character: CharacterType, settings: Settings) => {
    if (!authenticated) {
      login()
    } else {
      if (tokenInfo && twitterAgent) {
        setIsUpdating(true)
        try {
          const system = await getSystemPrompt({
            ideaName: tokenInfo.name,
            ideaTicker: tokenInfo.ticker,
            systemFrontend: character.systemFrontend,
            tone: twitterAgent.tone,
            website: character.website || '',
          })
  
          await trigger({
            body: JSON.stringify({
              character: {
                ...character,
                system,
              },
              schedulingPosts: settings.schedulingPosts,
              followProfiles: settings.followProfiles,
              processionActions: settings.processionActions,
              actionInterval: settings.actionInterval,
              followInterval: settings.followInterval,
              postInterval: settings.postInterval,
              twitterTargetUsers: settings.twitterTargetUsers,
            }),
            method: 'POST',
          });
  
          await supabase
            .from('Agents')
            .update({
              character: JSON.stringify(character),
              settings: JSON.stringify(settings),
            })
            .eq('agentId', agentId)
          setTimeout(() => {
            getAgents()
          }, 1000)
        } catch (error) {
          toast.error("Unable to edit character. Please try again later.");
          throw error;
        } finally {
          setIsUpdating(false)
        }
      }
    }
  };

  return {
    updateCharacter: onSubmit,
    isUpdatingCharacter: isUpdating,
  }
}
