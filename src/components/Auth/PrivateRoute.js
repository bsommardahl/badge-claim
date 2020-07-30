import React from "react";
import { Route, Redirect } from "react-router-dom";
import { app } from "../../../functions/FirebaseU/FirebaseUtils";
import { useObject } from "react-firebase-hooks/database";
import { useAuthState } from "react-firebase-hooks/auth";

const PrivateRoute = ({ component: Component, admin: admin, ...rest }) => {
  const [users, usersLoading, userError] = useObject(
    app.database().ref("/users/")
  );
  const [user, loading, error] = useAuthState(app.auth());

  return !loading && !usersLoading ? (
    <Route
      {...rest}
      render={(props) =>
        admin && user != null ? (
          Object.values(users.val()).filter(
            (item) => item.profile.email === user.email
          )[0].permission.isAdmin === 1 ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        ) : user != null ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  ) : (
    <div />
  );
};

export default PrivateRoute;
