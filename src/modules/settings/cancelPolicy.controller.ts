import { Controller, Post, Patch, Get, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import { use } from "../../lib/decorators/use";
import { checkProperty, protect } from "../auth/auth.middleware";
import cancelPolicyService from "./cancelPolicy.service";


@Controller("/setting/cancel-policy")
// @ts-ignore
class CancelPolicyController {

    @Post("/")
    @use(checkProperty)
    @use(protect)
    async createCancelPolicy(req: Request, res: Response) {
        const result = await cancelPolicyService.createCancelPolicy(req);
        if (result) Responder.sendSuccessCreatedMessage('cancelPolicy:success.create', res);
    }

    @Patch("/:id")
    @use(checkProperty)
    @use(protect)
    async editCancelPolicy(req: Request, res: Response) {
        const result = await cancelPolicyService.editCancelPolicy(req);
        if (result) Responder.sendSuccessMessage('cancelPolicy:success.update', res);
    }

    @Get("/all")
    @use(checkProperty)
    @use(protect)
    async getAllCancelPolicy(req: Request, res: Response) {
        const result = await cancelPolicyService.getAllCancelPolicy(req);
        if (result) Responder.sendSuccessData(result, 'cancelPolicy:success.list', res);
    }

    @Get("/:id")
    @use(checkProperty)
    @use(protect)
    async detailCancelPolicy(req: Request, res: Response) {
        const result = await cancelPolicyService.detailCancelPolicy(req.params.id);
        if (result) Responder.sendSuccessData(result, 'cancelPolicy:success.detail', res);
    }

    @Get("/")
    @use(checkProperty)
    @use(protect)
    async listCancelPolicy(req: Request, res: Response) {
        const result = await cancelPolicyService.listCancelPolicy(req);
        if (result) Responder.sendSuccessData(result, 'cancelPolicy:success.list', res);
    }

    @Delete("/:id")
    @use(checkProperty)
    @use(protect)
    async deleteCancelPolicy(req: Request, res: Response) {
        const result = await cancelPolicyService.deleteCancelPolicy(req.params.id);
        if (result) Responder.sendSuccessMessage('cancelPolicy:success.delete', res);
    }


}
