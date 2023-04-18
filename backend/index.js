const express = require('express');
const route =require("./src/route/route.js");
const mongoose  = require('mongoose');
const app= express();
require('dotenv').config()



app.use(express.json());


mongoose 
 .connect(process.env.MONGODB_URL) 
 .then(()=>console.log(`MongodB is Connected`)) 
 .catch((err)=>console.log(err)) 
 


 app.use('/', route);



app.listen(3000, function () {
    console.log('Express app running on port ' + (3000))
});


