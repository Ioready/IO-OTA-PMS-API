
import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { FloorModel } from '../../schemas';
import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';

class FloorService {

    // @ts-ignore
    createFloor = async (req: Request, res: Response) => {
        const data = req.body;
        await Utils.addPropertyId(data, req)
        const floor = await FloorModel.create(data);
        if (!floor) throw new ConflictResponse('floor:failure.create')
        return { floor }
    }

    editFloor = async (req: Request) => {
        const floorId = req.params.id;
        await this.getFloor(floorId)
        const floor = await Model.findOneAndUpdate(FloorModel, { _id: floorId }, req.body);
        if (!floor) throw new NotFoundResponse('floor:failure.update')
        return floor
    }

    getFloor = async (id: any) => {

        const floor = await Model.findOne(FloorModel, { _id: id });
        if (!floor) throw new NotFoundResponse('floor:failure.detail')
        return floor
    }

    // @ts-ignore
    getFloors = async (req: Request) => {

        const floors = await Model.find(FloorModel, req.query, {});
        if (!floors) throw new NotFoundResponse('floor:failure.list')
        return { floors: floors.data, total: floors.total }
    }

    deleteFloor = async (id: any) => {

        const floor = await FloorModel.findOneAndDelete({ _id: id });
        if (!floor) throw new NotFoundResponse('floor:failure.delete');
        return floor;
    }

}

export default new FloorService();