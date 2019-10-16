const axios = require('axios');
const { PRIVATE_KEY, DOMAIN, BADGE_OWNER_EMAIL } = require('../../config');
let Mailgun = require('mailgun-js');


const sendEmail = async(claimantEmail) =>  {
    mailgun = new Mailgun({apiKey: PRIVATE_KEY, domain: DOMAIN});
    
    let response;
    
    let data = {
          from: claimantEmail,
          to: BADGE_OWNER_EMAIL,
          subject: 'Claiming badge: <badge>',
          html: 'Hello, <br> We have a request from '+ claimantEmail +' to claim the “Client Relator I” badge. Please check any evidence submitted and click the link below to award this badge.<br>         <a href= "https://hairy-melon.herokuapp.com/award/B_iL8XNWQzmY3atNem0QMw?token=4kjh589efds3hkjhs98d79823754hksjdk23423" > App </a> <br>Thanks,<br>Badge Claim System'
        }
    
        await mailgun.messages().send(data, function (err, body) {            
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

module.exports = sendEmail;