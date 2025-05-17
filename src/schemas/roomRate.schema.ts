import mongoose, { Schema, ObjectId } from "mongoose";
import { Utils } from "../lib/utils";

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
    cancellationPolicy: ObjectId

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
    date: Date,
    status: { type: String, enum: ["active", "inactive"] },

}, Utils.returnSchemaOption());

const RatePlanModel = mongoose.model("rateplan", RatePlanSchema);

export { IRatePlan, RatePlanModel };