// getVoices.js
import dotenv from "dotenv";
dotenv.config();

import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

async function getVoices() {
  try {
    const voices = await client.voices.getAll();
    console.log("Available Voices:", voices);
    return voices;
  } catch (error) {
    console.error("Error fetching voices:", error);
  }
}

getVoices();
