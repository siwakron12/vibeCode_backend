import express from "express";
import cors from "cors";
import examRouter from "../routes/exam.js";

const app = express();

/*
  CORS
  origin: true = สะท้อน origin ที่ยิงมา
  ใช้ได้ทั้ง production preview ของ Vercel
*/
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// สำคัญมากสำหรับ preflight
app.options("*", cors());

app.use(express.json());

// health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/api/exams", examRouter);

// error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

/*
  ❗ ห้ามมี app.listen บน Vercel
  ต้อง export default เท่านั้น
*/
export default app;