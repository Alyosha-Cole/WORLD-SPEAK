import express from "express";
import { ElevenLabsClient } from "elevenlabs";
import config from "../config/config.js";
import { Readable } from "stream";

const router = express.Router();

// Initialize the ElevenLabs client
const elevenLabs = new ElevenLabsClient({
  apiKey: config.elevenLabsApiKey,
});

router.post("/", async (req, res) => {
  try {
    console.log("Received /api/tts request");
    const { text, voiceId = "IRjsPfajDk6jveoGo3jI" } = req.body;
    console.log("Text received:", text.substring(0, 100) + "..."); // Log first 100 chars
    console.log("Voice ID:", voiceId);

    if (!text) {
      console.error("No 'text' provided in request body.");
      return res.status(400).json({ error: "No 'text' provided." });
    }

    // Call ElevenLabs API
    const audioStream = await elevenLabs.textToSpeech.convert(voiceId, {
      output_format: "mp3_44100_128",
      text: text,
      model_id: "eleven_multilingual_v2",
    });

    // Set appropriate headers for audio data
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", 'attachment; filename="speech.mp3"');

    // Convert the stream to a Node readable stream and pipe it directly to the response
    if (audioStream instanceof ReadableStream) {
      const nodeReadable = Readable.fromWeb(audioStream);
      nodeReadable.pipe(res);
    } else {
      // Handle if it's already a buffer or other format
      // First collect all chunks
      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }

      // Convert collected chunks to a single buffer and send
      const buffer = Buffer.concat(chunks);
      res.send(buffer);
    }
  } catch (error) {
    console.error("Error generating speech:", error);
    res
      .status(500)
      .json({ error: "Error generating speech", details: error.message });
  }
});

export default router;
