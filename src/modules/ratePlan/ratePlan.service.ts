import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"

import { RatePlanModel } from '../../schemas/ratePlan.schema';
import { Model } from '../../lib/model';



class RatePlanService {

    // @ts-ignore
    createRatePlan = async (req: Request, res: Response) => {

        const room = await RatePlanModel.create(req.body);
        if (!room) throw new ConflictResponse('ratePlan:failure.create')
        return { room }
    }

    editRatePlan = async (req: Request) => {
        const roomId = req.params.id
        await this.detailRatePlan(roomId)
        const roomType = await Model.findOneAndUpdate(RatePlanModel, { _id: roomId }, req.body);
        if (!roomType) throw new NotFoundResponse('ratePlan:failure.update')
        return { roomType };
    }

    detailRatePlan = async (id: any) => {
        const roomType = await Model.findOne(RatePlanModel, { _id: id });
        if (!roomType) throw new NotFoundResponse('ratePlan:failure.detail')
        return { roomType };
    }
    deleteRatePlan = async (id: any) => {
        await this.detailRatePlan(id)
        const roomType = await Model.findOneAndDelete(RatePlanModel, { _id: id });
        if (!roomType) throw new NotFoundResponse('ratePlan:failure.delete')
        return { roomType };
    }
    ratePlans = async (req: Request) => {
        const query = req.query;
        const ratePlans = await Model.find(RatePlanModel ,query ,{name:1,code:1,status:1 ,updatedAt:1})
    if (!ratePlans) throw new NotFoundResponse('ratePlan:failure.detail')
        return { ratePlans };
    }


}
export default new RatePlanService();