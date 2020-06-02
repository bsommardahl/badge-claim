const axios = require('axios');
const envs = require('../../env.json');
const ISSUER_ID = envs.service.issuer_id;

const AwardService = {
  awardBadge: async (data, authToken) => {
    let response;

    await axios({
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      method: 'post',
      url: `/badgeclasses/${data.badgeToken}/assertions`,
      data: {
        recipient: {
          identity: data.email,
          type: 'email',
          hashed: true
        },
        notify: true
      }
    })
      .then(res => {
        response = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    return response;
  },
  listAwards: async (data, authToken) => {
    let response;

    await axios({
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      method: 'get',
      url: `/issuers/${ISSUER_ID}/assertions`,
      data: {
        recipient: {
          identity: "luis.alvarez@herounit.io",
          type: 'email',
          hashed: true
        },
        notify: true
      }
    })
      .then(res => {
        response = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    return response;
  },
  awardsByUser: async (data, issuerAwards) => {
    return issuerAwards.filter(a => a.recipient.plaintextIdentity === "luis.alvarez@herounit.io")
  }
}

module.exports = AwardService;
