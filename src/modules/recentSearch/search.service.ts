import { ConflictResponse, GoneResponse, NotFoundResponse } from "../../lib/decorators";
import { Request, Response } from "express";

import { CommonStatus, ModuleName, Msg, } from "../../resources";
import { Model } from "../../lib/model";

import { RecentSearchaModel } from "../../schemas/recentSearch.schema";
import { Utils } from "../../lib/utils";

class RecentSearchService {
    // @ts-ignore
    createRecentSearch = async (req: Request, res: Response) => {
        const data = req.body;
        await Utils.addPropertyId(data, req);

        const type = Object.values(ModuleName)
        if (!type.includes(data.type)) throw new GoneResponse('recentSearch:failure.typeInvalid')
        
        const doc = await RecentSearchaModel.countDocuments({ type: data.type })
        if (doc >= 3) await RecentSearchaModel.deleteMany({ type: data.type })

        const recentSearch = await RecentSearchaModel.create(data);
        if (!recentSearch) throw new ConflictResponse('recentSearch:failure.create')
        return { recentSearch }
    }


    getRecentSearch = async () => {

        const recentSearch = await Model.findAll(RecentSearchaModel, {}, { name: 1, type: 1 }, { limit: 3, sort: { _id: -1 } });
        if (!recentSearch) throw new NotFoundResponse('recentSearch:failure.list');
        return { recentSearch };
    };


}

export default new RecentSearchService();
