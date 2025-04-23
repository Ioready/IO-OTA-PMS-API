import { Request, Response } from 'express'
import { Responder } from '../lib/responder';

export function bodyValidation(keys: string[], req: Request, res: Response) {
    if (!req.body) {
        res.status(422).send('Invalid request')
        return
    }
    for (let key of keys) {

        if (!req.body[key]) {
            return Responder.sendFailureMessage(`Missing property ${key}`, 422, res)

        }
    }

    return true;
}