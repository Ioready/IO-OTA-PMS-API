
import { ConflictResponse, NotFoundResponse, UnauthorizedResponse } from '../../lib/decorators';
// import { bodyValidation, } from '../../middleware/validation';
// import { NotFoundResponse } from "http-errors-response-ts/lib";
import { Request, Response } from "express"
import { UserModel } from '../../schemas';
import { Msg } from '../../resources';
import { Utils } from '../../lib/utils';

class AuthService {
    // @ts-ignore
    getUser(req, res) {
        const user = "SSS"
        if (!user)
            throw new NotFoundResponse(Msg.user404)
        return user;
    }

    // @ts-ignore
    createUser = async (req: Request, res: Response) => {
        // let validateErr: any = bodyValidation(["username", "pass"], req, res)
        // console.log(validateErr);

        // if (validateErr) return;
        const data = req.body;
        data.password = await Utils.encryptPassword(data.password)
        const user = await UserModel.create(data);
        if (!user) throw new ConflictResponse(Msg.userCreated404)
        return user
    }
    login = async (req: Request) => {
        let data = req.body;
        // let validateErr: any = bodyValidation(["username", "pass"], req, res)
        // console.log(validateErr);

        // if (validateErr) return;

        let user: any = await UserModel.findOne({ email: data.email });
        if (!user) throw new NotFoundResponse(Msg.email404)

        let hashPass = await Utils.comparePassword(data.password, user.password);
        if (!hashPass) throw new UnauthorizedResponse(Msg.password404)

        const token = Utils.getSignedJwtToken(user);

        return { user, token }
    }



}

export default new AuthService();