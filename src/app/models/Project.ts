import { Schema, models, model, Model, InferSchemaType } from "mongoose";

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

export type IProject = InferSchemaType<typeof projectSchema>;

const Project: Model<IProject> =
  models.Project || model<IProject>("Project", projectSchema);

export default Project;
