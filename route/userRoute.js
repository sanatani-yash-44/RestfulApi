const express = require("express");
const cookieParser = require('cookie-parser');

const userRoute = express();
userRoute.use(express.json());
userRoute.use(cookieParser());
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const { uploadImage } = require("../utils/helper");




userRoute.get("/user/user-list",auth,userController.getAllUser);
// register user 
userRoute.post("/user/registerUser",uploadImage.single('avtar'),userController.registerUser);
// login 
userRoute.post("/user/login",userController.loginUser);
userRoute.post("/user/view-profile",auth,userController.viewProfile);
 userRoute.delete("/user/delete",auth,userController.userDelete)

module.exports = userRoute;
