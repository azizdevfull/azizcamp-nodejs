//Import The Database Connection
const mongoose = require("./connection");

///////////////////////////////////////////
// IMPORT YOUR MODELS BELOW
///////////////////////////////////////////
const User = require("../models/User")
const bcrypt = require("bcryptjs")

///////////////////////////////////////////
// DO YOUR DATABASE OPERATIONS IN BELOW FUNCTION
///////////////////////////////////////////

const seed = async () => {



  // Drop the Database before seeding
  mongoose.connection.db.dropDatabase();

  const newuser = {
    username: "alexmerced",
    password: await bcrypt.hash("cheese", await bcrypt.genSalt(10))
  }

  const user = await User.create(newuser)

  console.log(user)

  mongoose.disconnect();
};

// Wait for the DB Connection to be Established
mongoose.connection.on("open", () => {
  // Run Seed Function
  seed();
});
