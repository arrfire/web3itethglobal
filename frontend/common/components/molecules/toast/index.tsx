'use client';
import { Transition } from "@headlessui/react";
import {
  Toaster as ReactToaster, Toast, ToastIcon, resolveValue,
} from "react-hot-toast";
import { cn } from "@/utils/helpers";
import { toasterConfig } from "./config";

export const Toaster = () => {
  return (
    <ReactToaster
      {...toasterConfig}
      position="top-center"
    >
      {(toast: Toast) => {
        return (
          <Transition
            appear
            show={toast.visible}
            className={cn(
              'transform p-4 rounded-xl flex items-center text-2xl',
              toast.type === 'success' ? 'bg-green-500/5 shadow-sm shadow-green-500 backdrop-blur-sm' : 'bg-red-500/5 shadow-sm shadow-red-500 backdrop-blur-sm',
            )}
            enter="transition-all duration-150"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="transition-all duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-75"
          >
            <ToastIcon toast={toast} />
            <p
              className={cn(
                toast.type === 'success' ? 'text-green-500' : 'text-red-500',
                'text-sm font-medium',
              )}
            >
              {resolveValue(toast.message, toast)}
            </p>
          </Transition>
        )
      }}
    </ReactToaster>
  );
};
