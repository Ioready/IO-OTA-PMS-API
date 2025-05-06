
import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { FloorModel } from '../../schemas';
import { Msg } from '../../resources';
import { Model } from '../../lib/model';
import { bodyValidation } from '../../middleware/validation';

class FloorService {

    // @ts-ignore
    createFloor = async (req: Request, res: Response) => {

        const data = req.body;
        let validateErr: any = bodyValidation(["category", "priority"], req, res)
        if (!validateErr) return;
        const floor = await FloorModel.create(data);
        if (!floor) throw new ConflictResponse(Msg.floorCreated404)
        return floor
    }

    editFloor = async (req: Request) => {

        const floor = await Model.findOneAndUpdate(FloorModel, { _id: req.params.id }, req.body);
        if (!floor) throw new NotFoundResponse(Msg.floor404)
        return floor
    }

    getFloor = async (id: any) => {

        const floor = await Model.findOne(FloorModel, { _id: id });
        if (!floor) throw new NotFoundResponse(Msg.floor404)
        return floor
    }

    // @ts-ignore
    getFloors = async (req: Request) => {

        const floors = await Model.find(FloorModel, req.query, {});
        if (!floors) throw new NotFoundResponse(Msg.floors404)
        return { floors: floors.data, total: floors.total }
    }

}

export default new FloorService();