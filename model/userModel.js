const mongoose = require("mongoose");


// const user ={
//   name:"yash",
//   email:"yashsaini123@gmail.com",
//   password:"12345"
//   masterPassword:"12345",
//   avtar: "ysdh",
//   mobile:"1234567892",
//   role:"admin",
//   token:"ggjjgjggj",
//   status:"Y"

// }
const Users = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },  
    masterPassword: {
      type: String,
      default: null,
    }, 
    mobile: {
      type: String,
      required: true,
    },
    avtar: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "N",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", Users);
