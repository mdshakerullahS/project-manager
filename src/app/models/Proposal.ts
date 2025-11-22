import { Schema, models, model, Model, Types } from "mongoose";

export interface IProposal extends Document {
  workspace: Types.ObjectId;
  employeeEmail: string;
}

const proposalSchema = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: "User" },
    employeeEmail: { type: String, required: true },
  },
  { timestamps: true }
);

const Proposal: Model<IProposal> =
  models.proposal || model<IProposal>("Proposal", proposalSchema);

export default Proposal;
