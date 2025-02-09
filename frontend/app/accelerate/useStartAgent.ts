import {
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  startAgentUrl,
  fetchCharacterUrl,
  updateCharacterUrl,
} from "@/common/utils/network/endpoints";
import { createClient } from "@/common/utils/supabase/client";
import { usePasswordEncryption } from "@/common/hooks/usePasswordEncryption";
import {
  useAccount,
} from 'wagmi';
import { 
  adminAddress, adminAddress2,
} from "@/common/constants";
import { usePrivy } from "@privy-io/react-auth";
import { generateCharacter } from '../actions';
import {
  AgentType,
  TokenType,
} from "./types";

export const useStartAgent = ({
  tokenInfo,
  twitterAgent,
  setReviewAgenda,
  getAgents,
} : {
  tokenInfo: TokenType | null;
  setReviewAgenda: (value: boolean) => void;
  twitterAgent: AgentType | null;
  getAgents: () => void;
}) => {
  const supabase = createClient();
  const {
    address,
  } = useAccount();
  const {
    authenticated, login,
  } = usePrivy()

  const {
    encryptPassword,
    isEncrypting,
  } = usePasswordEncryption()

  const [isSubmitting, setIsSubmitting] = useState(false);


  const onSubmit = async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    if (!authenticated) {
      login()
    } else {
      const isAdmin = address === adminAddress || address === adminAddress2;
      const isCreator = address === tokenInfo?.creator;
      
      if (!isAdmin && !isCreator) {
        toast.error("You are not the creator of the dream.");
        return;
      }
      try {
        if (tokenInfo) {
          const encryptedPassword = await encryptPassword(payload.password);
          setIsSubmitting(true);
          const idea = tokenInfo
          const cachedCharacter = twitterAgent?.character ? JSON.parse(twitterAgent.character) : null
          const cachedSettings = twitterAgent?.settings ? JSON.parse(twitterAgent.settings) : null
          const response = await fetch(startAgentUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: payload.username.replace(/^@/, ''),
              email: payload.email,
              password: encryptedPassword,
              tokenAddress: idea?.address || '',
              description: idea?.description,
              ideaName: tokenInfo.name,
              character: twitterAgent ? cachedCharacter : null,
            }),
          });

          const data = await response.json();
          if (!data.success) {
            toast.error(data.message)
            setIsSubmitting(false);
            return
          }

          if (twitterAgent) {
            await fetch(updateCharacterUrl.replace('%agentId%', data.agentId), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                character: cachedCharacter,
                schedulingPosts: cachedSettings.schedulingPosts,
                actionInterval: cachedSettings.actionInterval,
                followInterval: cachedSettings.followInterval,
                postInterval: cachedSettings.postInterval,
                twitterTargetUsers: cachedSettings.twitterTargetUsers,
                followProfiles: cachedSettings.followProfiles,
                processionActions: cachedSettings.processionActions,
              }),
            })
            await supabase
              .from('Agents')
              .update({ status: 'started' })
              .eq('agentId', twitterAgent.agentId)
          } else {
            const characterSettingsResponse = await fetch(fetchCharacterUrl.replace('%agentId%', data.agentId))
            const characterSettings = await characterSettingsResponse.json()

            const newCharacter = await generateCharacter({
              ideaName: tokenInfo.name,
              ideaDescription: tokenInfo.description,
              ideaTicker: tokenInfo.ticker,
              tone: 'Gen-Z',
              website: tokenInfo.website,
              categories: tokenInfo.categories,
            })
            const updatedCharacter = {
              ...characterSettings.character,
              ...newCharacter,
              settings: {},
              website: tokenInfo.website,
              messageExamples: [
                [
                  {
                    user: "{{user1}}",
                    content: {
                      text: newCharacter.messageExamples[0],
                    },
                  },
                  {
                    user: idea.name,
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
                    user: idea.name,
                    content: {
                      text: newCharacter.messageExamples[3],
                    },
                  },
                ],
              ],
            }
            const settings = {
              schedulingPosts: true,
              followProfiles: false,
              processionActions: false,
              actionInterval: 7200000,
              followInterval: 24 * 60 * 60 * 1000,
              postInterval: 480,
              twitterTargetUsers: '',
            }
            await fetch(updateCharacterUrl.replace('%agentId%', data.agentId), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                character: updatedCharacter,
                schedulingPosts: settings.schedulingPosts,
                followProfiles: settings.followProfiles,
                processionActions: settings.processionActions,
                actionInterval: settings.actionInterval,
                followInterval: settings.followInterval,
                postInterval: settings.postInterval,
                twitterTargetUsers: settings.twitterTargetUsers,
              }),
            })

            await supabase
              .from('Agents')
              .insert([{
                agentId: data.agentId,
                username: payload.username,
                owner: idea.creator,
                type: 'twitter',
                tokenAddress: idea.address,
                tokenName: idea.name,
                status: 'started',
                tokenDescription: idea.description,
                tone: 'Gen-Z',
                character: JSON.stringify(updatedCharacter),
                settings: JSON.stringify(settings),
              }]).select()
          }
          await getAgents()
          setReviewAgenda(true)
          setIsSubmitting(false);
        } else {
          toast.error("Didn't find the dream to start the agent.");
        }
      } catch (error) {
        setIsSubmitting(false);
        toast.error("Unable to start agent. Please try again later.");
        throw error;
      }
    }
  };

  return {
    onStartAgent: onSubmit,
    isSubmitting: isSubmitting || isEncrypting,
  }
}
