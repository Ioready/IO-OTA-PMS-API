import mongoose, { Schema, ObjectId } from "mongoose";
import { Utils } from "../lib/utils";

interface IFloor extends Document {
    name: string,
    manager: ObjectId,
    property: ObjectId,
}
const FloorSchema = new Schema<IFloor>({

    name: String,
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "property",
    },
}, Utils.returnSchemaOption());

const FloorModel = mongoose.model("floor", FloorSchema);

export { IFloor, FloorModel };