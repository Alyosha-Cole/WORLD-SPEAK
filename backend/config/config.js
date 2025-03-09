import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate essential environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY is missing in your .env file");
  process.exit(1);
}

export default {
  openaiApiKey: process.env.OPENAI_API_KEY,
  port: process.env.PORT || 5000,
};
