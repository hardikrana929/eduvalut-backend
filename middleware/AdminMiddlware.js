const jwt = require("jsonwebtoken");
require("dotenv").config();
const AdminMiddlware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access Denied. No token provided in the headers.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only Admin access permitted.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication Failed! Invalid or expired token.",
      error: error.message,
    });
  }
};

module.exports = AdminMiddlware;
