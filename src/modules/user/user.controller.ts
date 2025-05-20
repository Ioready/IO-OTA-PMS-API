import { Controller, Get, NotExtendedResponse } from "../../lib/decorators";
import { use } from "../../lib/decorators/use";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import lodash from 'lodash';
import { protect } from "../auth/auth.middleware";

@Controller("/user")
// @ts-ignore
class UserController {

    @Get("/profile")
    @use(protect)
    async getProfile(req: Request, res: Response) {
        const user = req.user;
        const selectedUser = lodash.pick(user, [
            'fullName',
            'email',
            'referralSource',
            'role',
            'loginType',
            'setPassword',
            "_id"
        ]);

        if (user)
            Responder.sendSuccessData({ profile: selectedUser }, 'user:success.profile', res);
        else throw new NotExtendedResponse('user:failure.profile')
    }
}   