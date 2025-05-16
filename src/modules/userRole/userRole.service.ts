import { ConflictResponse, NotFoundResponse } from "../../lib/decorators";
import { Request } from "express";
import { UserModel } from "../../schemas";
import { CommonStatus, Msg, UserType } from "../../resources";
import { Model } from "../../lib/model";
import { Utils } from "../../lib/utils";



class UserRoleService {

    createUserRole = async (req: Request) => {
        const data = req.body;

        data.groupId = req.user.groupId
        data.type = UserType.USER
        const exEmail = await UserModel.findOne({ email: data.email });
        if (exEmail) throw new ConflictResponse(Msg.emailExist);

        const role = await UserModel.create(data);
        if (!role) throw new ConflictResponse(Msg.userCreated404);
        return role;
    }


    editUserRole = async (req: Request) => {
        const data = req.body;

        const userRole = await Model.findOneAndUpdate(UserModel, { _id: req.params.id }, data);
        if (!userRole) throw new NotFoundResponse(Msg.userUpdated404)
        return userRole;
    }

    getUserRole = async (id: any) => {
        const userRole = await Model.findOne(UserModel, { _id: id });
        if (!userRole) throw new NotFoundResponse(Msg.user404);
        return { userRole };
    }

    deleteUserRole = async (id: any) => {
        const UserRole = await UserModel.findOneAndUpdate({ _id: id }, { isDeleted: true });
        if (!UserRole) throw new NotFoundResponse(Msg.userDeleted404);
        return UserRole;
    }

    listUserRole = async (req: Request) => {
        const query: any = req.query;

        query.type = query.type === UserType.USER ? UserType.USER : UserType.HOUSEKEEPING;
        query.isDeleted = false;

        const userRole = await Model.find(UserModel, query, {})
        if (!userRole) throw new NotFoundResponse(Msg.user404);
        return { userRole: userRole.data, total: userRole.total };
    }

    listHousekeeping = async (req: Request) => {
        const query: any = req.query;

        query.type = UserType.HOUSEKEEPING;
        query.isDeleted = false;

        const housekeepings = await Model.findAll(UserModel, query, { _id: 1, fullName: 1 }, { sort: { _id: -1 } })
        if (!housekeepings) throw new NotFoundResponse(Msg.housekeepings404);
        return { housekeepings };
    }

}


export default new UserRoleService();
