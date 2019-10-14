const axios = require('axios');
const { USER, PASSWORD } = require('../../config')


const getBadgeData = async(badgeToken) =>  {
    let response;
    let userAuthData;
    await axios({
        headers: { 
            'content-type': 'application/x-www-form-urlencoded' 
        },       
        method: 'post',
        url: 'https://api.badgr.io/o/token',
        data:`username=${USER}&password=${PASSWORD}`
    }).then(res => {
        userAuthData = res.data;
    }).catch(err => {
        console.log(err)
    })
    await axios({
        headers: {
            'Authorization': `Bearer ${userAuthData.access_token}`
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