const express = require('express');
const router = express.Router();
const {createUser , follow , unfollowUser, getUser } = require("../Controllers/UserController");
const { authenticate } = require('../Middleware/authUser');
const postController = require("../Controllers/PostController");

// -------------------------------

router.post("/api/authenticate" ,createUser );


router.post('/api/follow/:userId', authenticate, follow);


router.post('/api/unfollow/:userId', authenticate, unfollowUser);

router.get('/api/user' , authenticate, getUser)


router.post("/api/posts/", authenticate, postController.createPost);

router.delete("/api/posts/:postId" , authenticate , postController.deletePost)

router.post("/api/like/:postId" , authenticate, postController.like)

router.post("/api/unlike/:postId", authenticate, postController.unlike)


router.post("/api/comment/:postId",authenticate, postController.comment )






module.exports = router;