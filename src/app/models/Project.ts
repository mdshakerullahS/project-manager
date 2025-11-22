import { Schema, models, model, Model, Types } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  deadline: Date;
  creator: Types.ObjectId;
  assignedTo: Types.ObjectId;
}

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do",
    },
    deadline: { type: Date },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  models.Project || model<IProject>("Project", projectSchema);

export default Project;
