"""
Sentiment Analysis Service
==========================
Loads trained LSTM model and provides sentiment prediction for text reviews.

Usage:
    analyzer = get_analyzer()
    result = analyzer.predict("This mentor was great!")
    # Returns: {"score": 0.85, "label": "POSITIVE", "confidence": 0.85}
"""

import pickle
import re
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences


class SentimentAnalyzer:
    """
    Sentiment analysis service using trained LSTM model.
    Loads model once at startup, reuses for all predictions.
    """
    
    def __init__(self):
        """
        Initialize sentiment analyzer by loading model and tokenizer.
        This runs ONCE when service starts.
        """
        print("🔄 Loading sentiment model...")
        
        # Load trained LSTM model (15-20 MB)
        self.model = load_model('models/sentiment_model.h5')
        print("✅ Model loaded: sentiment_model.h5")
        
        # Load tokenizer (word-to-index mapping)
        with open('models/tokenizer.pkl', 'rb') as f:
            tokenizer_data = pickle.load(f)
        
        self.word_index = tokenizer_data['word_index']
        self.vocab_size = tokenizer_data['vocab_size']
        self.max_length = tokenizer_data['max_length']
        print("✅ Tokenizer loaded: tokenizer.pkl")
        print(f"   Vocabulary size: {self.vocab_size}")
        print(f"   Max sequence length: {self.max_length}")
        print("✅ Sentiment analyzer ready!\n")
    
    def _preprocess(self, text: str) -> np.ndarray:
        """
        Preprocess text for model input.
        
        Steps:
        1. Convert to lowercase
        2. Remove punctuation
        3. Split into words
        4. Convert words to indices using tokenizer (+3 offset for IMDB)
        5. Pad sequence to fixed length (200)
        
        Args:
            text: Raw text input (e.g., "This mentor was great!")
        
        Returns:
            Padded sequence ready for model input
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove punctuation (keep only letters and spaces)
        text = re.sub(r'[^a-z\s]', '', text)
        
        # Split into words
        words = text.split()
        
        # Convert words to indices
        sequence = []
        for word in words:
            if word in self.word_index:
                # IMDB dataset uses +3 offset:
                # 0 = padding, 1 = start, 2 = unknown, 3+ = actual words
                idx = self.word_index[word] + 3
                
                # Only use words in vocabulary (top 10k + offset)
                if idx < self.vocab_size + 3:
                    sequence.append(idx)
        
        # Pad sequence to max_length (200)
        padded = pad_sequences([sequence], maxlen=self.max_length, padding='post')
        
        return padded
    
    def predict(self, text: str) -> dict:
        """
        Predict sentiment of text.
        
        Args:
            text: Review text to analyze
        
        Returns:
            Dictionary with:
            - score: float (-1 to +1, negative to positive)
            - label: str ("POSITIVE" or "NEGATIVE")
            - confidence: float (0 to 1, how confident the model is)
        
        Example:
            >>> analyzer.predict("This mentor was terrible!")
            {"score": -0.85, "label": "NEGATIVE", "confidence": 0.85}
        """
        # Step 1: Preprocess text
        processed = self._preprocess(text)
        
        # Step 2: Get raw prediction (0 to 1 from sigmoid)
        raw_score = self.model.predict(processed, verbose=0)[0][0]
        
        # Step 3: Normalize to -1 to +1 scale
        # 0.0 → -1.0 (very negative)
        # 0.5 → 0.0 (neutral)
        # 1.0 → +1.0 (very positive)
        normalized_score = (raw_score - 0.5) * 2
        
        # Step 4: Determine label
        label = "POSITIVE" if normalized_score > 0 else "NEGATIVE"
        
        # Step 5: Calculate confidence (absolute value)
        confidence = abs(normalized_score)
        
        return {
            "score": float(normalized_score),
            "label": label,
            "confidence": float(confidence)
        }


# Singleton instance (created once, reused everywhere)
_analyzer_instance = None


def get_analyzer() -> SentimentAnalyzer:
    """
    Get or create sentiment analyzer instance.
    Uses singleton pattern - creates only once, reuses for all requests.
    
    Returns:
        SentimentAnalyzer instance
    """
    global _analyzer_instance
    
    if _analyzer_instance is None:
        _analyzer_instance = SentimentAnalyzer()
    
    return _analyzer_instance


# Test the analyzer (only runs if this file is executed directly)
if __name__ == "__main__":
    print("=" * 70)
    print("TESTING SENTIMENT ANALYZER")
    print("=" * 70)
    
    analyzer = get_analyzer()
    
    # Test cases
    test_reviews = [
        "This mentor was absolutely amazing! I learned so much.",
        "Complete waste of time. Very rude and unprofessional.",
        "It was okay, nothing special.",
        "not bad at all",
        "I wanted to like it but it was terrible"
    ]
    
    for review in test_reviews:
        result = analyzer.predict(review)
        print(f"\nReview: \"{review}\"")
        print(f"Result: {result['label']} (score: {result['score']:.2f}, confidence: {result['confidence']:.2%})")
    
    print("\n" + "=" * 70)
    print("✅ Testing complete!")
