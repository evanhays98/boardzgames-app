import React, { useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from '../theme';
import {
  findWinner,
  useGetBoard,
  useGetMe,
  useGetPLayerInfoFromID,
  useGetWaitingBoard,
  useStartGame,
} from '../api/src';
import { Button } from './Buttons';
import { CopyInput } from './Input/CopyInput';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { useHistoryToDisplay, useNameById } from './hooks';

const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  container: (props) => ({
    width: '100%',
    height: '100%',
    overflow: 'scroll',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    ...theme.basicFlex,
    alignItems: 'center',
    justifyContent: 'center',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  content: {
    width: '100%',
    paddingTop: theme.marginBase * 2,
    ...theme.basicFlex,
    alignItems: 'center',
    justifyContent: 'center',
    [theme.media.mobile]: {
      padding: 0,
      paddingTop: theme.marginBase,
    },
  },
  contentTitle: {
    width: '100%',
    ...theme.basicFlex,
  },
  title: {
    ...theme.fonts.h5,
    marginBottom: theme.marginBase,
    color: 'rgba(0,0,0,0.9)',
    backgroundColor: 'rgba(206,206,206,0.84)',
    borderRadius: theme.borderRadius.std,
    backdropFilter: 'blur(5px)',
    padding: theme.marginBase,
    minWidth: '100%',
    fontSize: 12,
    fontWeight: 600,
    [theme.media.mobile]: {
      fontSize: 10,
      padding: theme.marginBase / 2,
    },
  },
  idGame: {
    ...theme.fonts.h4,
    marginBottom: theme.marginBase,
    color: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: theme.borderRadius.std,
    backdropFilter: 'blur(5px)',
    padding: theme.marginBase,
  },
}));

interface Props {
  pin?: boolean;
  title: string;
  description?: string;
  hide?: boolean;
}

export const InfoGame = ({ title }: Props) => {
  const classes = useStyles({ theme });
  const me = useGetMe();
  const { data: boardWaiting } = useGetWaitingBoard(me?.boardId);
  const { data: board } = useGetBoard(me?.boardId);
  const { mutateAsync: startGame } = useStartGame(me?.boardId);
  const playerToPlay = useGetPLayerInfoFromID(board?.currentPlayerId, board);
  const ref = useRef<any>(null);
  const winner = findWinner(board);
  const navigate = useNavigate();
  const nameList = useNameById(board);
  const historyFunction = useHistoryToDisplay();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [ref, board]);

  const submit = async () => {
    if (me?.isOwner) {
      await startGame({ boardId: me?.boardId });
    }
  };
  const endGame = () => {
    localStorage.removeItem('playerMe');
    navigate('/create-room');
  };

  if (!boardWaiting) return null;

  if (winner) {
    return (
      <Modal
        isOpen={true}
        setIsOpen={() => {
          endGame();
        }}
        title={`${winner} Won the game`}>
        <Button full onClick={endGame}>
          Continue
        </Button>
      </Modal>
    );
  }

  if (!board) {
    return (
      <div className={classes.container} style={{ flexDirection: 'column' }}>
        <div className={classes.content}>
          <CopyInput value={boardWaiting.boardId}></CopyInput>
          {me?.isOwner && (
            <Button text="Start game" type="submit" onClick={submit} />
          )}
        </div>
      </div>
    );
  }

  if (!playerToPlay) return null;
  return (
    <div className={classes.container} ref={ref} id="infoGame">
      <div className={classes.content}>
        {board.actionsList.map((action, index) => {
          if (!nameList) return null;
          const previousAction =
            board.actionsList && board.actionsList.length > 1
              ? board.actionsList[index - 1]
              : undefined;
          const madeByName = nameList[action.madeBy];
          let targetName: string | undefined = '';
          if (action.to) {
            targetName = nameList[action.to];
          } else if (previousAction?.madeBy) {
            targetName = nameList[previousAction.madeBy];
          }
          return (
            <div className={classes.contentTitle} key={index}>
              {historyFunction(action.action, madeByName, targetName)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
