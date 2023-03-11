import React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from '../theme';
import { Button } from './Buttons';
import { Icon, Icons } from './Icons';

const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.transparentDarkGray,
    borderRadius: theme.borderRadius.std,
    boxShadow: theme.boxShadow.std,
    ...theme.basicFlex,
    width: '100%',
    alignItems: 'flex-start',
    padding: theme.marginBase * 2,
  },
  headerContainer: {
    width: '100%',
    ...theme.basicFlex,
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  title: {
    ...theme.fonts.label,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    textAlign: 'left',
    '&:first-letter': {
      textTransform: 'uppercase',
    },
  },
}));


interface Props {
  title: string,
}

export const SentenceInformation = ({ title }: Props) => {
  const classes = useStyles({ theme });

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <div className={classes.title}>{title}</div>
        <Button square>
          <Icons icon={Icon.edit} size={theme.icon.normal + 2}></Icons>
        </Button>
      </div>
    </div>);
};