const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY");

const generateStartupAI = async (idea, category = "Unknown") => {
  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-2.5-flash", "gemini-3.1-flash-lite"];
  
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        }
      });

      const systemPrompt = `You are a senior product expert, AI architect, and startup strategist.

You must generate HIGHLY SPECIFIC, EXECUTION-FOCUSED, DOMAIN-EXPERT output.

========================================
STRICT RULES (MANDATORY)
========================================

1. NEVER use generic corporate phrases.
2. Every response MUST include specific tools/APIs.
3. Every response MUST include NUMBERS (time, cost, pricing, audience size).
4. REAL-WORLD IMPERFECTIONS: You MUST include realistic constraints, trade-offs, and risks with numbers (e.g., "Initial churn expected ~15–25% in first 3 months", "Processing cost ~$2–3 per video (AWS + APIs)", "Manual QA required for first 50–100 users"). Do not pretend everything is perfect.
5. READABILITY: For long fields (problem, solution, businessModel), format them STRICTLY as Markdown bullet points (using "• ") so they are easy to read.
6. TARGET USERS: "targetUsers" must ALWAYS be populated with at least 3 specific demographic/psychographic audiences. NEVER LEAVE IT EMPTY.
7. You MUST output a valid JSON object matching the exact schema below.

========================================
CONTEXT UNDERSTANDING
========================================

Idea Input Category: \${category}
You MUST output a better, refined category in your JSON response if needed.

JSON SCHEMA TO STRICTLY FOLLOW:
{
  "category": "Refined category name",
  "pitch": "One-line pitch highlighting specific mechanics",
  "problem": "• Bullet point 1 with specific pain metric\\n• Bullet point 2 with specific pain metric",
  "solution": "• Execution step 1\\n• Execution step 2 with specific tooling",
  "targetUsers": ["Indie creators (10k-100k audience)", "Agencies managing 5-20 clients", "Growth startups"],
  "features": ["Feature 1 with specific tech", "Feature 2 with metric"],
  "techStack": ["AWS Lambda", "Stripe Connect", "React Native"],
  "businessModel": "• Model 1 details\\n• Trade-offs for model 1",
  "monetization": ["$29/mo Pro Tier", "15% rev share"],
  "risks": ["Specific operational risk (e.g. 15% churn)", "API cost scaling ($2/req)"],
  "growth": ["Hyper-local targeting", "Growth strategy 2"],
  "estimatedCost": "e.g. $15k MVP",
  "timeToBuild": "e.g. 6 weeks",
  "revenuePotential": "e.g. $50k/month in 1 year",
  "difficulty": "Easy, Medium, or Hard",
  "timeSaved": "e.g. 15-20 hrs/week",
  "marketSize": "Optional - e.g. $10B TAM",
  "competitors": ["Optional - Competitor A", "Competitor B"]
}`;

    const prompt = `INPUT:
Startup Idea: "${idea}"
ML Category: "${category}"

Please output exactly the JSON structure requested in the system prompt.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will strictly follow the rules, context, and JSON schema." }],
        },
      ],
    });

      const result = await chat.sendMessage(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText);

    } catch (error) {
      console.error(`Gemini API Error with model ${modelName}:`, error.message);
      // If it's a 429 or 503 or 404, we just continue the loop to try the next model
      // wait 1 second before retrying next model to avoid spamming
      await new Promise(res => setTimeout(res, 1000));
    }
  }
  
  throw new Error("All Gemini models failed. The API is currently experiencing high demand or your quota is exhausted. Please try again later.");
};

const generateNamesAI = async (idea) => {
  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-2.5-flash", "gemini-3.1-flash-lite"];
  
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.8,
        }
      });

      const prompt = `You are a branding expert. Generate exactly 3 catchy, modern SaaS startup names based on the user's idea. Return only the 3 names separated by commas, nothing else.
      
Idea: ${idea}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      return text.split(',').map(name => name.trim()).filter(Boolean);

    } catch (error) {
      console.error(`Gemini API Error for Names with model ${modelName}:`, error.message);
      await new Promise(res => setTimeout(res, 1000));
    }
  }
  
  throw new Error("Failed to generate names. The API is experiencing high demand.");
};

module.exports = { generateStartupAI, generateNamesAI };