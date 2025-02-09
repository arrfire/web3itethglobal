'use client'
import {
  useRef, useState,
} from "react";
import {
  acceptedImageMimeTypes,
  FILE_SIZE_FIVE_MB,
} from "@/common/constants";
import { CircularSpinner } from "@/common/components/atoms";
import { UploadIcon } from "@/common/components/icons";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/common/components/atoms';
import { Edit } from "lucide-react";
import {
  UseFormSetValue, UseFormTrigger,
} from "react-hook-form";
import { pinataUploadUrl } from "@/common/utils/network/endpoints";
import lang from "@/common/lang";
import { TokenDTO } from "./types";

const { createIdea: { imageUpload: imageUploadCopy } } = lang

export const ImageSelectionAndUpload = ({
  errorField,
  id,
  errorMessage,
  setValue,
  value,
  disabled,
  trigger,
} : {
  errorField: boolean;
  errorMessage?: string;
  setValue: UseFormSetValue<TokenDTO>;
  value: string;
  id: string;
  disabled: boolean;
  trigger: UseFormTrigger<TokenDTO>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [uploadInProgress, setUploadInProgress] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setValue('imageUrl', '')
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      if (file.size > FILE_SIZE_FIVE_MB) {
        setError(imageUploadCopy.imageSizeError)
        return;
      }
      if (!acceptedImageMimeTypes.includes(file.type)) {
        setError(imageUploadCopy.imageType);
        return;
      }
      try {
        setUploadInProgress(true)
        const data = new FormData();
        data.set("file", file);
        const uploadRequest = await fetch(pinataUploadUrl, {
          method: "POST",
          body: data,
        });
        const IPFS_URL = await uploadRequest.json();
        setValue('imageUrl', IPFS_URL)
        setUploadInProgress(false)
        setError('')
      } catch (e) {
        setUploadInProgress(false)
        setError(imageUploadCopy.uploadError)
        toast.error(imageUploadCopy.uploadError)
      } finally {
        trigger(['imageUrl'])
      }
    }
  }

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  }

  const handleInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement;
    element.value = '';
  }
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-left w-max text-white font-medium text-sm"
      >
        {imageUploadCopy.title}
      </label>
      <input
        type="file"
        name="file"
        accept={acceptedImageMimeTypes.join(', ')}
        id={id}
        ref={fileInputRef}
        className="opacity-0 -z-10 absolute overflow-hidden"
        onChange={handleFileChange}
        onClick={handleInputClick}
      />
      {value?.length ? (
        <div className="flex gap-2">
          <div className="w-full h-auto rounded-2xl shadow-sm shadow-white overflow-hidden mt-2 bg-white/5 backdrop-blur-sm relative flex justify-center items-center px-4 py-8">
            <Image
              src={value}
              alt="pinata"
              width={400}
              height={200}
              className="w-40 h-auto"
              quality={50}
            />
          </div>
          <Tooltip delayDuration={200}>
            <TooltipTrigger
              disabled={uploadInProgress || disabled}
              onClick={handleUploadFile}
              type="button"
              className="shadow-sm absolute top-[38px] right-4 p-1 rounded-lg bg-violets-are-blue disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-violets-are-blue/80 text-white"
            >
              <Edit width={16} height={16} />
            </TooltipTrigger>
            <TooltipContent className="isolate bg-white/15 shadow-lg border-0 outline-none rounded-lg">
              <p className="text-xs text-white">Upload different logo</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <button
          type="button"
          className="bg-white/5 backdrop-blur-sm shadow-sm shadow-white mt-2 group uploadIconWithGradient disabled:pointer-events-none transition-transform duration-200 px-4 py-8 rounded-2xl flex flex-col gap-1 items-center"
          disabled={uploadInProgress}
          onClick={handleUploadFile}
        >
          {uploadInProgress ? <CircularSpinner /> : <UploadIcon />}
          <span className="text-gray-400 text-sm font-medium group-hover:bg-gradient-to-b from-han-purple to-tulip group-hover:text-transparent group-hover:bg-clip-text">
            {uploadInProgress ? imageUploadCopy.uploading : imageUploadCopy.uploadLabel}
          </span>
        </button>
      )}
      {(error || errorField) && (
        <p className="mt-0.5 text-sm text-red-300">
          {errorMessage || error || ''}
        </p>
      )}
    </div>
  )
}
