// import app
const app = require("./app");

require("dotenv").config();

// import the config module
// const CONFIG = require("./config/appConfig");

// import database connection function
const connectToDB = require("./db/mongoDB");

// call connectToDB function
connectToDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})