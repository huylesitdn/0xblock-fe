const TOKEN = `0xblock-token-${process.env.REACT_APP_NODE_ENV}`;

export const authenticateUser = (token: string): void => {
  localStorage.setItem(TOKEN, token);
};

export const isUserAuthenticated = (): boolean => {
  return localStorage.getItem(TOKEN) !== null;
};

export const unAuthenticateUser = (): void => {
  return localStorage.removeItem(TOKEN);
};

export const getToken = (): string => {
  return localStorage.getItem(TOKEN) as string;
};
