const axios = require('axios');

const awardBadge = async(data) =>  {
    let response;
        
    await axios({
        headers: {
            'Authorization': `Bearer ${data.authToken}`
        },
        method: 'post',
        url: `/badgeclasses/${data.badgeToken}/assertions`,
        data: {
                "recipient": {
                "identity": data.email,
                "type": "email",
                "hashed": true
                },
                "notify": true
            }
    }).then(res => {                
        response = res.data
    }).catch(err => {
        console.log(err)
    })
    return response
}   

module.exports = awardBadge;