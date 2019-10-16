
const express = require('express');

const router = express.Router();

const awardBadgeService = require('../services/AwardBadgeService');
const asyncMiddleware = require('../middleware/AsyncMiddleware');

router.post('/', asyncMiddleware(async (req, res, next) => {
    const response = await awardBadgeService(req.body)
    res.send(response)
}))

module.exports = router