const express = require("express");
const router = express.Router();
const { uploadPdf, getPdfs, updatePdf, deletePdf, getOnePdfs } = require("../Controllers/pdfController");
const adminAuth = require("../Middlware/AdminMiddlware");
const stdAuth = require("../Middlware/AuthMiddlware");
const upload = require("../Middlware/uploadMiddlware");

router.post("/addPdf", adminAuth, upload.single("pdf"), uploadPdf);
router.get("/getPdfs", stdAuth, getPdfs);
router.put("/updatePdf/:id", adminAuth, upload.single("pdf"), updatePdf);
router.get("/getPdfs/:id", adminAuth, getOnePdfs);
router.delete("/deletePdf/:id", adminAuth, deletePdf);

module.exports = router;