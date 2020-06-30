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

//SESSIONS
const logIn = () => {
  app.auth().signInWithPopup(googleProvider).then(result => 
  {
    document.location.href = '/explore';
  });
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

const getAdmins = () => {
  const promiseData = app.database().ref('/admins');
  return promiseData;
}

//DATABASE

const getPathways = () => {
  const promiseData = app.database().ref('/pathways');
  return promiseData;
}

const joinPathway = (pathway, usermail) => {
  const promiseData = app.database()
      .ref(`/pathways/${pathway.completionBadge?getID(pathway.completionBadge):getID(pathway.requiredBadge)}/users`)
      .set(pathway.users ? pathway.users.concat([usermail]) : [usermail]);
  return promiseData
}

const getUserEmail = () => {
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

//DRAFTS

const addDraft=(id,data)=>{
  app.database().ref(`drafts/${id}`).set(data)
}

const deleteDraft=(id)=>{
  app.database().ref(`drafts/${id}`).remove()
}

const publishDraft=(id,data)=>{
  app.database().ref(`drafts/${id}`).set(data)
  app.database().ref(`pathways/${id}`).set(data);
}

const getDrafts = () => {
  const promiseData = app.database().ref('/drafts');  
  return promiseData;
}

const getDraft = (id) => {
  const promiseData = app.database().ref(`/drafts/${id}`);
  return promiseData;
}

module.exports = {
        app: app, 
        googleProvider: googleProvider, 
        isLogin: isLogin, 
        logIn: logIn, 
        logOut: logOut, 
        getID: getID, 
        existPath: existPath,
        savePath: savePath, 
        addWebhook: addWebhook, 
        deleteWebhook: deleteWebhook, 
        addDraft: addDraft, 
        publishDraft: publishDraft,
        deleteDraft: deleteDraft, 
        getUserEmail: getUserEmail,
        getAdmins: getAdmins,
        getPathways: getPathways,
        joinPathway: joinPathway,
        getWebhooks: getWebhooks,
        getDrafts: getDrafts,
        getDraft: getDraft
};