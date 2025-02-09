import { 
  startAgentUrl, updateCharacterUrl,
} from '@/common/utils/network/endpoints';
import { createClient } from '@/common/utils/supabase/client';
import { AgentType } from '../accelerate/types';

export const useHandleStartAll = () => {
  const supabase = createClient();
    
  const getAllAgents = async () => {
    try {
      const { data: agents } = await supabase
        .from('Agents')
        .select('*')
      return { 
        agents,
      };
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }
  const startAgent = async (agent: AgentType) => {
    await fetch(startAgentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'email',
        password: 'password',
        username: agent.username,
        tokenAddress: agent.tokenAddress,
        description: agent.tokenDescription,
        ideaName: agent.tokenName,
        character: JSON.parse(agent.character),
      }),
    });
    const cachedSettings = agent?.settings ? JSON.parse(agent.settings) : null

    await fetch(updateCharacterUrl.replace('%agentId%', agent.agentId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        character: JSON.parse(agent.character),
        schedulingPosts: cachedSettings?.schedulingPosts,
        followProfiles: cachedSettings.followProfiles,
        processionActions: cachedSettings.processionActions,
        actionInterval: cachedSettings.actionInterval,
        followInterval: cachedSettings.followInterval,
        postInterval: cachedSettings.postInterval,
      }),
    })
    await supabase
      .from('Agents')
      .update({ status: 'started' })
      .eq('agentId', agent.agentId)
  }
  const handleStartAll = async () => {
    const {
      agents,
    } = await getAllAgents()
    if (agents?.length) {
      agents.forEach(async (agent: AgentType) => {
        if (agent.status === 'started') {
          await startAgent(agent)
        }
        setTimeout(() => {
        }, 1000)
      })
    }
  }
  return {
    handleStartAll,
  }
}