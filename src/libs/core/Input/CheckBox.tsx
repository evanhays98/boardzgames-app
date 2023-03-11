import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { createUseStyles } from 'react-jss';
import { theme, Theme } from 'src/libs/theme';
import classnames from 'classnames';

const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  inputContainer: {
    width: '100%',
    position: 'relative',
    ...theme.basicFlex,
  },
  text: {
    ...theme.fonts.label,
  },
  checkbox: {
    display: 'none',
  },
  customCheckbox: {
    ...theme.basicFlex,
    width: theme.marginBase * 2.4,
    height: theme.marginBase * 2.4,
    border: `2px solid ${theme.colors.orange}70`,
    borderRadius: theme.borderRadius.std / 2,
    position: 'relative',
  },
  checked: {
    display: 'block',
    width: theme.marginBase,
    height: theme.marginBase,
    background: theme.colors.orange,
    borderRadius: '50%',
  },

}));

interface Props {
  title: string,
  name: string,
  value?: string
}

export const CheckBox = ({ title, name, value }: Props) => {

    const formik = useFormikContext<any>();
    const classes = useStyles({ theme });
    const [isChecked, setIsChecked] = useState(false);

    const handleValue = (e: any) => {
      setIsChecked(!isChecked);
      if (!formik) {
        return;
      }
      formik.setFieldValue(
        name,
        e.value,
      );
    };

    return (
      <div className={classes.inputContainer} onClick={handleValue}>
        <input className={classes.checkbox} type='checkbox' name={name}
               checked={isChecked} />
        <label className={classnames(classes.customCheckbox)}>
          <div className={classnames({ [classes.checked]: isChecked })}></div>
        </label>
        <div className={classes.text}>{title}</div>
      </div>
    );
  }
;