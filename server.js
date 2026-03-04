import express from "express";
import cors from "cors";
import { config } from "./config.js";
import examRouter from "./routes/exam.js";

const app = express();
const port = config.port;

app.use(cors({
  origin: true
}));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/exams", examRouter);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Exam generator API listening on port ${port}`);
});
