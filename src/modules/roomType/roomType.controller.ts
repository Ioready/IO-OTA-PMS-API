import { Controller, Post } from "../../lib/decorators";
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
}   