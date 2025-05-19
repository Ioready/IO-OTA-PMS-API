import { ConflictResponse, NotFoundResponse } from "../../lib/decorators";
import { Request } from "express";
import { UserModel } from "../../schemas";
import { UserType } from "../../resources";
import { Model } from "../../lib/model";
import { Utils } from "../../lib/utils";
import RoleService from "../role/role.service";


class UserRoleService {

    createUserRole = async (req: Request) => {
        const data = req.body;

        data.groupId = req.user.groupId
        data.type = UserType.USER
        const exEmail = await UserModel.findOne({ email: data.email });
        if (exEmail) throw new ConflictResponse('user:failure.emailExist');

        const checkRole = await RoleService.getRole(data.role);
        if (!checkRole) throw new NotFoundResponse('role:failure.detail');

        if (checkRole.type === UserType.HOUSEKEEPING) data.type = UserType.HOUSEKEEPING
        const user = new UserModel(data);
        const savedUser = await user.save({ validateBeforeSave: false });
        if (!savedUser) throw new ConflictResponse('user:failure.create');
        return savedUser;
    }


    editUserRole = async (req: Request) => {
        const data = req.body;
        await this.getUserRole(req.params.id)
        const user = await Model.findOneAndUpdate(UserModel, { _id: req.params.id }, data);
        if (!user) throw new NotFoundResponse('user:failure.update')
        return user;
    }

    getUserRole = async (id: any) => {
        const user = await Model.findOne(UserModel, { _id: id }, { fullName: 1, role: 1, properties: 1, email: 1, });
        if (!user) throw new NotFoundResponse('user:failure.detail');
        return { user };
    }

    deleteUserRole = async (id: any) => {
        await this.getUserRole(id)
        const UserRole = await UserModel.findOneAndUpdate({ _id: id }, { isDeleted: true });
        if (!UserRole) throw new NotFoundResponse('user:failure.delete');
        return UserRole;
    }

    listUserRole = async (req: Request) => {
        const query: any = req.query;
        query.isDeleted = false;
        const projection: any = {
            _id: 1,
            fullName: 1,
            status: 1,
            phone: 1,
            email: 1,

        }
        if (query.type === UserType.HOUSEKEEPING) {
            query.type = UserType.HOUSEKEEPING;
            projection.property = 1;
        } else {
            query.type = UserType.USER
            projection.role = 1;
        }
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { fullName: regExp },
                { "role.name": regExp },
                { "property.name": regExp },
            ];
            delete query.searchText;
        }

        const pipeline = [
            Utils.lookupSelectedField("roles", "role", "_id", { _id: 1, name: 1 }),
            Utils.unwind("$role"),
            { $match: query },
            {
                $addFields: {
                    objectProperties: {
                        $map: {
                            input: "$properties",
                            as: "prop",
                            in: { $toObjectId: "$$prop" }
                        }
                    }
                }
            },
            Utils.lookupSelectedField("properties", "objectProperties", "_id", { _id: 1, name: 1 }, "property"),
            Utils.unwind("$property")
        ];


        let pageLimit = Utils.returnPageLimit(query);
        const users = await Model.aggregate(UserModel, pipeline, projection, pageLimit)



        if (!users) throw new NotFoundResponse('user:failure.list');
        return { users: users.data, total: users.total };
    }

    listHousekeeping = async (req: Request) => {
        const query: any = req.query;

        query.type = UserType.HOUSEKEEPING;
        query.isDeleted = false;

        const housekeepings = await Model.findAll(UserModel, query, { _id: 1, fullName: 1 }, { sort: { _id: -1 } })
        if (!housekeepings) throw new NotFoundResponse('user:failure.housekeepings');
        return { housekeepings };
    }

}


export default new UserRoleService();
