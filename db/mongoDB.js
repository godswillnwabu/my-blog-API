// import mongoose
const mongoose = require("mongoose");

// import config file
// const CONFIG = require("./../config/appConfig");

// database connection function
function connectToDB() {
    mongoose.connect(process.env.MONGODB_URL);

    // add event listener to test connection
    mongoose.connection.on("connected", () => {
        console.log("connected to DB successfully")
    })
    // catch error
    mongoose.connection.on("error", (err) => {
        console.log("Connection to DB failed")
        console.log(err)
    })
}

// export database connection function
module.exports = connectToDB;