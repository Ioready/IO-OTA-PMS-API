
import { Controller, Get, Post, Patch } from '../../lib/decorators';
import { Responder } from '../../lib/responder';
import { Msg } from '../../resources';

import { Request, Response } from "express"
import PropertyService from './property.service';

@Controller("/property")
// @ts-ignore
class PropertyController {

    @Post('/')
    async createProperty(req: Request, res: Response) {
        const result = await PropertyService.createProperty(req, res);
        if (result) Responder.sendSuccessCreatedMessage(Msg.propertyCreated, res);
    }

    @Patch("/:id")
    async editProperty(req: Request, res: Response) {
        const result = await PropertyService.editProperty(req);
        if (result) Responder.sendSuccessMessage(Msg.propertyUpdated, res)
    }

    @Get("/:id")
    async getProperty(req: Request, res: Response) {
        const property = await PropertyService.getProperty(req);
        if (property) Responder.sendSuccessData({ property }, Msg.property, res)
    }

    @Get("/")
    async getProperties(req: Request, res: Response) {
        const result = await PropertyService.getProperties(req);
        if (result) Responder.sendSuccessData(result, Msg.properties, res)
    }

}