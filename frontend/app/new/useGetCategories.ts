import useSWR from 'swr';
import { categoriesUrl } from "@/common/utils/network/endpoints";
import { fetcher } from '@/common/utils/network/baseFetcher';
import {
  CategoriesDTO, CategoryType,
} from './types';
import {
  useEffect,
  useState,
} from 'react';

export const useGetCategories = () => {

  const [categories, setCategories] = useState<Array<CategoryType> | []>([]);

  const result = useSWR<CategoriesDTO>(categoriesUrl, url => fetcher(
    url,
  ), {
    revalidateOnFocus: false,
  });

  const {
    data,
    isLoading,
    mutate,
  } = result;

  useEffect(() => {
    if (data?.data) {
      setCategories(data.data.map((d: CategoryType) => {
        return {
          label: d.value,
          value: d.value,
          name: d.value,
          id: d.id,
        };
      }))
    }
  }, [data])


  return {
    data: categories,
    isCategoriesLoading: isLoading,
    mutateCategories: mutate,
  }
}
