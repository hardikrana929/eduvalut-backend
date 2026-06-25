const con = require("../config/db");

//Get all semester
const getSemester = async (req, res) => {
  try {
    const query = "select * from semesters";
    const [result] = await con.query(query);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

//Get one semester
const getOneSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `select * from semesters where id=?`;
    const [result] = await con.query(query, [id]);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

//Add semester
const addSemester = async (req, res) => {
  try {
    const { semesterName } = req.body;
    const query = `insert into semesters(semester_name) values (?)`;
    if (!semesterName) {
      return res.status(400).json({ message: "All Fields are required." });
    }
    con.execute(query, [semesterName]);
    return res.status(201).json({
      message: "Semester created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};
//Update semester
const updateSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const { semesterName } = req.body;
    if (!semesterName) {
      return res.status(400).json({ message: "All Fields are required." });
    }
    const upquery = `update semesters set semester_name=? where id=?`;
    con.execute(upquery, [semesterName, id]);
    return res.status(200).json({
      message: "Semester Updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Remove semester
const removeSemester = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "All Fields are required." });
    }
    const rquery = `delete from semesters where id=?`;
    con.execute(rquery, [id]);
    return res.status(200).json({
      message: "Semester Deleted Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addSemester,
  updateSemester,
  removeSemester,
  getSemester,
  getOneSemester,
};
