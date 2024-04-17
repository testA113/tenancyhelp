import mongoose, { model, models } from "mongoose";

const chatHistoryTrainingSchema = new mongoose.Schema({
  messages: [
    {
      role: String,
      content: String,
      source: String,
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

const Post =
  models.Post || model("ChatHistoryTraining", chatHistoryTrainingSchema);
export default Post;
