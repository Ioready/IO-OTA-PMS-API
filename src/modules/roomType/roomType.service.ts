import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { RoomTypeModel } from '../../schemas/roomType.schema';
import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';
import { CommonStatus } from '../../resources';



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
        const query: any = req.query;
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { name: regExp },
                { "manager.name": regExp },
            ];
            delete query.searchText;
        }
        const pipeline = [
            // Utils.lookupSelectedField("users", "manager", "_id", { _id: 1, fullName: 1 }, "manager"),
            // Utils.unwind("$manager"),
            Utils.lookupField("rooms", "_id", "roomType", "rooms"),
            { $match: query },

            {
                $addFields: {
                    totalrooms: {
                        $size: "$rooms"
                    }
                }
            }
        ];
        const projection = {
            _id: 1,
            name: 1,
            type: 1,
            maxGuest: 1,
            rate: 1,
            status: 1,
            totalrooms: 1,
        }
        let pageLimit = Utils.returnPageLimit(query);
        const roomTypes = await Model.aggregate(RoomTypeModel, pipeline, projection, pageLimit)

        // const roomTypes = await Model.find(RoomTypeModel, req.query, { type: 1, maxGuest: 1, rate: 1, status: 1 });
        if (!roomTypes) throw new NotFoundResponse('roomType:failure.delete')
        return { roomTypes: roomTypes.data, total: roomTypes.total }
    }



    getAllRoomTypes = async (req: Request) => {
        const query: any = req.query;
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { name: regExp },
            ];
            delete query.searchText;
        }
        query.status = CommonStatus.ACTIVE;
        const roomTypes = await Model.findAll(RoomTypeModel, query, { name: 1, code: 1 },)
        if (!roomTypes) throw new NotFoundResponse('ratePlan:failure.list')
        return { roomTypes }
    }

}
export default new RoomTypeService();