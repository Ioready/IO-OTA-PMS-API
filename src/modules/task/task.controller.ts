import { Controller, Post } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import { use } from "../../lib/decorators/use";
import { protect } from "../auth/auth.middleware";
import taskService from "./task.service";


@Controller("/task")
// @ts-ignore
class TaskController {

    @Post("/")
    
    @use(protect)
    async createTask(req: Request, res: Response) {
        const result = await taskService.createTask(req, res);
        if (result) Responder.sendSuccessCreatedMessage('task:success.create', res);
    }

}