import React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from '../theme';
import classnames from 'classnames';
import { Modal } from './Modal';
import { Icon, Icons } from './Icons';

const card = require('src/assests/images/card.png');
const duchess = require('src/assests/images/duchess.png');
const comtesse = require('src/assests/images/comtesse.png');
const ambassador = require('src/assests/images/ambassador.png');
const murderer = require('src/assests/images/murderer.png');
const captain = require('src/assests/images/captain.png');

const useStyles = createUseStyles<string, { pin: boolean; hide: boolean }, any>(
  (theme: Theme) => ({
    container: {
      borderRadius: theme.borderRadius.std,
      boxShadow: `0px 0px 20px 7px ${'rgba(0,0,0,0.6)'}`,
      ...theme.basicFlex,
      width: 100,
      height: 130,
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: theme.marginBase,
      position: 'relative',
      overflow: 'hidden',
      transition: 'scale ease-in-out .3s',
      border: `solid 1px ${'#595959'}`,
      [theme.media.mobile]: {
        width: 50,
        height: 65,
      },
    },
    hover: {
      '&:hover': {
        scale: '1.1',
        zIndex: 20,
        cursor: 'pointer',
      },
    },
    bottomTitleHider: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: `linear-gradient(180deg, ${'rgba(0,0,0,0.3)'} 0%, ${'rgba(0,0,0,0.1)'} 100%)`,
      zIndex: 2,
      backdropFilter: 'blur(2px)',
      height: 15,
      boxShadow: `0px 0px 20px 7px ${'rgba(0,0,0,0.30)'}`,
    },
    title: {
      position: 'absolute',
      ...theme.fonts.label,
      zIndex: 2,
      color: 'rgba(255,255,255,0.8)',
      bottom: 0,
      fontSize: 11,
      left: 5,
      userSelect: 'none',
      [theme.media.mobile]: {
        fontSize: 7,
      },
    },
    description: {
      ...theme.fonts.label,

      textAlign: 'justify',
    },
    img: {
      position: 'absolute',
      cover: 'cover',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
    destroyed: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(192,27,27,0.18)',
      zIndex: 3,
    },
    iconDestroyed: {
      position: 'absolute',
      top: 2,
      left: 2,
      color: '#c01b1b',
      [theme.media.mobile]: {
        fontSize: 15,
      },
    },
    iconDestroyed2: {
      position: 'absolute',
      top: 2,
      right: 2,
      color: '#c01b1b',
      transform: 'rotate(90deg)',
      [theme.media.mobile]: {
        fontSize: 15,
      },
    },
    iconDestroyed3: {
      position: 'absolute',
      bottom: 16,
      left: 2,
      color: '#c01b1b',
      zIndex: 2,
      transform: 'rotate(-90deg)',
      [theme.media.mobile]: {
        fontSize: 15,
      },
    },
    iconDestroyed4: {
      position: 'absolute',
      bottom: 16,
      right: 2,
      color: '#c01b1b',
      zIndex: 2,
      transform: 'rotate(180deg)',
      [theme.media.mobile]: {
        fontSize: 15,
      },
    },
    small: {
      fontSize: 7,
    },
  })
);

export enum CardType {
  DUCHESS = 'DUCHESS',
  COUNTESS = 'COUNTESS',
  AMBASSADOR = 'AMBASSADOR',
  ASSASSIN = 'ASSASSIN',
  CAPTAIN = 'CAPTAIN',
}

interface Props {
  pin?: boolean;
  hide?: boolean;
  cardType?: CardType;
  className?: string;
  style?: any;
  isDestroyed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
}

export const Card = ({
  pin,
  hide = false,
  cardType,
  className,
  style,
  isDestroyed,
  onClick,
  disabled,
  small,
}: Props) => {
  const classes = useStyles({ theme, pin: !!pin, hide });
  const [isOpen, setIsOpen] = React.useState(false);
  hide = hide && !isDestroyed;
  disabled = disabled || hide;

  return (
    <>
      <div
        className={classnames(
          classes.container,
          {
            [classes.hover]: !disabled && onClick,
          },
          className
        )}
        style={style}
        onClick={() => {
          if (!disabled) {
            onClick && onClick();
          }
        }}>
        {hide && <img src={card} alt="board" className={classes.img} />}
        {!hide && (
          <>
            <div className={classes.bottomTitleHider} />
            {cardType === CardType.DUCHESS && (
              <>
                <img src={duchess} alt="duchess" className={classes.img} />
                <h1
                  className={classnames(classes.title, {
                    [classes.small]: small,
                  })}>
                  Duchess
                </h1>
              </>
            )}
            {cardType === CardType.COUNTESS && (
              <>
                <img src={comtesse} alt="comtesse" className={classes.img} />
                <h1
                  className={classnames(classes.title, {
                    [classes.small]: small,
                  })}>
                  Comtesse
                </h1>
              </>
            )}
            {cardType === CardType.AMBASSADOR && (
              <>
                <img
                  src={ambassador}
                  alt="ambassador"
                  className={classes.img}
                />
                <h1
                  className={classnames(classes.title, {
                    [classes.small]: small,
                  })}>
                  Ambassador
                </h1>
              </>
            )}
            {cardType === CardType.ASSASSIN && (
              <>
                <img src={murderer} alt="MURDERER" className={classes.img} />
                <h1
                  className={classnames(classes.title, {
                    [classes.small]: small,
                  })}>
                  Assassin
                </h1>
              </>
            )}
            {cardType === CardType.CAPTAIN && (
              <>
                <img src={captain} alt="CAPTAIN" className={classes.img} />
                <h1
                  className={classnames(classes.title, {
                    [classes.small]: small,
                  })}>
                  Captain
                </h1>
              </>
            )}
            {isDestroyed && (
              <>
                <Icons icon={Icon.knife} className={classes.iconDestroyed} />
                <Icons icon={Icon.knife} className={classes.iconDestroyed2} />
                <Icons icon={Icon.knife} className={classes.iconDestroyed3} />
                <Icons icon={Icon.knife} className={classes.iconDestroyed4} />
                <div className={classes.destroyed} />
              </>
            )}
          </>
        )}
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        haha
      </Modal>
    </>
  );
};
