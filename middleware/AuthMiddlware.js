// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const AuthMiddlware = async (req, res, next) => {
//   try {
//     const auth = req.headers.authorization;
//     if (!auth) {
//       return res.status(401).json({
//         message: "Access Denied.",
//       });
//     }

//     const token = auth.split(" ")[1];
//     const verifyJwt = jwt.verify(token, process.env.JWT_KEY);    
//     req.user = verifyJwt;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Invalid Token",
//     });
//   }
// };

// module.exports = AuthMiddlware;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthMiddlware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Access Denied." });
    }
    const verifyJwt = jwt.verify(token, process.env.JWT_KEY);
    req.user = verifyJwt;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = AuthMiddlware;