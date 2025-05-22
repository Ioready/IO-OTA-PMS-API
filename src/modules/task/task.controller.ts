import { Controller, Delete, Get, Patch, Post } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import { use } from "../../lib/decorators/use";
import { checkProperty, protect } from "../auth/auth.middleware";
import taskService from "./task.service";


@Controller("/task")
// @ts-ignore
class TaskController {

    @Post("/")

    @use(checkProperty)
    @use(protect)
    async createTask(req: Request, res: Response) {
        const result = await taskService.createTask(req, res);
        if (result) Responder.sendSuccessCreatedMessage('task:success.create', res);
    }

    @Patch("/:id")
    @use(checkProperty)
    @use(protect)
    async editTask(req: Request, res: Response) {
        const result = await taskService.editTask(req);
        if (result) Responder.sendSuccessMessage('task:success.update', res);
    }

    @Get("/:id")

    @use(checkProperty)
    @use(protect)
    async detailTask(req: Request, res: Response) {
        const result = await taskService.detailTask(req.params.id);
        if (result) Responder.sendSuccessData(result, 'task:success.detail', res);
    }

    @Delete("/:id")

    @use(checkProperty)
    @use(protect)
    async deleteTask(req: Request, res: Response) {
        const result = await taskService.deleteTask(req.params.id);
        if (result) Responder.sendSuccessMessage('task:success.delete', res);
    }
    @Get("/")

    @use(checkProperty)
    @use(protect)
    async getAllTask(req: Request, res: Response) {
        const result = await taskService.getAllTask(req);
        if (result) Responder.sendSuccessData(result, 'task:success.list', res);
    }

}