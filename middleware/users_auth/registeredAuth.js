
//Checking with help of payload through the decoded token if user_permissions == 2, if yes so next()

const jwt = require("jsonwebtoken");

const jwtAuth = async (req, res, next) => {


  try {
const token = req.headers.authorization.split(' ')[1];



    if (!token) {
      
      throw new Error("No token provided");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      throw new Error("No decoded token provided");
    }

    // console.log(decode)

    const registered = 1
    const editor = 2
    const manager = 3

   if(decode.user_permission !== registered && decode.user_permission !== editor && decode.user_permission !== manager) {
      throw new Error("Restricted access allowed for registered users editors and managers only")
    }

    next();
    
  } catch (error) {
    return res.status(500).json({
      message: "authentication failed",
      error: error.message,
    });
  }
};

module.exports = jwtAuth