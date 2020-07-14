const axios = require('axios');

const ONE_HOUR = 60 * 60 * 1000;
const issuers = {};

const IssuerService = {
    getIssuerData: async(issuerToken, authToken) => {
        var d = new Date(); 
        var time = d.getTime();

        if(issuers[issuerToken] && (time - issuers[issuerToken][1]) < ONE_HOUR){
            return issuers[issuerToken][0];
        }
        
        let response;

        await axios({
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'get',
            url: `/issuers/${issuerToken}`,

        }).then(res => {                
            response = res.data
            issuers[issuerToken] = [response, time];
        }).catch(err => {
            console.log(err)
        })
        
        return response
    }
}

module.exports = IssuerService;