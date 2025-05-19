import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";

interface IProperty extends Document {
    name: string,
    type: string,
    country: string,
    email: string,
    phoneType: string,
    phone: any,
    address: any,
    description: string,
    currency: string,
    timezone: string,
    checkIn: Date,
    checkOut: Date,
    ownerInfo: any,
    tax: any,
    licenseNumber: string,
    mersis: string,
    amenities: any,
    step: number,
    groupId: any,
    coordinate: any,
    status: string,
}

const ownerInfoSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    phone: Utils.returnPhoneSchema(),
    notifymail: Boolean
}, { _id: false });

const addressSchema = new Schema({
    floor: String,
    line: String,
    province: String,
    district: String,
    country: String,
    postalCode: String
}, { _id: false });

const PropertySchema = new Schema<IProperty>({
    name: String,
    type: String,
    country: String,
    email: String,
    phoneType: String,
    phone: Utils.returnPhoneSchema(),
    address: addressSchema,
    description: String,
    currency: String,
    coordinate: String,
    timezone: String,
    checkIn: Date,
    checkOut: Date,
    ownerInfo: ownerInfoSchema,
    tax: {
        kdv: String,
        vkn: String
    },
    licenseNumber: String,
    mersis: String,
    amenities: Object,
    step: Number,
    groupId: { type: mongoose.Schema.Types.ObjectId, default: null },
    status: String,

}, Utils.returnSchemaOption());

const PropertyModel = mongoose.model("property", PropertySchema);

export { IProperty, PropertyModel };