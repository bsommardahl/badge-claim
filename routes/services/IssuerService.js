const axios = require('axios');

const IssuerService = {
    getIssuerData: async(issuerToken, authToken) => {
        let response;

        await axios({
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'get',
            url: `/issuers/${issuerToken}`,

        }).then(res => {                
            response = res.data
        }).catch(err => {
            console.log(err)
        })
        
        return response
    }
}

module.exports = IssuerService;