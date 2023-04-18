//=======================Import bcrypt==========================//
const bcrypt = require('bcrypt')
const userModel = require('../models/UserModel');
const authenticate = require('../Middleware/authUser');
const jwt = require("jsonwebtoken");


//===========================Import Validation module======================//
const {isValid,isValidEmail,isValidPassword,isValidObjectId,isValidRequestBody} = require('../validation/validator');
const UserModel = require('../models/UserModel');

//===========================Create userModel===============================//
const createUser = async (req, res) => {
    try {
        const data = req.body
        if(!isValidRequestBody(data)) return  res.status(400).send({status:false,message:'Body Should not be empty!'})
        const { email, password } = data
        if (!email || !password ) {
            return res.status(400).send({status:false, message: 'All fields are required i.e email,password,name,dob' });
        }
        if(!isValidEmail(email)) return res.status(400).send({status:false,message:'email is invalid.'})
        let checkEmail = await userModel.findOne({email:email})
        if(checkEmail) return res.status(400).send({status:false,message : 'email alredy used! please use another email.'}); 

        if(!isValidPassword(password)) return res.status(400).send({status:false,message:'password is invalid! Please use minimum 8 character and maximum 15 character , 1 upercase , 1 lowercase , 1 numeric value and one special symbol'})

        // use Bcrypted password in db
        let salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        let createUser = await userModel.create(req.body)
        // console.log(createUser,"createuser")
        let userid = await userModel.findOne({email:email})
        // console.log(userid,"userid")
        userid = userid._id
        // console.log(userid,"useriddddd")
        const token = jwt.sign({userId:userid },'your-secret-key',{expiresIn:'50d'});

        const user = await userModel.create(data); 
        
        return res.status(201).send({status:true , data:token}); 
    } catch (error) {
        return res.status(500).send({status:false,message: error.message })
    }
};



// -------------------------------followUser------------------------------------------------

let follow = async (req, res) => {
  try {
    // Extract the user ID from the authenticated request object
    const authUserId = req.user.id;

    // Get the user ID to follow from the request parameters
    const userIdToFollow = req.params.userId;

    // Find the authenticated user in the database and add the user to follow to their 'following' array
    const authUser = await userModel.findById(authUserId);
    if (!authUser) {
      return res.status(404).json({ success: false, message: 'userModel not found.' });
    }
    authUser.following.addToSet(userIdToFollow);
    await authUser.save();

    // Find the user to follow in the database and add the authenticated user to their 'followers' array
    const userToFollow = await userModel.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ success: false, message: 'userModel not found.' });
    }
    userToFollow.followers.addToSet(authUserId);
    await userToFollow.save();

    res.json({ success: true, message: 'userModel followed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ---------------------------------------------------------------------------

// ===================unfollow===============================


let unfollowUser = async (req, res) => {
  try {
    const  id  = req.params;
    const userId = req.user.id; // assuming userId is stored in the request object after authentication
    
    // Find the authenticated user and remove the target user from their following list
    const user = await userModel.findByIdAndUpdate(
      userId,
      { "$pull": { following: {id} } },
      { new: true }
    )
    // console.log(user)
    
    // Find the target user and remove the authenticated user from their followers list
    const targetUser = await userModel.findByIdAndUpdate(
      id,
      { "$pull": { followers: {userId} } },
      { new: true }
    )
    // console.log(targetUser)
    
    res.status(200).json({ message: `Unfollowed user ${id}` });
  } catch (error) {
   console.log(error.message)
  }
};

// ----------------------get--------------------------------

const getUser  = async(req,res)=>{

   try {const user = req.user.id

    const getuser = await userModel.findById(user)
    const {email,followers,following} = getuser
    let obj ={
      userName : email,
      followers : followers,
      following : following
    }
    if(!getuser){
      return res.status(400).send({status:false, msg :"user not found"})
    }
    return res.status(200).send({status:true, msg :obj})
  
  }catch(err){
    console.log(err.message)
  }
}



module.exports = {createUser , follow ,unfollowUser,getUser} 
