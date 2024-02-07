
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


// app.options("*", cors());
// const corsOptions = {
//   origin: '*', 
//   credentials: true, 
// };

// app.use(cors(corsOptions));
app.use(cors());
app.options("*", cors());
app.head("/api/v1", cors(), (req, res) => {
  console.info("HEAD /simple-cors");
  res.sendStatus(204);
});
app.get("/api/v1", cors(), (req, res) => {
  console.info("GET /simple-cors");
  res.json({
    text: "Simple CORS requests are working. [GET]"
  });
});
app.post("/api/v1", cors(), (req, res) => {
  console.info("POST /simple-cors");
  res.json({
    text: "Simple CORS requests are working. [POST]"
  });
});
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