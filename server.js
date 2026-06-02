const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const StdRoute = require("./routes/stdRoute");
const BranchRouter = require("./routes/BranchRouter");
const SemesterRouter = require("./routes/SemesterRouter");
const FeedbackRouter = require("./routes/FeedbackRouter");
const pdfRouter = require("./routes/pdfRouter");
const PaperRouter = require("./routes/PaperRouter");
const PasswordRouter = require("./routes/PasswordRouter");

const app = express();

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

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
app.use("/api/student", StdRoute);
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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

module.exports = app;