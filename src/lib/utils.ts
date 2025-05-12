import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { config } from '../config/env.config';
import { TokenModel } from '../schemas';
import mongoose from 'mongoose';

class UtilsClass {
    constructor() { }

    returnSchemaOption = () => {
        return {
            versionKey: false,
            timestamps: true
        }
    }

    comparePassword = async (password: string, existingPassword: string) => {
        return await bcrypt.compare(password, existingPassword)
    }

    // getSignedJwtToken = (data: any) => {
    //     return jwt.sign({ id: data._id }, config.jwt.secret!, {
    //         expiresIn: config.jwt.expiresIn,
    //     });
    // };

    encryptPassword = async (password: any) => {
        return await bcrypt.hash(password, await bcrypt.genSalt(10))
    };

    getSignedJwtToken = (payload: any, expiresIn: any) => {
        return jwt.sign(payload, config.jwt.secret!, {
            expiresIn
        });
    };

    verifyToken = (payload: any) => {
        return jwt.verify(payload, config.jwt.secret!,);
    };


    generateVerificationCode = () => {
        var digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let OTP = "";
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    };

    generateToken = async (user: any, res: any) => {

        const tokens = await this.generateTokens({
            id: user._id,
            type: user.type,
            role: user.role
        });

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: config.jwt.cookieExpiry,
        });
        return { accessToken: tokens.accessToken }
    }

    generateTokens = async (payload: any) => {
        const accessToken = this.getSignedJwtToken(payload, config.jwt.expiresIn);
        const refreshToken = this.getSignedJwtToken(payload, config.jwt.refreshTexpiresIn);
        return { accessToken, refreshToken };
    };

    generateTokenAndMail = async (user: any, type: any) => {
        const token = this.getSignedJwtToken({ id: user._id, }, config.jwt.expiresIn);
        await TokenModel.create({ token })
        // const url = `${config.url.base}/ ${type}  ?token=${token}`;
        // //send mail

    }

    returnObjectId = (id: string) => {
        return new mongoose.Types.ObjectId(id)
    }

    newObjectId = () => {
        return new mongoose.Types.ObjectId()
    }


}
export const Utils = new UtilsClass();
