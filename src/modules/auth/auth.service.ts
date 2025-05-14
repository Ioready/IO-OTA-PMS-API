
import { ConflictResponse, ForbiddenResponse, GoneResponse, InternalServerResponse, NotFoundResponse, UnauthorizedResponse } from '../../lib/decorators';
// import { bodyValidation, } from '../../middleware/validation';
// import { NotFoundResponse } from "http-errors-response-ts/lib";
import { Request, Response } from "express"
import { TokenModel, UserModel } from '../../schemas';
import { LoginType, Msg } from '../../resources';
import { Utils } from '../../lib/utils';
import { config } from '../../config/env.config';
import { CONSTANTS } from '../../lib/constants';
import { bodyValidation } from '../../middleware/validation';
// import { config } from '../../config/env.config';
import { OAuth2Client } from 'google-auth-library';

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

        // let validateErr: any = bodyValidation(["fullName", "email"], req, res)
        // if (!validateErr) return
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
        if (!user) throw new UnauthorizedResponse(Msg.invalidCred)

        let hashPass = await Utils.comparePassword(data.password, user.password);
        if (!hashPass) throw new UnauthorizedResponse(Msg.invalidCred)
        Utils.createDevice(user, req, res);
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
                throw new GoneResponse(Msg.tokenExpired)
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
        user.otpExpiry = Date.now() + CONSTANTS.otpExpiry;
        user.save();
        //mail sent

        // return user;
        // const token = Utils.getSignedJwtToken({ id: user._id, role: user.role }, config.jwt.expiresIn);
        // return { token }
        const token = Utils.generateToken(user, res);
        return token;

    }

    forgotPassword = async (req: Request) => {

        const user: any = await UserModel.findOne({ email: req.body.email });
        if (!user) throw new NotFoundResponse(Msg.user404)
        Utils.generateTokenAndMail(user, "forgot")
        return true;

    }

    setPassword = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        let validateErr: any = bodyValidation(["email", "password"], req, res)
        if (!validateErr) return;

        const user: any = await UserModel.findOne({ email: email });
        if (!user) throw new NotFoundResponse(Msg.user404)

        user.password = await Utils.encryptPassword(password);
        user.isVerified = true;
        user.lastLogin = new Date();
        user.save();
        const deviceId = await Utils.createDevice(user, req, res);

        const tokenDoc = Utils.generateToken(user, res);
        await Utils.updateKeepsignToken(user, deviceId, req, res)
        return tokenDoc;
    }


    verifyOtp = async (req: Request, res: Response) => {
        const { email, otp } = req.body;

        let validateErr: any = bodyValidation(["email", "otp"], req, res)
        if (!validateErr) return;

        const user: any = await UserModel.findOne({ email: email });
        if (!user) throw new NotFoundResponse(Msg.user404)

        if (user.otp != otp) throw new NotFoundResponse(Msg.invalidOtp)
        if (user.otpExpiry < new Date()) throw new GoneResponse(Msg.otp404)
        user.otp = "";
        user.otpExpiry = "";
        user.lastLogin = new Date();

        await user.save();
        await Utils.updateKeepsignToken(user, req.cookies.deviceId, req, res)
        return Utils.generateToken(user, res);
    }


    refreshToken = async (req: Request, res: Response) => {
        try {
            const token = req.cookies?.refreshToken;

            if (!token) throw new UnauthorizedResponse(Msg.refresh404)
            const decoded = Utils.verifyToken(token);
            const user: any = await UserModel.findOne({ _id: decoded.id });
            if (!user) throw new NotFoundResponse(Msg.user404)
            const accessToken = Utils.generateToken(user, res);
            return accessToken;


        } catch (err) {
            throw new ForbiddenResponse(Msg.invalid404)
        }
    }

    // oAuth = () => {
    //     

    //     const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    //     async function verifyGoogleToken(idToken: string) {
    //         const ticket = await client.verifyIdToken({
    //             idToken,
    //             audience: process.env.GOOGLE_CLIENT_ID,
    //         });
    //         const payload = ticket.getPayload();
    //         return payload; // contains email, sub, name, etc.
    //     }

    // }

    oAuthsignIn = async (req: Request, res: Response) => {
        const data = req.body;
        const userData = await Utils.getGoogleAuth(data.access_token)
        let user: any;
        if (userData) {
            user = await UserModel.findOne({ email: userData.email })
            if (!user) {
                const userObj: any = {
                    groupId: await Utils.newObjectId(),
                    fullName: userData.name,
                    email: userData.email,
                    isVerified: true,
                    loginType: LoginType.GOOGLE,
                    lastLogin: new Date()
                };

                user = await UserModel.create(userObj);
            }
            const deviceId = await Utils.createDevice(user, req, res);
            const tokenDoc = Utils.generateToken(user, res);
            await Utils.updateKeepsignToken(user, deviceId, req, res)
            return tokenDoc;
        }

    }

}

export default new AuthService();