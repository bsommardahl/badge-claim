const express = require('express');

const router = express.Router();

const awardBadgeService = require('../services/AwardBadgeService');
const asyncMiddleware = require('../middleware/AsyncMiddleware');
const authenticate = require('../middleware/Authenticate');

router.post(
  '/',
  asyncMiddleware(authenticate),
  asyncMiddleware(async (req, res, next) => {
    console.log("AWARDING IN CONTROLLER!!!!!!!")
    const authToken = req.authData.access_token;
    const response = await awardBadgeService.awardBadge(req.body, authToken);
    res.send(response);
  })
);

router.get(
  '/',
  asyncMiddleware(authenticate),
  asyncMiddleware(async (req, res, next) => {
    const authToken = req.authData.access_token;
    const response = await awardBadgeService.listAwards(req.body, authToken);
    res.send(response);
  })
);

module.exports = router;
