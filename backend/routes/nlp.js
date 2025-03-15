import express from "express";
import { processText, LANGUAGE_MODELS } from "../services/nlpService.js";

const router = express.Router();

// Get available language models
router.get("/models", async (req, res) => {
  try {
    res.json({ models: Object.keys(LANGUAGE_MODELS) });
  } catch (error) {
    console.error("Error fetching language models:", error);
    res.status(500).json({ error: "Error fetching language models" });
  }
});

// Process text with NLP
router.post("/analyze", async (req, res) => {
  try {
    const { text, language = "spanish" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    console.log(
      `Processing text with NLP (${language}):`,
      text.slice(0, 50) + "..."
    );

    const tokens = await processText(text, language);

    res.json({ tokens });
  } catch (error) {
    console.error("Error processing text with NLP:", error);
    res.status(500).json({ error: "Error processing text with NLP" });
  }
});

export default router;
