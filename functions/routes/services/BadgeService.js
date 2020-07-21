const axios = require('axios');
const envs = require('../../env.json');

const ISSUER_ID = envs.service.issuer_id

const BadgeService = {
    getBadgeData: async(badgeToken, authToken) => {
        console.log("BADGESERVICE TOKEN: ", badgeToken);
        console.log("BADGESERVICE AUTH: ",authToken);
        let response;

        await axios.get(`/v2/badgeclasses/${badgeToken}`,{
            headers: {
                'Authorization': `Bearer ${authToken}`
            }





        //HERE I'M STUCK






        
        }).then(res => {     
            console.log("IT WORKED");        
            response = res.data
        }).catch(err => {
            console.log("IT DIDNT WORK");
            //console.log(err)
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
    },
    getAllBadges: async(issuerToken, authToken)=>{
        let response;

        await axios({
            headers:{
                'Authorization': `Bearer ${authToken}`
            },
            method:'get',
            url: '/badgeclasses'
        }).then(res => {     
            console.log("SEE RES: ",res);        
        }).catch(err => {
            console.log(err)
        })

        return response
    }
}

module.exports = BadgeService;