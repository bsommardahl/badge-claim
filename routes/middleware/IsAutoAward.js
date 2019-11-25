const axios = require('axios')
const { APP_URL } = require('../../config');
const awardBadgeService = require('../services/AwardBadgeService');

const isAutoAward  = async(req, res, next) => {
    let data = req.body

    data.authToken = req.authData.access_token

    const autoAwardFlag = hasAutoAwardTag(data)

    req.autoAwardFlag = autoAwardFlag

    if (autoAwardFlag) {
        const response = await awardBadgeService(req.body)
        res.send(response)
    }
    
    return next();
}

const hasAutoAwardTag = (data) => {
    const tags = data.tags
    
    let flag = tags.includes('auto-award')

    return flag
}

module.exports = isAutoAward