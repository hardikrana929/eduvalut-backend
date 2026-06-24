const con = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//Create Student

const stdSignup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const hashPassword = await bcrypt.hash(password, 4);

    const inq = `
      INSERT INTO users(fullname, email, password)
      VALUES(?, ?, ?)
    `;

    // Await pauses execution until the database insertion is completely finished
    await con.execute(inq, [fullname, email, hashPassword]);

    return res.status(201).json({
      message: "Account created successfully",
    });
  } catch (err) {
    console.log(err);

    // If the email already exists in the database, catch it here instantly
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

//Student Login
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK EMAIL EXISTS
    const query = `
      SELECT * FROM users
      WHERE email = ?
    `;

    const [rows] = await con.execute(query, [email]);

    // USER NOT FOUND
    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // GET USER
    const user = rows[0];

    // VERIFY PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    // PASSWORD WRONG
    if (!isMatch) {
      return res.status(401).json({
        message: "Password is not match...",
      });
    }

    // GENERATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "7d",
      },
    );

    // SUCCESS RESPONSE
    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Create admin account
const adminSignup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // 1. Validation (Always a good idea to check for missing fields)
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Increase bcrypt rounds to 10 for actual security
    const hashPass = await bcrypt.hash(password, 10);

    // 3. Force the role to 'admin' so users can't exploit it
    const role = "admin";

    const inq = `INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?);`;

    // 4. Properly await the promise. mysql2 returns [result, fields]
    const [result] = await con.execute(inq, [fullname, email, hashPass, role]);

    // 5. If it succeeds, send the success response out here
    return res.status(201).json({
      message: "Admin account created successfully",
      userId: result.insertId, // Optional: returns the new database ID
    });
  } catch (err) {
    // 5. Any database or hashing errors will automatically catch here
    console.error(err);

    // Tip: Check for duplicate email errors (MySQL error code 'ER_DUP_ENTRY')
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
module.exports = { stdSignup, adminSignup, studentLogin };
