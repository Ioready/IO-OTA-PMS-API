import { Controller, Get, NotExtendedResponse } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Msg } from "../../resources";
import { Request, Response } from "express";
import { protect } from "../auth/auth.middleware";
import { use } from "../../lib/decorators/use";
import lodash from 'lodash';

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
        ]);
        if (user)
            Responder.sendSuccessData({ profile: selectedUser }, Msg.profile, res);
        else throw new NotExtendedResponse(Msg.profile404)
    }
}   