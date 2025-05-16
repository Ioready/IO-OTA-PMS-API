
import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { PropertyModel, UserModel } from '../../schemas';
import { Msg } from '../../resources';
import { Model } from '../../lib/model';

class PropertyService {

    // @ts-ignore
    createProperty = async (req: Request, res: Response) => {

        const data = req.body;
        data.groupId = req.user.groupId;
        const property = await PropertyModel.create(data);
        if (!property) throw new ConflictResponse('property:error.create')
        await Model.findOneAndUpdate(UserModel, { _id: req.user._id }, { currentProperty: property._id })
        return property
    }

    editProperty = async (req: Request) => {

        const property = await Model.findOneAndUpdate(PropertyModel, { _id: req.params.id }, req.body);
        if (!property) throw new NotFoundResponse('property:error.detail')
        return property
    }

    getProperty = async (id: any) => {

        const property = await Model.findOne(PropertyModel, { _id: id });
        if (!property) throw new NotFoundResponse('property:error.detail')
        return property
    }

    getProperties = async (req: Request) => {
        const properties = await Model.find(PropertyModel, req.query, {});
        if (!properties) throw new NotFoundResponse('property:error.list')
        return { properties: properties.data, total: properties.total }
    }

    getAllProperties = async () => {
        const properties = await Model.findAll(PropertyModel, {}, { name: 1 }, { sort: { _id: -1 } });
        if (!properties) throw new NotFoundResponse('property:error.list')
        return { properties }
    }

}

export default new PropertyService();