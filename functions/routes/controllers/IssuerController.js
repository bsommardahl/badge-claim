const express = require('express');

const router = express.Router();

const issuerService = require('../services/IssuerService')
const authenticate = require('../middleware/Authenticate')
const asyncMiddleware = require('../middleware/AsyncMiddleware');

router.get('/:issuerToken', asyncMiddleware(authenticate), asyncMiddleware(async (req, res, next) => {
    const issuerToken = req.params.issuerToken
    const authToken = req.authData.access_token
    const response = await issuerService.getIssuerData(issuerToken, authToken)
    res.send(response)
}))

module.exports = router