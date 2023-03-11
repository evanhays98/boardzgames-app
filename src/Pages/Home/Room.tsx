import React from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, theme } from 'src/libs/theme';
import classnames from 'classnames';
import { PlayerPlace } from '../../libs/core/PlayerPlace';
import { CenterGame } from '../../libs/core/CenterGame';
import { InfoGame } from '../../libs/core/InfoGame';
import { useFollowBoard, useGetBoard, useGetMe, useGetWaitingBoard, useQueueWaiting } from '../../libs/api/src';
import { Navigate } from 'react-router-dom';
import { CenteredLoader } from '../../libs/core';


const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  globalContainer: {
    height: '100%',
    width: '100%',
    backdropFilter: 'blur(0.5px)',
    overflow: 'hidden',
  },
  boardGameContainer: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '30% 40% 30%',
    gridTemplateRows: '33% 33% 33%',
    gridTemplateAreas: ` 'player1 info player2' 'player3 game player4' 'player5 me player6'`,
  },
  game: {
    gridArea: 'game',
  },
  player1: {
    gridArea: 'player1',
    justifyContent: 'flex-end',
  },
  player2: {
    gridArea: 'player2',
    justifyContent: 'flex-start',
  },
  player3: {
    gridArea: 'player3',
    justifyContent: 'flex-start',
  },
  player4: {
    gridArea: 'player4',
    justifyContent: 'flex-end',
  },
  player5: {
    gridArea: 'player5',
    justifyContent: 'flex-end',
  },
  player6: {
    gridArea: 'player6',
    justifyContent: 'flex-start',
  },
  info: {
    gridArea: 'info',
  },
  me: {
    gridArea: 'me',
    justifyContent: 'center',
  },
  player: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.marginBase * 2,
  },
}));


export const Room = () => {
  const classes = useStyles({ theme });

  const me = useGetMe();
  const { data: boardWaiting, isLoading } = useGetWaitingBoard(me?.boardId);
  const players = boardWaiting?.playerNames?.filter((player) => player !== me?.name);
  const nbPlayer = players?.length || 0;
  const { data: board } = useGetBoard(me?.boardId);
  useQueueWaiting(boardWaiting ? boardWaiting.boardId : '', !!board);
  useFollowBoard(boardWaiting ? boardWaiting.boardId : '');

  if (isLoading) {
    return <CenteredLoader />;
  }

  if (!me || !boardWaiting) {
    return <Navigate to='/create-room' />;
  }

  return (
    <div className={classes.globalContainer}>
      <div className={classes.boardGameContainer}>
        <div className={classnames(classes.player1, classes.player)}>
          {players && nbPlayer >= 1 && <PlayerPlace name={players[0]} />}
        </div>
        <div className={classes.info}>
          <InfoGame title={'player 2 is playing '} />
        </div>
        <div className={classnames(classes.player2, classes.player)}>
          {players && nbPlayer >= 2 && <PlayerPlace name={players[1]} />}
        </div>

        <div className={classnames(classes.player3, classes.player)}>
          {players && nbPlayer >= 3 && <PlayerPlace name={players[2]} />}
        </div>
        <div className={classes.game}>
          <CenterGame />
        </div>
        <div className={classnames(classes.player4, classes.player)}>
          {players && nbPlayer >= 4 && <PlayerPlace name={players[3]} />}
        </div>

        <div className={classnames(classes.player5, classes.player)}>
          {players && nbPlayer >= 5 && <PlayerPlace name={players[4]} />}
        </div>
        <div className={classnames(classes.me, classes.player)}>
          <PlayerPlace isMe name={me.name} />
        </div>
        <div className={classnames(classes.player6, classes.player)}>
          {players && nbPlayer >= 6 && <PlayerPlace name={players[5]} />}
        </div>
      </div>
    </div>

  );
};
