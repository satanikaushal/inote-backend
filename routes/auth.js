const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');

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
  user = await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  }).then(user => res.json(user)).catch((err)=>{
    console.log(err);
    res.json({error: "please enter a unique value for email",message : err.message})
  })
} catch(error) {
   console.log(error)
   res.status(500).send({error : "some error occured"})
}
});

module.exports = router;
