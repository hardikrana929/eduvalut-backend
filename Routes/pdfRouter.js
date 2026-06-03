const express = require("express");
const router = express.Router();
const { uploadPdf, getPdfs, updatePdf, deletePdf, getOnePdfs } = require("../Controllers/pdfController");
const adminAuth = require("../middleware/AdminMiddlware");
const stdAuth = require("../middleware/AuthMiddlware");
const upload = require("../middleware/uploadMiddlware");

router.post("/addPdf", adminAuth, upload.single("pdfs"), uploadPdf);
router.get("/getPdfs", stdAuth, getPdfs);
router.put("/updatePdf/:id", adminAuth, upload.single("pdfs"), updatePdf);
router.get("/getPdfs/:id", adminAuth, getOnePdfs);
router.delete("/deletePdf/:id", adminAuth, deletePdf);

module.exports = router;