import { useMutation, useQueryClient } from 'react-query';
import { queryCreate } from './fetch';
import { BoardWaiting, useGetMe } from './boardWaiting';
import { Board, Card, useGetPLayerInfoFromID, useGetPLayerInfoFromName, useLastAction } from './board';
import { CardType } from '../../core/Card';
import { useCallback } from 'react';

export enum ActionType {
  PICK_COIN_1 = 'PICK_COIN_1',
  PICK_COIN_2 = 'PICK_COIN_2',
  PICK_COIN_3 = 'PICK_COIN_3',
  LIE = 'LIE',
  KILL_COIN_3 = 'KILL_COIN_3',
  KILL_COIN_7 = 'KILL_COIN_7',
  ROB_COIN = 'ROB_COIN',
  BLOCK_KILL = 'BLOCK_KILL',
  BLOCK_ROB = 'BLOCK_ROB',
  BLOCK_PICK = 'BLOCK_PICK',
  CHOOSE_CARD = 'CHOOSE_CARD',
  TRADE_CARDS = 'TRADE_CARDS',
}

export interface ActionDto {
  madeBy: string;

  to?: string;
  card?: Card;

  action: ActionType;
}


export const useAction = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<BoardWaiting, undefined, ActionDto>(
    ['boards', 'actions', id],
    queryCreate(`/boards/actions/${id} `),
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData(['api', 'boards', 'boards', id], data);
      },
    },
  );
};

interface PossibleAction {
  action: ActionType;
  type: 'allow' | 'warn';
}


export const usePossibleActions = (board: Board | undefined, idPlayer?: string): PossibleAction[] => {
  const actions: PossibleAction[] = [];
  const me = useGetMe();
  const playerTarget = useGetPLayerInfoFromID(idPlayer, board);
  const playerMe = useGetPLayerInfoFromName(me?.name, board);
  const lastAction = useLastAction(board);

  if (!me || !board) return [];
  if (!board || !playerMe) return actions;

  const myCards = playerMe.cards.filter(card => !card.isDestroyed);

  if (playerMe.id === board.currentPlayerId && playerMe.goldCoin === 10) {
    actions.push({ action: ActionType.KILL_COIN_7, type: 'allow' });
    return actions;
  }

  // if 4 : CHOOSE_CARD
  // 5 : KILL_COIN_3
  // next player could not lie

  if (lastAction === ActionType.KILL_COIN_3) {
    actions.push({ action: ActionType.CHOOSE_CARD, type: 'allow' });
    /*if (board.previousPlayerId !== playerMe.id) {
      actions.push({ action: ActionType.LIE, type: 'allow' });
    }*/
    actions.push({ action: ActionType.LIE, type: 'allow' });
    if (myCards.find(card => card.power === CardType.COUNTESS || card.power === CardType.DUCHESS)) {
      actions.push({ action: ActionType.BLOCK_KILL, type: 'allow' });
    } else {
      actions.push({ action: ActionType.BLOCK_KILL, type: 'warn' });
    }
    return actions;
  }


  if (lastAction === ActionType.LIE || lastAction === ActionType.KILL_COIN_7) {
    if (playerMe.id === board.currentPlayerId) {
      actions.push({ action: ActionType.CHOOSE_CARD, type: 'allow' });
    }
    return actions;
  }


  Object.values(ActionType).forEach((action) => {
    switch (action) {
      case ActionType.PICK_COIN_1:
        if (playerMe.goldCoin <= 9) {
          actions.push({ action: ActionType.PICK_COIN_1, type: 'allow' });
        }
        break;
      case ActionType.PICK_COIN_2:
        if (playerMe.goldCoin > 8) {
          break;
        }
        actions.push({ action: ActionType.PICK_COIN_2, type: 'allow' });
        break;
      case ActionType.PICK_COIN_3:
        if (playerMe.goldCoin > 7) {
          break;
        }
        if (myCards.find(card => card.power === CardType.DUCHESS) !== undefined) {
          actions.push({ action: ActionType.PICK_COIN_3, type: 'allow' });
        } else {
          actions.push({ action: ActionType.PICK_COIN_3, type: 'warn' });
        }
        break;
      case ActionType.KILL_COIN_3:
        if (myCards.find(card => card.power === CardType.ASSASSIN) === undefined && playerMe.goldCoin >= 3) {
          actions.push({ action: ActionType.KILL_COIN_3, type: 'warn' });
        } else if (playerMe.goldCoin >= 3) {
          actions.push({ action: ActionType.KILL_COIN_3, type: 'allow' });
        }
        break;
      case ActionType.KILL_COIN_7:
        if (playerMe.goldCoin >= 7) {
          actions.push({ action: ActionType.KILL_COIN_7, type: 'allow' });
        }
        break;
      case ActionType.ROB_COIN:
        if (!playerTarget) break;
        if (myCards.find(card => card.power === CardType.CAPTAIN) !== undefined && playerTarget.goldCoin >= 2) {
          actions.push({ action: ActionType.ROB_COIN, type: 'allow' });
        } else if (playerTarget.goldCoin >= 2) {
          actions.push({ action: ActionType.ROB_COIN, type: 'warn' });
        }
        break;
      case ActionType.BLOCK_ROB:
        if (myCards.find(card => (
          (card.power === CardType.AMBASSADOR || card.power === CardType.CAPTAIN)
          && lastAction === ActionType.ROB_COIN))) {
          actions.push({ action: ActionType.BLOCK_ROB, type: 'allow' });
        } else if (lastAction === ActionType.ROB_COIN) {
          actions.push({ action: ActionType.BLOCK_ROB, type: 'warn' });
        }
        break;
      case ActionType.BLOCK_PICK:
        if (myCards.find(card => card.power === CardType.DUCHESS && lastAction === ActionType.PICK_COIN_2)) {
          actions.push({ action: ActionType.BLOCK_PICK, type: 'allow' });
        } else if (lastAction === ActionType.PICK_COIN_2) {
          actions.push({ action: ActionType.BLOCK_PICK, type: 'warn' });
        }
        break;
      case ActionType.TRADE_CARDS:
        if (myCards.find(card => card.power === CardType.AMBASSADOR) === undefined) {
          actions.push({ action: ActionType.TRADE_CARDS, type: 'warn' });
        } else {
          actions.push({ action: ActionType.TRADE_CARDS, type: 'allow' });
        }
        break;
      case ActionType.LIE:
        if ((lastAction === ActionType.PICK_COIN_3
          || lastAction === ActionType.BLOCK_PICK
          || lastAction === ActionType.BLOCK_ROB
          || lastAction === ActionType.TRADE_CARDS
          || lastAction === ActionType.ROB_COIN
          || lastAction === ActionType.BLOCK_KILL
        ) && board.previousPlayerId !== playerMe.id) {
          actions.push({ action: ActionType.LIE, type: 'allow' });
        }
        break;
      default:
        break;
    }
    return actions;
  });
  return actions;
};

