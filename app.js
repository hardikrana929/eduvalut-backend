const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const stdRouter = require("./Routes/stdRouter");
const BranchRouter = require("./Routes/BranchRouter");
const SemesterRouter = require("./Routes/SemesterRouter");
const FeedbackRouter = require("./Routes/FeedbackRouter");
const pdfRouter = require("./Routes/pdfRouter");
const PaperRouter = require("./Routes/PaperRouter");
const PasswordRouter = require("./Routes/PasswordRouter");
const helmet = require('helmet');

const app = express();
// 1. Extract your specific Supabase domain safely from your .env variable
// (Assumes your env variable is named SUPABASE_URL)
let supabaseDomain = "*.supabase.co";
if (process.env.SUPABASE_URL) {
  try {
    supabaseDomain = new URL(process.env.SUPABASE_URL).hostname;
  } catch (e) {
    console.error("Invalid SUPABASE_URL in environment variables:", e.message);
  }
}

// 2. Activate Helmet with your dynamic domain
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    // Allows images from your local server and your specific Supabase project
    imgSrc: ["'self'", supabaseDomain, "data:"],
    // Allows your frontend to load and display PDFs directly from your Supabase storage
    objectSrc: ["'self'", supabaseDomain],
    frameSrc: ["'self'", supabaseDomain],
  }
}));

//Cookie Parse
app.use(cookieParser());

// CORS
app.use(cors({
  origin: "https://eduvalut-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
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

module.exports = app;