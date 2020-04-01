const envs = require('./config');
const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const mailgun = require('mailgun-js')({apiKey: PRIVATE_KEY, domain: DOMAIN});

const badgeController = require('./routes/controllers/BadgeController');
const ClaimBadgeController = require('./routes/controllers/ClaimBadgeController');
const awardBadgeController = require('./routes/controllers/AwardBadgeController');
const wakeUpDyno = require('./utils/wakeUpDyno');

axios.defaults.baseURL = envs.BASE_URL;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/badges', badgeController);

app.use('/api/claim', ClaimBadgeController);

app.use('/api/award', awardBadgeController);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/request', (req, res) => {
  var data = {
    from: req.body.from,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text
  };
  
  mailgun.messages().send(data, function (error, body) {
    res.status(200).send('OK');
  });
})

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send(`This is the badge claim api: ${process.env.PORT}`);
});

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
  wakeUpDyno(envs.BASE_URL);
});
