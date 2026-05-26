const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log(result.response.text());
  } catch (e) {
    console.error("1.5-flash-latest failed:", e.message);
    try {
      const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result2 = await model2.generateContent("Say hello");
      console.log("gemini-pro success:", result2.response.text());
    } catch (e2) {
      console.error("gemini-pro failed:", e2.message);
    }
  }
}
test();
