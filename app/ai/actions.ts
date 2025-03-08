"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function generateLearningContent(skill: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set")
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    })

    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    }

    const prompt = `
      I want to learn about ${skill} for a job in tech. Please provide:
      
      1. A brief introduction to ${skill} (what it is and why it's important)
      2. Key concepts I need to understand
      3. A learning roadmap (beginner to advanced)
      4. Recommended resources (courses, books, websites)
      5. A simple example or exercise to get started
      
      Format your response with clear headings and bullet points where appropriate.
    `

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    })

    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Error generating content:", error)
    return `Sorry, there was an error generating learning content. Please try again later.`
  }
}

