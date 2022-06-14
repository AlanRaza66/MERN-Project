//IMPORT
const mongoose = require("mongoose");

//Connecter mongoose à mongodb
mongoose
  .connect("mongodb://localhost:27017/mern-project")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Failed to connect to MongoDB", err));
