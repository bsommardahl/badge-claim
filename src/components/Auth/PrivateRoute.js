import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import {
  getUserEmail,
  getAdmins,
} from "../../../functions/FirebaseU/FirebaseUtils";

const PrivateRoute = ({ component: Component, admin: admin, ...rest }) => {
  const [user, setUser] = useState("");
  const [isAdmin, setAdmin] = useState("");

  useEffect(() => {
    if (!user) {
      getUser();
    }
    if (!admin) {
      getAdmin();
    }
  }, []);

  const getUser = async () => {
    const msg = await getUserEmail();
    setUser(msg);
  };

  const getAdmin = async () => {
    var msg;
    const email = await getUserEmail();
    getAdmins().on("value", (snapshot) => {
      console.log(snapshot.val());
      for (let x = 0; x < snapshot.val().length; x++) {
        if (email.email == snapshot.val()[x]) {
          console.log("ADMIN!", email.email);
          setAdmin(snapshot.val()[x]);
          break;
        }
      }
    });
  };

  return (
    <Route
      {...rest}
      render={(props) =>
        admin? isAdmin? <Component {...props} /> : <Redirect to="/login" />:
        user != null ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
