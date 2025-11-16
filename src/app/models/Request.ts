import { Schema, models, model, Model, InferSchemaType } from "mongoose";

const requestSchema = new Schema(
  {
    workSpace: { type: Schema.Types.ObjectId, ref: "Workspace" },
    employeeEmail: { type: String, required: true },
  },
  { timestamps: true }
);

export type IRequest = InferSchemaType<typeof requestSchema>;

const Request: Model<IRequest> =
  models.request || model<IRequest>("Request", requestSchema);

export default Request;
