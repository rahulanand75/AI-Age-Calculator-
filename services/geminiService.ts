
import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsights = async (birthDate: Date): Promise<AIInsight> => {
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.toLocaleString('default', { month: 'long' });
  const birthDay = birthDate.getDate();
  const today = new Date();
  const currentAge = today.getFullYear() - birthYear;

  const prompt = `Act as an expert Vedic Astrologer (Siddhanta Panchanaga Specialist). 
  Provide accurate Vedic (Sidereal) astrology data for someone born on ${birthMonth} ${birthDay}, ${birthYear}.
  
  CRITICAL TASK: 
  1. Calculate the Janma Rashi (Moon Sign) and Nakshatram (Birth Star) based on the Sidereal (Lahiri/Chitra Paksha Ayanamsa) system.
  2. Important Validation: For Sept 18, 1975, the Rashi is Kumbha (Aquarius) and Nakshatram is Shatabhisha. Use this level of precision for all calculations.
  3. Identify their Generation (Gen X, Millennial, Gen Z, Alpha, etc.).
  4. Provide a 5-year roadmap.

  The user specifically wants the Telugu Rashi (e.g. Kumbham, Mesham) and the Nakshatram (e.g. Shatabhisha, Ashwini).

  Return strictly valid JSON:
  {
    "birthYearFact": "A fascinating pop-culture or historical event from their birth year",
    "generation": "Generation name and defining trait",
    "historicalContext": "Status of the world during their birth year",
    "lifePathAdvice": "Wisdom for their current life stage",
    "personalityNature": "A summary of their traits based on their Janma Rashi and Nakshatram",
    "futurePredictions": "A roadmap for the next 5 years",
    "janmaRashi": "Telugu Name (English Name) - e.g., Kumbham (Aquarius)",
    "nakshatram": "Telugu Name (English Name) - e.g., Shatabhisha",
    "padham": "Number (1-4)"
  }`;

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
            janmaRashi: { type: Type.STRING },
            nakshatram: { type: Type.STRING },
            padham: { type: Type.STRING },
          },
          required: ["birthYearFact", "generation", "historicalContext", "lifePathAdvice", "personalityNature", "futurePredictions", "janmaRashi", "nakshatram", "padham"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      birthYearFact: "A year of significant cultural and global transformation.",
      generation: "Part of a resilient and adaptive generation.",
      historicalContext: "The world was witnessing a major shift in technology and society.",
      lifePathAdvice: "Balance ambition with inner peace for long-term fulfillment.",
      personalityNature: "A dynamic individual with a strong sense of purpose.",
      futurePredictions: "The next five years bring opportunities for career growth and deep personal connections.",
      janmaRashi: "Calculated based on Moon position",
      nakshatram: "Consulting Panchangam...",
      padham: "Variable"
    };
  }
};
