import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"

import { RoomModel } from '../../schemas/room.schema';
import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';


class RoomService {

    // @ts-ignore
    createRoom = async (req: Request, res: Response) => {
        const data = req.body;
        await Utils.addPropertyId(data, req)
        const room = await RoomModel.create(data);
        if (!room) throw new ConflictResponse('room:failure.create')
        return { room }
    }

    editRoom = async (req: Request) => {
        const roomId = req.params.id
        await this.detailRoom(roomId)
        const room = await Model.findOneAndUpdate(RoomModel, { _id: roomId }, req.body);
        if (!room) throw new NotFoundResponse('room:failure.update')
        return { room };
    }

    detailRoom = async (id: any) => {
        const room = await Model.findOne(RoomModel, { _id: id });
        if (!room) throw new NotFoundResponse('room:failure.detail')
        return { room };
    }

    deleteRoom = async (id: any) => {
        await this.detailRoom(id)
        const room = await Model.findOneAndDelete(RoomModel, { _id: id });
        if (!room) throw new NotFoundResponse('room:failure.delete')
        return { room };
    }

    getRooms = async (req: Request) => {
        const query: any = req.query;
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { roomNumber: regExp },
                { "roomType.name": regExp },
                { "floor.name": regExp },

            ];
            delete query.searchText;
        }

        if (query.roomType) {
            query["roomType._id"] = Utils.returnObjectId(query.roomType);
            delete query.roomType
        }
        const pipeline = [
            Utils.lookupSelectedField("roomtypes", "roomType", "_id", { _id: 1, name: 1 }),
            Utils.unwind("$roomType"),
            Utils.lookupSelectedField("floors", "floor", "_id", { _id: 1, name: 1 }),
            Utils.unwind("$floor"),
            { $match: query },

        ];
        const projection = {
            _id: 1,
            roomNumber: 1,
            roomType: 1,
            floor: 1,
            createdAt: 1,
            updatedAt: 1,
            notes: 1,
            status: 1,
        }
        let pageLimit = Utils.returnPageLimit(query);
        const rooms = await Model.aggregate(RoomModel, pipeline, projection, pageLimit)

        if (!rooms) throw new NotFoundResponse('room:failure.list')
        return { rooms: rooms.data, total: rooms.total }
    }

}
export default new RoomService();