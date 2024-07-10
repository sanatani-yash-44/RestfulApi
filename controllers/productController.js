const productModel = require("../model/productModel");
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const helperFile = require("../utils/helper");
const { ObjectId } = require("mongodb");

const addProduct = async (req, res) => {
  try {
    // console.log(req.file);
    // return false;
    let avtarName;
    if (req.file) {
      avtarName = req.file.filename;
    }

    if (
      !req.body.name ||
      !req.body.price ||
      !req.body.description ||
      !req.body.categoryId
    ) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(200).send({
        success: false,
        message: "Please provide all credentials",
      });
    }

    const productName = await helperFile.capitalizeFirstLetter(req.body.name);
    const productPrice = req.body.price;
    const ProductDescription = req.body.description;
    const categoryId = req.body.categoryId;

    const isProductExists = await productModel.findOne({ name: productName });
    // console.log(isEmailExit);
    // const rand = Math.random().toString(16).substr(2, 16);

    if (isProductExists) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(200).send({
        success: false,
        message: "This prduct is already exist",
      });
    } else {
      const setProductData = new productModel({
        name: productName,
        price: productPrice,
        description: ProductDescription,
        image: avtarName,
        categoryId: categoryId,
      });

      const saveData = await setProductData.save();
      res.status(200).send({
        success: true,
        message: productName + ", Thank you for add product.",
        data: saveData,
      });
    }
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.log("Error:", error);
    res.status(200).send({
      success: false,
      message: "Error:" + error,
    });
  }
};

const viewProduct = async (req, res) => {
  try {
    const Id = req.query._id;
    const productName = req.query.productName;
    const categoryName = req.query.categoryName;

    if (Id) {
      const getProductById = await productModel
        .findOne({ _id: new ObjectId(Id) }, { createdAt: 0, updatedAt: 0 })
        .select("-__v")
        .populate({ path: "categoryId", select: "name" });

      if (getProductById) {
        let productObj = {
          ...getProductById.toObject(),
          image: `${process.env.HOST_NAME}:${process.env.PORT}/${process.env.FILE_PATH}/${getProductById.image}`,
          categoryName: getProductById.categoryId.name,
        };
       

        res.status(400).send({
          success: true,
          message: "Product get successfully",
          data: productObj,
        });
      } else {
        res.status(400).send({ success: false, message: "Invalid Id" });
      }
    } else {
      const limit = parseInt(req.query.limit) || 3;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;

      let searchObj = {};

      if (productName) {
        searchObj.name = { $regex: new RegExp(productName, "i") };
      }

      if (categoryName) {
        searchObj.categoryId.name = { $regex: new RegExp(categoryName, "i") };
      }

      const viewAllProduct = await productModel
        .find(searchObj, { createdAt: 0, updatedAt: 0 })
        .select("-__v")
        .populate({ path: "categoryId", select: "name" })
        .limit(limit)
        .skip(skip);

      if (viewAllProduct.length > 0) {
        var getProduct = viewAllProduct.map((product) => {
          if (product.image) {
            return {
              ...product.toObject(),
              image: `${process.env.HOST_NAME}:${process.env.PORT}/${process.env.FILE_PATH}/${product.image}`,
              categoryName: product.categoryId.name,
            };
          } else {
            return {
              ...product.toObject(),
              categoryName: product.categoryId.name,
            };
          }
        });
      }
      res.status(200).send({
        success: true,
        message: "All Products successfully viewed",
        getProduct,
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports = { addProduct, viewProduct };
