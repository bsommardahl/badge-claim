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
                "narrative": "This is an overall narrative describing how the badge was earned.",
                "evidence": [
                    {
                        "url": "http://example.com",
                        "narrative": "This is a narrative describing the individual evidence item."
                    }
                ],
                "expires": new Date(),
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