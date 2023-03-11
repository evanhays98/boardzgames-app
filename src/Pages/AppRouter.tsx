import { Route, Routes } from 'react-router-dom';
import { Login } from './Login/Login';
import { Room } from './Home/Room';
import { Register } from './Login/Register';
import React from 'react';
import { FindRoom } from './FindRoom';
import { CreateRoom } from './CreateRoom';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/*' element={<Room />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/room' element={<Room />} />
      <Route path='/find-room' element={<FindRoom />} />
      <Route path='/create-room' element={<CreateRoom />} />
    </Routes>
  );
};