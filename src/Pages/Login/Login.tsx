import React from 'react';
import { createUseStyles } from 'react-jss';
import { ColorsTest, theme, Theme } from '../../libs/theme';
import { Button, PageTitle } from '../../libs/core';
import Input from '../../libs/core/Input/Input';
import { Form, Formik } from 'formik';
import { useLogin } from '../../libs/api/src';
import { useNavigate } from 'react-router-dom';


const useStyles = createUseStyles<string, {}, any>((theme: Theme) => ({
  page: {
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: theme.marginBase * 6,
    flexDirection: 'column',
    padding: theme.marginBase,
    paddingBottom: theme.marginBase * 6,
    alignItems: 'center',
  },
  container: {
    ...theme.basicFlex,
    background: theme.colors.transparentDarkGray,
    backdropFilter: 'blur(2px)',
    borderRadius: theme.borderRadius.std,
    padding: [theme.marginBase * 4, theme.marginBase * 2],
    gap: theme.marginBase * 3,
    margin: theme.marginBase * 2,
    maxWidth: 400,
  },
  link: {
    color: theme.colors.lightGray,
    textDecoration: 'underline',
    padding: theme.marginBase,
  },
}));

interface Values {
  mail: string,
  password: string,
}

export const Login = () => {
  const classes = useStyles({ theme });
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();


  const submit = async (values: Values) => {
    try {
      await login(values);
      navigate('/home');
    } catch (e) {
      throw e;
    }
  };

  return (
    <div className={classes.page}>
      <Formik initialValues={{ mail: '', password: '' }} onSubmit={submit}>
        <Form>
          <div className={classes.container}>
            <PageTitle text={'Sign in'} />
            <Input title='Email' name='mail' />
            <Input title='Password' name='password' type='password' eye />
            <Button text='Connect' type='submit' full />
            <Button text='Dont have an account' full line bgColor='transparent' color={ColorsTest.lightBeige}
                    to='/register' />
          </div>
        </Form>
      </Formik>
    </div>
  );
};