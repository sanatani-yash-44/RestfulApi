const contactModel = require("../model/contactModel");

const getAllContact = async (req, res) => {
  try {
    // console.log(bcryptPassword);

    const userName =  req.body.name;
    const userEmail = req.body.email;
    const userMobile = req.body.mobile;
    const userMessage = req.body.message;  
    //
      const setUserData = contactModel({
        name: userName,
        email: userEmail,
        mobile: userMobile,
        message: userMessage,
      });

      const saveData = await setUserData.save();
      res.status(200).send({
        success: true,
        message: userName + ", Thank you for contact with us.",
        // data: saveData,
      });
    
  } catch (error) {
    console.log("Error:", error);
  }
};

module.exports = { getAllContact };
