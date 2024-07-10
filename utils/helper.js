const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"), function (
      error,
      success
    ) {
      if (error) throw error;
    });
  },
  filename: function (req, file, cb) {
    let name;
    if (req.body.name) {
      name =
        req.body.name.replace(/\s+/g, "_") +
        "_" +
        Date.now() +
        "_" +
        file.originalname.replace(/\s+/g, "");
    } else {
      name = Date.now() + "_" + file.originalname.replace(/\s+/g, "");
    }
    cb(null, name, function (error1, success1) {
      if (error1) throw error1;
    });
  },
});

const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

const createPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    console.log("Error in createPassword:", error.message);
    return error.message;
  }
};

const comparePassword = async (plainPawword, hashPassword) => {
  try {
    const isComparePassword = await bcrypt.compare(plainPawword, hashPassword);
    return isComparePassword;
  } catch (error) {
    console.log("Error in createPassword:", error.message);
    return error.message;
  }
};

const capitalizeFirstLetter = (userName) => {
  return userName.charAt(0).toUpperCase() + userName.slice(1);
};

const createToken = async (data) => {
  try {
    const token = jwt.sign(data, process.env.SECRET_KEY, {
      expiresIn: "48h", // expires in 48 hours
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = async (token) => {
  try {
    const decodeData = jwt.verify(token, process.env.SECRET_KEY);
    return decodeData;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const sendEmail = async (toEmail, subject, html) => {
  try {
    const SMTP = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "yashsaini1508y@gmail.com",
        pass: "hafz azhq qkha mnah",
      },
    };

    const transporter = nodemailer.createTransport(SMTP);

    const mailOptions = {
      from: SMTP.email,
      to: toEmail,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message);
        return false;

        // res.status(400).send({ sucess: false, message: error.message });
      } else {
        // res.status(200).send({ sucess: true, message: "Email sent: " + info.response });
        console.log("Email sent: " + info.response);
        return true;
      }
    });
  } catch (error) {
    // res.status(400).send({ sucess: false, message: error.message });
    return false;
  }
};

module.exports = {
  createPassword,
  capitalizeFirstLetter,
  comparePassword,
  createToken,
  verifyToken,
  uploadImage,
  sendEmail,
};



// export default helper