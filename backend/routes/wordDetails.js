import express from "express";
import { OpenAI } from "openai";
import config from "../config/config.js";

const router = express.Router();

// Initialize the OpenAI client with the API key from config
const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

router.post("/", async (req, res) => {
  try {
    console.log("Received /api/wordDetails request");
    const { word, language = "spanish", pos } = req.body;

    if (!word) {
      return res.status(400).json({ error: "No word provided" });
    }

    console.log(`Getting details for word "${word}" in ${language}`);

    // Building prompt for generating word details
    const languagePrompts = {
      spanish: `
        Provide comprehensive details about the Spanish word "${word}" (part of speech: ${
        pos || "unknown"
      }).
        Include:
        1. A brief English translation
        2. Two example sentences in Spanish that illustrate how to use this word
        3. Two separate explanations:
           - A clear explanation in Spanish (target language)
           - A clear explanation in English (native language)
        Structure the response as a JSON object with these fields:
        {
          "word": "${word}",
          "pos": "part of speech",
          "translation": "brief English translation",
          "examples": ["example sentence 1", "example sentence 2"],
          "explanation": {
            "target": "explanation in Spanish",
            "native": "explanation in English"
          }
        }
      `,
      russian: `
        Provide comprehensive details about the Russian word "${word}" (part of speech: ${
        pos || "unknown"
      }).
        Include:
        1. A brief English translation
        2. Two example sentences in Russian that illustrate how to use this word
        3. Two separate explanations:
           - A clear explanation in Russian (target language)
           - A clear explanation in English (native language)
        Structure the response as a JSON object with these fields:
        {
          "word": "${word}",
          "pos": "part of speech",
          "translation": "brief English translation",
          "examples": ["example sentence 1", "example sentence 2"],
          "explanation": {
            "target": "explanation in Russian",
            "native": "explanation in English"
          }
        }
      `,
    };

    const prompt = languagePrompts[language] || languagePrompts.spanish;

    // Call OpenAI's Chat Completion API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a language learning assistant that provides detailed information about words in various languages.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    // Parse the JSON response
    const responseContent = response.choices[0].message.content;
    const wordDetails = JSON.parse(responseContent);

    res.json(wordDetails);
  } catch (error) {
    console.error("Error getting word details:", error);
    res.status(500).json({ error: "Error getting word details" });
  }
});

export default router;
