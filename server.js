import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.OPENROUTER_API_KEY) {
  console.warn("Missing OpenRouter API key. Please set OPENROUTER_API_KEY in your .env file.");
} else {
  console.log("OpenRouter API key loaded successfully.");
}

app.post("/api/recipe", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "Ingredients array is required." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Recipe Generator App"
      },
      body: JSON.stringify({
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages: [
          {
            role: "system",
            content: `
              You are a helpful chef assistant.
              When given ingredients, reply with a detailed recipe — include:
              - A recipe title (use markdown heading)
              - Ingredient list (use markdown bullets)
              - Numbered cooking steps
              - A short description
              Format your response in **markdown** for rendering on a web page.
            `
          },
          {
            role: "user",
            content: `I have ${ingredients.join(", ")}. Suggest a creative recipe using these ingredients.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`OpenRouter error (${response.status}): ${text}`);
      return res.status(response.status).json({ error: "Failed to fetch recipe from AI provider." });
    }

    const data = await response.json();
    const recipeText = data?.choices?.[0]?.message?.content?.trim() || null;

    if (!recipeText) {
      console.warn("No recipe content returned from model.");
      return res.status(204).json({ recipe: "No recipe generated." });
    }

    res.json({ recipe: recipeText });
  } catch (error) {
    console.error("Internal server error while fetching recipe:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Recipe server running on port ${PORT}`);
});
