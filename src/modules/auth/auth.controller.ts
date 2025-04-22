
import { Controller, Get } from '../../lib/decorators';
import { Responder } from '../../lib/responder';
import AuthService from './auth.service'
import { Request, Response } from "express"

@Controller("/auth")
// @ts-ignore
class AuthController {

    @Get('/login')
    async getHello(req: Request, res: Response) {
        console.log("ddddd");

        const hello = await AuthService.getUser(req, res);
        return Responder.sendSuccessData({ hello }, "Hello Message", res)
    }
}