import { Schema, models, model, Model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    accountType: {
      type: String,
      enum: ["Individual", "Workspace", null],
      default: "",
    },
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    provider: { type: String },
  },
  { timestamps: true }
);

export type IUser = InferSchemaType<typeof userSchema>;

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;
