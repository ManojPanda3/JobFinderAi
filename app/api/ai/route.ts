// app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

let chatHistory: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({
        message: "Prompt is required",
        status: 400
      });
    }

    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });

    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(chatHistory.length - 10);
    }

    return NextResponse.json({
      message: responseText,
      status: 200
    });
  } catch (error) {
    console.error("Error in AI processing:", error);
    return NextResponse.json({
      message: "An error occurred while processing your request",
      status: 500
    });
  }
}
