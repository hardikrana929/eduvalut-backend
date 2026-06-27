const e = require("express");
const con = require("../config/db");

//User Create Feedback
const createFeedback = async (req, res) => {
  try {
    const { userId, rating, message } = req.body;

    if (!userId || !rating || !message) {
      return res.status(400).json({
        message: "All fields are required.",
      })
    }
    const query = `insert into feedback (user_id,rating,message) values(?,?,?)`;

    await con.execute(query, [userId, rating, message]);

    return res.status(201).json({
      message: "Feedback send Successfully.",
    });
  } catch (error) {

    return (
      res.status(500),
      json({
        message: "Server Error",
        error: error.message,
      })
    );
  }
};

//Get all feedback
const getFeedback = async (req, res) => {
  try {
    const query = `select feedback.*,users.fullname from feedback JOIN users on feedback.user_id = users.id`;
    const [result] = await con.query(query);

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return (
      res.status(500),
      json({
        message: "Server Error",
        error: error.message,
      })
    );
  }
};

//Delete Feedback
const delteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deQuer = `delete from feedback where id=?`;

    const result = await con.query(deQuer, [id]);
    return res.status(200).json({
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    return (
      res.status(500),
      json({
        message: "Server Error",
        error: error.message,
      })
    );
  }
}

module.exports = { createFeedback, getFeedback, delteFeedback };
