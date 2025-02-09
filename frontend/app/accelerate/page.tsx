import { Footer } from "@/common/components/organisms";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import lang from '@/common/lang';
import dynamic from "next/dynamic";
import { Loader } from "@/common/components/atoms";

const Agents = dynamic(() => import('./agents').then(m => m.Agents), { 
  ssr: false, 
  loading: () => <Loader />,
});

const { manageIdea: manageIdeaCopy } = lang
export const maxDuration = 60

const ReviewPage = async () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen pt-20 md:pt-32 pb-8">
        <div className='container mx-auto flex items-center flex-col w-full relative'>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center text-white">{manageIdeaCopy.heading}</h2>
          <h1 className="text-center text-neutral-200 text-sm pb-4 max-w-sm md:max-w-max">
            {manageIdeaCopy.subHeading}
          </h1>
          <Agents />
        </div>
      </div>
      <Footer />
    </TooltipProvider>
  );
}

export default ReviewPage
