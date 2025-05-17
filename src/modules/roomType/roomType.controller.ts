import { Controller, Post, Patch, Get, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import roomTypeService from "./roomType.service";


@Controller("/room-type")
// @ts-ignore
class RoomTypeController {
    @Post("/")

    async createRoomType(req: Request, res: Response) {
        const result = await roomTypeService.createRoomType(req, res);
        if (result) Responder.sendSuccessCreatedMessage('floor:success.create', res);
    }

    @Patch("/:id")
    async editRoomType(req: Request, res: Response) {
        const result = await roomTypeService.editRoomType(req);
        if (result) Responder.sendSuccessMessage('floor:success.update', res);
    }

    @Get("/:id")
    async detailRoomType(req: Request, res: Response) {
        const result = await roomTypeService.detailRoomType(req.params.id);
        if (result) Responder.sendSuccessData(result, 'floor:success.detail', res);
    }
    @Delete("/:id")
    async deleteRoomType(req: Request, res: Response) {
        const result = await roomTypeService.deleteRoomType(req.params.id);
        if (result) Responder.sendSuccessMessage('floor:success.delete', res);
    }


}   
