import React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from '../theme';
import { Button } from './Buttons';
import { Icon, Icons } from './Icons';

const useStyles = createUseStyles<string, { open: boolean }, any>((theme: Theme) => ({
  mainContainer: props => ({
    position: 'fixed',
    background: `rgba(245, 245, 245, 0.3)`,
    height: '100vh',
    width: '100vw',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    transition: 'all 0.3s ease-in-out',
    ...theme.basicFlex,
  }),
  container: {
    background: '#171616',
    backdropFilter: 'blur(2px)',
    borderRadius: theme.borderRadius.std,
    padding: [theme.marginBase * 4, theme.marginBase * 2],
    boxShadow: theme.boxShadow.std,
    width: '500px',
    height: 'fit-content',
  },
  headerContainer: {
    width: '100%',
    ...theme.basicFlex,
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    marginBottom: theme.marginBase * 4,
  },
  title: {
    ...theme.fonts.h4,
    textTransform: 'uppercase',
  },
}));


interface Props {
  children?: React.ReactNode,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  title?: string,
}

export const Modal = ({ children, isOpen, setIsOpen, title }: Props) => {
  const classes = useStyles({ theme, open: isOpen });
  if (!isOpen) return null;

  return (

    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <Button square onClick={() => setIsOpen(false)}>
            <Icons icon={Icon.close}></Icons>
          </Button>
          <h1 className={classes.title}>{title}</h1>
        </div>
        {children}
      </div>
    </div>);
};