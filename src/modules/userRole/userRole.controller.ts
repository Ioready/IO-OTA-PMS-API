import { Controller, Get, Post, Patch, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Msg } from "../../resources";

import { Request, Response } from "express";

import { use } from "../../lib/decorators/use";
import { protect } from "../auth/auth.middleware";
import userRoleService from "./userRole.service";

@Controller("/user/role")
//@ts-ignore

class UserRoleController {

    @Post("/")
    @use(protect)
    async createUserRole(req: Request, res: Response) {
        const result = await userRoleService.createUserRole(req);
        if (result) Responder.sendSuccessCreatedMessage(Msg.userCreated, res)
    }

    @Patch("/:id")
    @use(protect)
    async editUserRole(req: Request, res: Response) {
        const result = await userRoleService.editUserRole(req);
        if (result) Responder.sendSuccessMessage(Msg.userUpdated, res);

    }

}