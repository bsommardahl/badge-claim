const firebase = require('firebase')
const envs = require('../config')

const config = {
    apiKey: envs.REACT_APP_FB_APIKEY,
    authDomain: envs.REACT_APP_FB_AUTHDOM,
    databaseURL: envs.REACT_APP_FB_DATABASE,
    projectId: envs.REACT_APP_FB_PROJECTID,
    storageBucket: envs.REACT_APP_FB_STOREBUCKET,
    messagingSenderId: envs.REACT_APP_FB_SENDER,
    appId: envs.REACT_APP_FB_APPID,
    measurementId: envs.REACT_APP_FB_MEASURE
};

const app = firebase.initializeApp(config);
const googleProvider = new firebase.auth.GoogleAuthProvider();
const getID = (str) => str.substring(str.lastIndexOf('/') + 1)

//SESSIONS
const logIn = async() => {
  var signin = await app.auth().signInWithPopup(googleProvider)
  
  if(signin)
    document.location.href = '/explore';
}

const logOut = () => {
  app.auth().signOut();
  document.location.href = '/login';
}

const isLogin = async() => {
  app.auth().onAuthStateChanged(function (user) {
    return user != null;
  });
}

const getUserEmail = () => {
  return new Promise((resolve, reject) => {
     const unsubscribe = app.auth().onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
     }, reject);
  });
}

const getAdmins = () => {
  const promiseData = app.database().ref('/admins');
  return promiseData;
}

const getWebhooks = () => {
  const promiseData = app.database().ref('/webhooks');
  return promiseData;
}

const addWebhook=(data)=>{
  app.database().ref(`webhooks/${data.id}:${data.name}`)
    .set({"url":  data.url, "event":  data.event, "secret":  data.secret, "owner": data.email})
}

const deleteWebhook=(value)=>{
  app.database().ref(`webhooks/${value}`).remove()
}

const userSubscribe = (email, ids) => {
  app.database().ref(`/users/${email.replace(/[\.@]/ig,'')}`).set(ids);
  alert("Subscribed!");
}

const getSubscritions = (email) => {
  const promiseData = app.database().ref(`/users/${email.replace(/[\.@]/ig,'')}`);
  return promiseData;
}

module.exports = {
        app: app, 
        googleProvider: googleProvider, 
        isLogin: isLogin, 
        logIn: logIn, 
        logOut: logOut, 
        getID: getID, 
        addWebhook: addWebhook, 
        deleteWebhook: deleteWebhook,  
        getUserEmail: getUserEmail,
        getAdmins: getAdmins,
        getWebhooks: getWebhooks,
        userSubscribe: userSubscribe,
        getSubscritions: getSubscritions
};