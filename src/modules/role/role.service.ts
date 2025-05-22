import { ConflictResponse, NotFoundResponse } from "../../lib/decorators";
import { Request, Response } from "express";
import { RoleModel, UserModel } from "../../schemas";
import { CommonStatus, UserType, } from "../../resources";
import { Model } from "../../lib/model";
import { Utils } from "../../lib/utils";

class RoleService {
  // @ts-ignore
  createRole = async (req: Request, res: Response) => {
    const data = req.body;
    const exRole = await Model.findOne(RoleModel, { name: Utils.returnRegExp(data.name), });

    if (exRole) throw new ConflictResponse('role:failure.name');
    data.groupId = req.user.groupId;
    const role = await RoleModel.create(data);
    if (!role) throw new ConflictResponse('role:failure.create');
    return role;
  };

  editRole = async (req: Request) => {
    const data = req.body;
    const roleId = req.params.id;
    await this.getRole(roleId)
    if (data.name) {
      const exRole = await Model.findOne(RoleModel, { name: Utils.returnRegExp(data.name), _id: { $ne: roleId } });
      if (exRole) throw new ConflictResponse('role:failure.name');
    }

    const role = await Model.findOneAndUpdate(RoleModel, { _id: roleId }, data);
    if (!role) throw new NotFoundResponse('role:failure.update');
    return role;
  };

  getRole = async (id: any) => {
    const role = await Model.findOne(RoleModel, { _id: id });
    if (!role) throw new NotFoundResponse('role:failure.detail');
    return role;
  };


  getRoles = async (req: Request) => {
    const query: any = req.query;
    await Utils.addGroupId(query, req);
    query.type = { $ne: UserType.ADMIN };
    // query.status = CommonStatus.ACTIVE;
    if (query.searchText) {
      const regExp = Utils.returnRegExp(query.searchText);
      query["$or"] = [
        { name: regExp },
      ];
      delete query.searchText;
    }
    const pipeline = [
      { $match: query },
      Utils.lookupField("users", "_id", "role", "users"),
      {
        $addFields: {
          totalUsers: {
            $size: "$users"
          }
        }
      }
    ];
    const projection = {
      _id: 1,
      name: 1,
      description: 1,
      status: 1,
      createdAt: 1,
      totalUsers: 1,
    }
    let pageLimit = Utils.returnPageLimit(query);
    const roles = await Model.aggregate(RoleModel, pipeline, projection, pageLimit)
    if (!roles) throw new NotFoundResponse('role:failure.list');
    return { roles: roles.data, total: roles.total };
  };

  deleteRole = async (id: any) => {
    await this.getRole(id)
    const userCount = await Model.countDocuments(UserModel, { role: id })
    if (userCount >= 1) {
      throw new NotFoundResponse('role:failure.delete')
    }
    const role = await RoleModel.findByIdAndDelete({ _id: id });
    if (!role) throw new NotFoundResponse('role:failure.delete');
    return { role };
  };


  getAllRoles = async (req: Request) => {
    const query = req.query;
    query.status = CommonStatus.ACTIVE;
    query.type = { $ne: UserType.ADMIN };
    await Utils.addGroupId(query, req)
    const roles = await Model.findAll(RoleModel, query, { _id: 1, name: 1 }, { sort: { _id: -1 } });
    if (!roles) throw new NotFoundResponse('role:failure.list');
    return { roles };
  };


}

export default new RoleService();
