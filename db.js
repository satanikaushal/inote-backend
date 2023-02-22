const mongoose = require('mongoose');
require('dotenv').config();
const mongoName = process.env.mongoName;
const mongoPass = process.env.mongoPass;

const connectToMongo = async()=>{
   try {
      // Connect to the MongoDB cluster
      mongoose.connect(
        `mongodb+srv://${mongoName}:${mongoPass}@cluster0.6ru8n0e.mongodb.net/notebook?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log("Mongoose is connected"),
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