import { Controller, Post, Patch, Get, Delete } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import RoomTypeService from "./roomType.service";
import { use } from "../../lib/decorators/use";
import { checkProperty, protect } from "../auth/auth.middleware";


@Controller("/room-type")
// @ts-ignore
class RoomTypeController {

    @Post("/")
    @use(checkProperty)
    @use(protect)
    async createRoomType(req: Request, res: Response) {
        const result = await RoomTypeService.createRoomType(req, res);
        if (result) Responder.sendSuccessCreatedMessage('roomType:success.create', res);
    }

    @Patch("/:id")
    @use(checkProperty)
    @use(protect)
    async editRoomType(req: Request, res: Response) {
        const result = await RoomTypeService.editRoomType(req);
        if (result) Responder.sendSuccessMessage('roomType:success.update', res);
    }

    @Get("/all")
    @use(checkProperty)
    @use(protect)
    async getAllRoomTypes(req: Request, res: Response) {
        const result = await RoomTypeService.getAllRoomTypes(req);
        if (result) Responder.sendSuccessData(result, 'roomType:success.list', res);
    }

    @Get("/:id")
    @use(checkProperty)
    @use(protect)
    async detailRoomType(req: Request, res: Response) {
        const result = await RoomTypeService.detailRoomType(req.params.id);
        if (result) Responder.sendSuccessData(result, 'roomType:success.detail', res);
    }

    @Delete("/:id")
    @use(checkProperty)
    @use(protect)
    async deleteRoomType(req: Request, res: Response) {
        const result = await RoomTypeService.deleteRoomType(req.params.id);
        if (result) Responder.sendSuccessMessage('roomType:success.delete', res);
    }

    @Get("/")
    @use(checkProperty)
         @use(protect)
    async listRoomType(req: Request, res: Response) {
        const result = await RoomTypeService.listRoomType(req);
        if (result) Responder.sendSuccessData(result, 'roomType:success.list', res);
    }


}   
