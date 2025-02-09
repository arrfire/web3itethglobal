import { 
  useEffect, useState,
} from 'react';
import useSWR from 'swr';
import { createClient } from '@/common/utils/supabase/client';
import { SupabaseTables } from '@/common/constants';
import { Comment } from './types';

const fetchIdeaComments = async (ideaAddress: string) => {
  const supabase = createClient();
  const { data } = await supabase
    .from(SupabaseTables.IdeaFeed)
    .select('*')
    .eq('ideaAddress', ideaAddress)
    .order('created_at', { ascending: false });
  return data as Comment[];
};

export const useIdeaComments = (idea: { tokenAddress: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { 
    data: commentsLocal, 
    error, 
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    ['ideaComments', idea.tokenAddress],
    () => fetchIdeaComments(idea.tokenAddress),
    {
      revalidateOnFocus: true,
    },
  );

  useEffect(() => {
    if (commentsLocal?.length) {
      setComments(commentsLocal);
    } else {
      setComments([]);
    }
  }, [commentsLocal])

  return {
    comments: comments,
    setComments,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};