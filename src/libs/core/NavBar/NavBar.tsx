import React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from '../../theme';

const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  page: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  navBar: {
    width: '100%',
    padding: theme.marginBase,
    background: theme.colors.yellowGradient,
    ...theme.basicFlex,
    justifyContent: 'space-evenly',
    borderTopRightRadius: theme.borderRadius.std * 2,
    borderTopLeftRadius: theme.borderRadius.std * 2,
    zIndex: 100,
  },
  pageContainer: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
}));

interface Props {
  children?: React.ReactNode;
}

export const NavBar = ({ children }: Props) => {
  const classes = useStyles({ theme });
  return (
    <div className={classes.page}>
      <div className={classes.pageContainer}>
        {children}
      </div>
    </div>
  );
};