import { Response } from 'express'
import i18n from '../i18n';
class ResponderClass {

    private translate = (key: string, req: Request) => {
        const locale = req.headers['lang']?.toString() || 'en';
        return i18n.__({ phrase: key, locale });
    };

    public sendSuccessData(data: any, message: string, res: Response) {
        return res.send({
            success: true,
            message,
            data,
            statusCode: 200
        }).status(200)
    }
    public sendSuccessMessage(message: string, res: Response) {
        return res.send({
            success: true,
            message,
            statusCode: 200
        }).status(200)
    }

    public sendSuccessCreatedMessage(message: string, res: Response) {
        return res.status(201).send({
            success: true,
            message,
            statusCode: 201
        })
    }

    public sendSuccessCreatedDate(data: any, message: string, res: Response) {
        return res.status(201).send({
            success: true,
            message,
            data,
            statusCode: 201
        })
    }

    public sendFailureMessage(message: string, code: number = 200, res: Response) {
        return res.status(code).send({
            success: false,
            message,
            statusCode: code
        })
    }
    public sendFailureData(data: any, message: string, code: number = 200, res: Response) {
        return res.send({
            success: false,
            message,
            data,
            statusCode: code
        }).status(code)
    }

    public sendSuccessMessageTest(message: string, req: Request, res: Response) {
        var message = this.translate(message, req);
        return res.send({
            success: true,
            message,
            statusCode: 200
        }).status(200)
    }
};

export const Responder = new ResponderClass();