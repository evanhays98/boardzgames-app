import React from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, theme } from 'src/libs/theme';

const board = require('src/assests/images/board2.png');

const useStyles = createUseStyles((theme: Theme) => ({
  pageBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  img: {
    position: 'absolute',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    opacity: 0.45,
  },
  test: {
    width: '100%',
    height: '100%',
    background: 'rgba(79,79,79,0.2)',
  },
}));

export const PageBackground = () => {
  const classes = useStyles({ theme });
  return (
    <div className={classes.pageBackground}>
      <img src={board} alt='board' className={classes.img} />
      <div className={classes.test}></div>
    </div>
  );
};