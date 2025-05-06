import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { config } from '../config/env.config';

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

    getSignedJwtToken = (data: any) => {
        return jwt.sign({ id: data._id }, config.jwt.secret!, {
            expiresIn:  config.jwt.expiresIn,
        });
    };

    encryptPassword = async (password: any) => {
        return await bcrypt.hash(password, await bcrypt.genSalt(10))
    };


}
export const Utils = new UtilsClass();