export const useActionPossible = (board?: Board, playerId?: string) => {
  const possibleActions = usePossibleActions(board, playerId);
  return useCallback(
    (actionType: ActionType) => {
      if (!board || !possibleActions || possibleActions.length === 0) {
        return false;
      }
      return !!possibleActions.find((action) => action.action === actionType);
    },
    [board, possibleActions],
  );

};

export const useIsWarnAction = (board?: Board, playerId?: string) => {
  const possibleActions = usePossibleActions(board, playerId);
  return useCallback((actionType: ActionType) => {
    if (!board || !possibleActions || possibleActions.length === 0) {
      return false;
    }
    return !!possibleActions.find((action) => action.action === actionType && action.type === 'warn');
  }, [board, possibleActions]);
};

export const useWarningLie = (board?: Board, playerId?: string) => {
  const lastAction = useLastAction(board);
  if (!board || !playerId) {
    return false;
  }
  return lastAction === ActionType.LIE && board.currentPlayerId === playerId;

};

const mapHistoric = {
  [ActionType.PICK_COIN_1]: 'PICK_COIN_1',
  [ActionType.PICK_COIN_2]: 'PICK_COIN_2',
  [ActionType.PICK_COIN_3]: 'PICK_COIN_3',
  [ActionType.KILL_COIN_3]: 'KILL_COIN_3',
  [ActionType.KILL_COIN_7]: 'KILL_COIN_7',
  [ActionType.ROB_COIN]: 'ROB_COIN',
  [ActionType.BLOCK_ROB]: 'BLOCK_ROB',
  [ActionType.BLOCK_PICK]: 'BLOCK_PICK',
  [ActionType.TRADE_CARDS]: 'TRADE_CARDS',
  [ActionType.LIE]: 'LIE',
};



