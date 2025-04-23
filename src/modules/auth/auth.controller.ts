
import { Controller, Get, Post } from '../../lib/decorators';
import { Responder } from '../../lib/responder';
import { Msg } from '../../resources';
import AuthService from './auth.service'
import { Request, Response } from "express"

@Controller("/auth/user")
// @ts-ignore
class AuthController {

    @Get('/login')
    async getHello(req: Request, res: Response) {
        console.log("ddddd");

        const hello = await AuthService.getUser(req, res);
        return Responder.sendSuccessData({ hello }, "Hello Message", res)
    }

    @Post('/')
    async createUser(req: Request, res: Response) {
        await AuthService.createUser(req, res).then((_result: any) => Responder.sendSuccessMessage(Msg.userCreated, res))
    }

    @Post("/login")
    async employerLogin(req: Request, res: Response) {
        await AuthService.login(req)
            .then((result: any) => {
                if (result) Responder.sendSuccessData(result, Msg.login, res)
            })

    }

}