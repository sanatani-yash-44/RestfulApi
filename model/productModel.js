const mongoose = require("mongoose");

const Product = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 30
    },
    price: {
      type: String,
      require: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    image: {
      type: String
    },
    description: {
      type: String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product);
