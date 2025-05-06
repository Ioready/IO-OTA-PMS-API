import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";

interface IProperty extends Document {
    category: string,
    priority: string,
    subject: string,
    description: string,
    status: string,
}
const PropertySchema = new Schema<IProperty>({
    category: String,
    priority: String,
    subject: String,
    description: String,
    status: String,
}, Utils.returnSchemaOption());

const PropertyModel = mongoose.model("property", PropertySchema);

export { IProperty, PropertyModel };