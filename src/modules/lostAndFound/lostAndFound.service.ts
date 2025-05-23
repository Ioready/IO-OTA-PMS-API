import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';
import { LostAndFoundModel } from '../../schemas';



class LostAndFoundService {


    createLostAndFound = async (req: Request) => {
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
        await Utils.getPropertyId(query, req)
        const pipeline = [
            Utils.lookupSelectedField("users", "reportPerson", "_id", { _id: 1, fullName: 1 }, "reportPerson"),
            Utils.unwind("$reportPerson"),
            Utils.lookupSelectedField("rooms", "room", "_id", { _id: 1, roomNumber: 1 }, "room"),
            Utils.unwind("$room"),
            { $match: query },
        ];
        const projection = {
            _id: 1,
            item: 1,
            room: 1,
            reportPerson: 1,
            status: 1,
            createdAt: 1,
        }
        
        let pageLimit = Utils.returnPageLimit(query);
        const lostAndFounds = await Model.aggregate(LostAndFoundModel, pipeline, projection, pageLimit)
        if (!lostAndFounds) throw new NotFoundResponse('LostAndFound:failure.delete')
        return { lostAndFounds: lostAndFounds.data, total: lostAndFounds.total }
    }
}
export default new LostAndFoundService();