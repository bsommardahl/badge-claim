const axios = require('axios');
const { ISSUER_ID } = require('../../config');

const BadgeService = {
    getBadgeData: async(badgeToken, authToken) => {
        let response;

        await axios({
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'get',
            url: `/badgeclasses/${badgeToken}`,

        }).then(res => {                
            response = res.data
        }).catch(err => {
            console.log(err)
        })
        
        return response
    },
    getBadges: async(authToken) => {
        let response;
        
        await axios({
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'get',
            url: `/issuers/${ISSUER_ID}/badgeclasses`,

        }).then(res => {                
            response = res.data
        }).catch(err => {
            console.log(err)
        })

        return response
    }
}

module.exports = BadgeService;