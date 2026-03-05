import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
  });
}

const db = admin.database();

// AI Generation Route
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, theme, pages = ["Home"] } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const systemInstruction = `
      You are NebulaForge AI, a world-class website generator.
      Generate a complete, modern, responsive website based on the user prompt.
      Return a JSON object with the following structure:
      {
        "pages": [
          {
            "name": "Home",
            "html": "...",
            "seo": { "title": "...", "description": "..." }
          }
        ],
        "theme": {
          "colors": { "primary": "...", "secondary": "...", "bg": "...", "text": "..." },
          "fonts": { "heading": "...", "body": "..." }
        }
      }
      Use Tailwind CSS for all styling. Ensure high-quality, professional design.
      The HTML should be a complete body content (no <html> or <head> tags, just the inner content).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Prompt: ${prompt}\nTheme: ${theme}\nPages: ${pages.join(", ")}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: "Failed to generate website" });
  }
});

// AI Redesign Route
app.post("/api/redesign", async (req, res) => {
  try {
    const { html, instruction } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Redesign the following HTML based on this instruction: ${instruction}\n\nHTML:\n${html}`,
      config: {
        systemInstruction: "You are a UI/UX expert. Return ONLY the modified HTML content. No markdown, no explanations.",
      },
    });

    res.json({ html: response.text });
  } catch (error) {
    res.status(500).json({ error: "Redesign failed" });
  }
});

// Projects API
app.get("/api/projects", async (req, res) => {
  const { userId } = req.query;
  try {
    const snapshot = await db.ref('projects').orderByChild('userId').equalTo(userId as string).once('value');
    const data = snapshot.val();
    const projects = data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) : [];
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// AI Analytics Simulator
app.get("/api/analytics", async (req, res) => {
  const { projectId } = req.query;
  const data = {
    visits: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
    conversions: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20)),
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };
  res.json(data);
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
