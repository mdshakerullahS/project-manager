import { Schema, models, model, Model, InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
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

export type ITask = InferSchemaType<typeof taskSchema>;

const Task: Model<ITask> = models.Task || model<ITask>("Task", taskSchema);

export default Task;
