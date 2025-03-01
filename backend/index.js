// backend/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Create a new OpenAI client instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 1) Chat endpoint: /api/chat
 */
app.post("/api/chat", async (req, res) => {
  try {
    console.log("Received /api/chat request");
    const { messages } = req.body;
    console.log("Messages received:", messages);

    if (!Array.isArray(messages)) {
      console.error("Invalid request: 'messages' is not an array.");
      return res
        .status(400)
        .json({ error: "Invalid request. 'messages' should be an array." });
    }

    // Convert user-supplied messages to the format needed by OpenAI
    const sanitizedMessages = messages.map((msg) => ({
      role: msg.role,
      content:
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content),
    }));
    console.log("Sanitized messages:", sanitizedMessages);

    // Prepend a system message to force Spanish responses
    const conversation = [
      {
        role: "system",
        content:
          "Eres un tutor de español servicial. Responde siempre en español, sin importar lo que el usuario escriba.",
      },
      ...sanitizedMessages,
    ];
    console.log("Full conversation sent to OpenAI:", conversation);

    // Call OpenAI's Chat Completion API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
    });
    console.log("OpenAI API response:", response);

    // Extract the assistant's message from the response
    const assistantMessage = response.choices[0].message.content;
    console.log("Assistant message:", assistantMessage);

    res.json({ assistant: assistantMessage });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Error calling the OpenAI API" });
  }
});

/**
 * 2) Example generation endpoint: /api/generateExample
 */
app.post("/api/generateExample", async (req, res) => {
  try {
    console.log("Received /api/generateExample request");
    const { word } = req.body;
    console.log("Word received:", word);

    if (!word) {
      console.error("No 'word' provided in request body.");
      return res.status(400).json({ error: "No 'word' provided." });
    }

    // Create a specialized prompt for generating a short example sentence
    const prompt = `Proporciona una oración corta en español usando la palabra "${word}".`;
    console.log("Prompt for example generation:", prompt);

    // Call the OpenAI Chat Completion API for a short Spanish sentence
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful Spanish tutor. Always respond in Spanish, and provide short example sentences.",
        },
        { role: "user", content: prompt },
      ],
    });
    console.log("OpenAI response for example generation:", response);

    // Extract the generated example and trim extra whitespace
    const generatedExample = response.choices[0].message.content.trim();
    console.log("Generated example:", generatedExample);

    res.json({ generatedExample });
  } catch (error) {
    console.error("Error generating example sentence:", error);
    res.status(500).json({ error: "Error generating example sentence" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
