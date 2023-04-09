import { Board } from 'src/libs/api/src';

export const useNameById = (board?: Board) => {
  if (!board) return null;
  return board.board.players.reduce((acc, player) => {
    acc[player.id] = player.name;
    return acc;
  }, {} as { [key: string]: string });
};