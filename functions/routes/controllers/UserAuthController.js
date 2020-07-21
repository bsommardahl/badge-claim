const express = require('express');

const router = express.Router();

const userService = require('../services/UserAuthService');
const authenticate = require('../middleware/Authenticate')
const asyncMiddleware = require('../middleware/AsyncMiddleware');

router.post('/', asyncMiddleware(async (req, res, next) => {
    const data = req.body
    const response = await userService.userAuth(data)
    res.send(response)
}))

router.post('/logged', asyncMiddleware(async (req, res, next) => {
    const data = req.body
    const response = await userService.isLogged(data)
    res.send(response)
}))

router.post('/backpack', asyncMiddleware(authenticate), asyncMiddleware(async (req, res, next) => {
    const data = req.body
    const response = await userService.getBackpack(data)
    res.send(response)
}))

module.exports = router