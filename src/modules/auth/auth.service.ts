
import { ConflictResponse, ForbiddenResponse, GoneResponse, NotFoundResponse, UnauthorizedResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { DeviceModel, TokenModel, UserModel } from '../../schemas';
import { LoginType, Msg } from '../../resources';
import { Utils } from '../../lib/utils';
import { config } from '../../config/env.config';
import { CONSTANTS } from '../../lib/constants';
import { bodyValidation } from '../../middleware/validation';
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
        const exUser = await UserModel.findOne({ email: data.email })
        if (exUser) throw new ConflictResponse('user:failure.email')

        data.groupId = await Utils.newObjectId()
        const user = await UserModel.create(data);
        if (!user) throw new ConflictResponse('user:failure.create')
        Utils.generateTokenAndMail(user, "create")

        return user
    }
    login = async (req: Request, res: Response) => {
        const data = req.body;
        let validateErr: any = bodyValidation(["email", "password"], req, res)
        if (!validateErr) return;

        const user: any = await UserModel.findOne({ email: data.email }).select("+password");
        if (!user) throw new UnauthorizedResponse('user:failure.invalidCred')

        let hashPass = await Utils.comparePassword(data.password, user.password);
        if (!hashPass) throw new UnauthorizedResponse('user:failure.invalidCred')
        await Utils.setCookies('keepMeSigned', data.keepMeSigned ?? false, config.cookie.oneHour, res);
        return this.sendOtp(user)
    }


    verifyAndExpiryUrl = async (req: Request) => {
        try {
            const { token: rawToken, type: checkType } = req.query;
            const token = await TokenModel.findOne({ token: rawToken });
            if (!token) throw new NotFoundResponse('user:failure.invalidToken')
            const decoded = Utils.verifyToken(rawToken);
            const { id, type } = (decoded as { id: string, type: string });

            const user: any = await UserModel.findOne({ _id: id });
            if (!user) throw new NotFoundResponse('user:failure.account')
            if (checkType === 'verify') {
                return { email: user.email, type: type, url: checkType }
            }
            if (checkType === 'expiry') {
                await TokenModel.deleteOne({ token: rawToken })
                return { type: type, url: checkType };
            }

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new GoneResponse('user:failure.tokenExpired')
            } else {
                throw new NotFoundResponse('user:failure.invalidToken')
            }
        }
    }

    resendOtp = async (req: Request) => {
        const user: any = await UserModel.findOne({ email: req.body.email });
        if (!user) throw new NotFoundResponse('user:failure.account')
        return this.sendOtp(user)
    }

    sendOtp = async (user: any) => {
        var otp: string;
        if (config.app.env === "development")
            otp = CONSTANTS.defaultOtp;
        else otp = Utils.generateVerificationCode()
        user.otp = otp;
        user.otpExpiry = Date.now() + CONSTANTS.otpExpiry;
        await user.save({ validateBeforeSave: false });

        // ZohoApi.sendMailTemplate(user.email, user.fullName, config.zeptoMail.template.otp, { OTP: otp, product: "Otlesoft" })

        // return user;
        // const token = Utils.getSignedJwtToken({ id: user._id, role: user.role }, config.jwt.expiresIn);
        // return { token }
        // const token = Utils.generateToken(user, res);
        return user;

    }

    forgotPassword = async (req: Request, type: string) => {

        const user: any = await UserModel.findOne({ email: req.body.email });
        if (!user) throw new NotFoundResponse('user:failure.account')
        Utils.generateTokenAndMail(user, type)
        return true;

    }

    setPassword = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        let validateErr: any = bodyValidation(["email", "password"], req, res)
        if (!validateErr) return;

        const user: any = await UserModel.findOne({ email: email });
        if (!user) throw new NotFoundResponse('user:failure.account')

        user.password = await Utils.encryptPassword(password);
        user.isVerified = true;
        await user.save();
        await this.sendOtp(user);
        await DeviceModel.deleteMany({ user: user._id })
        // const deviceId = await Utils.createDevice(user, req, res);

        // const tokenDoc = Utils.generateToken(user, res);
        // await Utils.updateKeepsignToken(user, deviceId, res)
        return user;
    }


    verifyOtp = async (req: Request, res: Response) => {
        const { email, otp } = req.body;

        let validateErr: any = bodyValidation(["email", "otp"], req, res)
        if (!validateErr) return;

        const user: any = await UserModel.findOne({ email: email });
        if (!user) throw new NotFoundResponse('user:failure.account')

        if (user.otp != otp) throw new NotFoundResponse('user:failure.invalidOtp')
        if (user.otpExpiry < new Date()) throw new GoneResponse('user:failure.otp')
        // user.otp = "";
        // user.otpExpiry = "";
        user.lastLogin = new Date();

        await user.save();
        const deviceId = await Utils.createDevice(user, req);
        await Utils.updateKeepsignToken(user, deviceId, res)
        return Utils.generateToken(user, deviceId, res);
    }


    refreshToken = async (req: Request, res: Response) => {
        try {
            const token = req.cookies?.refreshToken;

            if (!token) throw new UnauthorizedResponse('user:failure.refresh')
            const decoded = Utils.verifyToken(token);
            const { deviceId } = (decoded as { deviceId: string });

            const user: any = await UserModel.findOne({ _id: deviceId });
            if (!user) throw new NotFoundResponse('user:failure.account')
            const accessToken = Utils.generateToken(user, deviceId, res);
            return accessToken;


        } catch (err) {
            throw new ForbiddenResponse('user:failure.invalid')
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
            const deviceId = await Utils.createDevice(user, req);
            const tokenDoc = Utils.generateToken(user, deviceId, res);
            await Utils.updateKeepsignToken(user, deviceId, res)
            return tokenDoc;
        }

    }

}

export default new AuthService();