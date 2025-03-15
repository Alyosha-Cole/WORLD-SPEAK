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
    const { text, voiceId = "IRjsPfajDk6jveoGo3jI", speed = 0.7 } = req.body;
    console.log("Text received:", text.substring(0, 100) + "...");
    console.log("Voice ID:", voiceId);
    console.log("Speed:", speed);

    if (!text) {
      console.error("No 'text' provided in request body.");
      return res.status(400).json({ error: "No 'text' provided." });
    }

    // Call ElevenLabs API with the speed parameter included
    const audioStream = await elevenLabs.textToSpeech.convert(voiceId, {
      output_format: "mp3_44100_128",
      text: text,
      model_id: "eleven_multilingual_v2",
      speed: speed, // Adjust speech speed between 0.7 and 1.2
    });

    // Set appropriate headers for audio data
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", 'attachment; filename="speech.mp3"');

    // Convert the stream to a Node readable stream and pipe it directly to the response
    if (audioStream instanceof ReadableStream) {
      const nodeReadable = Readable.fromWeb(audioStream);
      nodeReadable.pipe(res);
    } else {
      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
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
