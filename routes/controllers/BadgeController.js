const express = require('express');

const router = express.Router();

const badgeService = require('../services/BadgeService')
const asyncMiddleware = require('../middleware/AsyncMiddleware');


router.get('/:badgeToken',  asyncMiddleware(async (req, res, next) => {
    const badgeToken = req.params.badgeToken
    const response = await badgeService(badgeToken)
    res.send(response)
}))

module.exports = router