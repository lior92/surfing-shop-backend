const jwt = require("jsonwebtoken");

const jtwAuth = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];


    if (!token) {
      throw new Error("Invalid token");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
 

    if(!decode){
      throw new Error('token cant be verify')
    }

    return res.status(201).json({
      success:true,
      decode
    })
  


    
  } catch (error) {
    return res.status(500).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};

module.exports = jtwAuth