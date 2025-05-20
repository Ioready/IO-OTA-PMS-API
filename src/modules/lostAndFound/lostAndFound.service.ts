import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';
import { CommonStatus } from '../../resources';
import { LostAndFoundModel } from '../../schemas';



class LostAndFoundService {

    // @ts-ignore
    createLostAndFound = async (req: Request, res: Response) => {
        const data = req.body
        await Utils.addPropertyId(data, req)
        const lostAndFound = await LostAndFoundModel.create(data);
        if (!lostAndFound) throw new ConflictResponse('lostAndFound:failure.create')
        return { lostAndFound }
    }

    editLostAndFound = async (req: Request) => {
        const lostAndFoundId = req.params.id
        await this.detailLostAndFound(lostAndFoundId)
        const lostAndFound = await Model.findOneAndUpdate(LostAndFoundModel, { _id: lostAndFoundId }, req.body);
        if (!lostAndFound) throw new NotFoundResponse('lostAndFound:failure.update')
        return { lostAndFound };
    }

    detailLostAndFound = async (id: any) => {
        const lostAndFound = await Model.findOne(LostAndFoundModel, { _id: id });
        if (!lostAndFound) throw new NotFoundResponse('lostAndFound:failure.detail')
        return { lostAndFound };
    }
    deleteLostAndFound = async (id: any) => {
        await this.detailLostAndFound(id)
        const lostAndFound = await Model.findOneAndDelete(LostAndFoundModel, { _id: id });
        if (!lostAndFound) throw new NotFoundResponse('lostAndFound:failure.delete')
        return { lostAndFound };
    }

    getLostAndFounds = async (req: Request) => {
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
            Utils.lookupField("rooms", "_id", "LostAndFound", "rooms"),
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
        const LostAndFounds = await Model.aggregate(LostAndFoundModel, pipeline, projection, pageLimit)

        // const LostAndFounds = await Model.find(LostAndFoundModel, req.query, { type: 1, maxGuest: 1, rate: 1, status: 1 });
        if (!LostAndFounds) throw new NotFoundResponse('LostAndFound:failure.delete')
        return { LostAndFounds: LostAndFounds.data, total: LostAndFounds.total }
    }



    getAllLostAndFounds = async (req: Request) => {
        const query: any = req.query;
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { name: regExp },
            ];
            delete query.searchText;
        }
        query.status = CommonStatus.ACTIVE;
        const LostAndFounds = await Model.findAll(LostAndFoundModel, query, { name: 1, code: 1 },)
        if (!LostAndFounds) throw new NotFoundResponse('ratePlan:failure.list')
        return { LostAndFounds }
    }

}
export default new LostAndFoundService();