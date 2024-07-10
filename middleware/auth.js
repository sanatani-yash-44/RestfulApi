const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let token = req.cookies.token;
  token =
    token ||
    req.body.token ||
    req.query.token ||
    (req.headers.authorization &&
      req.headers.authorization.replace("Bearer ", ""));

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed: Token missing",
    });
  }

  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  try {
    // console.log(token)
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.userData = decode;
    // console.log(decode);
  } catch (error) {
    res.status(400).send({ success: false, message: "Token Error: " + error });
    return false;
  }
  return next();
};

module.exports = auth;
