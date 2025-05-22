import mongoose, { Schema, ObjectId } from "mongoose";
import { Utils } from "../lib/utils";
import { RoomStatus } from "../resources";

interface ITask extends Document {

    room: ObjectId,
    assignTo: ObjectId,
    priority: ObjectId,
    property: ObjectId,
    notes: any,
    date: any,
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
        enum: ["low", "normal", "high"]
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "property",
    },
    notes: String,
    date: {
        from: String,
        to: String
    },
    status: {
        type: String,
        enum: Object.values(RoomStatus)
    },
}, Utils.returnSchemaOption());

const TaskModel = mongoose.model("task", TaskSchema);

export { ITask, TaskModel };
