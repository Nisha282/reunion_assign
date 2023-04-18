// Import the User model and the JWT library
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Define an authentication middleware function
exports.authenticate = async (req, res, next) => {
  try {
    // Get the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, "your-secret-key");
    // console.log(decoded)
    const userId = decoded.userId;
    // console.log(userId,"userId")

    // Find the user in the database and attach their ID to the request object
    const user = await User.findById(userId);
    // console.log(user,"user")
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token.', user:user });
    }
    req.user = { id: userId }; 

    // Call the next middleware function
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: 'Authentication failed.' , error:err });
  }
};
