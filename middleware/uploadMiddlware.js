// const multer = require("multer");

// const {
//   CloudinaryStorage,
// } = require("multer-storage-cloudinary");

// const cloudinary = require("../config/cloudinary");

// const path = require("path");

// // STORAGE
// const storage = new CloudinaryStorage({
//   cloudinary,

//   params: async (req, file) => {

//     const fileExtention =
//       path.extname(file.originalname);

//     const baseName =
//       path.basename(
//         file.originalname,
//         fileExtention
//       );

//     const cleanName =
//       baseName.replace(/[^a-zA-Z0-9]/g, "_");

//     return {

//       folder: "eduvault-pdf",

//       // IMPORTANT
//       resource_type: "image",

//       format: "pdf",

//       public_id: `${cleanName}-${Date.now()}`,
//     };
//   },
// });

// const upload = multer({
//   storage,

//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },

//   fileFilter: (req, file, cb) => {

//     if (
//       file.mimetype === "application/pdf"
//     ) {

//       cb(null, true);

//     } else {

//       cb(
//         new Error(
//           "Only PDF files allowed!"
//         ),
//         false
//       );
//     }
//   },
// });

// module.exports = upload;
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Ensure the upload directory exists
// const uploadDir = "./public/uploads/pdfs";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
//     cb(null, `${baseName}-${Date.now()}${ext}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "application/pdf") cb(null, true);
//     else cb(new Error("Only PDF files allowed!"), false);
//   }
// });

// module.exports = upload;
const multer = require("multer");
require("dotenv").config();
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  // FILE TYPE VALIDATION
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }

    cb(null, true);
  },
});

module.exports = upload;