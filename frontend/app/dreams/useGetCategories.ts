import {
  useEffect, useState,
} from 'react';
import useSWR from 'swr';
import { categoriesUrl } from "@/common/utils/network/endpoints";
import { fetcher } from '@/common/utils/network/baseFetcher';
import {
  CategoriesDTO, CategoryType,
} from './types';

export const useGetCategories = () => {
  const [categories, setCategories] = useState<Array<CategoryType>>([])
  const [currentCategory, setCurrentCategory] = useState('All')
  const result = useSWR<CategoriesDTO>(categoriesUrl, url => fetcher(
    url,
  ), {
    revalidateOnFocus: false,
  });

  const {
    data,
    isLoading,
  } = result;

  useEffect(() => {
    if (data?.data.length) {
      setCategories([{
        value: 'All',
        id: 'all',
        active: true,
      }, ...data.data.map((d: CategoryType) => {
        return {
          value: d.value,
          id: d.id,
          active: false,
        }
      })])
    }
  }, [data])

  return {
    categories,
    setCategories,
    currentCategory,
    setCurrentCategory,
    isCategoriesLoading: isLoading,
  }
}
