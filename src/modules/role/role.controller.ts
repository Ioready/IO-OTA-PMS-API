
import { Controller, Get, Post, Patch } from '../../lib/decorators';
import { Responder } from '../../lib/responder';
import { Msg } from '../../resources';

import { Request, Response } from "express"
import RoleService from './role.service';

@Controller("/role")
// @ts-ignore
class RoleController {

    @Post('/')
    async createRole(req: Request, res: Response) {
        const result = await RoleService.createRole(req, res);
        if (result) Responder.sendSuccessCreatedMessage(Msg.roleCreated, res);
    }

    @Patch("/:id")
    async editRole(req: Request, res: Response) {
        const result = await RoleService.editRole(req);
        if (result) Responder.sendSuccessMessage(Msg.roleUpdated, res)
    }

    @Get("/:id")
    async getRole(req: Request, res: Response) {
        const Role = await RoleService.getRole(req.params.id);
        if (Role) Responder.sendSuccessData({ Role }, Msg.role, res)
    }

    @Get("/")
    async getRoles(req: Request, res: Response) {
        const result = await RoleService.getRoles(req);
        if (result) Responder.sendSuccessData(result, Msg.roles, res)
    }

}