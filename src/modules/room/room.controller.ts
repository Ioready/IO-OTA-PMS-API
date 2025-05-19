import { Controller, Post, Patch, Get, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";

import RoomService from "./room.service";

@Controller("/room")
// @ts-ignore
class RoomController {

 @Post("/")

    async createRoom(req: Request, res: Response) {
        const result = await RoomService.createRoom(req, res);
        if (result) Responder.sendSuccessCreatedMessage('room:success.create', res);
    }
  @Patch("/:id")
    async editRoom(req: Request, res: Response) {
        const result = await RoomService.editRoom(req);
        if (result) Responder.sendSuccessMessage('room:success.update', res);
    }

    @Get("/:id")
        async detailRoom(req: Request, res: Response) {
            const result = await RoomService.detailRoom(req.params.id);
            if (result) Responder.sendSuccessData(result, 'roomType:success.detail', res);
    }
    @Delete("/:id")
        async deleteRoom(req: Request, res: Response) {
            const result = await RoomService.deleteRoom(req.params.id);
            if (result) Responder.sendSuccessMessage('room:success.delete', res);
        }


}

