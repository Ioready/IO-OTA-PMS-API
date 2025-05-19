import { Controller, Get, NotExtendedResponse } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import lodash from 'lodash';

@Controller("/user")
// @ts-ignore
class UserController {

    @Get("/profile")
    async getProfile(req: Request, res: Response) {
        const user = req.user;
        const selectedUser = lodash.pick(user, [
            'fullName',
            'email',
            'referralSource',
            'role',
            'loginType',
            "_id"
        ]);
        if (user)
            Responder.sendSuccessData({ profile: selectedUser }, 'user:success.profile', res);
        else throw new NotExtendedResponse('user:failure.profile')
    }
}   