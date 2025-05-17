
import { Controller, Get, Post, Patch } from '../../lib/decorators';
import { Responder } from '../../lib/responder';
import { Request, Response } from "express"
import PropertyService from './property.service';
import { use } from '../../lib/decorators/use';
import { protect } from '../auth/auth.middleware';

@Controller("/property")
// @ts-ignore
class PropertyController {

    @Post('/')
    @use(protect)
    async createProperty(req: Request, res: Response) {
        const result = await PropertyService.createProperty(req, res);
        if (result) Responder.sendSuccessCreatedDate({ property: result._id }, 'property:success.create', res);
    }

    @Patch("/:id")
    async editProperty(req: Request, res: Response) {
        const result = await PropertyService.editProperty(req);
        if (result) Responder.sendSuccessMessage('property:success.update', res)
    }


    @Get("/all")
    // @ts-ignore
    async getAllProperties(req: Request, res: Response) {
        const result = await PropertyService.getAllProperties();
        if (result) Responder.sendSuccessData(result, 'property:success.list', res)
    }

    @Get("/:id")
    async getProperty(req: Request, res: Response) {
        const property = await PropertyService.getProperty(req.params.id);
        if (property) Responder.sendSuccessData({ property }, 'property:success.detail', res)
    }

    @Get("/")
    async getProperties(req: Request, res: Response) {
        const result = await PropertyService.getProperties(req);
        if (result) Responder.sendSuccessData(result, 'property:success.list', res)
    }

}