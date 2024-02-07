
require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const app = express()
const port = process.env.port
const route = require('./routes');
const mongodb = require('./config/mongodb');



app.use(cors({
  origin: ["http://localhost:3000", "https://wifi-tracking-frontend.vercel.app"],
  credentials: true // Enable credentials if needed
}));

// Enable preflight requests for all routes
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json());
app.use(route)

mongodb();



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})