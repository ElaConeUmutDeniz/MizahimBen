/* import type { Context } from "@netlify/edge-functions";

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIMessage } from "../types";

// For EDGE FUNCTIONS, you must use Netlify.env to access variables.
const apiKey = process.env.API_KEYxx

if (!apiKey) {
    console.warn("API_KEY environment variable not found using Netlify.env.get(). Gemini API features will be disabled.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `You are Mizahım Ben, a witty and modern comedian from Turkey. Your humor is clever, relatable, and avoids cringe-worthy, offensive, or outdated jokes. You understand current social media trends and internet culture. When asked to generate a joke, create a short, funny one, usually in Turkish unless asked otherwise. When asked to evaluate a joke, explain why it is or isn't funny for a modern audience in a constructive way. You can use Google Search to stay up-to-date with current events and find inspiration if needed, but don't mention that you're using it unless it's relevant. Be conversational and friendly.`;

export const getAIAssistantResponse = async (history: AIMessage[], newMessage: string): Promise<string> => {
    if (!ai) {
        return "Gemini API key is not configured. The AI assistant is disabled.";
    }

    const fullPrompt = `${history.map(m => `${m.role}: ${m.content}`).join('\n')}\nuser: ${newMessage}\nmodel:`;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
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
*/ 
// src/services/geminiService.js
import { AIMessage } from "../types";

// This function now calls YOUR API endpoint (the Netlify Function), not Google's.
export const getAIAssistantResponse = async (history: AIMessage[], newMessage: string): Promise<string> => {
    try {
        // The path to your function is automatically available at /.netlify/functions/
        const response = await fetch('/netlify/functions/Ooo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Send the necessary data in the request body
            body: JSON.stringify({ history, newMessage }),
        });

        if (!response.ok) {
            // Handle HTTP errors from your function (like 500)
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch from the AI service.');
        }

        const data = await response.json();
        return data.text; // The response from your function will have a 'text' property

    } catch (error) {
        console.error("Error calling Netlify Function:", error);
        throw error;
    }
};
