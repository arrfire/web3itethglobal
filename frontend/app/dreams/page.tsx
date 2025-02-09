import { Footer } from "@/common/components/organisms";
import { IdeaType } from "@/common/types";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import dynamic from "next/dynamic";
import { Loader } from "@/common/components/atoms";
import { getIdeas } from "../actions";

const Ideas = dynamic(() => import('./ideas').then(m => m.Ideas), { 
  ssr: false, 
  loading: () => <Loader />,
});

const IdeasPage = async () => {
  const ideas = await getIdeas()
  const tokens = ideas as Array<IdeaType> | []
  return (
    <TooltipProvider>
      <Ideas ideaTokens={tokens} />
      <Footer />
    </TooltipProvider>
  );
}

export default IdeasPage
