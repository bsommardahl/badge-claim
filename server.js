const envs = require('./config')
const express = require('express')
const path = require('path')
const axios = require('axios');
const badgeController = require('./routes/controllers/BadgeController')
const cors = require('cors')
 
axios.defaults.baseURL = envs.BASE_URL

const app = express()

app.use(express.static(path.join(__dirname, "build")));

app.use('/api/badge', badgeController);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname , "build", "index.html"));
});

app.use(cors())


const PORT = envs.PORT || 3001

app.get('/', (req, res) => {
    res.send(`This is the badge claim api: ${process.env.PORT}`)
})

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})