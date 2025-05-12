
import { ConflictResponse, InternalServerResponse, NotFoundResponse, UnauthorizedResponse } from '../../lib/decorators';
// import { bodyValidation, } from '../../middleware/validation';
// import { NotFoundResponse } from "http-errors-response-ts/lib";
import { Request, Response } from "express"
import { TokenModel, UserModel } from '../../schemas';
import { Msg } from '../../resources';
import { Utils } from '../../lib/utils';
import { config } from '../../config/env.config';
import { CONSTANTS } from '../../lib/constants';
import { bodyValidation } from '../../middleware/validation';
// import { config } from '../../config/env.config';

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
        const data = req.body;

        let validateErr: any = bodyValidation(["fullName", "email"], req, res)
        if (!validateErr) return
        // data.password = await Utils.encryptPassword(data.password)
        const exUser = await UserModel.findOne({ email: data.email })
        if (exUser) throw new ConflictResponse(Msg.email404)

        data.groupId = await Utils.newObjectId()
        const user = await UserModel.create(data);
        if (!user) throw new ConflictResponse(Msg.userCreated404)
        Utils.generateTokenAndMail(user, "create")

        return user
    }
    login = async (req: Request, res: Response) => {
        const data = req.body;
        // let validateErr: any = bodyValidation(["username", "pass"], req, res)
        // console.log(validateErr);

        // if (validateErr) return;

        const user: any = await UserModel.findOne({ email: data.email });
        if (!user) throw new NotFoundResponse(Msg.email404)

        let hashPass = await Utils.comparePassword(data.password, user.password);
        if (!hashPass) throw new UnauthorizedResponse(Msg.password404)

        return this.sendOtp(user, res)
    }


    verifyAndExpiryUrl = async (req: Request) => {
        try {
            const { token: rawToken, type } = req.query;
            const token = await TokenModel.findOne({ token: rawToken });
            if (!token) throw new NotFoundResponse(Msg.invalidToken)
            const decoded = Utils.verifyToken(rawToken);
            const user: any = await UserModel.findOne({ _id: decoded.id });
            if (!user) throw new NotFoundResponse(Msg.user404)
            if (type === 'verify') {
                return { email: user.email, type }
            }
            if (type === 'expiry') {
                await TokenModel.deleteOne({ token: rawToken })
                return { type };
            }

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedResponse(Msg.tokenExpired)
            } else {
                throw new NotFoundResponse(Msg.invalidToken)
            }
        }
    }

    resendOtp = async (req: Request, res: Response) => {
        const user: any = await UserModel.findOne({ email: req.body.email });
        if (!user) throw new NotFoundResponse(Msg.user404)
        return this.sendOtp(user, res)
    }

    sendOtp = async (user: any, res: Response) => {

        var otp: string;
        if (config.app.env === "development")
            otp = CONSTANTS.defaultOtp;
        else otp = Utils.generateVerificationCode()
        user.otp = otp;
        user.save();
        //mail sent

        return user;
        // const token = Utils.getSignedJwtToken({ id: user._id, role: user.role }, config.jwt.expiresIn);
        // return { token }
        // const token = Utils.generateToken(user, res);
        // return token;

    }

    forgotPassword = async (req: Request) => {
        try {

            const user: any = await UserModel.findOne({ email: req.body.email });
            if (!user) throw new NotFoundResponse(Msg.user404)
            // this.generateTokenAndMail(user, "forgot")
            return true;
        } catch (err) {
            throw new InternalServerResponse(err.Message)
        }
    }

    setPassword = async (req: Request, res) => {
        try {
            const { email, password } = req.body;

            let validateErr: any = bodyValidation(["email", "password"], req, res)
            if (!validateErr) return;

            const user: any = await UserModel.findOne({ email: email });
            if (!user) throw new NotFoundResponse(Msg.user404)

            user.password = await Utils.encryptPassword(password);
            user.isVerified = true;
            user.save();
            const tokenDoc = Utils.generateToken(user, res);
            return tokenDoc;
        } catch (err) {
            // if (err.name === 'TokenExpiredError') {
            //     throw new UnauthorizedResponse(Msg.tokenExpired)
            // } else {
            //     throw new UnauthorizedResponse(Msg.invalidToken)
            // }
            throw new InternalServerResponse(err.Message)

        }
    }


    verifyOtp = async (req: Request, res) => {
        const { email, otp } = req.body;

        let validateErr: any = bodyValidation(["email", "otp"], req, res)
        if (!validateErr) return;

        const user: any = await UserModel.findOne({ email: email });
        if (!user) throw new NotFoundResponse(Msg.user404)

        if (user.otp != otp) throw new NotFoundResponse(Msg.invalidOtp)
        user.otp = "";
        await user.save();
        return Utils.generateToken(user, res);
    }



}

export default new AuthService();