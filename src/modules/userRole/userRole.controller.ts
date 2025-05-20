import { Controller, Get, Post, Patch, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";

import { Request, Response } from "express";

import { use } from "../../lib/decorators/use";
import { checkProperty, protect } from "../auth/auth.middleware";
import userRoleService from "./userRole.service";



@Controller("/user/role")
//@ts-ignore

class UserRoleController {

    @Post("/")
    @use(checkProperty)
    @use(protect)
    async createUserRole(req: Request, res: Response) {
        const result = await userRoleService.createUserRole(req);
        if (result) Responder.sendSuccessCreatedMessage('user:success.create', res)
    }

    @Get("/housekeeping")
    @use(checkProperty)
    @use(protect)
    async listHousekeeping(req: Request, res: Response) {
        const result = await userRoleService.listHousekeeping(req)
        if (result) Responder.sendSuccessData(result, 'user:success.housekeepings', res);
    }

    @Patch("/:id")
    @use(checkProperty)
    @use(protect)
    async editUserRole(req: Request, res: Response) {
        const result = await userRoleService.editUserRole(req);
        if (result) Responder.sendSuccessMessage('user:success.update', res);

    }

    @Get("/:id")
    @use(checkProperty)
    @use(protect)
    async getUserRole(req: Request, res: Response) {
        console.log("sss");

        const result = await userRoleService.getUserRole(req.params.id);
        if (result) Responder.sendSuccessData(result, 'user:success.list', res);
    }
    @Delete("/:id")
    @use(checkProperty)
    @use(protect)
    async deleteUserRole(req: Request, res: Response) {
        const result = await userRoleService.deleteUserRole(req.params.id);
        if (result) Responder.sendSuccessMessage('user:success.delete', res)
    }

    @Get("/")
    @use(checkProperty)
    @use(protect)
    async listUserRole(req: Request, res: Response) {
        const result = await userRoleService.listUserRole(req)
        if (result) Responder.sendSuccessData(result, 'user:success.list', res);
    }


}