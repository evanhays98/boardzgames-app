import React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from '../theme';
import classnames from 'classnames';
import { Icon, Icons } from './Icons';

const coin = require('src/assests/images/coin.png');

const useStyles = createUseStyles<string, { disabled: boolean }, any>((theme: Theme) => ({
  container: props => ({
    ...theme.basicFlex,
    width: '50px',
    height: '50px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.marginBase,
    position: 'relative',
    borderRadius: '50%',
    transition: 'all ease-in-out .3s',
    opacity: props.disabled ? 0.5 : 1,
    [theme.media.mobile]: {
      width: 40,
      height: 40,
    },

  }),
  hover: props => ({
    '&:hover': {
      scale: props.disabled ? 1 : 1.2,
      zIndex: 20,
      cursor: props.disabled ? 'auto' : 'pointer',
    },
  }),
  title: {
    ...theme.fonts.h5,
    marginBottom: theme.marginBase,
    color: 'rgba(228,236,236,0.86)',
    zIndex: 2,
    paddingLeft: 1,
    paddingTop: '5px',
    userSelect: 'none',
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
  test: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    width: '40%',
    height: '40%',
    backgroundColor: 'transparent',
    boxShadow: `0px 0px 20px 7px ${'rgb(2,2,2)'}`,
  },
  warning: {
    position: 'absolute',
    top: -14,
    right: -14,
  },
}));


interface Props {
  point: number,
  className?: string,
  onClick?: () => void,
  action?: boolean,
  disabled?: boolean,
  warning?: boolean,
}

export const Coin = ({ point, className, onClick, action, disabled, warning }: Props) => {
  const classes = useStyles({ theme, disabled: !!disabled });
  if (disabled) {
    onClick = () => {
    };
  }

  return (
    <div className={classnames(classes.container,
      { [classes.hover]: action },
      className)} onClick={() => {
      onClick && onClick();
      return;
    }}>
      {warning && <Icons icon={Icon.warn} size={16} className={classes.warning} color='lightBeige' />}
      <div className={classes.test}></div>
      <img src={coin} alt='coin' className={classes.img} />
      <h1 className={classes.title}>{point}</h1>
    </div>);
};