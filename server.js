// import app
const app = require("./app");

// import the config module
const CONFIG = require("./config/appConfig");

// import database connection function
const connectToDB = require("./db/mongoDB");

// call connectToDB function
connectToDB();

app.listen(CONFIG.PORT, () => {
    console.log(`Server is running on http://localhost:${CONFIG.PORT}`)
})