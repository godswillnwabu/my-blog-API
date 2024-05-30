const express = require("express");
// Initializing express application
const app = express();

// import post router and user router
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

// add middlware to parse request body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// middleware for API endpoints
app.use("/api", userRouter)
app.use("/api/posts", postRouter)

module.exports = app;