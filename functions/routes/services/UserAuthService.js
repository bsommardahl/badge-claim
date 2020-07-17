const axios = require('axios');
const envs = require('../../env.json');
const APP_URL = envs.service.app_url;


const ONE_DAY = 86400;
const ONE_HOUR = 60 * 60 * 1000;

const userToken = {}
const backpacks = {}

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

        console.log("response: ",response);
        return response
    },
    isLogged: async(data) => {
        console.log("DATA IS LOGGED", data);
        if(userToken[data.email] && (time - userToken[data.email][1]) < ONE_DAY){
            return true;
        }

        return false;
    },
    getBackpack: async(data)=>{
        var d = new Date(); 
        var time = d.getTime();

        console.log("DATA GET BACKPACK", data);
        if(backpacks[data.email] && (time - backpacks[data.email][1]) < ONE_HOUR){
            return backpacks[data.email][0];
        }

        var userBackpack = {badges: []}

        let response;

        await axios({
            headers: { 
                'Authorization': `Bearer ${userToken[data.email][0].access_token}`
            },
            url:`https://api.badgr.io/v2/backpack/assertions`,
            method: 'get'
        })
        .then(res=>{
            response = res.data.result;
        })
        .catch(err=>{            
            console.log(err);
        })

        //get the badgedata and return it

        console.log("Response: ", response);
        for(let i = 0; i < response.length; i++){
            console.log(`Response ${i} : `, response[i]);
            const badge = (await axios.get(`${APP_URL}/api/badges/${response[i].badgeclass}`)).data
            console.log("badge: ", badge);
            if(badge.result && badge.result.length>0)
                userBackpack.badges.push(badge.result[0])
        }
        console.log("userBackpack: ", userBackpack);

        backpacks[data.email] = [userBackpack, time];
        return userBackpack
    },
}

module.exports = UserAuthService