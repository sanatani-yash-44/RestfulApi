const categoryModel = require("../model/categoryModel");

const createCategory = async (req, res) => {
  try {
    const { name, status } = req.body;


    const existCategory = await categoryModel.findOne({ name: name });

    if (existCategory) {
      res
        .status(200)
        .send({
          success: false,
          message: name + "category is already defined",
        });
    } else {
      const saveCategory = await categoryModel({
        name,
        status,
      });

      await saveCategory.save();
      res
        .status(200)
        .send({ success: true, message: name + "category has been created" });
    }
  } catch (error) {
    console.log("error", error);
  }
};
module.exports = { createCategory };
