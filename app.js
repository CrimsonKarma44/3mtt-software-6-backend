const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth.route");

app.use(cors());
const secretKey = process.env.JWT_SECRET; // Replace with your own secret key

app.use(express.json());

app.use("/auth",  authRoutes);


module.exports = app;