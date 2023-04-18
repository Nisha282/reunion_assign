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
    // console.log(postCreated)
    
    let getPost = await PostModel.findOne({title:title}).select({likes:0, __v:0})
    // console.log(getPost,"hello")
    const authUser = await UserModel.findById(user);
        // console.log(authUser)
        if (!authUser) {
          return res.status(404).json({ success: false, message: 'post  not found.' });
        }
        authUser.post.addToSet(postCreated);
        await authUser.save();


    return res.status(200).send({status:true,msg:getPost}) 
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
    return res.status(200).send({status:true , msg :"user successfully deleted"})

    }catch(err){
        return res.status(500).send({status:true , msg :"err.message"})
    }
}

// ------------------------like api----------------------

const like = async (req,res) =>{
    try {
        
        const authUserId = req.user.id;
        const postToLike = req.params.postId;
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
 const unlike = async (req, res) => {
        try {
          // Extract the user ID from the authenticated request object
          const authUserId = req.user.id;
      
          const postToUnlike = req.params.postId;
      
          // Find the post to unlike in the database
          const post = await PostModel.findById(postToUnlike);
      
          if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found.' });
          }
      
          // Remove the authenticated user from the post's 'likes' array
          post.likes.pull(authUserId);
          await post.save();
      
          res.json({ success: true, message: 'Post unliked successfully.' });
        } catch (err) {
          console.log(err);
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
           const authUserId = req.user.id;
            let post
            const posttocomment =  post =req.params.postId
            let user = authUserId;
            let {comment }= req.body
            let obj = {user,post,comment}
            let data  = await CommentModel.create(obj)
            let getCommentId  = await CommentModel.findOne(data).select({_id:1})

        //   console.log(getCommentId)
            const authUser = await PostModel.findById(posttocomment);
            console.log(authUser)
            if (!authUser) {
              return res.status(404).json({ success: false, message: 'post  not found.' });
            }
            authUser.comment.addToSet(getCommentId);
            await authUser.save();
        
        
            res.json({ success: true, message: 'comment  successfully.' });

        }catch(err){
            console.error(err.message);
        res.status(500).json({ success: false, message: 'Something went wrong.' });

        }
    }
 // ---------------getdetails api--------------------------------


const getPostDetails  = async (req,res)=>{
   try {
    const  post = req.params.postId
    let getPost = await PostModel.findById(post).populate("comment")
    if(!getPost){
        return res.status(404).send({status:false,msg :"post not found"})
    }

    return res.status(200).send({status:true,msg:getPost})


   }catch(err){
    console.log(err.message)
   }
}

//------------------ get api for all ---------------------


    
const getPostAllDetails = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await UserModel.findById(userId).populate('post');
      const posts = user.post;
  
      const postDetails = await Promise.all(posts.map(async (post) => {
        const populatedPost = await PostModel.findById(post._id)
          .populate('likes')
          .populate({
            path: 'comment',
            populate: { path: 'user', model: 'User' },
          });
  
        return {
          id: populatedPost._id,
          title: populatedPost.title,
          desc: populatedPost.description,
          created_at: populatedPost.createdAt,
          comments: populatedPost.comment,
          
          likes: populatedPost.likes.length,
        };
      }));
  
      return res.status(200).send({ status: true, msg: postDetails });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ status: false, msg: 'Server error' });
    }
  };
  
 

module.exports={createPost ,deletePost , like  , unlike ,getUser, comment , getPostDetails , getPostAllDetails}