const express = require("express");
const router = express.Router();

const {
  createFeedback,
  getFeedback,
  delteFeedback,
} = require("../controllers/feedbackController");

const auth = require("../middleware/AuthMiddlware");
const adminAuth = require("../middleware/AdminMiddlware");

router.get("/getFeedback", adminAuth, getFeedback);

router.post("/addFeedback", auth, createFeedback);

router.delete("/deleteFeedback/:id", adminAuth, delteFeedback);

module.exports = router;
