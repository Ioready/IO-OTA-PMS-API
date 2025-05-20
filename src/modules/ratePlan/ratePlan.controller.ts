import { Controller, Post, Patch, Get, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import RatePlanService from "./ratePlan.service";
import { checkProperty, protect } from "../auth/auth.middleware";
import { use } from "../../lib/decorators/use";



@Controller("/rate-plan")
// @ts-ignore
class RatePlanController {

    @Post("/")
    @use(checkProperty)
    @use(protect)
    async createRatePlan(req: Request, res: Response) {
        const result = await RatePlanService.createRatePlan(req, res);
        if (result) Responder.sendSuccessCreatedMessage('ratePlan:success.create', res);
    }

    @Patch("/:id")
    @use(checkProperty)
    @use(protect)
    async editRatePlan(req: Request, res: Response) {
        const result = await RatePlanService.editRatePlan(req);
        if (result) Responder.sendSuccessMessage('ratePlan:success.update', res);
    }

    @Get("/:id")
    @use(checkProperty)
    @use(protect)
    async detailRatePlan(req: Request, res: Response) {
        const result = await RatePlanService.detailRatePlan(req.params.id);
        if (result) Responder.sendSuccessData(result, 'ratePlan:success.detail', res);
    }

    @Delete("/:id")
    @use(checkProperty)
    @use(protect)
    async deleteRatePlan(req: Request, res: Response) {
        const result = await RatePlanService.deleteRatePlan(req.params.id);
        if (result) Responder.sendSuccessMessage('ratePlan:success.delete', res);
    }

    @Get("/")
    @use(checkProperty)
    @use(protect)
    async ratePlans(req: Request, res: Response) {
        const result = await RatePlanService.ratePlans(req);
        if (result) Responder.sendSuccessData(result, 'ratePlan:success.detail', res);
    }

}

