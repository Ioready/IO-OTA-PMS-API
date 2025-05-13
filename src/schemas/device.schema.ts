import mongoose, { ObjectId, Schema } from "mongoose";
import { Utils } from "../lib/utils";

interface IDevice extends Document {
    user: ObjectId,
    deviceId: string,
    ip: string,
    userAgent: string
    keepMeSigned: any


}
const DeviceSchema = new Schema<IDevice>({
    user: { type: mongoose.Schema.Types.ObjectId, default: null },
    deviceId: String,
    ip: String,
    userAgent: String,
    keepMeSigned: { type: Boolean, default: false }

}, Utils.returnSchemaOption());

const DeviceModel = mongoose.model("device", DeviceSchema);

export { IDevice, DeviceModel };