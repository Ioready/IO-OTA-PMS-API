

import { SendMailClient } from "zeptomail";
import { config } from "../config/env.config";

const url = config.zeptoMail.url;
const token = config.zeptoMail.token;

let client = new SendMailClient({ url, token });

class ZohoApiClass {


    sendMailTemplate = (email: any, name: any, template: any, mergeInfo: any) => {
        // sendMailTemplate = (email: any, name: any) => {

        return client.sendMailWithTemplate({
            "template_key": template,
            "from": {
                "address": config.email.from,
                name: config.email.name
            },
            "to": [
                {
                    "email_address": {
                        "address": email,
                        "name": name
                    }
                }
            ],
            "merge_info": {
                name,
                ...mergeInfo
            }
        })
    }

    sendMail = () => {
        client.sendMail({
            "from":
            {
                "address": "noreply@ioready.io",
                "name": "noreply"
            },
            "to":
                [
                    {
                        "email_address":
                        {
                            "address": "muhammad_kabir@ioready.io",
                            "name": "Kabir"
                        }
                    }
                ],
            "subject": "Test Email",
            "htmlbody": "<div><b> Test email sent successfully.</b></div>",
        }).then((resp) => console.log("success")).catch((error) => {
            console.log(error);

            console.log("error")
        });
    }
}


export const ZohoApi = new ZohoApiClass();
