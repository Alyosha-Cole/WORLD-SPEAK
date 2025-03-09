import express from "express";
import { OpenAI } from "openai";
import { languageTemplates } from "../config/languageTemplates.js";
import config from "../config/config.js";

const router = express.Router();

// Initialize the OpenAI client with the API key from config
const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

router.post("/", async (req, res) => {
  try {
    console.log("Received /api/generateExample request");
    const { word, language = "spanish" } = req.body;
    console.log("Word received:", word);
    console.log("Language:", language);

    if (!word) {
      console.error("No 'word' provided in request body.");
      return res.status(400).json({ error: "No 'word' provided." });
    }

    // Get the appropriate language template
    const template =
      languageTemplates[language.toLowerCase()] || languageTemplates.default;
    const targetLanguage = template.language;

    // Create prompt for generating an example sentence
    const prompt = `Provide a short, simple sentence in ${targetLanguage} using the word "${word}".`;
    console.log("Prompt for example generation:", prompt);

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful ${targetLanguage} tutor. Always respond in ${targetLanguage}, and provide short example sentences.`,
        },
        { role: "user", content: prompt },
      ],
    });
    console.log("OpenAI response for example generation:", response);

    // Extract and send back the generated example
    const generatedExample = response.choices[0].message.content.trim();
    console.log("Generated example:", generatedExample);

    res.json({ generatedExample });
  } catch (error) {
    console.error("Error generating example sentence:", error);
    res.status(500).json({ error: "Error generating example sentence" });
  }
});

export default router;
