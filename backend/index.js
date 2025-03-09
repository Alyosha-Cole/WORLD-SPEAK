import express from "express";
import cors from "cors";
import config from "./config/config.js"; // Import config which loads env variables

const app = express();
app.use(cors());
app.use(express.json());

// Import route modules
import chatRoutes from "./routes/chat.js";
import generateExampleRoutes from "./routes/generateExample.js";
import ttsRoutes from "./routes/tts.js";

// Set up route handlers
app.use("/api/chat", chatRoutes);
app.use("/api/generateExample", generateExampleRoutes);
app.use("/api/tts", ttsRoutes);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
