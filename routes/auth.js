const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Kaushalisthebest';
const fetchuser = require('../middleware/fetchuser');


//Create a user using : POST '/api/auth', donsn't require auth No login is required
router.post("/createuser", [
  body('email','Please enter a valid email').isEmail(),
  body('name','Your name should have atleast 3 characters').isLength({min:3}),
  body('password','Password must contain atleast 5 characters').isLength({min:5})
],async (req, res) => {
  const errors = validationResult(req);
  // if there are errors then return bad request with 400 code and the error as well
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //check if the user with these email exist already
  try{
  let user = await User.findOne({email: req.body.email});
  if (user){
    return res.status(400).json({error: "sorry user with these email already exists"})
  }
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);
  user = await User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email,
}).then(user => {
  const data = {
    user:{
      id: user.id
    }
  }
  const authToken = jwt.sign(data, JWT_SECRET);
  res.json({authToken})}).catch((err)=>{
    console.log(err);
    res.json({error: "please enter a unique value for email",message : err.message})
  })
} catch(error) {
   console.log(error)
   res.status(500).send("interanal server error occured")
}
});

//authenticate a user using : /api/auth/login. No login required
router.post('/login', [
  body('email','enter a valid email').isEmail(),
  body('password','password cannot be blank').exists(),
], async (req, res)=>{
  const errors = validationResult(req);
   // if there are errors then return bad request with 400 code and the error as well
   if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
const {email,password} = req.body;
try{
  let user = await User.findOne({email});
  if(!user){
    return res.status(400).json({error: "Please try to login with correct credentials"});
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if(!passwordCompare){
    return res.status(400).json({error: "Please try to login with correct credentials"}); 
  }
  const payload = {
    user: {
      id: user.id
    }
  }
  const authtoken = jwt.sign(payload, JWT_SECRET);
  res.json({authtoken})
}catch(error){
  console.log(error)
  res.status(500).send("Internal server error occured")
}
})

//get logged in user's details using POST '/api/auth/getuser' login required
router.post('/getuser',fetchuser, async (req, res)=>{

try {
 let userId = req.user.id;
const user = await User.findById(userId).select("-password")
  res.send(user)
} catch (error) {
  console.log(error)
  res.status(500).send("Internal server error occured")
}
})

module.exports = router;
