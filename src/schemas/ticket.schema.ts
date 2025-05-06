import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";

interface ITicket extends Document {
    category: string,
    priority: string,
    subject: string,
    description: string,
    status: string,
}
const TicketSchema = new Schema<ITicket>({
    category: String,
    priority: String,
    subject: String,
    description: String,
    status: String,
}, Utils.returnSchemaOption());

const TicketModel = mongoose.model("ticket", TicketSchema);

export { ITicket, TicketModel };