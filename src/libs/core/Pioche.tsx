import React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from '../theme';
import { Card } from './Card';
import classnames from 'classnames';
import { Icon, Icons } from './Icons';

const useStyles = createUseStyles<string, { disabled: boolean }, any>((theme: Theme) => ({
  container: props => ({
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      cursor: props.disabled ? 'auto' : 'pointer',
      scale: props.disabled ? 1 : 1.05,
    },
  }),
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    [theme.media.mobile]: {
      width: 100 / 2,
      height: 130 / 2,
    },
  },
  cardd: {
    [theme.media.mobile]: {
      width: 100 / 2,
      height: 130 / 2,
    },
  },
  warning: {
    position: 'absolute',
    top: -20,
    right: -20,
  },
}));


interface Props {
  onClick?: () => void,
  disabled?: boolean,
  warning?: boolean,
}

export const Pioche = ({ onClick, disabled, warning }: Props) => {
  const classes = useStyles({ theme, disabled: !!disabled });

  return (
    <div className={classes.container} onClick={() => {
      onClick && onClick();
    }}>
      {warning && <Icons icon={Icon.warn} size={20} className={classes.warning} color='lightBeige' />}
      <Card pin hide className={classnames(classes.cardd)}></Card>

      {[45, 90].map((i) =>
        <Card pin hide className={classnames(classes.card)} style={{ transform: `rotate(${i}deg)` }} key={i} />)
      }
    </div>);
};