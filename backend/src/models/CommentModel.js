

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const commentSchema = new  mongoose.Schema({
    
      user: { type: ObjectId, ref: 'User', required: true },
      post:{type:ObjectId,ref:"Post",required:true},
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      
  });

module.exports = mongoose.model('comment', commentSchema );