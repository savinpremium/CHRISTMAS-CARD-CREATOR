
import { GoogleGenAI } from "@google/genai";
import { CardTone } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateWishAI = async (recipient: string, sender: string, tone: CardTone): Promise<string> => {
  const ai = getAI();
  const prompt = `Write a beautiful and touching Christmas card message (30-50 words) for ${recipient} from ${sender}. 
    The tone should be ${tone}. 
    CRITICAL: Do not use any markdown formatting like asterisks (*), hashtags (#), or bolding. 
    Just plain elegant text. 
    Incorporate warm festive imagery like sleigh bells, North Pole magic, or Santa's journey if appropriate for the tone.`;

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
    'Heartfelt': 'A high-definition masterpiece of Santa Claus quietly placing gifts under a glowing Christmas tree in a cozy living room with a fireplace, warm golden lighting, nostalgia, 8k resolution, cinematic.',
    'Funny': 'A humorous 3D Pixar-style scene of Santa Claus accidentally getting stuck in a chimney with reindeer laughing nearby, bright colors, expressive faces, snowy roof background.',
    'Professional': 'A minimalist and luxury illustration of a golden sleigh flying across a moonlit sky over a silhouette of a pine forest, elegant gold foil texture, deep navy blue background, high-end art.',
    'Poetic': 'A dreamy, ethereal winter scene. An ice-sculpture of a reindeer in a magical forest under the Aurora Borealis, glowing sparkles, soft watercolor textures, enchanting and serene.',
    'Short & Sweet': 'A cute and charming illustration of Santa’s hat resting on a pile of beautifully wrapped gifts, soft festive colors, clean vector art, heartwarming holiday design.'
  };

  const basePrompt = stylePromptMap[tone] || 'A beautiful high-quality Christmas scene with Santa and festive decorations.';
  const finalPrompt = `${basePrompt} NO ROADS, NO CARS. EXTREME CHRISTMAS VIBES, SNOW, MAGIC.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16"
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
