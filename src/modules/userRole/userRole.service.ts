import { ConflictResponse, NotFoundResponse } from "../../lib/decorators";
import { Request } from "express";
import { UserModel } from "../../schemas";
import { UserType } from "../../resources";
import { Model } from "../../lib/model";


class UserRoleService {

    createUserRole = async (req: Request) => {
        const data = req.body;

        data.groupId = req.user.groupId
        data.type = UserType.USER
        const exEmail = await UserModel.findOne({ email: data.email });
        if (exEmail) throw new ConflictResponse('user:failure.emailExist');

        // const role = await UserModel.create(data);
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
        const user = await Model.findOne(UserModel, { _id: id });
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

        query.type = query.type === UserType.USER ? UserType.USER : UserType.HOUSEKEEPING;
        query.isDeleted = false;

        const users = await Model.find(UserModel, query, {})
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
