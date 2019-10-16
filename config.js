const dotenv = require('dotenv');
const _ = require('lodash/each')
const result = dotenv.config();

let envs;

if (!('error' in result)) {
  envs = result.parsed;
} else {
  envs = {};
  _.each(process.env, (value, key) => envs[key] = value);
}
console.log(envs)

module.exports = envs;