const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const jwt = require("jsonwebtoken");


const userSchema = new  mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followers: [{ type:ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});

// =================Generate Token for user==================//
// userSchema.methods.generateAuthToken = ()=>{
//   const email = this.email;
//   const token = jwt.sign({email:email },'your-secret-key',{expiresIn:'50d'});
//   return token ;
// }

// =================Export Schema============================//


module.exports = mongoose.model("User", userSchema);
