import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin } from '../../FirebaseUtils';

const PrivateRoute = ({component: Component, ...rest}) => {
    const login = isLogin();
    return (
        <Route {...rest} render={props => (
            login ?
                <Component {...props} {...rest}/>
            : <Redirect to="/login" />
        )} />
    );
};

export default PrivateRoute;