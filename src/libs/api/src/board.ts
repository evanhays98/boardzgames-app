import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_URL, queryCreate, queryGet } from './fetch';
import { AxiosError } from 'axios';
import { CardType } from '../../core/Card';
import { ActionType } from './action';
import { useEffect, useRef } from 'react';


export interface Card {
  power: CardType;
  isDestroyed: boolean;
  ownerId: string;
}

export interface Player {
  id: string;
  goldCoin: number;
  name: string;
  cards: Card[];
}

export interface HistoryItem {
  madeBy: string;
  to?: string;
  action: ActionType;
}

export interface  Board {
  currentPlayerId: string;
  board: {
    id: string;
    players: Player[]
  };
  actionsList: HistoryItem[];
  previousPlayerId?: string;
}

export const useGetBoard = (id?: string) => {
  return useQuery<Board, AxiosError>(
    ['api', 'boards', 'boards', id],
    queryGet(`/boards/boards/${id}`),
    {
      enabled: !!id,
      retry: false,
      staleTime: 1000,
    },
  );
};

export const useGetPLayerInfoFromID = (id?: string, board?: Board) => {
  if (!board || !id) return null;
  return board.board.players.find(player => player.id === id);
};

export const useGetPLayerInfoFromName = (name?: string, board?: Board) => {
  if (!board || !name) return null;
  return board.board.players.find(player => player.name === name);
};

export const useStartGame = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<Board, undefined, any>(
    ['api', 'boards', 'start', id],
    queryCreate(`/boards/start/${id} `),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['api', 'boards', 'boards', id], data);
      },
    });
};

export const useFollowBoard = (boardId?: string) => {
  const esRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!boardId) {
      return;
    }
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    const eventSource = new EventSource(
      `${API_URL}/boards/follow/${boardId}`,
    );

    eventSource.onmessage = async (boardWaiting) => {
      const board = JSON.parse(boardWaiting.data);
      console.log('board', board);
      await queryClient.invalidateQueries(['api', 'boards', 'boards', board.board.id]);
    };
    esRef.current = eventSource;
    return () => {
      eventSource.close();
    };
  }, [boardId, queryClient]);
};


export const useLastAction = (board?: Board) => {
  if (!board || !board.actionsList || board.actionsList.length === 0) return null;
  return board.actionsList[board.actionsList.length - 1].action;
};

export const usePreviousPlayerAction = (board?: Board) => {
  if (!board || !board.actionsList || board.actionsList.length === 0) return null;
  return board.actionsList[board.actionsList.length - 1].madeBy;
};

export const findWinner = (board?: Board) => {
  if (!board) return;
  const getBoardCount = board?.board.players.filter(player => player.cards.some(card => !card.isDestroyed))
  if (getBoardCount && getBoardCount.length === 1) {
    return getBoardCount[0].name
  }
  return null;
}