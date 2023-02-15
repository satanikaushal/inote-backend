const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/kaushal";

const connectToMongo= async()=>{
    mongoose.connect(mongoURI, () => {
      console.log(
         "Connected to yourDB-name database");
   })
}
mongoose.set('strictQuery', false);
module.exports = connectToMongo;