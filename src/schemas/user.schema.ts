import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";
import { ObjectId } from "mongoose";

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
    status: string,
}

const UserSchema = new Schema<IUser>({
    name: String,
    fullName: String,
    email: { type: String, index: { unique: true }, },
    password: { type: String },
    isVerified: Boolean,
    role: { type: mongoose.Schema.Types.ObjectId, ref: "role", default: null },
    groupId: { type: mongoose.Schema.Types.ObjectId, default: null },
    type: { type: String, default: "admin" },
    otp: String,
    status: String,

}, Utils.returnSchemaOption());

const UserModel = mongoose.model("user", UserSchema);

export { IUser, UserModel };