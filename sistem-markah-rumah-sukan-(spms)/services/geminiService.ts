
import { GoogleGenAI } from "@google/genai";
import { HouseStanding, ScoreEntry, House } from "../types";

export async function getSportsCommentary(
  standings: HouseStanding[],
  houses: Record<string, House>,
  recentScores: ScoreEntry[]
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const standingsStr = standings
    .map((s, idx) => `${idx + 1}. ${houses[s.houseId].name}: ${s.totalPoints} mata`)
    .join("\n");

  const prompt = `
    Anda adalah seorang pengulas sukan sekolah yang bersemangat. 
    Berikut adalah kedudukan semasa rumah sukan bagi Kejohanan Olahraga SK Bukit Bota 2026:
    ${standingsStr}

    Sila berikan ulasan ringkas (maksimum 3 ayat) tentang persaingan ini dalam Bahasa Melayu yang santai, membakar semangat, dan kreatif.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    // Pastikan penggunaan .text (property) bukannya .text() (method)
    return response.text || "Persaingan sengit diteruskan! Siapakah yang akan menjulang piala pusingan tahun ini?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Kejohanan sukan tahunan sedang berlangsung dengan penuh semangat kesukanan dan persaingan sihat!";
  }
}
