const express = require("express");
const router = express.Router();
const adminAuth = require("../Middlware/AdminMiddlware");
const stdAuth = require("../Middlware/AuthMiddlware");
const { uploadPaper, updatePaper, getAllPapers, getOnePaper, deletePaper } = require("../Controllers/PaperController");
const upload = require("../Middlware/uploadMiddlware");

router.post("/addPaper", adminAuth , upload.single("paper"), uploadPaper);
router.put("/updatePaper/:id", adminAuth, updatePaper);
router.get("/getPaper", stdAuth, getAllPapers);
router.get("/getPaper/:id", adminAuth, getOnePaper);
router.delete("/deletePaper/:id", adminAuth, deletePaper);

module.exports = router;
