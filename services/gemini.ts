
import { GoogleGenAI } from "@google/genai";
import { CardTone } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateWishAI = async (recipient: string, sender: string, tone: CardTone): Promise<string> => {
  const ai = getAI();
  const prompt = `Write a short Christmas card message (less than 45 words) for ${recipient} from ${sender}. 
    The tone should be ${tone}. 
    CRITICAL: Do not use any markdown formatting like asterisks (*), hashtags (#), or bolding. 
    Just plain text. 
    Focus on warm wishes and seasonal joy.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text || "Wishing you a very Merry Christmas and a Happy New Year filled with joy and laughter!";
  } catch (error) {
    console.error("Error generating wish:", error);
    return "Wishing you a magical holiday season filled with love, joy, and peace. Merry Christmas!";
  }
};

export const generateCardImageAI = async (tone: CardTone): Promise<string> => {
  const ai = getAI();
  
  const stylePromptMap: Record<CardTone, string> = {
    'Heartfelt': 'A cozy, elegant oil painting of a warm fireplace with Christmas stockings and soft golden light, nostalgic and peaceful.',
    'Funny': 'A whimsical 3D Pixar-style illustration of a clumsy reindeer tangled in colorful Christmas lights, expressive and vibrant.',
    'Professional': 'A sophisticated, minimalist digital art of a stylized Christmas tree made of geometric gold lines on a deep navy background, corporate and modern.',
    'Poetic': 'A dreamy watercolor landscape of a snow-covered pine forest under a bright full moon with ethereal sparkles, moody and artistic.',
    'Short & Sweet': 'A simple and cute illustration of a smiling gingerbread man holding a tiny candy cane, bright and festive.'
  };

  const prompt = stylePromptMap[tone] || 'A festive Christmas scene with ornaments and snow.';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data in response");
  } catch (error) {
    console.error("Error generating image:", error);
    // Fallback placeholder image
    return `https://picsum.photos/seed/${tone}-christmas/800/800`;
  }
};
