import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { roomTypeModel } from '../../schemas/roomType.schema';
import { Model } from '../../lib/model';



class RoomTypeService {

    // @ts-ignore
    createRoomType = async (req: Request, res: Response) => {

        const roomType = await roomTypeModel.create(req.body);
        if (!roomType) throw new ConflictResponse('roomType:failure.create')
        return { roomType }
    }

    editRoomType = async (req: Request) => {
        const roomType = await Model.findOneAndUpdate(roomTypeModel, { _id: req.params.id }, req.body);
        if (!roomType) throw new NotFoundResponse('roomType:failure.update')
        return { roomType };
    }

    detailRoomType = async (id: any) => {
        const roomType = await Model.findOne(roomTypeModel, { _id: id });
        if (!roomType) throw new NotFoundResponse('roomType:failure.detail')
        return { roomType };
    }
    deleteRoomType = async (id: any) => {
        const roomType = await Model.findOneAndDelete(roomTypeModel, { _id: id });
        if (!roomType) throw new NotFoundResponse('roomType:failure.delete')
        return { roomType };
    }

}
export default new RoomTypeService();