// get the library
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
// connect to database
const url =
  "mongodb+srv://gurpreeet1579:Mongodb%401@cluster0.dfvvh8y.mongodb.net/DrivingTestDB";
mongoose.connect(url);

// get the database
db = mongoose.connection;

// check for errors while connectiong to database
db.on("error", console.error.bind(console, "Connection to database failed"));

// on connection console log connection is made
db.once("open", function callback() {
  console.log("Successfully connected database");
});
