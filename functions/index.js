const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const envs = require('./env.json');

const PRIVATE_KEY=envs.service.private_key
const DOMAIN=envs.service.domain

const app = express();

axios.defaults.baseURL = envs.service.base_url;

const badgeController = require('./routes/controllers/BadgeController');
const ClaimBadgeController = require('./routes/controllers/ClaimBadgeController');
const awardBadgeController = require('./routes/controllers/AwardBadgeController');
const issuerController = require('./routes/controllers/IssuerController');
const groupController = require('./routes/controllers/GroupController');

const mailgun = require('mailgun-js')({apiKey: PRIVATE_KEY, domain: DOMAIN});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/badges', badgeController);

app.use('/api/claim', ClaimBadgeController);

app.use('/api/issuer', issuerController);

app.use('/api/award', awardBadgeController);

app.use('/api/group', groupController);

app.post('/api/pathways/:pathwayId/subscribe', (req, res) => {
  var data = {
    from: req.body.from,
    to: req.body.to,
    subject: `Subscription to ${req.body.pathway} pathway`,
    html: `Hello, 
          <br><br>
          
          We have a request from ${req.body.from} to subscribe to the pathway:
          <p>Name: ${req.body.pathway}</p>
          <p>ID: ${req.params.pathwayId}</p>
          <br><br>

          Thanks,
          <br><br>

          Badgr Extras Extension`
  };
  
  mailgun.messages().send(data, function (error, body) {
    res.status(200).send('OK');
  });
})

app.post('/api/v2/pathways/:pathwayId/subscribe', (req, res) => {
  var data = {
    from: req.body.from,
    to: req.body.to,
    subject: `Subscription to ${req.body.pathway} pathway`,
    html: `Hello, 
          <br><br>
          
          We have a request from ${req.body.from} to subscribe to the pathway:
          <p>Name: ${req.body.pathway}</p>
          <p>ID: ${req.params.pathwayId}</p>
          <br><br>

          Thanks,
          <br><br>

          Badgr Extras Extension`
  };
  
  mailgun.messages().send(data, function (error, body) {
    res.status(200).send('OK');
  });
})

app.post('/api/invite', (req, res) => {
  var data = {
    from: EMAIL,
    to: req.body.payload.email,
    subject: `Invitation to ${req.body.payload.name} Group`,
    html: `Hello, 
          <br><br>
          
          You were added to the group:
          <p>Group: ${req.body.payload.name}</p>
          <br><br>

          Welcome,
          <br><br>

          Acera`
  };
  
  mailgun.messages().send(data, function (error, body) {
    res.status(200).send('OK');
  });
})

app.post('/api/users/getToken', async (req, response) =>{
  var res;
  try {
    res = await axios({
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        url: 'https://api.badgr.io/o/token',
        data: req.body.data
    })
  } catch (error) {
    console.log("An error ocurred", error);
  }

  var res1 = [];
  
  if (res.status == 200) {
    res1 = await axios({
      headers: {
          'Authorization': `Bearer ${res.data.access_token}`
      },
      method: 'get',
      url: `https://api.badgr.io/v2/issuers`,
    })
    response.status(200).send(JSON.stringify(res1.data));
  }else{
    response.status(400).send("NO ISSUERS");
  }
})

app.get('/hi', (req, res) => {
    res.send(`This is the badge claim api`);  
});



functions.database.ref(`/groups/`).onUpdate((snap, context) => {
  console.log(snap.val(), "written by", context.auth.uid);
});



exports.app = functions.https.onRequest(app)