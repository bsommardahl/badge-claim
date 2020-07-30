const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const envs = require('./functions/env.json');
const APP_URL=envs.service.app_url

const PRIVATE_KEY=envs.service.private_key
const DOMAIN=envs.service.domain
const EMAIL=envs.service.badge_owner_email

axios.defaults.baseURL = envs.service.base_url;

const mailgun = require('mailgun-js')({apiKey: PRIVATE_KEY, domain: DOMAIN});

const badgeController = require('./functions/routes/controllers/BadgeController');
const ClaimBadgeController = require('./functions/routes/controllers/ClaimBadgeController');
const awardBadgeController = require('./functions/routes/controllers/AwardBadgeController');
const issuerController = require('./functions/routes/controllers/IssuerController');

axios.defaults.baseURL = "https://api.badgr.io/v2";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/badges', badgeController);

app.use('/api/claim', ClaimBadgeController);

app.use('/api/issuer', issuerController);

app.use('/api/award', awardBadgeController);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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
          ${APP_URL}explore
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

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send(`This is the badge claim api: ${process.env.PORT}`);
});

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
});
