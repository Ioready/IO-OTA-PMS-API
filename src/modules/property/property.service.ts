
import { ConflictResponse, ForbiddenResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { PropertyModel, UserModel } from '../../schemas';
import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';

class PropertyService {

    // @ts-ignore
    createProperty = async (req: Request, res: Response) => {

        const data = req.body;
        data.groupId = req.user.groupId;
        const property = await PropertyModel.create(data);
        if (!property) throw new ConflictResponse('property:failure.create')
        await Model.findOneAndUpdate(UserModel, { _id: req.user._id }, { currentProperty: property._id })
        return property
    }

    editProperty = async (req: Request) => {
        const propId = req.params.id, data = req.body;
        const prop = await this.getProperty(propId);
        var currentStep = prop.step;
        var msg = (data.step === 1 && currentStep === 1) ? 'property:success.create' : 'property:success.update';

        if (currentStep === 6 || currentStep >= data.step) {
            delete data.step;
        } else {
            let cs: any, errHas: boolean = true;;
            cs = currentStep === data.step ? currentStep : currentStep + 1;
            if (cs === data.step) errHas = false;
            if (errHas) throw new ForbiddenResponse(`property:failure.update`)
        }
        const property = await Model.findOneAndUpdate(PropertyModel, { _id: propId }, data);
        if (!property) throw new NotFoundResponse('property:failure.update')
        return { property, msg }
    }

    getProperty = async (id: any) => {
        const property = await Model.findOne(PropertyModel, { _id: id });
        if (!property) throw new NotFoundResponse('property:failure.detail')
        return property
    }

    getProperties = async (req: Request) => {
        const query: any = req.query;
        await Utils.addGroupId(query, req)
        let projection: any;
        projection = {
            name: 1,
            ownerInfo: 1,
            address: 1,
            room: 1,
            step: 1
        }
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { name: regExp },
                { "ownerInfo.name.first": regExp },
                { "ownerInfo.name.last": regExp },

            ];
            delete query.searchText;
        }
        // query.step = 6;
        const properties = await Model.find(PropertyModel, query, projection);
        if (!properties) throw new NotFoundResponse('property:failure.list')
        return { properties: properties.data, total: properties.total }
    }

    getAllProperties = async () => {
        const properties = await Model.findAll(PropertyModel, {}, { name: 1 }, { sort: { _id: -1 } });
        if (!properties) throw new NotFoundResponse('property:failure.list')
        return { properties }
    }

    switchProperty = async (id: any, userId: any) => {
        const prop = await this.getProperty(id)
        if (prop.step != 6) {
            throw new NotFoundResponse('property:failure.switch')
        }
        const property = await Model.findOneAndUpdate(UserModel, { _id: userId }, { currentProperty: id });
        if (!property) throw new NotFoundResponse('property:failure.switch')
        return property
    }

}

export default new PropertyService();