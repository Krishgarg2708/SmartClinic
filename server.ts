import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initializer for Gemini API client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment settings.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Global active server check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// AI Feature 1: Analyze reports, medical tests or handwritten text OCR/simplification
app.post("/api/gemini/analyze", async (req: any, res: any) => {
  try {
    const { content, type } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Missing clinical content to analyze." });
    }

    const ai = getGeminiClient();
    let prompt = "";

    if (type === "ocr") {
      prompt = `You are an expert clinical OCR assistant. Extract the patient name, age, symptoms, medications, blood levels, test dates, and values if present in the text below. Extract them in clean markdown table format first, followed by a structured bullet point translation for the patient. Keep descriptions human-literal, simple, and jargon-free.\n\nInput Content:\n${content}`;
    } else if (type === "report") {
      prompt = `You are an expert Medical Report Simplifier. Analyze the following diagnostic test data or report, explain normal vs abnormal ranges (highlighed values), explain what the findings mean in easy, plain English, and provide practical lifestyle and dietary recommendations. Explicitly add a disclaimer at the top stating: "Approved by SmartClinic AI Assistant. Final diagnosis must be certified by a physician."\n\nReport Content:\n${content}`;
    } else if (type === "interaction") {
      prompt = `You are an expert Medicine Interaction Checker. Check the following list of medications for potential drug-drug interactions, risk levels, contraindications, and general food/beverage warning directions. Provide the output in a clearly structured list with risk categories (High, Moderate, Minimal).\n\nMedication List:\n${content}`;
    } else if (type === "prescription") {
      prompt = `You are a clinical prescription assistant. Explain the following prescription in plain, simple terms for the patient: describe what each medicine is for, how it should be taken (morning, noon, night, before/after meals), and potential mild side effects. \n\nPrescription Details:\n${content}`;
    } else {
      prompt = `You are the SmartClinic Enterprise health AI partner. Provide a clinical summary, disease risk prediction, risk level, lifestyle or advice notes, and recommendations based on the history provided below:\n\nClinical History:\n${content}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Analyze Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the Gemini AI service." });
  }
});

// AI Feature 2: Doctor Clinical AI Copilot & Voice Dictation assistance
app.post("/api/gemini/copilot", async (req: any, res: any) => {
  try {
    const { command, notesText } = req.body;
    if (!notesText) {
      return res.status(400).json({ error: "Notes missing." });
    }

    const ai = getGeminiClient();
    const prompt = `You are a Senior Clinical Documentation Copilot. Transform this loose unstructured voice transcription or rapid clinical dictation note into a professional, standard structured EMR section. 
Include sections: 
- Chief Complaints
- Symptoms
- Probable Diagnosis
- Suggested Care Plan and Follow-up Timeline.

Dictated Note: "${notesText}"
Contextual Instruction: ${command || "Formatting as professional standard EMR"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Copilot Error:", error);
    res.status(500).json({ error: error.message || "AI Copilot failed to process command." });
  }
});

// AI Feature 3: Natural language query search engine
app.post("/api/gemini/search", async (req: any, res: any) => {
  try {
    const { query, tableContext } = req.body;
    const ai = getGeminiClient();
    
    const prompt = `You are a clinician's intelligent database assistant for SmartClinic. 
The user typed: "${query}".
Using the clinical dataset provided below (in JSON), filter matches and return:
1. Matching patients/appointments/inventory
2. A short, highly clinical explanation of why they match and any urgent follow-up action.

Return the response in a structured Markdown format with bold highlights.

Clinical JSON Context:
${JSON.stringify(tableContext)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Search Error:", error);
    res.status(500).json({ error: error.message || "Gemini Search process failed." });
  }
});

// Initialize Vite Dev Server or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartClinic Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
