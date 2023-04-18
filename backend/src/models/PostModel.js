const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  likes: [{ type: ObjectId, ref: "User" }],
  comment: [{ type: ObjectId, ref: "comment" }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
