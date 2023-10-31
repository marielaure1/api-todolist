import { CourierClient } from "@trycourier/courier";
import dotenv from 'dotenv';

dotenv.config();

const { COURIER_KEY, BASE_URL } = process.env
const courier = CourierClient({ authorizationToken: `${COURIER_KEY}`});

export default {
    async sendMail(data, type) {

        let title = "";
        let body = "";
        let email = `${data.email}`;

        if(type == "confirmation inscription"){
            title = `Veuillez comfirmer votre compte sur Booking`,
            body = `Voici votre lien de confirmation : ${BASE_URL}/auth/signup/confirm?token=${data.token}`
        } else if(type == "succes inscription"){
            title = `Bienvenue sur Booking ${data.name}`,
            body = `Bienvenue sur Booking ${data.name}, votre inscription à été validé!`
        }

        const { requestId } = await courier.send({
            message: {
                content: { title: title, body: body},
                to: { email: email }
            }
        });

        const messageStatus = await courier.getMessage(requestId);

        return messageStatus;
    }
}