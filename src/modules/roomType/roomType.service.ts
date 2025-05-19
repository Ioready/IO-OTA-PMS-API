import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { RoomTypeModel } from '../../schemas/roomType.schema';
import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';



class RoomTypeService {

    // @ts-ignore
    createRoomType = async (req: Request, res: Response) => {
        const data = req.body
        await Utils.addPropertyId(data, req)
        const roomType = await RoomTypeModel.create(data);
        if (!roomType) throw new ConflictResponse('roomType:failure.create')
        return { roomType }
    }

    editRoomType = async (req: Request) => {
        const roomTypeId = req.params.id
        await this.detailRoomType(roomTypeId)
        const roomType = await Model.findOneAndUpdate(RoomTypeModel, { _id: roomTypeId }, req.body);
        if (!roomType) throw new NotFoundResponse('roomType:failure.update')
        return { roomType };
    }

    detailRoomType = async (id: any) => {
        const roomType = await Model.findOne(RoomTypeModel, { _id: id });
        if (!roomType) throw new NotFoundResponse('roomType:failure.detail')
        return { roomType };
    }
    deleteRoomType = async (id: any) => {
        await this.detailRoomType(id)
        const roomType = await Model.findOneAndDelete(RoomTypeModel, { _id: id });
        if (!roomType) throw new NotFoundResponse('roomType:failure.delete')
        return { roomType };
    }
    listRoomType = async (req: Request) => {

        const roomTypes = await Model.find(RoomTypeModel, req.query, { type: 1, maxGuest: 1, rate: 1, status: 1 });
        if (!roomTypes) throw new NotFoundResponse('roomType:failure.delete')
        return { roomTypes: roomTypes.data, total: roomTypes.total }
    }

}
export default new RoomTypeService();