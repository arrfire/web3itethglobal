import { useState } from "react";
import toast from "react-hot-toast";
import { stopAgentUrl } from "@/common/utils/network/endpoints";
import { createClient } from "@/common/utils/supabase/client";
import { AgentType } from "./types";

export const useStopAgent = ({
  twitterAgent,
  getAgents,
} : {
  twitterAgent: AgentType | null;
  getAgents: () => void;
}) => {
  const supabase = createClient();
  const [isStopping, setIsStopping] = useState(false);
 
  const onSubmit = async () => {
    try {
      if (twitterAgent) {
        setIsStopping(true);
        const response = await fetch(stopAgentUrl.replace("%agentId%", twitterAgent.agentId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await supabase
          .from('Agents')
          .update({ status: 'stopped' })
          .eq('agentId', twitterAgent.agentId)
        await getAgents()
        setIsStopping(false);
        toast.success("Agent has been stopped for this dream");
      }

    } catch (error) {
      if (twitterAgent) {
        await supabase
          .from('Agents')
          .update({ status: 'stopped' })
          .eq('agentId', twitterAgent.agentId)
      }
      await getAgents()
      setIsStopping(false);
      toast.error("Unable to stop agent. Please try again later.");
      throw error;
    }
  };

  return {
    handleStopAgent: onSubmit,
    isStopping,
  }
}