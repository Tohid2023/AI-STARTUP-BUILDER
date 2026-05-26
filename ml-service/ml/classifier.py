import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

class StartupClassifier:
    def __init__(self, data_path="data/dummy_data.json"):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.classifier = MultinomialNB()
        self.is_trained = False
        
        # Load and train immediately upon initialization
        self.train_model(data_path)

    def train_model(self, data_path):
        """Loads dummy data and trains the Naive Bayes model."""
        base_dir = os.path.dirname(os.path.dirname(__file__))
        full_path = os.path.join(base_dir, data_path)
        
        if not os.path.exists(full_path):
            print(f"Warning: Data file {full_path} not found. Cannot train model.")
            return

        with open(full_path, 'r') as f:
            data = json.load(f)

        ideas = [item['idea'] for item in data]
        categories = [item['category'] for item in data]

        if not ideas:
            return

        # Vectorize text
        X_train = self.vectorizer.fit_transform(ideas)
        y_train = categories

        # Train model
        self.classifier.fit(X_train, y_train)
        self.is_trained = True
        print(f"Model trained successfully on {len(ideas)} samples.")

    def predict(self, idea_text):
        """Predicts the category of a given startup idea."""
        if not self.is_trained:
            return "Unknown"
        
        X_test = self.vectorizer.transform([idea_text])
        prediction = self.classifier.predict(X_test)
        return prediction[0]

# Instantiate a global classifier object so it loads once
classifier_instance = StartupClassifier()

def predict_category(idea):
    return classifier_instance.predict(idea)
