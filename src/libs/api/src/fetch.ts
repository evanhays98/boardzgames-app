import Axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';

export const API_URL = 'http://192.168.217.33:8000/api';
export const APP_URL = 'http://192.168.217.33:2000/';

export const fetchWithAuth = async <T = any>(
  options: AxiosRequestConfig,
): Promise<T> => {
  try {
    const result = await Axios({
      ...options,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    });
    if (result.data.access_token) {
      localStorage.setItem('userToken', result.data.access_token);
    }
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const queryFetch = <T = any>(
  options: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = fetchWithAuth({
    cancelToken: source.token,
    ...options,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('cancelled');
  };

  return promise;
};

export const queryGet = (path: string, params?: Object) => () => {
  return queryFetch({
    url: `${API_URL}${path}`,
    params: params,
    method: 'GET',
  });
};

export interface QueryUpdateOptions {
  params?: Object;
}

export const queryUpdate =
  (path: string | ((data: any) => string), options?: QueryUpdateOptions) =>
    (data: any) => {
      const finalPath = typeof path === 'string' ? path : path(data);

      return queryFetch({
        url: `${API_URL}${finalPath}`,
        params: options && options.params,
        method: 'PATCH',
        data,
      });
    };

export const queryReplace =
  (path: string | ((data: any) => string), options?: QueryUpdateOptions) =>
    (data: any) => {
      const finalPath = typeof path === 'string' ? path : path(data);

      return queryFetch({
        url: `${API_URL}${finalPath}`,
        params: options && options.params,
        method: 'PUT',
        data,
      });
    };

export interface QueryCreateOptions extends QueryUpdateOptions {
}

export const queryCreate =
  (path: string, options?: QueryCreateOptions) => (data?: any) =>
    queryFetch({
      url: `${API_URL}${path}`,
      params: options && options.params,
      method: 'POST',
      data,
    });

export const queryDelete =
  (path: string | ((data: any) => string), options?: QueryUpdateOptions) =>
    (data: any) => {
      const finalPath = typeof path === 'string' ? path : path(data);

      return queryFetch({
        url: `${API_URL}${finalPath}`,
        params: options && options.params,
        method: 'DELETE',
        data,
      });
    };