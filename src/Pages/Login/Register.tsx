import React from 'react';
import { createUseStyles } from 'react-jss';
import { ColorsTest, theme, Theme } from '../../libs/theme';
import { Button, PageTitle } from '../../libs/core';
import Input from '../../libs/core/Input/Input';
import { Form, Formik } from 'formik';
import { CreateUserDto, useRegister } from '../../libs/api/src';
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
}));


export const Register = () => {
  const classes = useStyles({ theme });
  const { mutateAsync: register } = useRegister();
  const navigate = useNavigate();

  const submit = async (values: CreateUserDto) => {
    try {
      const test = await register(values);
      console.log('register pass ', test);
      navigate('/create-room');
    } catch (e) {
      console.log('error ', e);
      throw e;
    }
  };

  return (
    <div className={classes.page}>

      <Formik initialValues={{ email: '', password: '', userName: '', theme: 'Light' }} onSubmit={submit}>
        <Form>
          <div className={classes.container}>
            <PageTitle text={'Sign up'} />
            <Input title='Email' name='email' />
            <Input title='userName' name='userName' />
            <Input title='Password' name='password' type='password' eye />
            <Button text='Join' type='submit' full />
            <Button text='Already have an account' full line bgColor='transparent' color={ColorsTest.lightBeige}
                    to='/login' />
          </div>
        </Form>
      </Formik>

    </div>
  );
};