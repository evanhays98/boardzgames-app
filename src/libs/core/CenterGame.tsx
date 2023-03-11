import React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from '../theme';
import { Coin } from './Coin';
import { Icon, Icons } from './Icons';
import { Pioche } from './Pioche';
import {
  ActionType,
  useAction,
  useActionPossible,
  useGetBoard,
  useGetMe,
  useGetPLayerInfoFromName,
  useIsWarnAction,
} from '../api/src';
import { Button } from './Buttons';

const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  mainContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: props => ({
    ...theme.basicFlex,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.marginBase * 2,
    justifyContent: 'space-evenly',
    [theme.media.mobile]: {
      padding: theme.marginBase / 2,
    },
  }),
  title: {
    ...theme.fonts.h5,
    color: theme.colors.lightBeige,
  },
  description: {
    ...theme.fonts.label,
    textAlign: 'justify',
  },
  coinContainer: {
    ...theme.basicFlex,
    flexDirection: 'column',
    [theme.media.mobile]: {
      flexDirection: 'row',
    },
  },
}));


interface Props {
}

export const CenterGame = ({}: Props) => {
  const classes = useStyles({ theme });
  const me = useGetMe();
  const { data: board } = useGetBoard(me?.boardId);
  const playerMe = useGetPLayerInfoFromName(me?.name, board);
  const { mutateAsync: action } = useAction(me?.boardId);
  const isMyTurn = board && board.currentPlayerId === playerMe?.id;

  const isPossibleAction = useActionPossible(board);
  const isWarnAction = useIsWarnAction(board);

  if (!playerMe || !me) {
    return null;
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <Pioche onClick={() => {
          action({
            madeBy: playerMe.id,
            action: ActionType.TRADE_CARDS,
          });
        }} disabled={!isPossibleAction(ActionType.TRADE_CARDS)} warning={isWarnAction(ActionType.TRADE_CARDS)} />
        <Button disabled={!isPossibleAction(ActionType.LIE)} action={true} bgColor='lightBeige'
                onClick={() => {
                  action({
                    madeBy: playerMe.id,
                    action: ActionType.LIE,
                  });
                }
                }>
          <Icons icon={Icon.lie} size={theme.icon.normal + 20} color='orange' />
        </Button>
        <div className={classes.coinContainer}>
          <Coin point={1} onClick={() => {
            action({
              madeBy: playerMe.id,
              action: ActionType.PICK_COIN_1,
            });
          }} action={isMyTurn} disabled={!isPossibleAction(ActionType.PICK_COIN_1)} />
          <Coin point={2} onClick={() => action({
            madeBy: playerMe.id,
            action: ActionType.PICK_COIN_2,
          })} action={isMyTurn} disabled={!isPossibleAction(ActionType.PICK_COIN_2)}
                warning={isWarnAction(ActionType.PICK_COIN_2)} />
          <Coin point={3}
                onClick={() => action({
                  madeBy: playerMe.id,
                  action: ActionType.PICK_COIN_3,
                })} action={isMyTurn} disabled={!isPossibleAction(ActionType.PICK_COIN_3)}
                warning={isWarnAction(ActionType.PICK_COIN_3)} />
        </div>
      </div>
    </div>);
};