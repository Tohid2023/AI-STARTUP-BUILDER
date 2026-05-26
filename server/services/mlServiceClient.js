const ML_BASE_URL = "http://localhost:5003";

const callMlEndpoint = async (endpoint, data) => {
  try {
    const response = await fetch(`${ML_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`ML Service responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling ML service at ${endpoint}:`, error.message);
    return null;
  }
};

exports.getMlData = async (idea) => {
  try {
    // 1. Get Category & Keywords concurrently
    const [categoryRes, keywordsRes] = await Promise.all([
      callMlEndpoint('/predict-category', { idea }),
      callMlEndpoint('/extract-keywords', { idea })
    ]);

    const category = categoryRes?.category || "Unknown";
    const keywords = keywordsRes?.keywords || [];

    // 2. Based on category, get recommendations; also get similarity matches
    const [recommendationsRes, similarityRes] = await Promise.all([
      callMlEndpoint('/recommend', { category }),
      callMlEndpoint('/similarity', { idea })
    ]);

    return {
      category,
      keywords,
      mlRecommendations: recommendationsRes || { features: [], techStack: [], monetization: [] },
      similarityMatches: similarityRes?.matches || []
    };
  } catch (error) {
    console.error("ML Integration Error:", error);
    return {
      category: "Unknown",
      keywords: [],
      mlRecommendations: { features: [], techStack: [], monetization: [] },
      similarityMatches: []
    };
  }
};
