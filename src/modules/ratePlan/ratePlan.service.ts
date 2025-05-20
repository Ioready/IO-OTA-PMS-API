import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"

import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';
import { CommonStatus } from '../../resources';
import { RatePlanModel } from '../../schemas';

class RatePlanService {

    // @ts-ignore
    createRatePlan = async (req: Request, res: Response) => {
        const data = req.body;
        await Utils.addPropertyId(data, req);
        const ratePlan = await RatePlanModel.create(data);
        if (!ratePlan) throw new ConflictResponse('ratePlan:failure.create')
        return { ratePlan }
    }

    editRatePlan = async (req: Request) => {
        const ratePlanId = req.params.id
        await this.detailRatePlan(ratePlanId)
        const ratePlan = await Model.findOneAndUpdate(RatePlanModel, { _id: ratePlanId }, req.body);
        if (!ratePlan) throw new NotFoundResponse('ratePlan:failure.update')
        return { ratePlan };
    }

    detailRatePlan = async (id: any) => {
        const ratePlan = await Model.findOne(RatePlanModel, { _id: id });
        if (!ratePlan) throw new NotFoundResponse('ratePlan:failure.detail')
        return { ratePlan };
    }

    deleteRatePlan = async (id: any) => {
        await this.detailRatePlan(id)
        const ratePlan = await Model.findOneAndDelete(RatePlanModel, { _id: id });
        if (!ratePlan) throw new NotFoundResponse('ratePlan:failure.delete')
        return { ratePlan };
    }

    getRatePlans = async (req: Request) => {
        const query: any = req.query;
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { name: regExp },
            ];
            delete query.searchText;
        }
        const ratePlans = await Model.find(RatePlanModel, query, { name: 1, code: 1, status: 1, updatedAt: 1 })
        if (!ratePlans) throw new NotFoundResponse('ratePlan:failure.list')
        return { ratePlans: ratePlans.data, total: ratePlans.total }
    }

    getAllRatePlans = async (req: Request) => {
        const query: any = req.query;
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { name: regExp },
            ];
            delete query.searchText;
        }
        query.status = CommonStatus.ACTIVE;
        const ratePlans = await Model.findAll(RatePlanModel, query, { name: 1, code: 1, mappedRoomTypes: 1 },)
        if (!ratePlans) throw new NotFoundResponse('ratePlan:failure.list')
        return { ratePlans }
    }

    addRatePlanMapping = async (req: Request) => {
        const ratePlanId = req.params.id
        await this.detailRatePlan(ratePlanId)
        const ratePlan = await Model.findOneAndUpdate(RatePlanModel, { _id: ratePlanId }, req.body);
        if (!ratePlan) throw new NotFoundResponse('ratePlan:failure.mapping')
        return { ratePlan };
    }


}
export default new RatePlanService();