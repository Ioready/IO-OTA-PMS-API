import { Controller, Get, Post, Patch, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import RoleService from "./role.service";
import { use } from "../../lib/decorators/use";
import { checkProperty, protect } from "../auth/auth.middleware";

@Controller("/role")
// @ts-ignore
class RoleController {

  @Post("/")
  @use(checkProperty)
  @use(protect)
  async createRole(req: Request, res: Response) {
    const result = await RoleService.createRole(req, res);
    if (result) Responder.sendSuccessCreatedMessage('role:success.create', res);
  }

  @Patch("/:id")
  @use(checkProperty)
  @use(protect)
  async editRole(req: Request, res: Response) {
    const result = await RoleService.editRole(req);
    if (result) Responder.sendSuccessMessage('role:success.update', res);
  }

  @Get("/all")
  @use(checkProperty)
  @use(protect)
  async getAllRoles(req: Request, res: Response) {
    console.log("here");

    const result = await RoleService.getAllRoles(req);
    if (result) Responder.sendSuccessData(result, 'role:success.list', res);
  }

  @Get("/:id")
  @use(checkProperty)
  @use(protect)
  async getRole(req: Request, res: Response) {
    const role = await RoleService.getRole(req.params.id);
    if (role) Responder.sendSuccessData({ role }, 'role:success.detail', res);
  }

  @Get("/")
  @use(checkProperty)
  @use(protect)
  async getRoles(req: Request, res: Response) {
    const result = await RoleService.getRoles(req);
    if (result) Responder.sendSuccessData(result, 'role:success.list', res);
  }

  @Delete("/:id")
  @use(checkProperty)
  @use(protect)
  async deleteRole(req: Request, res: Response) {
    const result = await RoleService.deleteRole(req.params.id);
    if (result) Responder.sendSuccessMessage('role:success.delete', res)
  }


}
