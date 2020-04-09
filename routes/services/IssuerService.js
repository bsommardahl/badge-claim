const axios = require('axios');

const issuers = {};

const IssuerService = {
    getIssuerData: async(issuerToken, authToken) => {
        if(issuers[issuerToken]){
            return issuers[issuerToken];
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
            issuers[issuerToken] = response;
        }).catch(err => {
            console.log(err)
        })
        
        return response
    }
}

module.exports = IssuerService;