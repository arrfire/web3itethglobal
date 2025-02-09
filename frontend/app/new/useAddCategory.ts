import useSWRMutation from "swr/mutation";
import { fetcher } from "@/common/utils/network/baseFetcher";
import { categoriesUrl } from "@/common/utils/network/endpoints";
import toast from "react-hot-toast";

export const useAddCategory = () => {
  const addTag = useSWRMutation(categoriesUrl, fetcher);
  const {
    trigger,
    isMutating,
  } = addTag

  const onSubmit = async ({
    value,
    id,
  } : {
    value: string;
    id: string;
  }) => {
    try {
      await trigger({
        body: JSON.stringify({
          id,
          value,
        }),
        method: 'POST',
      });

    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return {
    onSubmit,
    isAddingCategory: isMutating,
  }
}
