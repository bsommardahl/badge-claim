import {getWebhooks} from '../../../functions/FirebaseU/FirebaseUtils'
import axios from 'axios'

export const WebhookFire = (issuer, event, payload) => {
    getWebhooks().on('value', (snapshot) =>{
        var webhooks = snapshot.val() ? 
            Object.entries(snapshot.val()).map(([key,value])=> 
                key.split(":")[0] === issuer && value.event === event ? 
                axios.post(value.url, {secret: value.secret, payload: payload}).catch(error=>console.log(error))
                : console.log()) 
            : {};
    })
}