const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Kaushalisthebest';

//in this we will extract the id the user from the given authtoken. We can do that because the authtoken was generated through the id only so we can go back to the id itself.

const fetchuser = (req,  res, next)=>{
    //get the user jwt token and add id to req object
    const token = req.header("authtoken")
    if(!token){
        res.sendStatus(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
    req.user = data.user;
    next()
    } catch (error) {
        res.sendStatus(401).send({error: "Please authenticate using a valid token"})
    }
}
module.exports = fetchuser;