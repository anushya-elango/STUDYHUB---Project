const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   🧠 Conversation Memory
================================= */

let conversationHistory = [
  {
    role: "system",
    content: `
You are StudyHub AI, a professional academic assistant.

Rules:
- Be clear and structured.
- Give clean code when coding is asked.
- Explain step-by-step when needed.
- Be intelligent but concise.
- Sound natural and human.
`
  }
];

/* ===============================
   💬 Chat Route (Ollama - Phi)
================================= */

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message required" });
    }

    // Add user message
    conversationHistory.push({
      role: "user",
      content: message
    });

    // Keep last 10 messages only
    if (conversationHistory.length > 12) {
      conversationHistory = [
        conversationHistory[0],
        ...conversationHistory.slice(-10)
      ];
    }

    // Convert conversation to single prompt
    const fullPrompt = conversationHistory
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n");

    // Send to Ollama with Phi model ✅
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "phi",         // ✅ Changed from "llama3" to "phi"
      prompt: fullPrompt,
      stream: false
    });

    const aiReply = response.data.response;

    // Save AI reply
    conversationHistory.push({
      role: "assistant",
      content: aiReply
    });

    res.json({ reply: aiReply });

  } catch (error) {
    console.log("🔥 FULL ERROR BELOW:");
    console.log(error.message);

    res.status(500).json({
      reply: "Ollama error. Make sure Ollama is running with: ollama run phi"
    });
  }
});

/* ===============================
   🏥 Health Check
================================= */

app.get("/health", (req, res) => {
  res.send("🤖 StudyHub AI running with Ollama (Phi)!");
});

/* ===============================
   🚀 Start Server
================================= */

app.listen(5000, () => {
  console.log("🚀 Backend running at http://localhost:5000");
  console.log("🤖 StudyHub AI (Phi Model) Ready!");
});