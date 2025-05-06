
import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { PropertyModel } from '../../schemas';
import { Msg } from '../../resources';
import { Model } from '../../lib/model';
import { bodyValidation } from '../../middleware/validation';

class PropertyService {

    // @ts-ignore
    createProperty = async (req: Request, res: Response) => {

        const data = req.body;
        let validateErr: any = bodyValidation(["category", "priority"], req, res)
        if (!validateErr) return;
        const property = await PropertyModel.create(data);
        if (!property) throw new ConflictResponse(Msg.propertyCreated404)
        return property
    }

    editProperty = async (req: Request) => {

        const property = await Model.findOneAndUpdate(PropertyModel, { _id: req.params.id }, req.body);
        if (!property) throw new NotFoundResponse(Msg.property404)
        return property
    }

    getProperty = async (id: any) => {

        const property = await Model.findOne(PropertyModel, { _id: id });
        if (!property) throw new NotFoundResponse(Msg.property404)
        return property
    }

    // @ts-ignore
    getProperties = async (req: Request) => {

        const properties = await Model.find(PropertyModel, req.query, {});
        if (!properties) throw new NotFoundResponse(Msg.properties404)
        return { Propertys: properties.data, total: properties.total }
    }

}

export default new PropertyService();