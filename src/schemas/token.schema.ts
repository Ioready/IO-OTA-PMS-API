import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";

interface IToken extends Document {
    token: string,

}
const TokenSchema = new Schema<IToken>({
    token: String,

}, Utils.returnSchemaOption());

const TokenModel = mongoose.model("token", TokenSchema);

export { IToken, TokenModel };