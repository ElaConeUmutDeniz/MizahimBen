
// netlify/functions/get-ai-response.js

// You will need to install this dependency for your function
// Run: npm install @google/genai
import { GoogleGenAI } from "@google/genai";

// This is the secure way to access the key inside a Netlify Function
const apiKey = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are Mizahım Ben, a witty and modern comedian from Turkey. Your humor is clever, relatable, and avoids cringe-worthy, offensive, or outdated jokes. You understand current social media trends and internet culture. When asked to generate a joke, create a short, funny one, usually in Turkish unless asked otherwise. When asked to evaluate a joke, explain why it is or isn't funny for a modern audience in a constructive way. You can use Google Search to stay up-to-date with current events and find inspiration if needed, but don't mention that you're using it unless it's relevant. Be conversational and friendly.`;

// The handler function is the entry point for the Netlify Function
export const handler = async (event) => {
    // A quick check to ensure the key is present.
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Gemini API key is not configured on the server." }),
        };
    }

    // A check to ensure the request is a POST request.
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        // The data (history, newMessage) sent from your React component
        const { history, newMessage } = JSON.parse(event.body);

        const fullPrompt = `${history.map(m => `${m.role}: ${m.content}`).join('\n')}\nuser: ${newMessage}\nmodel:`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: [{ googleSearch: {} }],
            }
        });
        
        // Return a success response to your React component
        return {
            statusCode: 200,
            body: JSON.stringify({ text: response.text }),
        };

    } catch (error) {
        console.error("Gemini API error in Netlify Function:", error);
        // Return an error response to your React component
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while communicating with the AI assistant." }),
        };
    }
};
