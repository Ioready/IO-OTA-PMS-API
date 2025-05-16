
import { Controller, Get, Post, Patch ,Delete } from '../../lib/decorators';
import { Responder } from '../../lib/responder';
import { Msg } from '../../resources';

import { Request, Response } from "express"
import FloorService from './floor.service';

@Controller("/floor")
// @ts-ignore
class FloorController {

    @Post("/")
    async createFloor(req: Request, res: Response) {
        const result = await FloorService.createFloor(req, res);
        if (result) Responder.sendSuccessCreatedMessage(Msg.floorCreated, res);
    }

    @Patch("/:id")
    async editFloor(req: Request, res: Response) {
        const result = await FloorService.editFloor(req);
        if (result) Responder.sendSuccessMessage(Msg.floorUpdated, res)
    }

    @Get("/:id")
    async getFloor(req: Request, res: Response) {
        const Floor = await FloorService.getFloor(req.params.id);
        if (Floor) Responder.sendSuccessData({ Floor }, Msg.floor, res)
    }

    @Get("/")
    async getFloors(req: Request, res: Response) {
        const result = await FloorService.getFloors(req);
        if (result) Responder.sendSuccessData(result, Msg.floors, res)
    }
    
    @Delete("/:id") 
    async deleteFloor(req: Request ,res: Response) {
        const Floor = await FloorService.deleteFloor(req.params.id);
        if (Floor) Responder.sendSuccessMessage(Msg.floorDeleted ,res)
    }

}