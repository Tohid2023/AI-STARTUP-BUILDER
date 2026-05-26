const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const startupRoutes = require("./routes/startupRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api", testRoutes);
app.use("/api/user", userRoutes);
app.use("/api/startup", startupRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});