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

// Middleware
app.use(express.json());

app.use(cors({
  origin: "https://eduvalut-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

// Routes
app.use("/api/student", StdRoute);
app.use("/api/branch", BranchRouter);
app.use("/api/semester", SemesterRouter);
app.use("/api/feedback", FeedbackRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/paper", PaperRouter);
app.use("/api/pass", PasswordRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("EduVault Backend Running...");
});

module.exports = app;