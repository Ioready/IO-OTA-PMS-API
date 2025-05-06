import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";

interface IFloor extends Document {
    category: string,
    priority: string,
    subject: string,
    description: string,
    status: string,
}
const FloorSchema = new Schema<IFloor>({
    category: String,
    priority: String,
    subject: String,
    description: String,
    status: String,
}, Utils.returnSchemaOption());

const FloorModel = mongoose.model("floor", FloorSchema);

export { IFloor, FloorModel };