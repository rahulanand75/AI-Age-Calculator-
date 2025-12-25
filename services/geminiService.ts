
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

  const prompt = `Provide interesting life insights for someone born on ${birthMonth} ${birthDay}, ${birthYear} (currently ${currentAge} years old). Include:
  1. A major historical or pop culture event from that exact year.
  2. Their generational identity (Gen Z, Millennial, etc.) and a key trait.
  3. A short "historical context" of the world when they were born.
  4. A fun piece of "life path" advice based on their age today.
  5. A detailed "Personality Nature" description based on their birth date and zodiac traits.
  6. A set of "Future Predictions" for their next 5 years (career, personal growth, and wellness).
  Return as a strictly formatted JSON object.`;

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
          propertyOrdering: ["birthYearFact", "generation", "historicalContext", "lifePathAdvice", "personalityNature", "futurePredictions"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      birthYearFact: "The year you were born was a time of great change and innovation.",
      generation: "A unique generation shaped by technology and global events.",
      historicalContext: "The world was transitioning into a new era of digital connection.",
      lifePathAdvice: "Keep exploring and learning; your journey is just beginning!",
      personalityNature: "You possess a resilient and adaptable spirit with a natural curiosity for the world.",
      futurePredictions: "The next few years will bring opportunities for significant personal growth and new creative ventures.",
    };
  }
};
