'use client'
import lang from "@/common/lang";
import dynamic from "next/dynamic";


const Timeline = dynamic(() => import('@/common/components/molecules').then(m => m.Timeline), { 
  ssr: false, 
});

const { homePage: homePageCopy } = lang

export const DevelopmentProcess = () => {

  const data = [
    {
      title: homePageCopy.developmentProcess.stepOneTitle,
      content: (
        <div>
          <p className="text-neutral-400 md:text-neutral-200 text-sm md:text-lg font-medium max-w-xl">
            {homePageCopy.developmentProcess.stepOneInfo}
          </p>
          <div className="md:block hidden mt-2 text-neutral-400 text-sm md:max-w-[400px]">{homePageCopy.developmentProcess.stepOnePoints}</div>
        </div>
      ),
    },
    {
      title: homePageCopy.developmentProcess.stepTwoTitle,
      content: (
        <div>
          <p className="text-neutral-400 md:text-neutral-200 text-sm md:text-lg font-medium max-w-xl">
            {homePageCopy.developmentProcess.stepTwoInfo}
          </p>
          <div className="md:block hidden mt-2 text-neutral-400 text-sm md:max-w-[400px]">{homePageCopy.developmentProcess.stepTwoPoints}</div>
        </div>
      ),
    },
    {
      title: homePageCopy.developmentProcess.stepThreeTitle,
      content: (
        <div>
          <p className="text-neutral-400 md:text-neutral-200 text-sm md:text-lg font-medium max-w-xl">
            {homePageCopy.developmentProcess.stepThreeInfo}
          </p>
          <div className="md:block hidden mt-2 text-neutral-400 text-sm md:max-w-[400px]">{homePageCopy.developmentProcess.stepThreePoints}</div>
        </div>
      ),
    },
    {
      title: homePageCopy.developmentProcess.stepFourTitle,
      content: (
        <div>
          <p className="text-neutral-400 md:text-neutral-200 text-sm md:text-lg font-medium max-w-xl">
            {homePageCopy.developmentProcess.stepFourInfo}
          </p>
          <div className="md:block hidden mt-2 text-neutral-400 text-sm md:max-w-[400px]">{homePageCopy.developmentProcess.stepFourPoints}</div>
        </div>
      ),
    },
  ];
  return (
    <section className="md:py-12 px-4 md:mb-6">
      <div className="container mx-auto">
        <Timeline data={data} />
      </div>
    </section>
  );
};
