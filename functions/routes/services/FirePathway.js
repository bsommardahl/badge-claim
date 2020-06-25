const firebase = require('firebase')

const config = {
    apiKey: process.env.REACT_APP_FB_APIKEY,
    authDomain: process.env.REACT_APP_FB_AUTHDOM,
    databaseURL: "https://bagde-claim.firebaseio.com",
    projectId: process.env.REACT_APP_FB_PROJECTID,
    storageBucket: process.env.REACT_APP_FB_STOREBUCKET,
    messagingSenderId: process.env.REACT_APP_FB_SENDER,
    appId: process.env.REACT_APP_FB_APPID,
    measurementId: process.env.REACT_APP_FB_MEASURE
};

const app = firebase.initializeApp(config);

const getPathways = () => {
  const promiseData = app.database().ref('/pathways');
  return promiseData;
}

module.exports = getPathways;