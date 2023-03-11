import React from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, theme } from '../theme/Theme';

const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  globalContainer: {
    width: '100%',
    padding: theme.marginBase,
  },
  title: {
    ...theme.fonts.h1,
    color: theme.colors.orange,
  },
}));

interface Props {
  text: string,
}

export const PageTitle = ({ text }: Props) => {
  const classes = useStyles({ theme });
  return (
    <div className={classes.globalContainer}>
      <h1 className={classes.title}>{text}</h1>
    </div>
  );
};