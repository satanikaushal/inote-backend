const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Kaushalisthebest';
let success;

//in this we will extract the id the user from the given authtoken. We can do that because the authtoken was generated through the id only so we can go back to the id itself.

const fetchuser = (req,  res, next)=>{
    //get the user jwt token and add id to req object
    const token = req.header("authtoken")
    if(!token){
        success = false;
       return res.sendStatus(401).send({success,error: "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
    req.user = data.user;
    next()
    } catch (error) {
        success = false;
       return res.sendStatus(401).send({success, error: "Please authenticate using a valid token"})
    }
}
module.exports = fetchuser;