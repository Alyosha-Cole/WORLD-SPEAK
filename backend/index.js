import express from "express";
import cors from "cors";
import config from "./config/config.js"; // Import config which loads env variables

const app = express();
app.use(cors());
app.use(express.json());

// Import route modules
import chatRoutes from "./routes/chat.js";
import generateExampleRoutes from "./routes/generateExample.js";
import nlpRoutes from "./routes/nlp.js"; // Import our new NLP routes
import ttsRoutes from "./routes/tts.js"; // Import our TTS routes
import wordDetailsRoutes from "./routes/wordDetails.js"; // Import word details routes
import placeholderRoutes from "./routes/placeholder.js"; // Import placeholder image routes

// Set up route handlers
app.use("/api/chat", chatRoutes);
app.use("/api/generateExample", generateExampleRoutes);
app.use("/api/nlp", nlpRoutes); // Add our new NLP routes
app.use("/api/tts", ttsRoutes); // Add our TTS routes
app.use("/api/wordDetails", wordDetailsRoutes); // Add word details routes
app.use("/api/placeholder", placeholderRoutes); // Add placeholder image routes

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
