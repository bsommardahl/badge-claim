const dotenv = require('dotenv');
const _each = require('lodash/each')
const result = dotenv.config();

let envs;

if (!('error' in result)) {
  envs = result.parsed;
} else {
  envs = {};
  _each(process.env, (value, key) => envs[key] = value);
}

module.exports = envs;