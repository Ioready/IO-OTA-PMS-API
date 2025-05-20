import { Controller, Post, Patch, Get, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";

import RoomService from "./room.service";
import { use } from "../../lib/decorators/use";
import { checkProperty, protect } from "../auth/auth.middleware";

@Controller("/room")
// @ts-ignore
class RoomController {

    @Post("/")
    @use(checkProperty)
    @use(protect)
    async createRoom(req: Request, res: Response) {
        const result = await RoomService.createRoom(req, res);
        if (result) Responder.sendSuccessCreatedMessage('room:success.create', res);
    }
    
    @Patch("/:id")
    @use(checkProperty)
    @use(protect)
    async editRoom(req: Request, res: Response) {
        const result = await RoomService.editRoom(req);
        if (result) Responder.sendSuccessMessage('room:success.update', res);
    }

    @Get("/:id")
    @use(checkProperty)
    @use(protect)
    async detailRoom(req: Request, res: Response) {
        const result = await RoomService.detailRoom(req.params.id);
        if (result) Responder.sendSuccessData(result, 'room:success.detail', res);
    }

    @Delete("/:id")
    @use(checkProperty)
    @use(protect)
    async deleteRoom(req: Request, res: Response) {
        const result = await RoomService.deleteRoom(req.params.id);
        if (result) Responder.sendSuccessMessage('room:success.delete', res);
    }

    @Get("/")
    @use(checkProperty)
    @use(protect)
    async listRoomType(req: Request, res: Response) {
        const result = await RoomService.getRooms(req);
        if (result) Responder.sendSuccessData(result, 'room:success.list', res);
    }


}

