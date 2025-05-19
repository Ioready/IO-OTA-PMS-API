import { ConflictResponse ,NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"

import { RoomModel } from '../../schemas/room.schema';
import { Model } from '../../lib/model';


class RoomService {

// @ts-ignore
    createRoom = async (req: Request, res: Response) => {

        const room = await RoomModel.create(req.body);
        if (!room) throw new ConflictResponse('room:failure.create')
        return { room }
    }

    editRoom = async (req: Request) => {
            const roomId=req.params.id
            await this.detailRoom(roomId)
            const roomType = await Model.findOneAndUpdate(RoomModel, { _id: roomId }, req.body);
            if (!roomType) throw new NotFoundResponse('room:failure.update')
            return { roomType };
    }
    
    detailRoom = async (id: any) => {
            const roomType = await Model.findOne(RoomModel, { _id: id });
            if (!roomType) throw new NotFoundResponse('room:failure.detail')
            return { roomType };
    }
    deleteRoom = async (id: any) => {
         await this.detailRoom(id)
        const roomType = await Model.findOneAndDelete(RoomModel, { _id: id });
        if (!roomType) throw new NotFoundResponse('room:failure.delete')
        return { roomType };
    }

    }
export default new RoomService();