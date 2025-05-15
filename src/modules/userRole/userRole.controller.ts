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

    @Get("/housekeeping")
    @use(protect)
    async listHousekeeping(req: Request , res:Response) {
        const result = await userRoleService.listHousekeeping(req)
        if (result) Responder.sendSuccessData(result, Msg.housekeepings, res);
    }

    @Patch("/:id")
    @use(protect)
    async editUserRole(req: Request, res: Response) {
        const result = await userRoleService.editUserRole(req);
        if (result) Responder.sendSuccessMessage(Msg.userUpdated, res);

    }

    @Get("/:id")
    @use(protect)
    async getUserRole(req: Request, res: Response) {
        const result = await userRoleService.getUserRole(req.params.id);
        if (result) Responder.sendSuccessData(result, Msg.users, res);
    }
    @Delete("/:id")
    @use(protect)
    async deleteUserRole(req: Request, res: Response) {
          const result = await userRoleService.deleteUserRole(req.params.id);
            if (result) Responder.sendSuccessMessage(Msg.userDeleted, res)
    }
    
    @Get("/")
    @use(protect)
    async listUserRole(req: Request , res:Response) {
        const result = await userRoleService.listUserRole(req)
        if (result) Responder.sendSuccessData(result, Msg.users, res);
    }

    
}