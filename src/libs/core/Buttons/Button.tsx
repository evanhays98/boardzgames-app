import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Colors, theme, Theme } from '../../theme';
import { Link, LinkProps } from 'react-router-dom';
import { Icon, Icons } from '../Icons';

const useStyles = createUseStyles<string, { line: boolean, bgColor: Colors, color: Colors, disabled: boolean, action: boolean }, any>((theme: Theme) => ({
  blockColor: props => ({
    background: theme.colors[props.bgColor],
    borderRadius: theme.borderRadius.std,
    ...theme.fonts.body,
    color: theme.colors[props.color],
    fontWeight: 'bold',
    display: 'flex',
    border: 0,
    alignItems: 'center',
    position: 'relative',
    alignContent: 'center',
    justifyContent: 'center',
    padding: !props.line ? theme.marginBase : [theme.marginBase / 4, theme.marginBase],
    gap: !props.line ? theme.marginBase * 2 : theme.marginBase,
    opacity: props.disabled ? 0.5 : 1,
    transition: 'all ease-in-out .2s',
    '&:hover': {
      cursor: props.disabled ? 'auto' : 'pointer',
      opacity: props.disabled ? 0.5 : 1,
      scale: !props.disabled && props.action ? 1.1 : 1,
    },
  }),
  full: {
    width: '100%',
  },
  square: props => ({
    width: theme.marginBase * 4,
    maxWidth: theme.marginBase * 4,
    height: theme.marginBase * 4,
    padding: theme.marginBase / 2,
    '&:hover': {
      cursor: 'pointer',
      boxShadow: !props.disabled && props.action ? `0px 0px 30px 3px ${theme.colors.lightBeige}` : undefined,
    },
  }),
  line: {
    textDecoration: 'underline',
  },
  warning: {
    position: 'absolute',
    top: -14,
    right: -14,
  },
}));


interface Props {
  classNameUpdate?: string;
  bgColor?: Colors;
  color?: Colors;
  iconColor?: Colors;
  text?: string;
  children?: React.ReactNode;
  full?: boolean;
  icon?: Icon;
  line?: boolean;
  square?: boolean;
  sizeIcon?: number;
  disabled?: boolean;
  warning?: boolean;
  action?: boolean;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface AProps extends React.LinkHTMLAttributes<HTMLLinkElement> {
  href: string;
}

export type GenericButtonProps = ButtonProps | LinkProps | AProps;


export const Button = (props: Props & GenericButtonProps) => {
  const classes = useStyles({
    line: !!props.line,
    theme,
    bgColor: props.bgColor || 'orange',
    color: props.color || 'lightGray',
    disabled: props.disabled || false,
    action: props.action || false,
  });
  let ButtonComp: any = 'button';
  if ('to' in props) {
    ButtonComp = (lprops: any) => <Link to={props.to} {...lprops} />;
  }
  if ('href' in props) {
    ButtonComp = 'a';
  }
  return <ButtonComp className={classnames(classes.blockColor, {
    [classes.full]: props.full,
    [classes.line]: props.line,
    [classes.square]: props.square,
  }, props.classNameUpdate)} {...props} onClick={props.disabled ? () => {
  } : props.onClick}>
    {props.warning && <Icons icon={Icon.warn} size={16} className={classes.warning} color='lightBeige' />}
    {props.children}
    {props.text && props.text}
    {props.icon && <Icons icon={props.icon} size={16} />}
  </ButtonComp>;
};
