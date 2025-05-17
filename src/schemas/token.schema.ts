import mongoose, { ObjectId, Schema } from "mongoose";
import { Utils } from "../lib/utils";

interface IToken extends Document {
    token: string,
    user: ObjectId,
    type: string

}
const TokenSchema = new Schema<IToken>({
    token: String,
    user: { type: mongoose.Schema.Types.ObjectId, default: null },
    type: String


}, Utils.returnSchemaOption());

const TokenModel = mongoose.model("token", TokenSchema);

export { IToken, TokenModel };