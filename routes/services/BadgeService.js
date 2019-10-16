const axios = require('axios');

const getBadgeData = async(badgeToken, authToken) =>  {
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
}   

module.exports = getBadgeData;