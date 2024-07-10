const express = require('express');
const contactRoute =express();
const bodyParser = require('body-parser');
contactRoute.use(bodyParser.json());
const contactContoller = require("../controllers/contactController")

contactRoute.post("/contact",contactContoller.getAllContact);

module.exports=contactRoute;