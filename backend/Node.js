import fetch from "node-fetch";

const API_KEY = "AIzaSyDHcFp7mVjok8Ynbew9PFarztTFk2sCgIU";

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + API_KEY,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: "Hello Gemini" }]
      }]
    })
  }
);

console.log(await response.json());
