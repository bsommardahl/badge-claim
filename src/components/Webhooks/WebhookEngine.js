import {getWebhooks} from '../../FirebaseUtils'
import axios from 'axios'

export const WebhookFire = (issuer, event, payload) => {
    getWebhooks().on('value', (snapshot) =>{
        var webhooks = snapshot.val() ? 
            Object.entries(snapshot.val()).map(([key,value])=> 
                key.split(":")[0] === issuer && value.event === event ? 
                axios.post(value.url, {secret: value.secret, payload: payload})
                .then(res => {console.log(res);})
                .catch(function (error) {
                    console.log(value.url);
                }) 
                : console.log()) 
            : {};

        
        console.log("webhook", webhooks);
    })
}