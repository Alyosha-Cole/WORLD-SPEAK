import express from "express";
import { createCanvas } from "canvas";

const router = express.Router();

router.get("/:width/:height", (req, res) => {
  try {
    const width = parseInt(req.params.width) || 300;
    const height = parseInt(req.params.height) || 200;
    const text = req.query.text || "Placeholder";

    // Create a canvas with the requested dimensions
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fill with a light gray background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, width, height);

    // Add a border
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Add the text
    ctx.font = `${Math.min(width / 10, 24)}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#666666";

    // Limit text length and add ellipsis if needed
    let displayText = text;
    if (text.length > 15) {
      displayText = text.substring(0, 15) + "...";
    }

    ctx.fillText(displayText, width / 2, height / 2);

    // Return the image as PNG
    res.setHeader("Content-Type", "image/png");
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error("Error generating placeholder image:", error);
    res.status(500).send("Error generating placeholder image");
  }
});

export default router;
