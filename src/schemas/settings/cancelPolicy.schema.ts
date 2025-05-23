import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { Utils } from "../../lib/utils";
import { CancelPolicy, CommonStatus } from "../../resources";

interface ICustomPolicy {
    noOfDayBefore: number;
    percentage: string;
}

interface ICancelPolicy extends Document {
    name: string;
    type: string;
    percentage?: string;
    property: ObjectId;
    description?: string;
    custom?: ICustomPolicy;
    status: string;
}

const CustomPolicySchema = new Schema<ICustomPolicy>(
    {
        noOfDayBefore: Number,
        percentage: String,
    },
    { _id: false } // avoid creating an _id for nested schema
);

const CancelPolicySchema = new Schema<ICancelPolicy>(
    {
        name: { type: String, required: true },
        type: {
            type: String,
            enum: Object.values(CancelPolicy),
            required: true,
        },
        percentage: {
            type: String,
            required: [
                function (this: any) {
                    return this.type === CancelPolicy.PERCENTAGE;
                },
                'cancelPolicy:failure.percentage'
            ],
        },

        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "property",
            required: true,
        },
        description: String,
        custom: {
            type: CustomPolicySchema,
            required: [
                function (this: any) {
                return this.type === CancelPolicy.CUSTOM;
                },
                "cancelPolicy:failure.custom"
            ],
        },
        status: {
            type: String,
            enum: Object.values(CommonStatus),
            default: CommonStatus.ACTIVE,
        },
    },
    Utils.returnSchemaOption()
);

const CancelPolicyModel = mongoose.model<ICancelPolicy>(
    "cancel_policy",
    CancelPolicySchema
);

export { ICancelPolicy, CancelPolicyModel };
