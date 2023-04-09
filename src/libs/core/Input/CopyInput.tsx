import React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from 'src/libs/theme';
import Input from './Input';
import { Icon, Icons } from '../Icons';
import { APP_URL } from '../../api/src/fetch';

const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  inputContainer: {
    width: '100%',
    ...theme.basicFlex,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: theme.marginBase / 2,
    transition: 'all ease-in-out 0.3s',
    borderRadius: theme.borderRadius.std,
    backgroundColor: 'rgba(2,2,2,0.5)',
    backdropFilter: 'blur(100px)',
    position: 'relative',
    overflow: 'hidden',
  },
  input: {
    resize: 'none',
    border: 'none',
    outline: 'none',
    flex: 1,
    paddingRight: 40 + 2,
    minWidth: 0,
    margin: 'auto',
    backgroundColor: theme.colors.transparent,
    ...theme.fonts.body,
    padding: theme.marginBase,
  },
  button: {
    position: 'absolute',
    cursor: 'copy',
    flex: 1,
    top: 0,
    right: 0,
    bottom: 0,
    width: 40,
    backgroundColor: theme.colors.lightBeige,
    ...theme.basicFlex,
  },
}));

function copyToClipboard(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

interface Props {
  value?: string;
}

export const CopyInput = ({ value }: Props) => {
  const classes = useStyles({ theme });
  const link = APP_URL + 'find-room?code=' + value;

  return (
    <div className={classes.inputContainer}>
      <input
        className={classes.input}
        name="link-game"
        value={link}
        onChange={() => {}}
      />
      <div
        className={classes.button}
        onClick={() => {
          copyToClipboard(link);
        }}>
        <Icons icon={Icon.link} color="orange"></Icons>
      </div>
    </div>
  );
};

export default Input;
