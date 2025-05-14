import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";
import { ObjectId } from "mongoose";
import { LoginType } from "../resources";

interface IUser extends Document {
    name: string,
    fullName: string,
    email: string,
    password: string,
    isVerified: boolean,
    role: ObjectId,
    groupId: ObjectId,
    type: string,
    otp: string,
    otpExpiry: any,
    loginType: string,
    lastLogin: any,

    status: string,

}

const UserSchema = new Schema<IUser>({
    name: String,
    fullName: { type: String },
    email: String,
    password: {
        type: String, select: false,
        minlength: 8,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
        ],
    },
    isVerified: Boolean,
    role: { type: mongoose.Schema.Types.ObjectId, ref: "role", default: null },
    groupId: { type: mongoose.Schema.Types.ObjectId, default: null },
    type: { type: String, default: "admin" },
    otp: String,
    otpExpiry: Date,
    loginType: { type: String, default: LoginType.NORMAL },
    lastLogin: Date,
    status: String,

}, Utils.returnSchemaOption());

const UserModel = mongoose.model("user", UserSchema);

export { IUser, UserModel };