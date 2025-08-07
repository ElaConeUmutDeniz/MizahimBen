import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIMessage } from "../types";

// For EDGE FUNCTIONS, you must use Netlify.env to access variables.
// This is the correct way for your environment.
const apiKey = Netlify.env.get("API_KEY");

if (!apiKey) {
    // This warning will now correctly reflect the state within an Edge Function.
    console.warn("API_KEY environment variable not found using Netlify.env.get(). Gemini API features will be disabled.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `You are Mizahım Ben, a witty and modern comedian from Turkey. Your humor is clever, relatable, and avoids cringe-worthy, offensive, or outdated jokes. You understand current social media trends and internet culture. When asked to generate a joke, create a short, funny one, usually in Turkish unless asked otherwise. When asked to evaluate a joke, explain why it is or isn't funny for a modern audience in a constructive way. You can use Google Search to stay up-to-date with current events and find inspiration if needed, but don't mention that you're using it unless it's relevant. Be conversational and friendly.`;

// Note: The signature for an Edge Function is different. 
// It receives (request: Request, context: Context).
// We'll keep your exported function signature the same since another part of your code might be calling it,
// but be aware that the top-level handler for this file must be an Edge Function handler.

export const getAIAssistantResponse = async (history: AIMessage[], newMessage: string): Promise<string> => {
    if (!ai) {
        return "Gemini API key is not configured. The AI assistant is disabled.";
    }

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
        // Assuming 'generateContent' returns an object with a 'text' property.
        // If the API response structure is different, you might need to adjust this.
        // For example, some SDKs return response.text() as a function.
        return response.text; 
    } catch (error) {
        console.error("Gemini API error:", error);
        throw error;
    }
};

// If this file ITSELF is the Edge Function handler, it should look like this:
/*
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
    // You would get your history and newMessage from the 'request' object, for example:
    // const { history, newMessage } = await request.json();
    
    // Then call your logic
    // const aiResponse = await getAIAssistantResponse(history, newMessage);

    // And return a new Response
    // return new Response(aiResponse);

    // For now, we are assuming this file is imported by another Edge Function file.
};
*/
