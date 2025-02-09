import { IdeaTokenType } from "@/common/types";
import { blurDataUrl } from "@/common/utils/blurDataUrl";
import Image from "next/image";
import Link from "next/link";

export const Website = ({
  idea,
} : {
  idea: IdeaTokenType;
}) => {

  return (
    <div
      className={`p-3 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl shadow-sm shadow-white group relative`}
    >
      <div className="absolute bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out rounded-2xl md:rounded-3xl inset-0"></div>
      <Link
        href={idea?.productUrl || ''}
        target="_blank"
        className={`hidden group-hover:flex opacity-0 group-hover:opacity-100 items-center justify-center text-white rounded-2xl outline-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        transition-all duration-150 ease-in-out px-6 !py-2.5 font-medium text-base ring-1 ring-white
        gap-2 ring-inset hover:bg-white/15`}
      >
        View Website
      </Link>
      {idea?.productScreenshotUrl ? (
        <Image
          src={idea.productScreenshotUrl}
          quality={100}
          className="w-full h-auto rounded-xl"
          width={1200}
          height={800}
          alt={idea?.name}
          placeholder="blur"
          blurDataURL={blurDataUrl}
        />
      ) : (
        <div className="w-full h-[60vh] bg-zinc-900"></div>
      )}
    </div>
  );
};
