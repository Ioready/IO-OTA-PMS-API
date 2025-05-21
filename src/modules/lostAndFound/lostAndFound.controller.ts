import { Controller, Post, Patch, Get, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import { use } from "../../lib/decorators/use";
import { checkProperty, protect } from "../auth/auth.middleware";
import LostAndFoundService from "./lostAndFound.service";


@Controller("/lost-found")
// @ts-ignore
class LostAndFoundController {

    @Post("/")
    @use(checkProperty)
    @use(protect)
    async createLostAndFound(req: Request, res: Response) {
        const result = await LostAndFoundService.createLostAndFound(req);
        if (result) Responder.sendSuccessCreatedMessage('lostAndFound:success.create', res);
    }

    @Patch("/:id")
    @use(checkProperty)
    @use(protect)
    async editLostAndFound(req: Request, res: Response) {
        const result = await LostAndFoundService.editLostAndFound(req);
        if (result) Responder.sendSuccessMessage('lostAndFound:success.update', res);
    }

    @Get("/")
    @use(checkProperty)
    @use(protect)
    async getAllLostAndFounds(req: Request, res: Response) {
        const result = await LostAndFoundService.getAllLostAndFounds(req);
        if (result) Responder.sendSuccessData(result, 'lostAndFound:success.list', res);
    }

    @Get("/:id")
    @use(checkProperty)
    @use(protect)
    async detailLostAndFound(req: Request, res: Response) {
        const result = await LostAndFoundService.detailLostAndFound(req.params.id);
        if (result) Responder.sendSuccessData(result, 'lostAndFound:success.detail', res);
    }

    @Delete("/:id")
    @use(checkProperty)
    @use(protect)
    async deleteLostAndFound(req: Request, res: Response) {
        const result = await LostAndFoundService.deleteLostAndFound(req.params.id);
        if (result) Responder.sendSuccessMessage('lostAndFound:success.delete', res);
    }

    @Get("/")
    @use(checkProperty)
    async listLostAndFound(req: Request, res: Response) {
        const result = await LostAndFoundService.getLostAndFounds(req);
        if (result) Responder.sendSuccessData(result, 'lostAndFound:success.list', res);
    }


}   
