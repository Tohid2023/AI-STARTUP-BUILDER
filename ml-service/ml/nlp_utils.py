import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string

# Ensure required NLTK data packages are downloaded (only downloads if not present)
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')
    nltk.data.find('corpora/stopwords')
except Exception:
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
    nltk.download('stopwords', quiet=True)

def extract_keywords(text):
    """
    Extracts top keywords from a text by tokenizing, converting to lowercase,
    and removing stopwords and punctuation.
    """
    if not text:
        return []

    # Tokenize
    tokens = word_tokenize(text.lower())
    
    # Get english stopwords
    stop_words = set(stopwords.words('english'))
    punctuation = set(string.punctuation)
    
    # Filter tokens
    keywords = [
        word for word in tokens 
        if word not in stop_words and word not in punctuation and len(word) > 2
    ]
    
    # Simple frequency count (if we wanted to rank them)
    # Using a set to return unique keywords in order of appearance
    unique_keywords = []
    for kw in keywords:
        if kw not in unique_keywords:
            unique_keywords.append(kw)
            
    # Return top 5 keywords
    return unique_keywords[:5]
