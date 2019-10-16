const express = require('express');

const router = express.Router();

const sendEmailService = require('../services/SendEmailService')
const asyncMiddleware = require('../middleware/AsyncMiddleware');

router.post('/', asyncMiddleware(async (req, res, next) => {
    const response = await sendEmailService(req.body.email)
    res.send(response)
}))

// router.get('/:badgeToken',  asyncMiddleware(async (req, res, next) => {
//     const badgeToken = req.params.badgeToken
//     const response = await badgeService(badgeToken)
//     res.send(response)
// }))

module.exports = router