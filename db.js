const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017';

const connectToMongo= async()=>{
     mongoose.connect(mongoURI, ()=>{
        console.log("connected to mongo successfully");
     })
}
mongoose.set('strictQuery', false);
module.exports = connectToMongo;