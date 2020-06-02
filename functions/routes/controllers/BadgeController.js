const express = require('express');

const router = express.Router();

const badgeService = require('../services/BadgeService')
const authenticate = require('../middleware/Authenticate')
const asyncMiddleware = require('../middleware/AsyncMiddleware');

router.get('/:badgeToken', asyncMiddleware(authenticate), asyncMiddleware(async (req, res, next) => {
    const badgeToken = req.params.badgeToken
    const authToken = req.authData.access_token
    const response = await badgeService.getBadgeData(badgeToken, authToken)
    res.send(response)
}))

router.get('/', asyncMiddleware(authenticate), asyncMiddleware(async(req, res, next) => {
    const authToken = req.authData.access_token
    const response = await badgeService.getBadges(authToken)
    res.send(response)
}))

module.exports = router