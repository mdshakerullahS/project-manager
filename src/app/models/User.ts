import { Schema, models, model, Model } from "mongoose";

export interface IUser extends Document {
  accountType: "Individual" | "Workspace" | null;
  name: string;
  email: string;
  image: string;
  provider: string;
}

const userSchema = new Schema(
  {
    accountType: {
      type: String,
      enum: ["Individual", "Workspace", null],
    },
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    provider: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;
