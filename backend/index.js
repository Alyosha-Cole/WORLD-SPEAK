import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Import route modules
import chatRoutes from "./routes/chat.js";
import generateExampleRoutes from "./routes/generateExample.js";

// Set up route handlers
app.use("/api/chat", chatRoutes);
app.use("/api/generateExample", generateExampleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
