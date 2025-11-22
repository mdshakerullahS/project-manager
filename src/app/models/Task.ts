import { Schema, models, model, Model, Types } from "mongoose";

export interface ITask extends Document {
  creator: Types.ObjectId;
  title: string;
  status: "To Do" | "In Progress" | "Completed";
  project?: Types.ObjectId;
  assignedTo: Types.ObjectId;
}

const taskSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do",
    },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Task: Model<ITask> = models.Task || model<ITask>("Task", taskSchema);

export default Task;
