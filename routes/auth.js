const express = require("express");  //import express
const router = express.Router(); //use router instead of app = express() now we will call with router.get instead of app.get or app.post
const User = require("../models/User"); //User is a schema which will validate the data that is passed with as the body in the header
const { body, validationResult } = require('express-validator'); //this will validate the formate of the data passed
const bcrypt = require('bcryptjs');  //it will be used to hash the password and add salt to it 
const jwt = require('jsonwebtoken'); //it will give the user a token through which we will validate if he is the same user or not
const JWT_SECRET = 'Kaushalisthebest';  //it is my secret key through which i can access the hashing function
const fetchuser = require('../middleware/fetchuser'); //it has the fucntion through which i will fetch the user's data once he logins

//Route 1 : when some one hits this end point the user has to enter his data to sign up and he will be given an token according to that through which he can login again in the system 
//Create a user using : POST '/api/auth', donsn't require auth No login is required
router.post("/createuser", [  
  body('email','Please enter a valid email').isEmail(), //this lines validate the given data ie everything passed is valid or not. we can also set custom messages for custom errors. the data will be passed again through the body of the of the headers.
  body('name','Your name should have atleast 3 characters').isLength({min:3}),
  body('password','Password must contain atleast 5 characters').isLength({min:5})
],async (req, res) => {
  const errors = validationResult(req); //it will check if there are errors in the passed data from the above parameters

  // if there are errors then return bad request with 400 code and the error as well
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //check if the user with these email exist already
  try{
  let user = await User.findOne({email: req.body.email});
  if (user){ // if the user with the passed email id already exists then then return 400 and the following error message
    return res.status(400).json({error: "sorry user with these email already exists"})
  }
  const salt = await bcrypt.genSalt(10); // this will generate a salt that will add after the password so that we can secure it. The length of the salt generated will be 10 as passed in the function.
  const secPass = await bcrypt.hash(req.body.password, salt); // this will first add the original password passed from the body with the salt and then make a hash of it.
  user = await User.create({  // this will create a user with the data passed from the body of the header when the endpoint is hit. It will be created in the data whose name is passed when making a database connection. If no database name is passed in the link then it will automatically generate an test database.
    name: req.body.name,
    password: secPass, // here the name and email will be the original ones passed from the body of the headers but the password won't be in the real format, it will be now the hashed one. and in the database the password will be hashed and you can't get the original password.
    email: req.body.email,
}).then(user => {   //after the user is created in the data base it will return some information about the user but here we will extract his id in the database and store it in the object named data. In it their is another object named user whose first key is id and it's value is the id got from the database.
  const data = {
    user:{
      id: user.id
    }
  }
  const authToken = jwt.sign(data, JWT_SECRET); //this will first add the id recieved from the database with the JWT_SECRET string that we formed at the top of this code and then it will sign it. Signing it means it will convert it into an format which we cannot understand but we can use it to get information about that user when he comes back to the login page.
  res.json({authToken})}).catch((err)=>{
    console.log(err);
    res.json({error: "please enter a unique value for email",message : err.message}) ///this will for now return the authtoken as json resolution. and also the errors if we got some.
  })
} catch(error) {
   console.log(error)
   res.status(500).send("interanal server error occured") // if any error occurs in the try block then it will be catched here and will get it in console as well as the resolution
}
});

//ROUTE 2: here we will check if the user has entered the correct credentials and also if had even entered some.
//authenticate a user using : /api/auth/login. No login required
router.post('/login', [
  body('email','enter a valid email').isEmail(), // this will check if the email enter is actually an email or not. It won't check if an this email is their on the database or not but just if it is geniune or not.
  body('password','password cannot be blank').exists(), // this will check if the password is entered or not.
], async (req, res)=>{
  const errors = validationResult(req); // this will again catch the errors that are passed from the above the validations.
   // if there are errors then return bad request with 400 code and the error as well
   if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //also if there are errors then return bad request and error in json format
  }
const {email,password} = req.body; //here we are using ES6 syntax of object destructuring. The user will pass the email and password in the body and we will store it in these two varaibles.
try{
  let user = await User.findOne({email}); // this will find if there is a user with this email address in our database or not.
  if(!user){ // if there is no user with this email address then return bad request. and end this function.
    return res.status(400).json({error: "Please try to login with correct credentials"});
  }
  const passwordCompare = await bcrypt.compare(password, user.password); //if there is a user with these email address then compare the password entered by the user with the password that is in our database.
  if(!passwordCompare){// if the passwords do not match then return bad request and eroor message.
    return res.status(400).json({error: "Please try to login with correct credentials"}); 
  }
  const payload = { //if the email and password both are correct then get the id of that user from the database and store it in the object payload.
    user: {
      id: user.id
    }
  }
  const authtoken = jwt.sign(payload, JWT_SECRET); //give them the authtoken so that they can login into there account.
  res.json({authtoken}); // for now we will send the authtoken generated as json resolution to this endpoint hit.
}catch(error){
  console.log(error)
  res.status(500).send("Internal server error occured"); // if there are any errors in the try block then catch it here and show the above message.
}
})

//ROUTE 3: //here we will get the user's information on the basis of the authtoken passed in the header and a parameter.
//get logged in user's details using POST '/api/auth/getuser' login required
router.post('/getuser',fetchuser, async (req, res)=>{

try {
 let userId = req.user.id;
const user = await User.findById(userId).select("-password");
  res.send(user)
} catch (error) {
  console.log(error)
  res.status(500).send("Internal server error occured")
}
})

module.exports = router;
