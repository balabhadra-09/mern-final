import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const flowSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Flow = mongoose.model("Flow", flowSchema);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("❌ MongoDB error:", e.message));

const FREE_MODELS = [
  { model: "meta-llama/llama-3.3-70b-instruct:free", exclude: ["Venice"] },
  { model: "google/gemma-3-27b-it:free", exclude: ["Venice"] },
  { model: "google/gemma-3-12b-it:free", exclude: ["Venice"] },
  { model: "google/gemma-3-4b-it:free", exclude: ["Venice"] },
  { model: "nvidia/llama-3.3-nemotron-super-49b-v1:free", exclude: ["Venice"] },
  // fallback — no provider restriction
  { model: "meta-llama/llama-3.3-70b-instruct:free", exclude: [] },
  { model: "google/gemma-3-27b-it:free", exclude: [] },
];

async function askAI(prompt) {
  for (const { model, exclude } of FREE_MODELS) {
    try {
      console.log(`Trying: ${model} (exclude: ${exclude.join(",") || "none"})`);

      const body = {
        model,
        messages: [{ role: "user", content: prompt }],
      };

      if (exclude.length > 0) {
        body.provider = { ignore: exclude };
      }

      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "MERN AI Flow",
        },
        body: JSON.stringify(body),
      });

      const text = await r.text();
      if (!text) continue;

      const data = JSON.parse(text);
      if (data.error) { console.log(`Failed: ${data.error.message}`); continue; }

      const answer = data.choices?.[0]?.message?.content;
      if (!answer) continue;

      console.log(`✅ Success: ${model}`);
      return answer;
    } catch (e) {
      console.log(`Error: ${e.message}`);
      continue;
    }
  }
  throw new Error("All models failed. Please try again in a moment.");
}

app.post("/api/ask-ai", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt required" });
  try {
    const answer = await askAI(prompt);
    res.json({ answer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/save", async (req, res) => {
  const { prompt, response } = req.body;
  if (!prompt || !response)
    return res.status(400).json({ error: "prompt and response required" });
  try {
    const doc = await Flow.create({ prompt, response });
    res.json({ success: true, id: doc._id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const docs = await Flow.find().sort({ createdAt: -1 }).limit(20);
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(5002, () => console.log("🚀 Backend running on http://localhost:5002"));