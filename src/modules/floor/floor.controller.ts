
import { Controller, Get, Post, Patch, Delete } from '../../lib/decorators';
import { Responder } from '../../lib/responder';

import { Request, Response } from "express"
import FloorService from './floor.service';
import { use } from '../../lib/decorators/use';
import { checkProperty, protect } from '../auth/auth.middleware';

@Controller("/floor")
// @ts-ignore
class FloorController {

    @Post("/")
    @use(checkProperty)
    @use(protect)
    async createFloor(req: Request, res: Response) {
        const result = await FloorService.createFloor(req, res);
        if (result) Responder.sendSuccessCreatedMessage('floor:success.create', res);
    }

    @Patch("/:id")
    @use(checkProperty)
    @use(protect)
    async editFloor(req: Request, res: Response) {
        const result = await FloorService.editFloor(req);
        if (result) Responder.sendSuccessMessage('floor:success.update', res)
    }
    
     @Get("/all")
    @use(checkProperty)
    @use(protect)
    async getAllFloors(req: Request, res: Response) {
        const floors = await FloorService.getAllFloors(req);
        if (floors) Responder.sendSuccessData({ floors }, 'floor:success.list', res)
    }

    @Get("/:id")
    @use(checkProperty)
    @use(protect)
    async getFloor(req: Request, res: Response) {
        const floor = await FloorService.getFloor(req.params.id);
        if (floor) Responder.sendSuccessData({ floor }, 'floor:success.detail', res)
    }

    @Get("/")
    @use(checkProperty)
    @use(protect)
    async getFloors(req: Request, res: Response) {
        const result = await FloorService.getFloors(req);
        if (result) Responder.sendSuccessData(result, 'floor:success.list', res)
    }

    @Delete("/:id")
    @use(checkProperty)
    @use(protect)
    async deleteFloor(req: Request, res: Response) {
        const Floor = await FloorService.deleteFloor(req.params.id);
        if (Floor) Responder.sendSuccessMessage('floor:success.delete', res)
    }

}