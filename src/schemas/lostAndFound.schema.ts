import mongoose, { Schema, ObjectId } from "mongoose";
import { Utils } from "../lib/utils";

interface ILostAndFound extends Document {
    item: string,
    room: ObjectId,
    assignTo: ObjectId,
    property: ObjectId,
    attachment: any,
    remarks: string
    status: string,
}
const LostAndFoundSchema = new Schema<ILostAndFound>({
    item: String,
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "property",
    },
    attachment: [String],
    remarks: String,
    status: String,
}, Utils.returnSchemaOption());

const LostAndFoundModel = mongoose.model("lost_found", LostAndFoundSchema);

export { ILostAndFound, LostAndFoundModel };