import mongoose, { Schema, ObjectId } from "mongoose";
import { Utils } from "../lib/utils";
import { LostAndFoundStatus } from "../resources";

interface ILostAndFound extends Document {
    item: string,
    room: ObjectId,
    reportPerson: ObjectId,
    property: ObjectId,
    attachment: any,
    remarks: string
    status: any,
}
const LostAndFoundSchema = new Schema<ILostAndFound>({
    item: String,
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    reportPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "property",
    },
    attachment: [String],
    remarks: String,
    status: {type: String, default: LostAndFoundStatus.FOUND, enum: Object.values(LostAndFoundStatus)},
}, Utils.returnSchemaOption());

const LostAndFoundModel = mongoose.model("lost_found", LostAndFoundSchema);

export { ILostAndFound, LostAndFoundModel };