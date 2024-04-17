import mongoose, { model, models } from "mongoose";

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

const userSchema = new mongoose.Schema({
  id: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  image: {
    required: true,
    type: String,
    default: "",
  },
});
export const UserModel = models.User || model("User", userSchema);
