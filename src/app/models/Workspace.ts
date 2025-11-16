import { Schema, models, model, Model, InferSchemaType } from "mongoose";

const workspaceSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "User" },
  employees: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export type IWorkspace = InferSchemaType<typeof workspaceSchema>;

const Workspace: Model<IWorkspace> =
  models.Workspace || model("Workspace", workspaceSchema);

export default Workspace;
