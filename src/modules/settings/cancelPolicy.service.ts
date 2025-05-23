import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request } from "express"
import { Model } from '../../lib/model';
import { Utils } from '../../lib/utils';
import { CancelPolicyModel } from '../../schemas/settings/cancelPolicy.schema';
import { CommonStatus } from '../../resources';



class CancelPolicyService {


    createCancelPolicy = async (req: Request) => {
        const data = req.body
        await Utils.addPropertyId(data, req)
        const cancelPolicy = await CancelPolicyModel.create(data);
        if (!cancelPolicy) throw new ConflictResponse('cancelPolicy:failure.create')
        return { cancelPolicy }
    }
    editCancelPolicy = async (req: Request) => {
        const cancelPolicyId = req.params.id
        await this.detailCancelPolicy(cancelPolicyId)
        const cancelPolicy = await Model.findOneAndUpdate(CancelPolicyModel, { _id: cancelPolicyId }, req.body);
        if (!cancelPolicy) throw new NotFoundResponse('cancelPolicy:failure.update')
        return { cancelPolicy };
    }

    detailCancelPolicy = async (id: any) => {
        const cancelPolicy = await Model.findOne(CancelPolicyModel, { _id: id });
        if (!cancelPolicy) throw new NotFoundResponse('cancelPolicy:failure.detail')
        return { cancelPolicy };
    }
    listCancelPolicy = async (req: Request) => {
        const query: any = req.query;
        await Utils.getPropertyId(query,req)
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { name: regExp },
                { type: regExp },
            ];
            delete query.searchText;
        }

        const cancelPolicy = await Model.find(CancelPolicyModel, query, { name: 1, type: 1, description: 1, status: 1 });
        if (!cancelPolicy) throw new NotFoundResponse('cancelPolicy:failure.list')
        return { cancelPolicy }
    }

    deleteCancelPolicy = async (id: any) => {
        await this.detailCancelPolicy(id)
        const cancelPolicy = await Model.findOneAndDelete(CancelPolicyModel, { _id: id });
        if (!cancelPolicy) throw new NotFoundResponse('cancelPolicy:failure.delete')
        return { cancelPolicy };
    }


}
export default new CancelPolicyService();