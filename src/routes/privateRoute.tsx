import React, { FC } from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';

interface Props {
  component: typeof React.Component;
  auth: boolean;
}

const PrivateRoute: FC<Props> = ({ component: Component, auth = true, ...rest }) => (
  // @ts-ignore
  <Route {...rest} render={(props: RouteComponentProps) => (auth ? <Component {...props} /> : <Redirect to={'/'} />)} />
);

export default PrivateRoute;
