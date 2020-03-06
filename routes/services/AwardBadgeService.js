const axios = require('axios');

const awardBadge = async (data, authToken) => {
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
};

module.exports = awardBadge;
