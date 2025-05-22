import { BadRequestResponse } from "http-errors-response-ts/lib";
import { Request, Response } from "express"

// const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary } from 'cloudinary'
import { config } from "../../config/env.config";

cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.secret,
});

class CloudinaryService {
    // @ts-ignore
    getSignature = async (req: Request, res: Response) => {
        const { path, name } = req?.body;

        // let validateErr: any = bodyValidation(["path", "name"], req, res)
        // if (!validateErr) return;
        // console.log(validateErr);

        if (!path || !name) throw new BadRequestResponse('image:failure.invalid')
        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        const fullPath = `${process.env.IMG_PATH.toString()}/${path}`;
        const obj = {
            timestamp: timestamp,
            // eager: "c_pad,h_300,w_400|c_crop,h_200,w_260",
            folder: fullPath,
            public_id: name,
        }

        const result = cloudinary.utils.api_sign_request(
            obj,
            config.cloudinary.secret
        );

        if (result)
            return {
                folder: fullPath,
                signature: result,
                timestamp: timestamp,
                cloudname: config.cloudinary.name,
                apiKey: config.cloudinary.apiKey,
                public_id: name,
            };

    }

    deleteSignature = async (req: Request) => {
        //Path is public_id     
        const deleteImage = await cloudinary.uploader.destroy(`${config.cloudinary.path.toString()}/${req.body.path}`)

        if (deleteImage.result === "ok") return true;
        else throw new BadRequestResponse('image:failure.delete')

    }

}

export default new CloudinaryService();