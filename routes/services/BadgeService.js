const axios = require('axios');
const { ISSUER_ID } = require('../../config');

const badges = {};

const BadgeService = {
    getBadgeData: async(badgeToken, authToken) => {
        if(badges[badgeToken]){
            return badges[badgeToken];
        }

        let response;

        await axios({
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'get',
            url: `/badgeclasses/${badgeToken}`,

        }).then(res => {                
            response = res.data
            badges[badgeToken] = response
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