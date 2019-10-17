const axios = require('axios')
const _filter = require('lodash/filter')

const ClaimingUnawarded  = async(req, res, next) =>{
    let assertions;
    let response = res
    await axios({
        headers: {
            'Authorization': `Bearer ${req.authData.access_token}`
        },     
        method: 'get',
        url: `badgeclasses/${req.body.badgeToken}/assertions`        
    }).then(res => {
        assertions = res.data.result;
        const filteredAssertions = _filter(assertions, assertion => {
            return assertion.recipient.plaintextIdentity === req.body.email
        })
        if(filteredAssertions.length) {
            err = new Error('You have already claimed this badge')
            response.status(202).json({notification: 'You have already claimed this badge!' })
            response.send()
            next(err)
        }
    }).catch(err => {
        console.log(err)
    })
    return next();
}

module.exports = ClaimingUnawarded