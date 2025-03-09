import express from "express";
import { OpenAI } from "openai";
import { languageTemplates } from "../config/languageTemplates.js";

const router = express.Router();

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
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

    // Sanitize messages for OpenAI
    const sanitizedMessages = messages.map((msg) => ({
      role: msg.role,
      content:
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content),
    }));
    console.log("Sanitized messages:", sanitizedMessages);

    // Create a custom system message
    const systemMessage = {
      role: "system",
      content: template.systemPrompt(person),
    };

    // Build the conversation
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

export default router;
