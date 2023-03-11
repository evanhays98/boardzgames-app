import { Form, Formik } from 'formik';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Button, Input, PageTitle } from 'src/libs/core';
import { Theme, theme } from '../libs/theme';
import { CreateBoardDto, useCreateBoard } from '../libs/api/src';
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


export const CreateRoom = () => {
  const classes = useStyles({ theme });
  const navigate = useNavigate();
  const { mutateAsync: createBoard } = useCreateBoard();

  const submit = async (values: CreateBoardDto) => {
    try {
      await createBoard(values);
      navigate('/home');
    } catch (e) {
      throw e;
    }
  };


  return (
    <div className={classes.page}>
      <Formik initialValues={{ ownerName: '' }} onSubmit={submit}>
        <Form>
          <div className={classes.container}>
            <PageTitle text={'Create Room'} />
            <Input title='Player Name' name='ownerName' />
            <Button text='Create room' type='submit' full />
            <Button bgColor='transparent' color='lightBeige' text='Find a room' full to='/find-room' />
          </div>
        </Form>
      </Formik>
    </div>
  );
};