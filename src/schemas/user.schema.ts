import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";

interface IUser extends Document {
    name: string,
    email: string,
    password: string,
}

const UserSchema = new Schema<IUser>({
    name: String,
    email: String,
    password: { type: String },
}, Utils.returnSchemaOption());

const UserModel = mongoose.model("user", UserSchema);

export { IUser, UserModel };