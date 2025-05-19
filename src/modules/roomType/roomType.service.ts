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
        const typeId = req.params.id;
        await this.detailRoomType(typeId);
        const roomType = await Model.findOneAndUpdate(RoomTypeModel, { _id: typeId }, req.body);
        if (!roomType) throw new NotFoundResponse('roomType:failure.update')
        return { roomType };
    }

    detailRoomType = async (id: any) => {
        const roomType = await Model.findOne(RoomTypeModel, { _id: id });
        if (!roomType) throw new NotFoundResponse('roomType:failure.detail')
        return { roomType };
    }
    deleteRoomType = async (id: any) => {
        const roomType = await Model.findOneAndDelete(RoomTypeModel, { _id: id });
        if (!roomType) throw new NotFoundResponse('roomType:failure.delete')
        return { roomType };
    }

}
export default new RoomTypeService();