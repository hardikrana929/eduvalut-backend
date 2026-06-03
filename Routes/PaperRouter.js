const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/AdminMiddlware");
const stdAuth = require("../middleware/AuthMiddlware");
const { uploadPaper, updatePaper, getAllPapers, getOnePaper, deletePaper } = require("../Controllers/PaperController");
const upload = require("../middleware/uploadMiddlware");

router.post("/addPaper", adminAuth , upload.single("pdfs"), uploadPaper);
router.put("/updatePaper/:id", adminAuth, updatePaper);
router.get("/getPaper", stdAuth, getAllPapers);
router.get("/getPaper/:id", adminAuth, getOnePaper);
router.delete("/deletePaper/:id", adminAuth, deletePaper);

module.exports = router;
