
import { BadRequestResponse, ConflictResponse, GoneResponse, NotFoundResponse, UnauthorizedResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { DeviceModel, RoleModel, TokenModel, UserModel } from '../../schemas';
import { LoginType, Msg } from '../../resources';
import { Utils } from '../../lib/utils';
import { config } from '../../config/env.config';
import { CONSTANTS } from '../../lib/constants';
import { bodyValidation } from '../../middleware/validation';
import { ZohoApi } from '../../utils/zohoApi';
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

        data.email = Utils.trimDataAndLower(data.email)
        const exUser = await UserModel.findOne({ email: data.email, accountCreated: true })
        if (exUser) throw new ConflictResponse('user:failure.email')

        const obj = { email: data.email, accountCreated: false }
        const notRegister = await UserModel.findOne(obj)
        if (notRegister) {
            await TokenModel.deleteMany({ user: notRegister._id })
            await RoleModel.deleteMany({ groupId: notRegister.groupId })
        }
        await UserModel.deleteMany(obj)
        data.groupId = await Utils.newObjectId()
        await Utils.initialRoleCreated(data);
        const user = await UserModel.create(data);
        if (!user) throw new ConflictResponse('user:failure.create')
        Utils.generateTokenAndMail(user, "create")

        return user
    }

    login = async (req: Request, res: Response) => {
        const data = req.body;
        data.email = Utils.trimDataAndLower(data.email)

        let validateErr: any = bodyValidation(["email", "password"], req, res)
        if (!validateErr) return;

        const user: any = await UserModel.findOne({ email: data.email, accountCreated: true }).select("+password");
        if (!user || !user.password) {
            throw new UnauthorizedResponse('user:failure.invalidCred');
        }

        let hashPass = await Utils.comparePassword(data?.password, user?.password);
        if (!hashPass) throw new UnauthorizedResponse('user:failure.invalidCred')

        await Utils.setCookies('keepMeSigned', data.keepMeSigned ?? false, config.cookie.oneHour, res);
        return this.sendOtp(user)
    }


    verifyAndExpiryUrl = async (req: Request) => {
        try {
            const { token: rawToken, type: checkType } = req.query;
            const token = await TokenModel.findOne({ token: rawToken });
            if (!token) throw new GoneResponse('user:failure.tokenExpired')
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
        const user: any = await UserModel.findOne({ email: req.body.email, accountCreated: true });
        if (!user) throw new NotFoundResponse('user:failure.account')
        return this.sendOtp(user)
    }

    sendOtp = async (user: any) => {
        var otp: string;
        // if (config.app.env === "development")
        //     otp = CONSTANTS.defaultOtp;
        // else otp = Utils.generateVerificationCode()
        otp = Utils.generateVerificationCode()
        user.otp = otp;
        user.otpExpiry = Date.now() + CONSTANTS.otpExpiry;
        await user.save({ validateBeforeSave: false });

        ZohoApi.sendMailTemplate(user.email, user.fullName, config.zeptoMail.template.otp, { OTP: otp, product: "Otlesoft" })

        // return user;
        // const token = Utils.getSignedJwtToken({ id: user._id, role: user.role }, config.jwt.expiresIn);
        // return { token }
        // const token = Utils.generateToken(user, res);
        return user;

    }

    forgotPassword = async (req: Request, type: string) => {

        const user: any = await UserModel.findOne({ email: Utils.trimDataAndLower(req.body.email), accountCreated: true });
        if (!user) throw new NotFoundResponse('user:failure.account')
        Utils.generateTokenAndMail(user, type)
        return true;

    }

    setPassword = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const { token: rawToken } = req.query;
            console.log(rawToken);

            const token = await TokenModel.findOne({ token: rawToken });
            if (!token)  throw new GoneResponse('user:failure.tokenExpired')
            

            const decoded = Utils.verifyToken(rawToken);
            console.log({ decoded });

            let validateErr: any = bodyValidation(["email", "password"], req, res)
            if (!validateErr) return;

            const user: any = (await UserModel.findOne({ email: Utils.trimDataAndLower(email) }).select("+password"));
            if (!user) throw new NotFoundResponse('user:failure.account')

            if (user.password) {
                let checkPwd = await Utils.comparePassword(password, user?.password);
                if (checkPwd) throw new BadRequestResponse('user:failure.sameAsPwd')
            }

            user.password = await Utils.encryptPassword(password);
            user.isVerified = true;
            user.setPassword = true;
            user.accountCreated = true;
            await user.save({ validateBeforeSave: false });
            await this.sendOtp(user);
            await DeviceModel.deleteMany({ user: user._id })
             await TokenModel.deleteOne({ token: rawToken })
            // const deviceId = await Utils.createDevice(user, req, res);

            // const tokenDoc = Utils.generateToken(user, res);
            // await Utils.updateKeepsignToken(user, deviceId, res)
            return user;
        } catch (err) {

            if (err.name === 'TokenExpiredError') {
                throw new GoneResponse('user:failure.tokenExpired')
            }
            if (err instanceof GoneResponse) {
                throw err;
            }
        }
    }


    verifyOtp = async (req: Request, res: Response) => {
        const { email, otp } = req.body;

        let validateErr: any = bodyValidation(["email", "otp"], req, res)
        if (!validateErr) return;

        const user: any = await UserModel.findOne({ email: Utils.trimDataAndLower(email), accountCreated: true });
        if (!user) throw new NotFoundResponse('user:failure.account')

        if (user.otp != otp) throw new NotFoundResponse('user:failure.invalidOtp')
        if (user.otpExpiry < new Date()) throw new GoneResponse('user:failure.otp')
        user.otp = "";
        user.otpExpiry = "";
        user.lastLogin = new Date();

        await user.save({ validateBeforeSave: false });
        const deviceId = await Utils.createDevice(user, req);
        await Utils.updateKeepsignToken(user, deviceId, res)
        return Utils.generateToken(user, deviceId, res);
    }


    refreshToken = async (req: Request, res: Response) => {
        try {
            const token = req.cookies?.refreshToken;

            if (!token) throw new UnauthorizedResponse('user:failure.refresh')
            const decoded = Utils.verifyToken(token);
            const { deviceId, id } = (decoded as { deviceId: string, id: string });

            const user: any = await UserModel.findOne({ _id: id });
            if (!user) throw new NotFoundResponse('user:failure.account')

            const accessToken = await Utils.generateToken(user, deviceId, res);
            return accessToken;


        } catch (err) {
            if (err instanceof UnauthorizedResponse || err instanceof NotFoundResponse) {
                throw err;
            }
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
                    lastLogin: new Date(),
                    accountCreated: true,
                };

                user = await UserModel.create(userObj);
            }
            const deviceId = await Utils.createDevice(user, req);
            const tokenDoc = Utils.generateToken(user, deviceId, res);
            await Utils.updateKeepsignToken(user, deviceId, res)
            return tokenDoc;
        }

    }

    createResendLink = async (req: Request, type: string) => {

        const user: any = await UserModel.findOne({ email: Utils.trimDataAndLower(req.body.email) });
        if (!user) throw new NotFoundResponse('user:failure.account')
        if (user.accountCreated) throw new NotFoundResponse('user:failure.alreadyAcc')
        Utils.generateTokenAndMail(user, type)
        return true;

    }

}

export default new AuthService();