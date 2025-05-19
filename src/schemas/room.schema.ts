import mongoose, { Schema, ObjectId } from "mongoose";
import { Utils } from "../lib/utils";
import { CommonStatus } from "../resources";

interface IRoom extends Document {
    floor: ObjectId,
    roomType: ObjectId,

    roomNumber: string,
    status: string,
    notes: string
}
const RoomSchema = new Schema<IRoom>({


    floor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "floor"
    },
    roomType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roomtype",
    },

    roomNumber: String,
    status: { type: String, enum: [CommonStatus.ACTIVE, CommonStatus.INACTIVE], default: CommonStatus.ACTIVE },
    notes: String
}, Utils.returnSchemaOption());

const RoomModel = mongoose.model("room", RoomSchema);

export { IRoom, RoomModel };