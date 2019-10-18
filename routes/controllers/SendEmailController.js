const express = require('express');

const router = express.Router();

const sendEmailService = require('../services/SendEmailService');
const asyncMiddleware = require('../middleware/AsyncMiddleware');
const authenticate = require('../middleware/Authenticate');
const isUnawarded = require('../middleware/IsUnawarded');

router.post('/', asyncMiddleware(authenticate),asyncMiddleware(isUnawarded), asyncMiddleware(async (req, res, next) => {
    const authToken = req.authData.access_token     
    const response = await sendEmailService(req.body, authToken)
    res.send(response)
}))

module.exports = router