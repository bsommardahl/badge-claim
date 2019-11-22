const axios = require('axios');
const { PRIVATE_KEY, DOMAIN, BADGE_OWNER_EMAIL, APP_URL } = require('../../config');
let Mailgun = require('mailgun-js');


const sendEmail = async(data, authToken) =>  {
    mailgun = new Mailgun({apiKey: PRIVATE_KEY, domain: DOMAIN});
    
    let response;

    const awarderEmail = data.tags.length ? getAwarderEmailFromTag(data) : BADGE_OWNER_EMAIL
    
    let email = {
          from: data.email,
          to: awarderEmail,
          subject: 'Claiming badge',
          html: `Hello, 
          <br><br>
          
          We have a request from ${data.email} to claim the "${data.badgeName}" badge. Please check any evidence submitted and click the link below to award this badge.
          
          <br><br>
          
          <a href= "${APP_URL}/award/${data.badgeToken}?token=${authToken}&email=${data.email}" > Award Badge </a> 
          <br><br>

          Thanks,
          <br><br>

          Badge Claim System`
        }
    
        await mailgun.messages().send(email, function (err, body) {            
            if (err) {                
                console.log("got an error: ", err);
                response = err;
            }            
            else {                
                response = body                
            }
        });

        return response    
}

const getAwarderEmailFromTag = (data) => {
    const tags = data.tags;

    const emailRX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(tags) {
        let awarderEmail = tags[0].slice(8)
        return emailRX.test(awarderEmail) ? awarderEmail : null
    }
    return null
}

module.exports = sendEmail;