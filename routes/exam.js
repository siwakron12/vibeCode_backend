import express from "express";
import { generateExamJson } from "../services/openai.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { subject, difficulty, questionCount, questionType } = req.body || {};

    if (!subject || !difficulty || !questionCount || !questionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const count = Math.min(Math.max(Number(questionCount) || 1, 1), 50);

    const result = await generateExamJson({
      subject,
      difficulty,
      questionCount: count,
      questionType,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
