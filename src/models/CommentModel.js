

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const commentSchema = new  mongoose.Schema({
    
      author: { type: ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      
  });

module.exports = mongoose.model('comment', commentSchema );