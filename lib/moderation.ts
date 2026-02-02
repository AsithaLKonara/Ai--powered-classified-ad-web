import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function moderateContent(title: string, description: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.log("[DEMO MODE] Using local keyword moderation.");
    const bannedKeywords = ['scam', 'fake', 'drugs', 'illegal'];
    const lowerTitle = title.toLowerCase();
    const lowerDesc = description.toLowerCase();

    const isUnsafe = bannedKeywords.some(kw => lowerTitle.includes(kw) || lowerDesc.includes(kw));

    return {
      isSafe: !isUnsafe,
      reason: isUnsafe ? "Demo: Banned keyword detected" : null,
      flaggedCategory: isUnsafe ? "SPAM" : null,
      confidence: 1.0
    };
  }

  const prompt = `
    You are a professional content moderator for a classified ads platform. 
    Analyze the following ad title and description for any violations including:
    - Illegal items or services (drugs, weapons, etc.)
    - Scams or fraudulent promises
    - Adult content or nudity
    - Hate speech or harassment
    - Spam or misleading information

    Ad Title: ${title}
    Ad Description: ${description}

    Respond ONLY in JSON format:
    {
      "isSafe": boolean,
      "reason": string | null,
      "flaggedCategory": string | null,
      "confidence": number (0-1)
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    // Wrap in try-catch because LLMs can sometimes output markdown or filler
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Moderation Error:", error);
    return { isSafe: true, reason: "Error in moderation service" };
  }
}
