const express = require("express");
const authRoute = require("./route/authRoute");
const app = express();
const connectDB = require("./configure/db");


app.use(express.json());

app.use("/api/auth", authRoute);

connectDB();

module.exports = app;