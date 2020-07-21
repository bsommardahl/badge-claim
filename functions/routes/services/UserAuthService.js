const axios = require('axios');
const envs = require('../../env.json');
const badgeService = require('./BadgeService');
const fire = require('../../FirebaseU/FirebaseUtils');
const APP_URL = envs.service.app_url; 

const ONE_DAY = 86400 * 1000; //86400s to ms
const ONE_HOUR = 3600 * 1000; //3600s to ms

const userToken = {}

const UserAuthService = {
    userAuth: async(initialData) => {
        var d = new Date(); 
        var time = d.getTime();

        if(userToken[initialData.email] && (time - userToken[initialData.email][1]) < ONE_DAY){
            return userToken[initialData.email][0];
        }
        
        let response;
        const userData = `username=${encodeURIComponent(initialData.email)}&password=${encodeURIComponent(initialData.password)}`;
        await axios({
            headers: { 
                'content-type': 'application/x-www-form-urlencoded' 
            },       
            method: 'post',
            url: 'https://api.badgr.io/o/token',
            data: userData
        }).then(res => {           
            response = res.data
            userToken[initialData.email] = [response, time];
        }).catch(err => {
            console.log(err)
        })

        return response
    },
    isLogged: async(data) => {
        var d = new Date(); 
        var time = d.getTime();
        console.log("DATA: ",data.data.issuedOn);
        console.log("TIME: ",time);
        if(data && (time - data.data.issuedOn) < ONE_DAY){
            return true;
        }
        return false;
    },
    getBackpack: async(data)=>{
        var userBackpack = {badges: []}

        let response;

        console.log("DATA: ",data);

        await axios({
            headers: { 
                'Authorization': `Bearer ${data.token}`
            },
            url:`https://api.badgr.io/v2/backpack/assertions`,
            method: 'get'
        })
        .then(res=>{
            console.log("IT WORKED!!!");
            response = res.data.result;
        })
        .catch(err=>{            
            console.log(err);
        })

        //get the badgedata and return it
        console.log("RESPONSE: ", response);
        for(let i = 0; i < response.length; i++){
            const badge = (await badgeService.getBadgeData(response[i].badgeclass ,data.token))
            console.log("Badge", badge);
            if(badge){
                if(badge.result){
                    if(badge.result.length>0){
                        userBackpack.badges.push(badge.result[0])
                    }
                }    
            }
        }
        return userBackpack
    },
}

module.exports = UserAuthService