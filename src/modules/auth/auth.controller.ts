
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
        const hello = await AuthService.getUser(req, res);
        return Responder.sendSuccessData({ hello }, "Hello Message", res)
    }

    @Post('/')
    async createUser(req: Request, res: Response) {
        const result = await AuthService.createUser(req, res);
        if (result) Responder.sendSuccessMessage(Msg.createPassLinkMail, res)
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
        if (result.url === "verify") Responder.sendSuccessData(result, Msg.tokenVerified, res)
        if (result.url === "expiry") Responder.sendSuccessMessage(Msg.tokenExpired, res)
    }

    @Post("/resent")
    async resent(req: Request, res: Response) {
        const result: any = await AuthService.resendOtp(req);
        if (result) Responder.sendSuccessMessage(Msg.sentMail, res)
        else Responder.sendSuccessMessage(Msg.sentMail404, res)

    }

    @Post("/forgot-password")
    async forgotPassword(req: Request, res: Response) {
        const result: any = await AuthService.forgotPassword(req, "forgot");
        if (result) Responder.sendSuccessMessage(Msg.sentLinkMail, res)
    }

    @Post("/set-password")
    async setPassword(req: Request, res: Response) {
        const result: any = await AuthService.setPassword(req, res);
        if (result) Responder.sendSuccessMessage(Msg.sentMail, res);
        else Responder.sendSuccessMessage(Msg.sentMail404, res)
    }

    @Post("/create-password")
    async createPassword(req: Request, res: Response) {
        const result: any = await AuthService.forgotPassword(req, "create-password");
        if (result) Responder.sendSuccessMessage(Msg.createPassLinkMail, res)
    }

    @Post("/verify-otp")
    async verifyOtp(req: Request, res: Response) {
        const result: any = await AuthService.verifyOtp(req, res);
        if (result) Responder.sendSuccessData(result, Msg.login, res);
    }

    @Post("/refresh-token")
    async refreshToken(req: Request, res: Response) {
        const result: any = await AuthService.refreshToken(req, res);
        if (result) Responder.sendSuccessData({accessToken: result.accessToken}, Msg.login, res);
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