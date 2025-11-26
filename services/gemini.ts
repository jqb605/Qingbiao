
import { GoogleGenAI } from "@google/genai";

// 防止 TypeScript 编译错误 (如果 @types/node 未安装)
// Prevent TS build errors if @types/node is missing
declare var process: {
  env: {
    [key: string]: string | undefined;
  }
};

// [可修改] 确保在 Netlify 的 Site Settings > Environment Variables 中设置 API_KEY
// [Modifiable] Ensure API_KEY is set in Netlify Site Settings > Environment Variables
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || ''; 

// Helper to check if API key is present before making calls
export const isAiEnabled = (): boolean => {
  return !!apiKey;
};

export const polishDescription = async (text: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. AI features disabled.");
    throw new Error("API Key is missing. Please configure process.env.API_KEY in Netlify.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Please polish the following theater work description:\n\n"${text}"`,
      config: {
        systemInstruction: "You are a professional theater critic and copywriter. Your job is to take raw notes or rough descriptions of a theater production and rewrite them into sophisticated, engaging, and artistic portfolio descriptions. Keep the tone elegant and minimalist."
      }
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
