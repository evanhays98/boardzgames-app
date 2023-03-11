import { useMutation, useQuery, useQueryClient } from 'react-query';
import { queryCreate, queryGet } from './fetch';
import { useCallback } from 'react';
import { AxiosError } from 'axios';

export interface User {
  id: number,
  email: string,
  userName: string,
}

export interface CreateUserDto {
  email: string,
  password: string,
  userName: string,
  theme: string,
}

export const useLogout = () => {
  const queryClient = useQueryClient();

  const onLogout = useCallback(() => {
    queryClient.invalidateQueries();
    queryClient.removeQueries();
    localStorage.removeItem('userToken');
    window.location.replace('/login');
  }, [queryClient]);

  return useMutation<void, AxiosError, void>(queryCreate(`/v2/auth/logout`), {
    onSuccess: onLogout,
    onError: onLogout,
  });
};

export const useMe = (allowAnonymous?: boolean) => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useLogout();

  return useQuery<User, AxiosError>(
    ['auth', 'me'],
    queryGet('/users/account/my'),
    {
      staleTime: 1000 * 60, // 1 min
      onSuccess: (data) => {
        queryClient.setQueryData(['account', data.id], data);
      },
      retry: (count, error) => {
        if (error.response && error.response.status === 401) {
          return false;
        }
        return count < 2;
      },
      onError: () => {
        if (!allowAnonymous) {
          logout();
        }
      },
    },
  );
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<User, undefined, { mail: string; password: string }>(
    queryCreate(`/auth/signin`),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['account', data.id], data);
        queryClient.setQueryData(['auth', 'me'], data);
      },
    },
  );
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation<User, undefined, CreateUserDto>(
    queryCreate(`/auth/sign-up`),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['account', data.id], data);
        queryClient.setQueryData(['auth', 'me'], data);
      },
    },
  );
};