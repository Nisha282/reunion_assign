const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const CommentModel = require("../models/CommentModel");

// ----------------post api----------------------

const createPost = async function (req, res) {
    try { 
    let user = req.user.id
    const { title,description} = req.body

     if(title === "undifined" || title==null || typeof(title)!='string') return res.status(404).send("Title is required")
     if(description === "undifined" || description==null) return res.status(404).send("Description is required")
    let postCreated = await PostModel.create(req.body)
    let getPost = await PostModel.findOne({title:title}).select({likes:0, __v:0})
    return res.status(200).send({status:false,msg:getPost}) 
    }
catch (err) {
         res.status(500).send({status: false, msg: "Error", error: err.message})}
 }



// ---------------delete api ---------------------------



const deletePost = async (req,res)=>{
    try{
        const userid  = req.user.id
        
        const postId = req.param.id

        const deletePost = await PostModel.findByIdAndDelete(postId)

        return res.status(200).send({status:true , msg :"delete ho gye bhai"})

    }catch(err){
        return res.status(500).send({status:true , msg :"kuch to error hai nisha"})
    }
}

// ------------------------like api----------------------

const like = async (req,res) =>{
    try {
        // Extract the user ID from the authenticated request object
        const authUserId = req.user.id;
      
        const postToLike = req.params.postId
        
    
        // Get the user ID to follow from the request parameters
        // const userIdTolike = req.params.userId;
    
        // Find the authenticated user in the database and add the user to follow to their 'following' array
        const authUser = await PostModel.findById(postToLike);
        console.log(authUser)
        if (!authUser) {
          return res.status(404).json({ success: false, message: 'post  not found.' });
        }
        authUser.likes.addToSet(authUserId);
        await authUser.save();
    
    
        res.json({ success: true, message: 'post Like successfully.' });
      } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong.' });
      }
    };


// ------------------ Unlike api---------------------
    const unlike = async (req,res) =>{
        try {
            const  id  = req.params;
            const userId = req.user.id; // assuming userId is stored in the request object after authentication
            
            // Find the authenticated user and remove the target user from their following list
            const user = await PostModel.findByIdAndUpdate(
              userId,
              { "$pull": { following: {id} } },
              { new: true }
            )
            // console.log(user)
            
            // Find the target user and remove the authenticated user from their followers list
            const targetUser = await PostModel.findByIdAndUpdate(
              id,
              { "$pull": { followers: {userId} } },
              { new: true }
            )
            // console.log(targetUser)
            
            res.status(200).json({ message: `Unfollowed user ${id}` });
          } catch (error) {
            res.status(500).json({ success: false, message: 'Something went wrong.' });
          }
        };
        
    // ---------------get--------------------------------
        
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
            res.status(500).json({ success: false, message: 'Something went wrong.' });
          }
        };

 // -------------Comment Api----------------------
    const comment = async (req,res)=>{
        try{

            const user = req.user.id
            const post = req.params.postId

            let {comment }= req.body
            let obj = {user,post,comment}
            let data  = await CommentModel.create(obj)
            let getCommentId  = await CommentModel.findOne(data).select({_id:1})

            return res.status(201).send({status:true,msg:getCommentId })

        }catch(err){
            console.error(err.message);
        res.status(500).json({ success: false, message: 'Something went wrong.' });

        }
    }

    // ---------------get api--------------------------------


    //------------------ get api for all ---------------------



    


module.exports={createPost ,deletePost , like  , unlike ,getUser, comment}