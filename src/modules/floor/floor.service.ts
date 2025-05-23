
import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { FloorModel, UserModel } from '../../schemas';
import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';

class FloorService {

    // @ts-ignore
    createFloor = async (req: Request, res: Response) => {
        const data = req.body;
        await Utils.addPropertyId(data, req);

        const manager = await Model.findOne(UserModel, { _id: data?.manager })
        if (!manager) throw new NotFoundResponse('user:failure.manager')

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
            Utils.lookupSelectedField("users", "manager", "_id", { _id: 1, fullName: 1 }, "manager"),
            Utils.unwind("$manager"),
            Utils.lookupField("rooms", "_id", "floor", "rooms"),
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
            totalrooms: 1,
            manager: 1,
        }
        let pageLimit = Utils.returnPageLimit(query);
        const floors = await Model.aggregate(FloorModel, pipeline, projection, pageLimit)
        if (!floors) throw new NotFoundResponse('floor:failure.list')
        return { floors: floors.data, total: floors.total }
    }

    deleteFloor = async (id: any) => {

        const floor = await FloorModel.findOneAndDelete({ _id: id });
        if (!floor) throw new NotFoundResponse('floor:failure.delete');
        return floor;
    }

    getAllFloors = async (req: Request) => {
        const query: any = req.query;
        query.isDeleted = false;
        await Utils.getPropertyId(query, req)
        
        const floors = await Model.findAll(FloorModel, query, { _id: 1, name: 1 }, { sort: { _id: -1 } })
        if (!floors) throw new NotFoundResponse('user:failure.list');
        return floors ;
    }

}

export default new FloorService();