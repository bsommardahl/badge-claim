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

const mailgun = require('mailgun-js')({apiKey: PRIVATE_KEY, domain: DOMAIN});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/badges', badgeController);

app.use('/api/claim', ClaimBadgeController);

app.use('/api/issuer', issuerController);

app.use('/api/award', awardBadgeController);

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

app.get('/hi', (req, res) => {
    res.send(`This is the badge claim api`);  
});

exports.app = functions.https.onRequest(app)