const {
  PRIVATE_KEY,
  DOMAIN,
  BADGE_OWNER_EMAIL,
  APP_URL
} = require('../../config');
let Mailgun = require('mailgun-js');

const issuerService = require('../services/IssuerService');
const badgeService = require('../services/BadgeService')

function replaceMulti(str, findings, replacings) {
  var newStr = str;
  var regex;

  for (var i = 0; i < findings.length; i++) {
    if(findings[i] === '.'){
      newStr = newStr.replace(/\./g, replacings[i]);
    }else if(findings[i] === '*'){
      newStr = newStr.replace(/\./g, replacings[i]);
    }else{
      regex = new RegExp(findings[i], "g");
      newStr = newStr.replace(regex, replacings[i]);
    }
  }
  return newStr;
};

const sendEmail = async (data, authToken) => {
  mailgun = new Mailgun({ apiKey: PRIVATE_KEY, domain: DOMAIN });

  const responseBadge = await badgeService.getBadgeData(data.badgeToken, authToken);
  const issuerID = responseBadge.result[0].issuer;
  const responseIssuer = await issuerService.getIssuerData(issuerID, authToken);
  const emailIssuer = responseIssuer.result[0].email;

  let response;
  let awardBadgeUrl = `${APP_URL}/award/${data.badgeToken}?email=${data.email}&evidence=${escape(replaceMulti(
    data.evidence,
    ['@','-','_','/','.','*'],
    ['%40','%2D','%5F','%2F','%2E','%2A']))
  }`;
  let email = {
    from: data.email,
    to: getAwarderEmail(responseBadge.result[0]) || emailIssuer,
    subject: 'Claiming badge',
    html: `Hello, 
          <br><br>
          
          We have a request from ${data.email} to claim the "${data.badgeName}" badge. Please check any evidence submitted and click the link below to award this badge.
          
          <br><br>
          
          ${awardBadgeUrl}
          <br><br>

          Thanks,
          <br><br>

          Badge Claim System`
  };

  await mailgun.messages().send(email, function(err, body) {
    if (err) {
      console.log('got an error: ', err);
      response = err;
    } else {
      response = body;
    }
  });

  return response;
};

const getAwarderEmail = data => {
  const tags = data.tags;

  let awarderEmail;

  tags.forEach((e, i) => {
    if (e.includes('awarder')) {
      let email = e.split(':')[1].trim();

      const emailRX = /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      awarderEmail = emailRX.test(email) ? email : null;
    }
  });
  return awarderEmail;
};

module.exports = sendEmail;
