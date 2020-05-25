const axios = require('axios')
const envs = require('../../env.json');

const USER=envs.service.user
const PASSWORD=envs.service.password

const authenticate  = async(req, res, next) =>{
    const data = `username=${encodeURIComponent(USER)}&password=${encodeURIComponent(PASSWORD)}`;

    await axios({
        headers: { 
            'content-type': 'application/x-www-form-urlencoded' 
        },       
        method: 'post',
        url: 'https://api.badgr.io/o/token',
        data
    }).then(res => {
        req.authData = res.data;
    }).catch(err => {
        console.log(err)
    })
    return next();
}

module.exports = authenticate