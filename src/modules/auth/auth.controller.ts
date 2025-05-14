
import { Controller, Get, Patch, Post } from '../../lib/decorators';
import { use } from '../../lib/decorators/use';
import { Responder } from '../../lib/responder';
import { Msg } from '../../resources';
import { protect } from './auth.middleware';
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
        const result = await AuthService.createUser(req, res);
        if (result) Responder.sendSuccessMessage(Msg.userCreated, res)
    }

    @Post("/login")
    async login(req: Request, res: Response) {
        const result = await AuthService.login(req, res);
        if (result) Responder.sendSuccessMessage(Msg.sentMail, res)
        else Responder.sendSuccessMessage(Msg.sentMail404, res)

    }

    @Post("/verify-url")
    async verifyAndExpiryUrl(req: Request, res: Response) {
        const result: any = await AuthService.verifyAndExpiryUrl(req);
        if (result.type === "verify") Responder.sendSuccessData(result, Msg.tokenVerified, res)
        if (result.type === "expiry") Responder.sendSuccessMessage(Msg.tokenExpired, res)
    }

    @Post("/resent")
    async resent(req: Request, res: Response) {
        const result: any = await AuthService.resendOtp(req);
        if (result) Responder.sendSuccessMessage(Msg.sentMail, res)
        else Responder.sendSuccessMessage(Msg.sentMail404, res)

    }

    @Post("/forgot-password")
    async forgotPassword(req: Request, res: Response) {
        const result: any = await AuthService.forgotPassword(req);
        if (result) Responder.sendSuccessMessage(Msg.sentLinkMail, res)
    }

    @Post("/set-password")
    async setPassword(req: Request, res: Response) {
        const result: any = await AuthService.setPassword(req, res);
        if (result) Responder.sendSuccessMessage(Msg.sentMail, res);
        else Responder.sendSuccessMessage(Msg.sentMail404, res)
    }

    @Post("/verify-otp")
    async verifyOtp(req: Request, res: Response) {
        const result: any = await AuthService.verifyOtp(req, res);
        if (result) Responder.sendSuccessData(result, Msg.login, res);
    }

    @Post("/refresh-token")
    async refreshToken(req: Request, res: Response) {
        const result: any = await AuthService.refreshToken(req, res);
        if (result) Responder.sendSuccessData(result, Msg.login, res);
    }

    @Get("/me")
    @use(protect)
    async getMe(req: Request, res: Response) {
        const user = req.user;
        if (user) Responder.sendSuccessData(user, Msg.login, res);
    }

    @Post("/google")
    async oAuthsignIn(req: Request, res: Response) {
        const result: any = await AuthService.oAuthsignIn(req, res);
        if (result) Responder.sendSuccessData(result, Msg.login, res);
    }


}