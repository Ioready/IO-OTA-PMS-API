
import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { RoleModel } from '../../schemas';
import { Msg } from '../../resources';
import { Model } from '../../lib/model';
import { bodyValidation } from '../../middleware/validation';

class RoleService {

    // @ts-ignore
    createRole = async (req: Request, res: Response) => {

        const data = req.body;
        let validateErr: any = bodyValidation(["category", "priority"], req, res)
        if (!validateErr) return;
        const role = await RoleModel.create(data);        
        if (!role) throw new ConflictResponse(Msg.roleCreated404)
        return role
    }

    editRole = async (req: Request) => {

        const role = await Model.findOneAndUpdate(RoleModel, { _id: req.params.id }, req.body);
        if (!role) throw new NotFoundResponse(Msg.role404)
        return role
    }

    getRole = async (id: any) => {

        const role = await Model.findOne(RoleModel, { _id: id });
        if (!role) throw new NotFoundResponse(Msg.role404)
        return role
    }

    // @ts-ignore
    getRoles = async (req: Request) => {

        const roles = await Model.find(RoleModel, req.query, {});
        if (!roles) throw new NotFoundResponse(Msg.roles404)
        return { Roles: roles.data, total: roles.total }
    }

}

export default new RoleService();