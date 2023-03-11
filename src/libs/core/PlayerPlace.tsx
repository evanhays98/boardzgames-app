import React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from '../theme';
import { Card } from './Card';
import classnames from 'classnames';
import { Coin } from './Coin';
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
import { Icon, Icons } from './Icons';
import { Modal } from './Modal';

const useStyles = createUseStyles<string, { isMe: boolean, isPlayerTurn: boolean }, any>((theme: Theme) => ({
  container: props => ({
    ...theme.basicFlex,
    flexDirection: 'column',
    padding: theme.marginBase * 2,
    position: 'relative',
    [theme.media.mobile]: {
      padding: theme.marginBase / 2,
    },
  }),
  title: props => ({
    position: 'absolute',
    top: -16,
    left: 10,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
    [theme.media.mobile]: {
      padding: theme.marginBase / 2,
      fontSize: 10,
    },
    ...theme.fonts.body,
    marginBottom: theme.marginBase,
    background: 'rgba(0,0,0,0.39)',
    padding: theme.marginBase / 4,
    borderRadius: theme.borderRadius.std,
    color: theme.colors.lightBeige,
    boxShadow: props.isPlayerTurn ? `0px 0px 30px 3px ${theme.colors.orange}` : undefined,
  }),
  text: {
    ...theme.fonts.h5,
  },
  description: {
    ...theme.fonts.label,
    textAlign: 'justify',
  },
  header: props => ({
    ...theme.basicFlex,
    width: '100%',
    padding: theme.marginBase,
    justifyContent: 'center',
    [theme.media.mobile]: {
      padding: 0,
      paddingTop: theme.marginBase / 2,
    },
  }),
  containerCard: {
    ...theme.basicFlex,
    flex: 1,
    width: '100%',
  },
  button: props => ({
    border: 'none',
    background: theme.colors.orange,
  }),
  meContainer: {
    backgroundColor: 'rgba(147,145,145,0.05)',
    boxShadow: `0px 0px 50px 10px ${'rgb(0,0,0)'}`,
    borderRadius: theme.borderRadius.std + 10,
    minWidth: '80%',
    border: `1px solid ${'rgba(147,145,145,0.09)'}`,
  },
  modalContainer: {
    ...theme.basicFlex,
    gap: theme.marginBase * 2,
    backdropFilter: 'sepia(90%)',
  },
}));


interface Props {
  isMe?: boolean,
  name?: string,
}

