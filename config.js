const dotenv = require('dotenv');
const result = dotenv.config();

let envs;

if (!('error' in result)) {
  envs = result.parsed;
} else {
  envs = {};
  for(const [key, value] of process.env) {
      envs[key] = value
  }
}
console.log(envs)

module.exports = envs;