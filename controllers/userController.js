const userModel = require("../model/userModel");
const helperFile = require("../utils/helper");
const { ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");

const getAllUser = async (req, res) => {
  try {
    if (req.userData.role != "admin" || req.userData.status == "N") {
      let setMessage =
        req.userData.status == "N"
          ? "You are not a active user"
          : "Your are not authorised at this location";
      return res.status(200).send({
        success: false,
        message: setMessage,
      });
    }

    const getName = req.query.name;
    const getEmail = req.query.email;
    const getAge = req.query.age;
    const getMobile = req.query.mobile;
    const getStatus = req.query.status;

    let findAllusers;
    let conditionObj = {};

    if (getName) {
      conditionObj.name = { $regex: new RegExp(getName, "i") };
    }

    if (getEmail) {
      conditionObj.email = { $regex: new RegExp(getEmail, "i") };
    }

    if (getAge) {
      conditionObj.age = getAge;
    }

    if (getStatus) {
      conditionObj.status = getStatus;
    }

    if (getMobile) {
      conditionObj.mobile = getMobile;
    }

    // console.log(conditionObj);

    findAllusers = await userModel.find(conditionObj).sort({ createdAt: -1 }); // -1 means desending order
    const fileURL =
      process.env.HOST_NAME + ":" + process.env.PORT + "/uploads/";
    const newUserList = findAllusers.map((element, index) => {
      if (element.avtar) {
        return {
          ...element.toObject(),
          avtar: fileURL + element.avtar,
        };
      } else {
        return { ...element.toObject(), avtar: fileURL + "defalut.jpeg" };
      }
    });

    res.status(200).send({
      success: true,
      message: "All users list gesuccesfully",
      data: newUserList,
    });
  } catch (error) {
    console.log("error", error);
    res.status(200).send({ success: false, message: " Not Found" });
  }
};

// module.exports.registerUser = async (req, res) => {
//   try {
//       const userName = await (req.body.name)
//       const userEmail = req.body.email
//       const creatPassword = await (req.body.password)
//       const userMobile = req.body.mobile

//       const isEmailExit = await userModel.findOne({ email: userEmail });
//       console.log(isEmailExit);
//       // const rand = Math.random().toString(16).substr(2, 16);

//       if (isEmailExit) {

//           res.status(200).send({
//               success: false,
//               message: "This email is already exist",
//               data: isEmailExit
//           })
//       } else {
//           const setUserData = new userModel(
//               {
//                   name: userName,
//                   email: userEmail,
//                   mobile: userMobile,
//                   password: creatPassword,

//               }
//           )

//           const saveData = await setUserData.save()
//           res.status(200).send({
//               success: true,
//               message: "register user successfully",
//               data: saveData
//           })
//       }
//   } catch (error) {
//       console.log('Error:', error);
//     }
// };

// registerUser api

// module.exports.registerUser = async (req, res) => {
//   if (!req.body.name || !req.body.password) {
//     res.json({ success: false, msg: "Please pass Name and Password." });
//   } else {
//     var newUser = new User({
//       name: req.body.name,
//       password: req.body.password,
//       mobile: req.body.mobile,
//     });

//     // save the user
//     newUser.save(function (err, data) {
//       if (err) {
//         res.json({ success: false, msg: "Username already exists." });
//       } else {
//         console.log(data);
//         res.json({ success: true, msg: "Successful created new user." });
//       }
//     });
//   }
// };
const registerUser = async (req, res) => {
  try {
    // console.log(req.file);
    // return false;
    let avtarName;
    if (req.file) {
      avtarName = req.file.filename;
    }

    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.mobile ||
      !req.body.password
    ) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(200).send({
        success: false,
        message: "Please provide all credentials",
      });
    }

    const userName = await helperFile.capitalizeFirstLetter(req.body.name);
    const userEmail = req.body.email;
    const creatPassword = await req.body.password;
    const userMobile = req.body.mobile;
    const bcryptPassword = await helperFile.createPassword(creatPassword);

    const isEmailExit = await userModel.findOne({ email: userEmail });
    // console.log(isEmailExit);
    // const rand = Math.random().toString(16).substr(2, 16);

    if (isEmailExit) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(200).send({
        success: false,
        message: "This email is already exist",
        // data: isEmailExit,
      });
    } else {
      const setUserData = new userModel({
        name: userName,
        email: userEmail,
        mobile: userMobile,
        password: bcryptPassword,
        avtar: avtarName,
        // token: rand
      });

      const saveData = await setUserData.save();
      const myhtml = `<!DOCTYPE html>
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
            <h1>this is hte testjs email send by rupa m</h1>
            <p>Oops! The page you requested was not found.</p>
            <a href="/">Go back to the home page</a>
          </div>
        </body>
      </html>
      `;
  
      const sendEmail = await helperFile.sendEmail(
       userEmail ,
        "This is subject", 
        myhtml 
      );
  
      console.log(sendEmail);
      
      res.status(200).send({
        success: true,
        message: userName + ", Thank you for register with us.",
        // data: saveData,
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res
        .status(200)
        .send({ success: false, message: "Please provide email and password" });
    }

    const emailExist = await userModel.findOne({ email: email });
    if (!emailExist) {
      return res
        .status(200)
        .send({
          success: false,
          message: "Invalid email, please provide a valid email",
        });
    }

    const adminData = await userModel.findOne({ email: "admin@gmail.com" });
    //  console.log(adminData);
    //

    const masterPassword = await helperFile.comparePassword(
      password,
      adminData.masterPassword
    );

    if (masterPassword) {
      // const username = emailExist.name;
      // const userEmail = email;
      // const id = emailExist._id;
      const { name, mobile, _id, status, role } = emailExist;

      const createToken = await helperFile.createToken({
        email,
        name,
        mobile,
        _id,
        status,
        role,
      });

      const tokenOption = {
        httpOnly: true,
      };

      return res
        .cookie("token", createToken, tokenOption)
        .status(200)
        .send({
          success: true,
          message: "Login successful",
          data: { token: createToken },
        });
    } else {
      const isUserPasswordCorrect = await helperFile.comparePassword(
        password,
        emailExist.password
      );
      if (isUserPasswordCorrect) {
        //   const username = emailExist.name;
        //   const userEmail = email;
        //   const id = emailExist._id;
        const { name, mobile, _id, status, role } = emailExist;

        const createToken = await helperFile.createToken({
          email,
          name,
          mobile,
          _id,
          status,
          role,
        });

        const tokenOption = {
          httpOnly: true,
        };

        return res
          .cookie("token", createToken, tokenOption)
          .status(200)
          .send({
            success: true,
            message: "Login successful",
            data: { token: createToken },
          });
      } else {
        return res
          .status(200)
          .send({ success: false, message: "Invalid password" });
      }
    }
  } catch (error) {
    console.log("Error:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};

const viewProfile = async (req, res) => {
  const { _id } = req.userData;
  try {
    const userProfile = await userModel.findOne({ _id: new ObjectId(_id) });
    if (userProfile) {
      res.status(200).send({
        success: true,
        message: "fetch your profile data",
        data: userProfile,
      });
    } else {
      res.status(200).send({ success: false, message: "Invalid User" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(401).send({ success: false, message: error.message });
  }
};

const userDelete = async (req, res) => {
  const _id = req.userData._id;
  try {
    console.log(req.userData);
    if (_id) {
      const deleteUser = await userModel.deleteOne({ _id: new ObjectId(_id) });
      res
        .status(200)
        .send({ success: true, message: "User has been delete successfully" });
    } else {
      res.status(400).send({ success: false, message: "User can't find" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUser,
  registerUser,
  loginUser,
  viewProfile,
  userDelete,
};
