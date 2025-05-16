import mongoose, { Schema } from "mongoose";
import { Utils } from "../lib/utils";
import { CommonStatus } from "../resources";

interface IRole extends Document {
  name: string;
  access: any;
  description: string;
  status: string;
  groupId: any;
  isDeleted: boolean;
}
const RoleSchema = new Schema<IRole>(
  {
    name: String,
    access: Object,
    description: String,
    groupId: { type: mongoose.Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [CommonStatus.ACTIVE, CommonStatus.INACTIVE],
    },
  },
  Utils.returnSchemaOption()
);

const RoleModel = mongoose.model("role", RoleSchema);

export { IRole, RoleModel };
