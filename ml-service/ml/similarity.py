import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class SimilarityEngine:
    def __init__(self, data_path="data/dummy_data.json"):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.data = []
        self.tfidf_matrix = None
        self.is_ready = False
        
        self.load_data(data_path)

    def load_data(self, data_path):
        base_dir = os.path.dirname(os.path.dirname(__file__))
        full_path = os.path.join(base_dir, data_path)
        
        if not os.path.exists(full_path):
            print(f"Warning: Data file {full_path} not found. Cannot load similarity engine.")
            return

        with open(full_path, 'r') as f:
            self.data = json.load(f)

        ideas = [item['idea'] for item in self.data]
        if not ideas:
            return

        # Create TF-IDF matrix for all stored ideas
        self.tfidf_matrix = self.vectorizer.fit_transform(ideas)
        self.is_ready = True

    def find_similar(self, new_idea, top_k=3):
        """
        Compares the new_idea with stored ideas using Cosine Similarity.
        Returns the top matches and their similarity scores.
        """
        if not self.is_ready:
            return 0.0, []

        # Vectorize the new idea
        new_vec = self.vectorizer.transform([new_idea])
        
        # Calculate cosine similarity against all stored ideas
        # This returns an array of shape (1, num_ideas)
        cosine_scores = cosine_similarity(new_vec, self.tfidf_matrix)[0]
        
        # Get indices of top_k scores (descending order)
        top_indices = cosine_scores.argsort()[-top_k:][::-1]
        
        matches = []
        highest_score = float(cosine_scores[top_indices[0]]) if len(top_indices) > 0 else 0.0
        
        for idx in top_indices:
            score = float(cosine_scores[idx])
            # Only include meaningful matches (> 0.1)
            if score > 0.1:
                match_data = self.data[idx]
                matches.append({
                    "idea": match_data["idea"],
                    "category": match_data["category"],
                    "score": round(score, 4)
                })

        return round(highest_score, 4), matches

# Instantiate a global engine
similarity_instance = SimilarityEngine()

def get_similarity(idea):
    return similarity_instance.find_similar(idea)
