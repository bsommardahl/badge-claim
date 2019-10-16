// config.js
const dotenv = require('dotenv');
const result = dotenv.config();
console.log(result)
const { parsed: envs } = result;
module.exports = envs;