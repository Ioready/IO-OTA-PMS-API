import { BadRequestResponse, NotFoundResponse } from "http-errors-response-ts/lib";
import { Utils } from "../../lib/utils";
import { bodyValidation } from "../../middleware/validation";
import { DeviceModel, UserModel } from "../../schemas";
import { Request, Response } from "express";

class UserService {
    changePassword = async (req: Request, res: Response) => {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;
        let validateErr: any = bodyValidation(["oldPassword", "newPassword"], req, res)
        if (!validateErr) return;

        const user: any = await UserModel.findOne({ _id: userId }).select("+password");
        if (!user) {
            throw new NotFoundResponse('user:failure.detail');
        }

        let isMatch = await Utils.comparePassword(oldPassword, user?.password);
        if (!isMatch) throw new NotFoundResponse('user:failure.oldPwd')

        let checkPwd = await Utils.comparePassword(newPassword, user?.password);
        if (checkPwd) throw new BadRequestResponse('user:failure.sameAsPwd')

        user.password = await Utils.encryptPassword(newPassword);
        await user.save({ validateBeforeSave: false });
        
        await DeviceModel.deleteMany({ user: user._id, deviceId: { $ne: req.deviceId } })

        return user;

    }
}
export default new UserService();