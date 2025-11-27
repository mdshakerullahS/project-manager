import { Schema, model, models, Model, Types, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  creator: Types.ObjectId;
  operator: Types.ObjectId;
  members: Types.ObjectId[];
}

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    operator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

const Team: Model<ITeam> = models.Team || model<ITeam>("Team", teamSchema);

export default Team;
