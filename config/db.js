const sql = require("mysql2/promise");

const con = sql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "eduvault",
});

console.log("Database connenct...");

// con.connect((err) => {
//   if (err) {
//     console.log("Database connect error");
//   } else {
//     console.log("Database connencted...");
//   }
// });

module.exports = con;
