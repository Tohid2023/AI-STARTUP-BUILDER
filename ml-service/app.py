from flask import Flask, request, jsonify
from ml.classifier import predict_category
from ml.nlp_utils import extract_keywords
from ml.recommender import get_recommendations
from ml.similarity import get_similarity

app = Flask(__name__)

@app.route('/predict-category', methods=['POST'])
def predict_category_api():
    """Predicts category using Naive Bayes with rule-based fallback."""
    data = request.json
    if not data or 'idea' not in data:
        return jsonify({"error": "Missing 'idea' in request body"}), 400
    
    idea_lower = data['idea'].lower()
    
    # Rule-based fallback
    if "farm" in idea_lower or "agriculture" in idea_lower or "crop" in idea_lower:
        category = "AgriTech"
    elif "finance" in idea_lower or "bank" in idea_lower or "money" in idea_lower:
        category = "FinTech"
    elif "health" in idea_lower or "doctor" in idea_lower or "medical" in idea_lower:
        category = "HealthTech"
    elif "marketplace" in idea_lower or "buy and sell" in idea_lower:
        category = "SaaS Marketplace"
    else:
        category = predict_category(data['idea'])
        
    return jsonify({"category": category})

@app.route('/extract-keywords', methods=['POST'])
def extract_keywords_api():
    """Extracts top keywords using NLTK."""
    data = request.json
    if not data or 'idea' not in data:
        return jsonify({"error": "Missing 'idea' in request body"}), 400
        
    keywords = extract_keywords(data['idea'])
    return jsonify({"keywords": keywords})

@app.route('/recommend', methods=['POST'])
def recommend_api():
    """Returns curated features, tech stack, and monetization strategies based on category."""
    data = request.json
    if not data or 'category' not in data:
        return jsonify({"error": "Missing 'category' in request body"}), 400
        
    recommendations = get_recommendations(data['category'])
    return jsonify(recommendations)

@app.route('/similarity', methods=['POST'])
def similarity_api():
    """Calculates TF-IDF cosine similarity against existing ideas."""
    data = request.json
    if not data or 'idea' not in data:
        return jsonify({"error": "Missing 'idea' in request body"}), 400
        
    score, matches = get_similarity(data['idea'])
    return jsonify({
        "similarityScore": score,
        "matches": matches
    })

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "service": "AI Startup Builder ML Microservice",
        "status": "running",
        "endpoints": [
            "POST /predict-category",
            "POST /extract-keywords",
            "POST /recommend",
            "POST /similarity"
        ]
    })

if __name__ == '__main__':
    # Running on port 5003
    app.run(host='0.0.0.0', port=5003, debug=True)
