import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_URL, queryCreate, queryGet } from './fetch';
import { useEffect, useRef } from 'react';
import { AxiosError } from 'axios';


export interface BoardWaiting {
  boardId: string,
  playerNames?: string[],
}

export interface UserWaiting {
  name: string;
  boardId: string;
  isOwner: boolean;
}

export interface CreateBoardDto {
  ownerName: string;
}

export interface JoinBoardDto {
  playerName: string;
}


export const useCreateBoard = () => {
  return useMutation<BoardWaiting, undefined, CreateBoardDto>(
    queryCreate(`/boards/init`),
    {
      onSuccess: (data, variables) => {
        const me = { name: variables.ownerName, isOwner: true, boardId: data.boardId };
        localStorage.setItem('playerMe', JSON.stringify(me));
      },
    },
  );
};


export const useJoinBoard = (id?: string) => {
  return useMutation<BoardWaiting, undefined, JoinBoardDto>(
    queryCreate(`/boards/join/${id} `),
    {
      onSuccess: (data, variables) => {
        const me = { name: variables.playerName, isOwner: false, boardId: data.boardId };
        localStorage.setItem('playerMe', JSON.stringify(me));
      },
    },
  );
};

export const useGetWaitingBoard = (id?: string) => {
  return useQuery<BoardWaiting, AxiosError>(
    ['api', 'boards', 'waiting', id],
    queryGet(`/boards/waiting/${id}`),
    {
      retry: false,
      staleTime: 1000,
      enabled: !!id,
    },
  );
};

export const useGetMe = () => {
  const me = localStorage.getItem('playerMe');
  if (!me) return null;
  return JSON.parse(me) as UserWaiting;
};

export const useQueueWaiting = (boardId?: string, close?: boolean) => {
  const esRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!boardId) {
      return;
    }
    if (close) {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      return;
    }
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    const eventSource = new EventSource(
      `${API_URL}/boards/await/${boardId}`,
    );

    eventSource.onmessage = (boardWaiting) => {
      const board = JSON.parse(boardWaiting.data);
      queryClient.invalidateQueries(['api', 'boards', 'waiting', board.boardId]);
    };
    esRef.current = eventSource;
    return () => {
      eventSource.close();
    };
  }, [boardId, queryClient]);
};