export const PlayerPlace = ({ isMe = false, name }: Props) => {
  const me = useGetMe();
  const { data: board } = useGetBoard(me?.boardId);
  const player = useGetPLayerInfoFromName(name, board);
  const myPLayer = useGetPLayerInfoFromName(me?.name, board);
  const isMyTurn = board && myPLayer?.id === board.currentPlayerId;
  const classes = useStyles({ theme, isMe, isPlayerTurn: !!(board && player?.id === board.currentPlayerId) });
  const { mutateAsync: action } = useAction(me?.boardId);

  const isPossibleAction = useActionPossible(board, player ? player.id : '');
  const isWarnAction = useIsWarnAction(board, player ? player.id : '');

  const [modalBlock, setModalBlock] = React.useState(false);
  const [modalRobber, setModalRobber] = React.useState(false);
  const [modalKill, setModalKill] = React.useState(false);


  if (!board) {
    return (
      <div className={classnames(classes.container, {
        [classes.meContainer]: isMe,
      })}>
        <h1 className={classes.title}>{name}</h1>

        <div className={classes.header}>
          <Coin point={0} />
        </div>
        <div className={classes.containerCard}>
          <Card pin hide></Card>
          <Card pin hide></Card>
        </div>
      </div>);
  }


  return (
    <>
      <div className={classnames(classes.container, {
        [classes.meContainer]: isMe,
      })}>
        <h1 className={classes.title}>{name}</h1>

        <div className={classes.header}>
          {player && <Coin point={player.goldCoin || 0} />}
          {!isMe && isMyTurn &&
            <>
              <Button action={true} square={true} classNameUpdate={classes.button} onClick={() => setModalRobber(true)}
                      disabled={!isPossibleAction(ActionType.ROB_COIN)}>
                <Icons icon={Icon.robber} size={theme.icon.normal + 10} /></Button>
              <Button action={true} square={true} classNameUpdate={classes.button} onClick={() => setModalKill(true)}
                      disabled={!isPossibleAction(ActionType.KILL_COIN_7)
                        && !isPossibleAction(ActionType.KILL_COIN_3)
                      }>
                <Icons icon={Icon.knife} size={theme.icon.normal + 10} /></Button>
            </>
          }
          {
            isMe &&
            <Button action={true} square={true} classNameUpdate={classes.button} onClick={() => setModalBlock(true)}
                    disabled={!isPossibleAction(ActionType.BLOCK_PICK)
                      && !isPossibleAction(ActionType.BLOCK_ROB)
                      && !isPossibleAction(ActionType.BLOCK_KILL)}>
              <Icons icon={Icon.block} size={theme.icon.normal + 10} /></Button>
          }
        </div>
        {player &&
          <div className={classes.containerCard}>
            <Card pin hide={!isMe}
                  cardType={player.cards[0].power} isDestroyed={player.cards[0].isDestroyed}
                  disabled={!isPossibleAction(ActionType.CHOOSE_CARD)}
                  onClick={async () => {
                    if (!myPLayer) return;
                    await action({
                      madeBy: myPLayer.id,
                      action: ActionType.CHOOSE_CARD,
                      card: player.cards[0],
                    });
                  }}
            />
            <Card pin hide={!isMe} cardType={player.cards[1].power} isDestroyed={player.cards[1].isDestroyed}
                  disabled={!isPossibleAction(ActionType.CHOOSE_CARD)}
                  onClick={async () => {
                    if (!myPLayer) return;
                    await action({
                      madeBy: myPLayer.id,
                      action: ActionType.CHOOSE_CARD,
                      card: player.cards[1],
                    });
                  }} />
          </div>
        }
      </div>
      <Modal isOpen={modalBlock} setIsOpen={setModalBlock} title='Blockage'>
        <div className={classes.modalContainer}>
          <Button full warning={isWarnAction(ActionType.BLOCK_KILL)}
                  disabled={!isPossibleAction(ActionType.BLOCK_KILL)}
                  onClick={async () => {
                    if (!myPLayer) return;
                    setModalBlock(false);
                    await action({
                      madeBy: myPLayer.id,
                      action: ActionType.BLOCK_KILL,
                    });
                  }}>
            Kill à 3 pièces
          </Button>
          <Button full warning={isWarnAction(ActionType.BLOCK_ROB)}
                  disabled={!isPossibleAction(ActionType.BLOCK_ROB)}
                  onClick={async () => {
                    if (!myPLayer) return;
                    setModalBlock(false);
                    await action({
                      madeBy: myPLayer.id,
                      action: ActionType.BLOCK_ROB,
                    });
                  }}>
            Vol de 2 pièces
          </Button>
          <Button full warning={isWarnAction(ActionType.BLOCK_PICK)}
                  disabled={!isPossibleAction(ActionType.BLOCK_PICK)}
                  onClick={async () => {
                    if (!myPLayer) return;
                    setModalBlock(false);
                    await action({
                      madeBy: myPLayer.id,
                      action: ActionType.BLOCK_PICK,
                    });
                  }}
          >
            Pioche de 2 pièces
          </Button>
        </div>
      </Modal>
      {player &&
        <>
          <Modal isOpen={modalRobber} setIsOpen={setModalRobber} title='Voler'>
            <div className={classes.modalContainer}>
              <Button full
                      onClick={async () => {
                        if (!myPLayer) return;
                        setModalRobber(false);
                        await action({
                          madeBy: myPLayer.id,
                          to: player.id,
                          action: ActionType.ROB_COIN,
                        });
                      }}
                      warning={isWarnAction(ActionType.ROB_COIN)}
                      disabled={!isPossibleAction(ActionType.ROB_COIN)}>
                Voler 2 pièces à {name}
              </Button>
            </div>
          </Modal>
          <Modal isOpen={modalKill} setIsOpen={setModalKill} title='Tuer'>
            <div className={classes.modalContainer}>
              <Button full onClick={async () => {
                if (!myPLayer) return;
                setModalKill(false);
                await action({
                  madeBy: myPLayer.id,
                  to: player.id,
                  action: ActionType.KILL_COIN_3,
                });
              }} disabled={!isPossibleAction(ActionType.KILL_COIN_3)}
                      warning={isWarnAction(ActionType.KILL_COIN_3)}
              >
                Tuer {name?.toUpperCase()} pour 3 pièces
              </Button>
              <Button full onClick={async () => {
                if (!myPLayer) return;
                setModalKill(false);
                await action({
                  madeBy: myPLayer.id,
                  to: player.id,
                  action: ActionType.KILL_COIN_7,
                });
              }} disabled={!isPossibleAction(ActionType.KILL_COIN_7)}
                      warning={isWarnAction(ActionType.KILL_COIN_7)}>
                Tuer {name?.toUpperCase()} pour 7 pièces
              </Button>
            </div>
          </Modal>
        </>
      }
    </>);
};