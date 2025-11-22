import { Schema, models, model, Model, Types } from "mongoose";

export interface IWorkspace extends Document {
  account: Types.ObjectId;
  employees: Types.ObjectId[];
}

const workspaceSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "User" },
  employees: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Workspace: Model<IWorkspace> =
  models.Workspace || model("Workspace", workspaceSchema);

export default Workspace;
