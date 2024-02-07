require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 3000; // Use PORT environment variable or default to 3000
const route = require('./routes');
const mongodb = require('./config/mongodb');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true, allowedHeaders: "Access-Control-Allow-Origin" })); // Enable CORS for localhost:3000
app.use(route);

// MongoDB connection
mongodb();

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
