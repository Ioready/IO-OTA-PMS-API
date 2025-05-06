import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";

interface IRole extends Document {
    category: string,
    priority: string,
    subject: string,
    description: string,
    status: string,
}
const RoleSchema = new Schema<IRole>({
    category: String,
    priority: String,
    subject: String,
    description: String,
    status: String,
}, Utils.returnSchemaOption());

const RoleModel = mongoose.model("role", RoleSchema);

export { IRole, RoleModel };