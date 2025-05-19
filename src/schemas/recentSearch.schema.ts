import mongoose, { Schema, ObjectId } from "mongoose";
import { Utils } from "../lib/utils";

interface IRecentSearch extends Document {
    name: string,
    type: string,
    property:ObjectId
    
}
const RecentSearchSchema = new Schema<IRecentSearch>({

    name: String,
    type: String,
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "property",
    },
}, Utils.returnSchemaOption());

const RecentSearchaModel = mongoose.model("recent_search", RecentSearchSchema);

export { IRecentSearch, RecentSearchaModel };