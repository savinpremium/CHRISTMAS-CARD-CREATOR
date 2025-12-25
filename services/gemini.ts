
import { GoogleGenAI } from "@google/genai";
import { CardTone } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateWishAI = async (recipient: string, sender: string, tone: CardTone): Promise<string> => {
  const ai = getAI();
  const prompt = `Write a beautiful and touching Christmas card message (30-50 words) for ${recipient} from ${sender}. 
    The tone should be ${tone}. 
    CRITICAL: Do not use any markdown formatting like asterisks (*), hashtags (#), or bolding. 
    Just plain elegant text. 
    Make it feel deeply personal and magical.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.9,
        topP: 0.95,
      }
    });

    return response.text?.trim() || "Wishing you a very Merry Christmas and a Happy New Year filled with joy and laughter!";
  } catch (error) {
    console.error("Error generating wish:", error);
    return "Wishing you a magical holiday season filled with love, joy, and peace. May the spirit of Christmas bring you warmth and happiness. Merry Christmas!";
  }
};

export const generateCardImageAI = async (tone: CardTone): Promise<string> => {
  const ai = getAI();
  
  const stylePromptMap: Record<CardTone, string> = {
    'Heartfelt': 'A high-definition, cozy Christmas masterpiece. An elegant oil painting of a warm, glowing fireplace with red stockings, a decorated Christmas tree nearby with golden lights, soft atmospheric lighting, nostalgic holiday spirit, extremely detailed, 4k.',
    'Funny': 'A whimsical and vibrant 3D animation style illustration of a funny, adorable reindeer wearing an oversized Christmas sweater and getting tangled in glowing colorful fairy lights, snowy background, Pixar-like quality, bright and cheerful.',
    'Professional': 'A sophisticated and modern digital art piece. A minimalist, stylized Christmas tree formed from shimmering gold geometric lines on a deep luxury navy blue background, sharp focus, high-end corporate holiday card style, elegant and clean.',
    'Poetic': 'A breathtaking winter wonderland scene at night. A dreamy watercolor painting of a snow-covered forest under a giant glowing full moon, ethereal sparkles like diamond dust in the air, deep blues and silver highlights, magical and serene.',
    'Short & Sweet': 'A delightful and crisp illustration of a happy gingerbread man and a cute snowman sharing a candy cane, soft pastel winter colors, simple yet charming festive design, high quality vector-style art.'
  };

  const basePrompt = stylePromptMap[tone] || 'A beautiful high-quality Christmas scene with festive decorations and snow.';
  const finalPrompt = `${basePrompt} NO ROADS, NO CARS, ONLY FESTIVE CHRISTMAS ELEMENTS.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }]
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
    // Use specific high-quality Unsplash IDs for fallbacks instead of random picsum
    const fallbacks: Record<string, string> = {
      'Heartfelt': 'https://images.unsplash.com/photo-1543589077-47d816067ce1?q=80&w=1000&auto=format&fit=crop',
      'Funny': 'https://images.unsplash.com/photo-1512433990356-47065c86f7e3?q=80&w=1000&auto=format&fit=crop',
      'Professional': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1000&auto=format&fit=crop',
      'Poetic': 'https://images.unsplash.com/photo-1418985227304-f32df7d84e39?q=80&w=1000&auto=format&fit=crop',
      'Short & Sweet': 'https://images.unsplash.com/photo-1544273677-2415152ef55b?q=80&w=1000&auto=format&fit=crop'
    };
    return fallbacks[tone] || fallbacks['Heartfelt'];
  }
};
