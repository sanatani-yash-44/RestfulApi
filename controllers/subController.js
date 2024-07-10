// const SubcategoryModel = require("../model/subCategoryModel");

// const subCreate = async (req, res) => {
//   try {
//     const { name, status } = req.body;


//     const existSubCategory = await subCategoryModel.findOne({ name: name });

//     if (existSubCategory) {
//       res
//         .status(200)
//         .send({
//           success: false,
//           message: name + "category is already defined",
//         });
//     } else {
//       const saveSubCategory = await categoryModel({
//         name,
//         status,
//       });
// // 
//       await saveSubCategory.save();
//       res
//         .status(200)
//         .send({ success: true, message: name + "category has been created" });
//     }
//   } catch (error) {
//     console.log("error", error);
//   }
// };
// module.exports = { subCreate };
