const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const postSchema = new  mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: ObjectId, ref: 'User', required: true },
    likes: [{ type:ObjectId, ref: 'User' }],
    comments: [{
      author: { type: ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Post', postSchema);