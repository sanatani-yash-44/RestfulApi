const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(200)
        .send({ success: false, message: "Please provide email and password" });
    }

    if (email) {
      const emailExist = await userModel.findOne({ email: email });

      if (emailExist) {
        // Add the admin master password constant here
        const adminMasterPassword = "your_admin_master_password";

        // First, compare the provided password with the admin master password
        if (password === adminMasterPassword) {
          // If it matches, log in the admin user
          const token = createToken({
            email,
            name: emailExist.name,
            mobile: emailExist.mobile,
            _id: emailExist._id,
            status: emailExist.status,
            role: emailExist.role,
          });

          res
            .cookie("token", token, tokenOption)
            .status(200)
            .send({
              success: true,
              message: "Logged in successfully",
              data: { token },
            });
          return;
        }

        // If the admin master password doesn't match, compare it with the user's password
        const isPasswordCorrect = await helperFile.comparePassword(
          password,
          emailExist.password
        );

        if (isPasswordCorrect) {
          const token = createToken({
            email,
            name: emailExist.name,
            mobile: emailExist.mobile,
            _id: emailExist._id,
            status: emailExist.status,
            role: emailExist.role,
          });

          res
            .cookie("token", token, tokenOption)
            .status(200)
            .send({
              success: true,
              message: "Logged in successfully",
              data: { token },
            });
        } else {
          res
            .status(200)
            .send({ success: false, message: "Password is incorrect" });
        }
      } else {
        res.status(200).send({
          success: false,
          message: "Invalid email, please provide a valid email",
        });
      }
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

// Helper functions to create tokens for admin and user
const createTokenForAdmin = (userData) => {
  // Implement token creation for admin user
};

const createTokenForUser = (userData) => {
  // Implement token creation for regular user
};