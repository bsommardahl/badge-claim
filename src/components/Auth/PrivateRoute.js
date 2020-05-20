import React, {useEffect, useState} from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin, getUserEmail } from '../../FirebaseUtils';

const PrivateRoute = ({component: Component, ...rest}) => {
    const [user, setUser] = useState('');

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, []);

    const getUser = async () => {
        const msg = await getUserEmail();
        setUser(msg);
    };

    return (
        <Route {...rest} render={props => (
            user != null ?
                <Component {...props}/>
            : <Redirect to="/login" />
        )} />
    );
};

export default PrivateRoute;