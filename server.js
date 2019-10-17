const envs = require('./config')
const express = require('express')
const path = require('path')
const axios = require('axios');
const bodyParser = require('body-parser');

const badgeController = require('./routes/controllers/BadgeController')
const sendEmailController = require('./routes/controllers/SendEmailController')
const awardBadgeController = require('./routes/controllers/AwardBadgeController')

axios.defaults.baseURL = envs.BASE_URL

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

app.use('/api/badges', badgeController);

app.use('/api/email', sendEmailController);

app.use('/api/award', awardBadgeController);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname , "build", "index.html"));
});

const PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
    res.send(`This is the badge claim api: ${process.env.PORT}`)
})

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})