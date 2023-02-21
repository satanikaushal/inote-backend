const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://satanikaushal:9qLbIIFv1k5WaR0V@cluster0.6ru8n0e.mongodb.net/notebook?retryWrites=true&w=majority";

const connectToMongo = async()=>{
   try {
      // Connect to the MongoDB cluster
      mongoose.connect(
         mongoURI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log(" Mongoose is connected"),
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