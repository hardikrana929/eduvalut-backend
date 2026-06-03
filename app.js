const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const stdRouter = require("./Routes/stdRouter");
const BranchRouter = require("./Routes/BranchRouter");
const SemesterRouter = require("./Routes/SemesterRouter");
const FeedbackRouter = require("./Routes/FeedbackRouter");
const pdfRouter = require("./Routes/pdfRouter");
const PaperRouter = require("./Routes/PaperRouter");
const PasswordRouter = require("./Routes/PasswordRouter");

const app = express();

// CORS
app.use(cors({
  origin: "https://eduvalut-backend.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("/{*path}", cors());

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running...");
});

// ROUTES
app.use("/api/student", stdRouter);
app.use("/api/branch", BranchRouter);
app.use("/api/semester", SemesterRouter);
app.use("/api/feedback", FeedbackRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/paper", PaperRouter);
app.use("/api/pass", PasswordRouter);

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;