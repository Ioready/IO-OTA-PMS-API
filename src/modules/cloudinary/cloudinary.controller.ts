
import { Controller, Delete, Post } from '../../lib/decorators';
import { Responder } from '../../lib/responder';

import { Request, Response } from "express"
// import { use } from '../../lib/decorators/use';
// import {protect } from '../auth/auth.middleware';
import CloudinaryService from './cloudinary.service';

@Controller("/image-sign")
// @ts-ignore
class ImageController {

    @Post("/")
    // @use(protect)
    async createFloor(req: Request, res: Response) {
        const result = await CloudinaryService.getSignature(req, res);
        if (result) Responder.sendSuccessData({ signature: result }, 'image:success.signature', res);
    }



    @Delete("/")
    // @use(checkProperty)
    // @use(protect)
    async deleteSignature(req: Request, res: Response) {
        const result = await CloudinaryService.deleteSignature(req);
        if (result) Responder.sendSuccessMessage('image:success.delete', res)
    }

}