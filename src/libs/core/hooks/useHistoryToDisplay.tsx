import { ActionType } from '../../api/src';
import { createUseStyles } from 'react-jss';
import { type Theme, theme } from '../../theme';
import React from 'react';
import { Card, CardType } from '../Card';

const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  name: {
    ...theme.fonts.body,
    fontSize: 12,
    display: 'inline-flex',
    background: 'rgba(0,0,0,0.39)',
    padding: theme.marginBase / 4,
    borderRadius: theme.borderRadius.std / 2,
    color: theme.colors.lightBeige,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
    [theme.media.mobile]: {
      fontSize: 10,
      fontWeight: 600,
    },
  },
  marginLeft: {},
  text: {
    ...theme.fonts.body,
    width: '100%',
    textAlign: 'left',
    gap: theme.marginBase / 2,
    fontSize: 12,
    [theme.media.mobile]: {
      fontSize: 10,
      fontWeight: 600,
    },
  },
  content: {
    marginBottom: theme.marginBase,
    padding: theme.marginBase,
    borderRadius: theme.borderRadius.std,
    backgroundColor: 'rgba(0,0,0,0.50)',
    textAlign: 'left',
  },
  card: {
    boxShadow: 'none',
    opacity: 0.8,
    width: 48,
    height: 64,
    textAlign: 'left',
  },
  cardContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: theme.marginBase / 2,
  },
}));

interface Props {
  text?: string;
}

const NameComponent = ({ text }: Props) => {
  const classes = useStyles({ theme });
  if (!text) return null;
  return <div className={classes.name}>{text}</div>;
};

export const useHistoryToDisplay = () => {
  const classes = useStyles({ theme });
  return (action: ActionType, madeByName: string, targetName?: string) => {
    let res;
    switch (action) {
      case ActionType.BLOCK_KILL:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}pretend to be
            <Card
              cardType={CardType.COUNTESS}
              className={classes.card}
              small={true}
            />{' '}
            and blocked{'  '}
            <NameComponent text={targetName} />
            {'  '}pretend to be Countess and blocked
          </>
        );
        break;
      case ActionType.BLOCK_ROB:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}pretend to be
            <div className={classes.cardContainer}>
              <Card
                cardType={CardType.CAPTAIN}
                className={classes.card}
                small={true}
              />
              <p>or</p>
              <Card
                cardType={CardType.AMBASSADOR}
                className={classes.card}
                small={true}
              />
            </div>
            and blocked{'  '}
            <NameComponent text={targetName} />
            {'  '}from robbing 2 coins
          </>
        );
        break;
      case ActionType.BLOCK_PICK:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}pretend to be
            <div className={classes.cardContainer}>
              <Card
                cardType={CardType.DUCHESS}
                className={classes.card}
                small={true}
              />
            </div>
            and blocked{'  '}
            <NameComponent text={targetName} />
            {'  '}from picking 2 coins
          </>
        );
        break;
      case ActionType.LIE:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}say that{'  '}
            <NameComponent text={targetName} />
            {'  '}is lying
          </>
        );
        break;
      case ActionType.KILL_COIN_3:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}pretend to be
            <div className={classes.cardContainer}>
              <Card
                cardType={CardType.ASSASSIN}
                className={classes.card}
                small={true}
              />
            </div>
            and killed{'  '}
            <NameComponent text={targetName} />
            {'  '}for 3 coins
          </>
        );
        break;
      case ActionType.KILL_COIN_7:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}killed{'  '}
            <NameComponent text={targetName} />
            {'  '}for 7 coins
          </>
        );
        break;
      case ActionType.ROB_COIN:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}pretend to be
            <div className={classes.cardContainer}>
              <Card
                cardType={CardType.CAPTAIN}
                className={classes.card}
                small={true}
              />
            </div>
            and robbed 2 coins to{'  '}
            <NameComponent text={targetName} />
          </>
        );
        break;
      case ActionType.PICK_COIN_1:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}picked 1 coin
          </>
        );
        break;
      case ActionType.PICK_COIN_2:
        res = (
          <>
            <NameComponent text={madeByName} /> {'  '}picked 2 coins
          </>
        );
        break;
      case ActionType.PICK_COIN_3:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}pretend to be
            <div className={classes.cardContainer}>
              <Card
                cardType={CardType.DUCHESS}
                className={classes.card}
                small={true}
              />
            </div>
            and picked 3 coins
          </>
        );
        break;
      case ActionType.CHOOSE_CARD:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}killed one of his card
          </>
        );
        break;
      case ActionType.TRADE_CARDS:
        res = (
          <>
            <NameComponent text={madeByName} />
            {'  '}pretend to be
            <div className={classes.cardContainer}>
              <Card
                cardType={CardType.AMBASSADOR}
                className={classes.card}
                small={true}
              />
            </div>
            and traded his cards
          </>
        );
        break;
      default:
        res = <>No action</>;
        break;
    }
    return (
      <div className={classes.content}>
        <div className={classes.text}>{res}</div>
      </div>
    );
  };
};
