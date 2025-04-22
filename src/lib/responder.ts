import { Response } from 'express'

class ResponderClass {
    public sendSuccessData(data: any, message: string, res: Response) {
        return res.send({
            success: true,
            message,
            data,
            // statusCode: code
        }).status(200)
    }
    public sendSuccessMessage(message: string, res: Response) {
        return res.send({
            success: true,
            message,
            // statusCode: code
        }).status(200)
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
};

export const Responder = new ResponderClass();