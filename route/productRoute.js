const express = require('express');
const productRoute = express();
productRoute.use(express());
const bodyParser = require('body-parser');
productRoute.use(bodyParser.json());
const productController = require("../controllers/productController");
const auth = require('../middleware/auth');
const { uploadImage } = require('../utils/helper');



productRoute.post("/product/add-product",auth,uploadImage.single('image'), productController.addProduct);
productRoute.post("/product/viewProduct",productController.viewProduct);

module.exports = productRoute;