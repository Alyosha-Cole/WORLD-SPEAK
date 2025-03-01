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

// Language template mapping
const languageTemplates = {
  spanish: {
    systemPrompt: (person) => `You are ${person.name}, a ${
      person.occupation
    } from ${person.location || "your country"}. 
    ${person.description}
    
    Always respond in Spanish in a way that reflects your background, personality, and profession.
    Keep responses relatively short (2-4 sentences) to encourage back-and-forth conversation.
    If asked about topics you're knowledgeable about based on your occupation and background, provide helpful insights.
    If asked about personal details not specified, create consistent, plausible details that match your character.`,
    language: "Spanish",
  },
  russian: {
    systemPrompt: (person) => `You are ${person.name}, a ${
      person.occupation
    } from ${person.location || "your country"}. 
    ${person.description}
    
    Always respond in Russian in a way that reflects your background, personality, and profession.
    Keep responses relatively short (2-4 sentences) to encourage back-and-forth conversation.
    If asked about topics you're knowledgeable about based on your occupation and background, provide helpful insights.
    If asked about personal details not specified, create consistent, plausible details that match your character.`,
    language: "Russian",
  },
  // Add more languages as needed
  default: {
    systemPrompt: (person) => `You are ${person.name}, a ${
      person.occupation
    } from ${person.location || "your country"}. 
    ${person.description}
    
    Always respond in Spanish in a way that reflects your background, personality, and profession.
    Keep responses relatively short (2-4 sentences) to encourage back-and-forth conversation.
    If asked about topics you're knowledgeable about based on your occupation and background, provide helpful insights.
    If asked about personal details not specified, create consistent, plausible details that match your character.`,
    language: "Spanish",
  },
};

/**
 * 1) Chat endpoint: /api/chat
 */
app.post("/api/chat", async (req, res) => {
  try {
    console.log("Received /api/chat request");
    const { messages, person, language = "spanish" } = req.body;
    console.log("Messages received:", messages);
    console.log("Person info:", person);
    console.log("Language:", language);

    if (!Array.isArray(messages)) {
      console.error("Invalid request: 'messages' is not an array.");
      return res
        .status(400)
        .json({ error: "Invalid request. 'messages' should be an array." });
    }

    // Get the appropriate language template
    const template =
      languageTemplates[language.toLowerCase()] || languageTemplates.default;

    // Convert user-supplied messages to the format needed by OpenAI
    const sanitizedMessages = messages.map((msg) => ({
      role: msg.role,
      content:
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content),
    }));
    console.log("Sanitized messages:", sanitizedMessages);

    // Create a custom system message based on the person
    const systemMessage = {
      role: "system",
      content: template.systemPrompt(person),
    };

    // Build the conversation with our custom system message
    const conversation = [systemMessage, ...sanitizedMessages];
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
    const { word, language = "spanish" } = req.body;
    console.log("Word received:", word);
    console.log("Language:", language);

    if (!word) {
      console.error("No 'word' provided in request body.");
      return res.status(400).json({ error: "No 'word' provided." });
    }

    // Get the appropriate language
    const template =
      languageTemplates[language.toLowerCase()] || languageTemplates.default;
    const targetLanguage = template.language;

    // Create a specialized prompt for generating a short example sentence
    const prompt = `Provide a short, simple sentence in ${targetLanguage} using the word "${word}".`;
    console.log("Prompt for example generation:", prompt);

    // Call the OpenAI Chat Completion API for a short sentence
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
