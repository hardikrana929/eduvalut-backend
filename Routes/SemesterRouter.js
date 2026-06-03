const express = require("express");
const router = express.Router();
const auth = require("../middleware/AdminMiddlware");
const {
  addSemester,
  updateSemester,
  removeSemester,
  getSemester,
  getOneSemester,
} = require("../Controllers/SemesterController");

router.get("/getSemester", getSemester);

router.get("/getSemester/:id", auth, getOneSemester);

router.post("/addSemester", auth, addSemester);

router.put("/updateSemester/:id", auth, updateSemester);

router.delete("/removeSemester/:id", auth, removeSemester);

module.exports = router;
