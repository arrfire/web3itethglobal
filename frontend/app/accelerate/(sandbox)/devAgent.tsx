import { useState } from "react";
import {
  useSearchParams,
} from "next/navigation";
import { routes } from "@/common/routes";
import { SupabaseTables } from "@/common/constants";
import { createClient } from "@/common/utils/supabase/client";
import { MultiStepLoader } from "@/common/components/molecules";
import { createDevAgentUrl } from "@/common/utils/network/endpoints";
import lang from "@/common/lang";
import { 
  SandboxType, TokenType,
} from "../types";

const { manageIdea: manageIdeaCopy } = lang

export const DevAgent = ({
  sandboxState,
  tokenInfo,
  getSandboxes,
} : {
  sandboxState: SandboxType | null;
  getSandboxes: () => void;
  tokenInfo: TokenType | null;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const searchParams = useSearchParams()
  const createdIdeaId = searchParams.get('ideaId');
  const supabase = createClient();

  const handleCreateSandbox = async () => {
    if (!tokenInfo) {
      return
    }
    setIsProcessing(true)
    const response = await fetch(createDevAgentUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: `${tokenInfo.name}`,
        prompt: `Create a website for ${tokenInfo.name}- ${tokenInfo.description}. Use logo ${tokenInfo.logo}. Base the color theme on the logo and on Web3 and the description attached.`,
      }),
    });
    if (response.ok) {
      const responseData = await response.json()
      const { id } = responseData.data;
      await supabase
        .from(SupabaseTables.Sandboxes)
        .insert([
          {
            id: createdIdeaId,
            sandboxId: id,
          },
        ])
        .select();
      getSandboxes()
      window.open(`${routes.devAgentPath.replace("%id%", id)}`, "_blank");
    }
    setIsProcessing(false)
  };
  const handleOpenSandbox = () => {
    if (!sandboxState) {
      return;
    }
    window.open(`${routes.devAgentPath.replace("%id%", sandboxState?.sandboxId)}`, "_blank");
  };
  return (
    <>
      {manageIdeaCopy.devAgentDesc}
      <MultiStepLoader
        loadingStates={manageIdeaCopy.devLoadingStates}
        loading={isProcessing}
        duration={3000}
      />
      <div className="flex justify-end md:flex-row flex-col mt-6 gap-2">
        {/* {sandboxState ? (
          <Link
            href={"#"}
            prefetch={true}
            className={`flex items-center justify-center text-white rounded-2xl outline-none
            transition-all duration-150 ease-in-out px-4 py-2 font-medium text-base ring-1 ring-white
            gap-2 ring-inset hover:bg-white/15`}
          >
            {manageIdeaCopy.addNewDev}
          </Link>
        ) : null} */}
        {sandboxState ? (
          <button
            onClick={() => handleOpenSandbox()}
            className={`flex items-center justify-center text-white rounded-2xl outline-none px-4 py-2 text-base
            disabled:cursor-not-allowed ease-in-out transition-all gap-2 duration-150 hover:from-han-purple/70
            hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium`}
          >
            {manageIdeaCopy.openSandbox}
          </button>
        ) : null}
        {!sandboxState ? (
          <button
            onClick={() => handleCreateSandbox()}
            className={`flex items-center justify-center text-white rounded-2xl outline-none px-4 py-2 text-base
            disabled:cursor-not-allowed ease-in-out transition-all gap-2 duration-150 hover:from-han-purple/70
            hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium`}
          >
            {manageIdeaCopy.createSandbox}
          </button>
        ) : null}
      </div>
    </>
  );
}
