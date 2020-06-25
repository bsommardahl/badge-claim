const awardBadgeService = require('../services/AwardBadgeService');
const badgeService = require('../services/BadgeService')

const isAutoAward  = async(req, res, next) => {
    const authToken = req.authData.access_token;
    const responseBadge = await badgeService.getBadgeData(req.body.badgeToken, authToken);

    let data = req.body

    data.authToken = authToken

    const autoAwardFlag = hasAutoAwardTag(responseBadge.result[0])

    req.autoAwardFlag = autoAwardFlag

    if (autoAwardFlag) {
        const response = await awardBadgeService.awardBadge(req.body)
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