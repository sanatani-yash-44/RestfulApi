require("dotenv").config();
const cookieParser = require('cookie-parser');
const config = require("./config/config");
const express = require("express");
const App = express();
App.use(express.json());
App.use(cookieParser());
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST_NAME || "http://localhost";

App.use(express.static("public"));


//Home Route
App.get("/", (req, res) => {
  res.status(200).send(`<!DOCTYPE html>
  <html>
    <head>
      <title>Welcome to My Node.js Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
        }
        .container {
          margin: 100px auto;
          text-align: center;
        }
        h1 {
          font-size: 5em;
          color: #555;
          margin-bottom: 0.2em;
        }
        p {
          font-size: 1.2em;
          color: #777;
          margin-top: 0.2em;
        }
        a {
          color: #999;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to My Node.js Server</h1>
        <p>This is a simple Node.js application.</p>
      </div>
    </body>
  </html>
  `);
});



// get all route for user
const userRoute = require('./route/userRoute');
App.use('/api', userRoute);

// get all route for CONTACT
const contactRoute = require('./route/contactRoute');
App.use('/api', contactRoute);

//Product Route
const productRoute = require("./route/productRoute");
App.use("/api", productRoute);
//category 
const categoryRoute = require('./route/categoryRoute');
App.use('/api', categoryRoute);


//subCategory//
// const subCategoryRoute = require("./route/subRoute");
// application.use('/api',subCategoryRoute)

//when not found
App.get("*", (req, res) => {
  res.status(404).send(`<!DOCTYPE html>
  <html>
    <head>
      <title>404 Not Found</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
        }
        .container {
          margin: 100px auto;
          text-align: center;
        }
        h1 {
          font-size: 5em;
          color: #555;
          margin-bottom: 0.2em;
        }
        p {
          font-size: 1.2em;
          color: #777;
          margin-top: 0.2em;
        }
        a {
          color: #999;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <p>Oops! The page you requested was not found.</p>
        <a href="/">Go back to the home page</a>
      </div>
    </body>
  </html>
  `);
});



const serverStart = async () => {
  try {
    await config.connectDatabase();
    App.listen(PORT, () => {
      console.log(`Server is listen on link ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

serverStart();
