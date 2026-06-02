const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const StdRoute = require("./routes/StdRoute");
const BranchRouter = require("./routes/BranchRouter");
const SemesterRouter = require("./routes/SemesterRouter");
const FeedbackRouter = require("./routes/FeedbackRouter");
const pdfRouter = require("./routes/pdfRouter");
const PaperRouter = require("./routes/PaperRouter");
const PasswordRouter = require("./routes/PasswordRouter");
const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://eduvalut-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/api/student", StdRoute);
app.use("/api/branch", BranchRouter);
app.use("/api/semester", SemesterRouter);
app.use("/api/feedback", FeedbackRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/paper", PaperRouter);
app.use("/api/pass", PasswordRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});

module.exports = app;
