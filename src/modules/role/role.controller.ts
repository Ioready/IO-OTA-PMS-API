import { Controller, Get, Post, Patch, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Msg } from "../../resources";

import { Request, Response } from "express";
import RoleService from "./role.service";
import { use } from "../../lib/decorators/use";
import { protect } from "../auth/auth.middleware";

@Controller("/role")
// @ts-ignore
class RoleController {
  @Post("/")
  @use(protect)
  async createRole(req: Request, res: Response) {
    const result = await RoleService.createRole(req, res);
    if (result) Responder.sendSuccessCreatedMessage(Msg.roleCreated, res);
  }

  @Patch("/:id")
  @use(protect)
  async editRole(req: Request, res: Response) {
    const result = await RoleService.editRole(req);
    if (result) Responder.sendSuccessMessage(Msg.roleUpdated, res);
  }

  @Get("/all")
  async getAllRoles(req: Request, res: Response) {
    const result = await RoleService.getAllRoles(req);
    if (result) Responder.sendSuccessData(result, Msg.roles, res);
  }

  @Get("/:id")
  async getRole(req: Request, res: Response) {
    const role = await RoleService.getRole(req.params.id);
    if (role) Responder.sendSuccessData({ role }, Msg.role, res);
  }

  @Get("/")
  async getRoles(req: Request, res: Response) {
    const result = await RoleService.getRoles(req);
    if (result) Responder.sendSuccessData(result, Msg.roles, res);
  }
  @Delete("/:id")
  async deleteRole(req: Request, res: Response) {
    const result = await RoleService.deleteRole(req.params.id);
    if (result) Responder.sendSuccessMessage(Msg.roleDeleted, res)
  }


}
