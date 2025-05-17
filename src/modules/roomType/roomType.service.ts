import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"

import { Msg } from '../../resources';
import { roomTypeModel } from '../../schemas/roomType.schema';
import { Model } from '../../lib/model';



class RoomTypeService {

    // @ts-ignore
    createRoomType = async (req: Request, res: Response) => {

        const roomType = await roomTypeModel.create(req.body);
        if (!roomType) throw new ConflictResponse(Msg.roomTypeCreated404)
        return { roomType }
    }

    editRoomType = async (req: Request) => {
        const roomType = await Model.findOneAndUpdate(roomTypeModel, { _id: req.params.id }, req.body);
        if (!roomType) throw new NotFoundResponse(Msg.roomTypeUpdated404)
        return { roomType };
    }

    detailRoomType = async (id: any) => {
         const roomType = await Model.findOne(roomTypeModel, { _id: id });
        if (!roomType) throw new NotFoundResponse(Msg.roomType404 )
        return { roomType }; 
    }
    deleteRoomType = async (id: any) => {
        const roomType = await Model.findOneAndDelete(roomTypeModel, { _id: id });
        if (!roomType) throw new NotFoundResponse(Msg.roomType404 )
        return { roomType };
    }

}
export default new RoomTypeService();