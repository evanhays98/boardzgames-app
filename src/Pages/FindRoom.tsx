import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, Input, PageTitle } from 'src/libs/core';
import { Theme, theme } from '../libs/theme';
import { useLocation, useNavigate } from 'react-router-dom';
import { JoinBoardDto, useJoinBoard } from '../libs/api/src';


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


export const FindRoom = () => {
  const classes = useStyles({ theme });
  const navigate = useNavigate();
  const location = useLocation();
  const codeUrl = new URLSearchParams(location.search).get('code');
  const [code, setCode] = useState<string | undefined>(codeUrl || undefined);
  const { mutateAsync: createBoard } = useJoinBoard(code);


  const submit = async (values: JoinBoardDto) => {
    try {
      await createBoard({
        playerName: values.playerName,
      });
      navigate('/home');
    } catch (e) {
      throw e;
    }
  };


  return (
    <div className={classes.page}>
      <Formik initialValues={{ playerName: '' }} onSubmit={submit}>
        <Form>
          <div className={classes.container}>
            <PageTitle text={'Find Room'} />
            <Input title='Player Name' name='playerName' />
            <Input title='Code room ' value={code} name='code' onChange={(e) => {
              setCode(e.target.value);
            }} />
            <Button text='Join room' type='submit' full />
            <Button bgColor='transparent' color='lightBeige' text='Create room' type='submit' to='/create-room' line
                    full />
          </div>
        </Form>
      </Formik>
    </div>
  );
};