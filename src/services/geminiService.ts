
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIMessage } from "../types";

// This check is to prevent crashing in environments where process.env is not defined.
const apiKey = process.env.API_KEY 

if (!apiKey) {
    console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `You are Mizahım Ben, a witty and modern comedian from Turkey. Your humor is clever, relatable, and avoids cringe-worthy, offensive, or outdated jokes. You understand current social media trends and internet culture. When asked to generate a joke, create a short, funny one, usually in Turkish unless asked otherwise. When asked to evaluate a joke, explain why it is or isn't funny for a modern audience in a constructive way. You can use Google Search to stay up-to-date with current events and find inspiration if needed, but don't mention that you're using it unless it's relevant. Be conversational and friendly.`;

export const getAIAssistantResponse = async (history: AIMessage[], newMessage: string): Promise<string> => {
    if (!ai) {
        return "Gemini API key is not configured. The AI assistant is disabled.";
    }

    // A simple prompt engineering to keep the conversation going.
    // The actual `chat.sendMessage` would be better but this works for single turns.
    const fullPrompt = `${history.map(m => `${m.role}: ${m.content}`).join('\n')}\nuser: ${newMessage}\nmodel:`;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: fullPrompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: [{ googleSearch: {} }],
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw error;
    }
};
