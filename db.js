const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = async()=>{
   try {
      // Connect to the MongoDB cluster
      mongoose.connect(
         mongoURI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log(" Mongoose is connected",process.env.MONGODB_URI),
      );
    } catch (e) {
      console.log("could not connect");
    }
    
    const dbConnection = mongoose.connection;
    dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
    dbConnection.once("open", () => console.log("Connected to DB!"));
}
mongoose.set('strictQuery', false);
module.exports = connectToMongo;