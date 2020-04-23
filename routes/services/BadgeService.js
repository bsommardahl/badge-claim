const axios = require('axios');
const { ISSUER_ID } = require('../../config');

var ONE_HOUR = 60 * 60 * 1000;
const badges = {};

const BadgeService = {
    getBadgeData: async(badgeToken, authToken) => {
        var d = new Date(); 
        var time = d.getTime();

        if(badges[badgeToken] && (time - badges[badgeToken][1]) < ONE_HOUR){
            return badges[badgeToken][0];
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
            badges[badgeToken] = [response, time];
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