import mongoose, { Schema, ObjectId } from "mongoose";
import { Utils } from "../lib/utils";
import { CommonStatus } from "../resources";

interface IRatePlan extends Document {
    name: string,
    code: string,
    mealPlan: string,
    rate: string,
    by: string,
    sign: string,
    status: string,
    description: string,
    date: any,
    maxExtraChild: number,
    maxExtraGuest: number,
    cancellationPolicy: ObjectId,
    mappedRoomTypes: any,
    property: ObjectId,

}
const RatePlanSchema = new Schema<IRatePlan>({

    name: String,
    code: String,
    mealPlan: String,
    rate: { type: String, enum: ["increase", "decrease"] },
    by: String,
    sign: String,
    description: String,
    maxExtraChild: Number,
    maxExtraGuest: Number,
    cancellationPolicy: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "settings"
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "property"
    },
    date: {
        from: Date,
        to: Date
    },
    mappedRoomTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'room_type' }],
    status: { type: String, enum: [CommonStatus.ACTIVE, CommonStatus.INACTIVE], default: CommonStatus.ACTIVE },

}, Utils.returnSchemaOption());

const RatePlanModel = mongoose.model("rate_plan", RatePlanSchema);

export { IRatePlan, RatePlanModel };