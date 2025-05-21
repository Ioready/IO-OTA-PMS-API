import mongoose, { Schema, ObjectId } from "mongoose";
import { Utils } from "../lib/utils";

interface ITask extends Document {
    
    room: ObjectId,
    assignTo: ObjectId,
    priority: ObjectId,
    notes: any,
    status: string,
}
const TaskSchema = new Schema<ITask>({
    
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "room"
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    priority: {
        type: String,
        enum:["low","normal","high"]
    },
    notes: String,
    status:{
        type: String,
        enum:["dirty","deep clean","inspect","completed"]
    },
}, Utils.returnSchemaOption());

const TaskModel = mongoose.model("task", TaskSchema);

export { ITask, TaskModel };
