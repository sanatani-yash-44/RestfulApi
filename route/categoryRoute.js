const express = require("express");
const categoryRoute = express();
categoryRoute.use(express());
const bodyParser = require("body-parser");
categoryRoute.use(bodyParser.json());
const categoryContr = require("../controllers/categoryContr");

//create category//
categoryRoute.post("/category/create", categoryContr.createCategory);

module.exports = categoryRoute;
