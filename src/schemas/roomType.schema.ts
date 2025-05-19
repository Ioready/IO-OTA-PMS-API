import mongoose, { ObjectId, Schema } from "mongoose";
import { Utils } from "../lib/utils";


interface IRoomType extends Document {
    property: ObjectId,
    name:string,
    type: string,
    maxGuest: number,
    maxChild: number,
    minStay: number,
    maxStay: number,
    squareFeet: string,
    rate: string,
    description: string,
    images: any,
    amenities: any,
    status: string
}
const roomTypeSchema = new Schema<IRoomType>({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "property"
    },
    name: { type:String, required: [true, "Name is required"] },
    type: String,
    maxGuest: Number,
    maxChild: Number,
    minStay: Number,
    maxStay: Number,
    squareFeet: String,
    rate: String,
    description: String,
    images: [String],
    amenities: Object,
    status: String,
}, Utils.returnSchemaOption());

const RoomTypeModel = mongoose.model("roomtype", roomTypeSchema);

export { IRoomType, RoomTypeModel };