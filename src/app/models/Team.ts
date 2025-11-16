import { Schema, model, models, Model, InferSchemaType } from "mongoose";

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    operator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

export type ITeam = InferSchemaType<typeof teamSchema>;

const Team: Model<ITeam> = models.Team || model<ITeam>("Team", teamSchema);

export default Team;
