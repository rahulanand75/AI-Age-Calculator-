
import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight } from "../types";

// Always use the required initialization format for GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsights = async (birthDate: Date): Promise<AIInsight> => {
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.toLocaleString('default', { month: 'long' });
  const birthDay = birthDate.getDate();
  const today = new Date();
  const currentAge = today.getFullYear() - birthYear;

  const prompt = `Provide interesting life insights for someone born on ${birthMonth} ${birthDay}, ${birthYear} (currently ${currentAge} years old).
  Crucial Instructions:
  1. Identify their exact generation (Gen Alpha, Gen Z, Millennial, Gen X, etc.) based on standard definitions.
  2. Research a major pop-culture or historical event from ${birthYear}.
  3. Describe their personality nature using zodiac traits for ${birthMonth} ${birthDay}.
  4. Provide a forecast for the next 5 years based on their current age of ${currentAge}.
  
  Return as a strictly formatted JSON object with these fields:
  "birthYearFact": A fascinating fact from ${birthYear}.
  "generation": The full generation name and one signature trait.
  "historicalContext": What the world was like during their birth.
  "lifePathAdvice": Inspirational advice for their current life stage.
  "personalityNature": Detailed summary of their core personality.
  "futurePredictions": A roadmap for the next 5 years.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            birthYearFact: { type: Type.STRING },
            generation: { type: Type.STRING },
            historicalContext: { type: Type.STRING },
            lifePathAdvice: { type: Type.STRING },
            personalityNature: { type: Type.STRING },
            futurePredictions: { type: Type.STRING },
          },
          required: ["birthYearFact", "generation", "historicalContext", "lifePathAdvice", "personalityNature", "futurePredictions"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      birthYearFact: "A pivotal year in modern history filled with cultural shifts.",
      generation: "A generation defined by resilience and global connection.",
      historicalContext: "The world was rapidly evolving into the digital age.",
      lifePathAdvice: "The best time to plant a tree was 20 years ago. The second best time is now.",
      personalityNature: "Balanced, determined, and uniquely gifted with adaptability.",
      futurePredictions: "The coming years promise professional breakthroughs and personal enlightenment.",
    };
  }
};
