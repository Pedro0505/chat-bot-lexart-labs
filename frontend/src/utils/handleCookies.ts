import Cookies, { CookieSetOptions } from 'universal-cookie';

const cookie = new Cookies();

export const setCookie = (key: string, data: string, options?: CookieSetOptions) => {
  cookie.set(key, data, options);
};

export const getCookie = (key: string) => cookie.get(key);

export const removeCookie = (key: string) => {
  cookie.remove(key);
};
