const express = require('express');
const router = express.Router();
const {createUser , follow} = require("../Controllers/UserController");
const { authenticate } = require('../Middleware/authUser');

// -------------------------------

router.post("/api/authenticate" ,createUser );

// Set up the route to handle the follow request
router.post('/api/follow/:userId', authenticate, follow);






module.exports = router;