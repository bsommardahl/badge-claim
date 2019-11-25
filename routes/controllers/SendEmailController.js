const express = require('express');

const router = express.Router();

const sendEmailService = require('../services/SendEmailService');
const asyncMiddleware = require('../middleware/AsyncMiddleware');
const authenticate = require('../middleware/Authenticate');
const isUnawarded = require('../middleware/IsUnawarded');
const isAutoAward = require('../middleware/IsAutoAward');

router.post('/', asyncMiddleware(authenticate), asyncMiddleware(isUnawarded), asyncMiddleware(isAutoAward), asyncMiddleware(async (req, res, next) => {
    const authToken = req.authData.access_token
    if(!req.autoAwardFlag) {
        response = await sendEmailService(req.body, authToken)
        res.send(response)
    }
    next()
}))

module.exports = router