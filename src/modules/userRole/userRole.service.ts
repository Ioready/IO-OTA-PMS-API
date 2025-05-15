import { ConflictResponse, NotFoundResponse } from "../../lib/decorators";
import { Request } from "express";
import { UserModel } from "../../schemas";
import { Msg, UserType } from "../../resources";
import { Model } from "../../lib/model";



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


}


export default new UserRoleService();
