import firebase from 'firebase'

const {
  REACT_APP_FB_APIKEY,REACT_APP_FB_AUTHDOM,REACT_APP_FB_DATABASE,
  REACT_APP_FB_PROJECTID,REACT_APP_FB_STOREBUCKET,REACT_APP_FB_SENDER,
  REACT_APP_FB_APPID,REACT_APP_FB_MEASURE
} = require('./firebase.config');

const config = {
    apiKey: REACT_APP_FB_APIKEY,
    authDomain: REACT_APP_FB_AUTHDOM,
    databaseURL: REACT_APP_FB_DATABASE,
    projectId: REACT_APP_FB_PROJECTID,
    storageBucket: REACT_APP_FB_STOREBUCKET,
    messagingSenderId: REACT_APP_FB_SENDER,
    appId: REACT_APP_FB_APPID,
    measurementId: REACT_APP_FB_MEASURE
};

var FOUR_HOURS = 60 * 60 * 1000 * 4;
const PATHWAYS = {}

const app = firebase.initializeApp(config);
const googleProvider = new firebase.auth.GoogleAuthProvider();

//SESSIONS
const logIn = () => {
  app.auth().signInWithPopup(googleProvider).then(result => 
  {
    console.log(result);
    document.location.href = '/dashboard';
  });
}

const logOut = () => {
  app.auth().signOut();
  document.location.href = '/login';
}

const isLogin = async() => {
  app.auth().onAuthStateChanged(function (user) {
    //console.log(user);
    //console.log(user != null);
    return user != null;
  });
}

//DATABASE

export const getPathways = () => {
  const promiseData = app.database().ref('/pathways');
  return promiseData;
}

export const getUserEmail = () => {
  return new Promise((resolve, reject) => {
     const unsubscribe = app.auth().onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
     }, reject);
  });
}

const getID = (str) => str.substring(str.lastIndexOf('/') + 1)

const existPath = (pathwayID) => {
  var d = new Date(); 
  var time = d.getTime();

  if(PATHWAYS[pathwayID] && (time - PATHWAYS[pathwayID][1]) < FOUR_HOURS){
    return PATHWAYS[pathwayID][0];
  }

  return null;
}

const savePath = (pathwayID, pathway) => {
  var d = new Date(); 
  var time = d.getTime();
  PATHWAYS[pathwayID] = [pathway, time];
}

export {app, googleProvider, isLogin, logIn, logOut, getID, existPath, savePath};
