import firebase from 'firebase'

const config = {
    apiKey: process.env.REACT_APP_FB_APIKEY,
    authDomain: process.env.REACT_APP_FB_AUTHDOM,
    databaseURL: process.env.REACT_APP_FB_DATABASE,
    projectId: process.env.REACT_APP_FB_PROJECTID,
    storageBucket: process.env.REACT_APP_FB_STOREBUCKET,
    messagingSenderId: process.env.REACT_APP_FB_SENDER,
    appId: process.env.REACT_APP_FB_APPID,
    measurementId: process.env.REACT_APP_FB_MEASURE
};

var FOUR_HOURS = 60 * 60 * 1000 * 4;
const PATHWAYS = {}

const app = firebase.initializeApp(config);
const googleProvider = new firebase.auth.GoogleAuthProvider();

//SESSIONS
const logIn = () => {
  app.auth().signInWithPopup(googleProvider).then(result => 
  {
    //console.log(result);
    document.location.href = '/explore';
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

export const joinPathway = (pathway, usermail) => {
  const promiseData = app.database()
      .ref(`/pathways/${pathway.completionBadge?getID(pathway.completionBadge):getID(pathway.requiredBadge)}/users`)
      .set(pathway.users ? pathway.users.concat([usermail]) : [usermail]);
  return promiseData
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

export const getWebhooks = () => {
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

export const getDrafts = () => {
  const promiseData = app.database().ref('/drafts');
  return promiseData;
}

export const getDraft = (id) => {
  const promiseData = app.database().ref(`/drafts/${id}`);
  return promiseData;
}

export {
        app, googleProvider, isLogin, logIn, 
        logOut, getID, existPath, savePath, 
        addWebhook, deleteWebhook, addDraft, publishDraft,
        deleteDraft
      };
