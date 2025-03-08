"use server"

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

export async function generateLearningContent(skill: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const searchModel = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });
    const contentModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    const searchGenerationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };


    // Step 1:  Use Google Search to gather information.
    const searchPrompt = `Search for the best and most up-to-date resources for learning ${skill} for a tech job.  
    Include:
        - Key concepts of ${skill}
        - A learning roadmap from beginner to advanced for ${skill}
        - Courses for ${skill}
        - Books for ${skill}
        - Websites/blogs related to ${skill}
        - Introductory examples or exercises for ${skill}

    Provide a concise summary of your findings, focusing on high-quality and relevant resources. Do not format the answer. Just provide the information.
    `;


    const searchChat = searchModel.startChat({
      generationConfig: searchGenerationConfig,  // Use the search config
      history: [],
    });

    const searchResult = await searchChat.sendMessage(searchPrompt);
    const searchData = searchResult.response.text();


    // Step 2:  Process and structure the information using gemini-2.0-flash.

    const contentPrompt = `
      I want to learn about ${skill} for a job in tech.  I have gathered the following information:

      ${searchData}

      Based on this information, AND your own knowledge, please provide:
      
      1. A brief introduction to ${skill} (what it is and why it's important)
      2. Key concepts I need to understand
      3. A learning roadmap (beginner to advanced)
      4. Recommended resources (courses, books, websites)  (Prioritize resources from the search data, but you can add others if needed)
      5. A simple example or exercise to get started
      
      Format your response with clear headings and bullet points where appropriate.  Be concise and well-organized.
    `;

    const contentChat = contentModel.startChat({
      generationConfig, // Use the content config
      history: [],
    });

    const contentResult = await contentChat.sendMessage(contentPrompt);
    return contentResult.response.text();


  } catch (error) {
    console.error("Error generating content:", error);
    return `Sorry, there was an error generating learning content. Please try again later.`;
  }
}
