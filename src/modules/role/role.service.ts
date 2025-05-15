import { ConflictResponse, NotFoundResponse } from "../../lib/decorators";
import { Request, Response } from "express";
import { RoleModel, UserModel } from "../../schemas";
import { CommonStatus, Msg } from "../../resources";
import { Model } from "../../lib/model";
import { Utils } from "../../lib/utils";

class RoleService {
  // @ts-ignore
  createRole = async (req: Request, res: Response) => {
    const data = req.body;
    const exRole = await Model.findOne(RoleModel, {
      name: Utils.returnRegExp(data.name),
    });

    if (exRole) throw new ConflictResponse(Msg.roleName404);
    data.groupId = req.user.groupId;
    const role = await RoleModel.create(data);
    if (!role) throw new ConflictResponse(Msg.roleCreated404);
    return role;
  };

  editRole = async (req: Request) => {
    const data = req.body;

    if (data.name) {
      const exRole = await Model.findOne(RoleModel, {
        name: Utils.returnRegExp(data.name), _id: { $ne: req.params.id }
      });
      if (exRole) {
        throw new ConflictResponse(Msg.roleName404);
      }
    }

    const role = await Model.findOneAndUpdate(RoleModel, { _id: req.params.id }, data);
    if (!role) throw new NotFoundResponse(Msg.role404);
    return role;
  };

  getRole = async (id: any) => {
    const role = await Model.findOne(RoleModel, { _id: id });
    if (!role) throw new NotFoundResponse(Msg.role404);
    return role;
  };


  getRoles = async (req: Request) => {
    const roles = await Model.find(RoleModel, req.query, {});
    if (!roles) throw new NotFoundResponse(Msg.roles404);
    return { Roles: roles.data, total: roles.total };
  };

  deleteRole = async (id: any) => {
    // this.getRole(id)
    const userCount = await Model.countDocuments(UserModel, { role: id })
    if (userCount >= 1) {
      throw new NotFoundResponse(Msg.roleDeleted404)
    }
    const role = await RoleModel.findByIdAndDelete({ _id: id });
    if (!role) throw new NotFoundResponse(Msg.roleDeleted404);
    return { role };
  };


  getAllRoles = async (req: Request) => {
    const query = req.query;
    query.status = CommonStatus.ACTIVE
    const roles = await Model.findAll(RoleModel, query, { _id: 1, name: 1 }, { sort: { _id: -1 } });
    if (!roles) throw new NotFoundResponse(Msg.roles404);
    return { roles };
  };


}

export default new RoleService();
