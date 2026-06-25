const con = require("../config/db");

//Get all branch
const getBranch = async (req, res) => {
  try {
    const query = "select * from branches";
    const [result] = await con.query(query);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Get one Branch
const getoneBranch = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `select * from branches where id=?`;
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
//Add branch
const addBranch = async (req, res) => {
  try {
    const { branchName } = req.body;

    // Quick validation to prevent inserting empty data
    if (!branchName) {
      return res.status(400).json({ message: "Branch name is required." });
    }

    const query = `INSERT INTO branches(branch_name) VALUES (?)`;

    con.execute(query, [branchName]);
    return res.status(201).json({
      message: "Branch Created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error!",
      error: error.message,
    });
  }
};

//Update Branch
const changeBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchName } = req.body;
    if (!branchName || !id) {
      return res.status(400).json({ message: "Branch name and ID is required." });
    }
    const upquery = `update branches set branch_name=? where id=?`;
    con.execute(upquery, [branchName, id]);
    return res.status(200).json({
      message: "Branch Updated Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Remove branchs
const removeBranch = (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "All Fields are required." });
    }
    const query = `delete from branches where id=?`;

    con.execute(query, [id]);
    return res.status(200).json({
      message: "Branch remove Successfylly.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
module.exports = {
  addBranch,
  changeBranch,
  removeBranch,
  getBranch,
  getoneBranch,
};
