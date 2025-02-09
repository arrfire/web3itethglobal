'use client'
import {
  AlertErrorIcon, AlertSuccessIcon,
} from "@/common/components/icons";

export const toasterConfig = {
  toastOptions: {
    duration: 5000,
    success: {
      icon: <AlertSuccessIcon className="text-green-500 fill-green-500 mr-3" />,
    },
    error: {
      icon: <AlertErrorIcon className="text-red-500 fill-red-500 mr-3" />,
    },
  },
  containerStyle: {
    right: 16,
    top: 40,
  },
}
