

import { SendMailClient } from "zeptomail";

const url = "api.zeptomail.in/";
const token = "Zoho-enczapikey PHtE6r0LQe7ug2Ys8BUHsPTsHsPyPIon/OhkeAMR5Y1KX/5RTU1Q/dAsljWx+kp7UfJLEPWZyo1q57iftemGJGvvN2pJX2qyqK3sx/VYSPOZsbq6x00UsFkffkHdUYXqe9Zi1SPVu9nTNA==";

let client = new SendMailClient({ url, token });
console.log(client);

class ZohoApiClass {


    // sendMailTemplate = (email: any, name: any, template: any, mergeInfo: any) => {
    sendMailTemplate = (email: any, name: any) => {

        return client.sendMailWithTemplate({
            "template_key": "2518b.a07fd80a3de39dd.k1.40e5a930-3146-11f0-994a-ae9c7e0b6a9f.196d23b5343",
            "from": {
                "address": "noreply@ioready.io"
            },
            "to": [
                {
                    "email_address": {
                        "address": email,
                        "name": "Rajapandi"
                    }
                }
            ],
            "merge_info": {
                name,
                // ...mergeInfo
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
