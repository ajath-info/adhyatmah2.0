"use strict";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const recachegoose = require("recachegoose");
const routes = require("./routes/routeLoader");
const initializeDefaults = require("./startup/initializer");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Configure CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://adhyatmah.com",
  "https://www.adhyatmah.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., Postman, mobile apps)
      if (!origin) return callback(null, true);

      // Remove trailing slash if exists
      const cleanOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS policy: This origin is not allowed."),
        false
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(routes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    recachegoose(mongoose, {
      engine: "memory",
      ttl: 60,
    });

    const initialized = await initializeDefaults();
    if (initialized) {
      console.log(" Default settings/data created successfully.");
    } else {
      console.log(" Default settings/data already exist, no new data created.");
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
// GET API
app.get("/", (req, res) => {
  res.send("This is a GET API");
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
