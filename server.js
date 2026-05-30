const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const StdRoute = require("./Routes/StdRoute");
const BranchRouter = require("./Routes/BranchRouter");
const SemesterRouter = require("./Routes/SemesterRouter");
const FeedbackRouter = require("./Routes/FeedbackRouter");
const pdfRouter = require("./Routes/pdfRouter");
const PaperRouter = require("./Routes/PaperRouter");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/api/student", StdRoute);
app.use("/api/branch", BranchRouter);
app.use("/api/semester", SemesterRouter);
app.use("/api/feedback", FeedbackRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/paper", PaperRouter);
app.listen(3000, () => {
  console.log("Server started on port 3000...");
});

module.exports = app;
