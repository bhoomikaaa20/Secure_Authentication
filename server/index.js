const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const Auth = require("./models/authSchema");
const router = require("./routes/userRoute.js");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://remarkable-belekoy-83a35c.netlify.app", // Ensure this URL is correct
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true,
  })
);

// Routes
app.use("/auth", router);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BlogSpot")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the Server
const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
