import { useMutation, useQueryClient } from 'react-query';
import { queryCreate } from './fetch';

interface Chapter {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  questions?: any[];
  QuestionCopy?: any[];
}


export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation<Chapter, undefined, { title: string; description: string }>(
    queryCreate(`/chapter`),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['chapter', data.id], data);
      },
    },
  );
};