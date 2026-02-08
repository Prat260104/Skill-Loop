"""
Model Verification Script
=========================
Validates the trained sentiment analysis model with:
1. Accuracy on IMDB test set
2. Sample predictions on real reviews
3. Performance metrics

Run: python verification/verify_model.py
"""

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.datasets import imdb
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

print("=" * 70)
print("🔍 SENTIMENT MODEL VERIFICATION")
print("=" * 70)

# Load model
print("\n📂 Loading model and tokenizer...")
model = load_model('models/sentiment_model.h5')
print("✅ Model loaded: models/sentiment_model.h5")

with open('models/tokenizer.pkl', 'rb') as f:
    tokenizer_data = pickle.load(f)
print("✅ Tokenizer loaded: models/tokenizer.pkl")

# Load IMDB test data
print("\n📥 Loading IMDB test dataset...")
(_, _), (x_test, y_test) = imdb.load_data(num_words=10000)
x_test_padded = pad_sequences(x_test, maxlen=200, padding='post')
print(f"✅ Loaded {len(x_test)} test reviews")

# Test 1: Overall Accuracy
print("\n" + "=" * 70)
print("TEST 1: Overall Model Accuracy")
print("=" * 70)

predictions = model.predict(x_test_padded, verbose=0)
predicted_labels = (predictions > 0.5).astype(int).flatten()
accuracy = np.mean(predicted_labels == y_test) * 100

print(f"\n📊 Test Accuracy: {accuracy:.2f}%")
print(f"   Correct Predictions: {np.sum(predicted_labels == y_test)}/{len(y_test)}")
print(f"   Wrong Predictions: {np.sum(predicted_labels != y_test)}/{len(y_test)}")

# Test 2: Spot Check (First 100 Reviews)
print("\n" + "=" * 70)
print("TEST 2: Spot Check (Random 100 Reviews)")
print("=" * 70)

sample_indices = np.random.choice(len(x_test), 100, replace=False)
sample_predictions = (model.predict(x_test_padded[sample_indices], verbose=0) > 0.5).astype(int).flatten()
sample_accuracy = np.mean(sample_predictions == y_test[sample_indices]) * 100

print(f"\n✅ Spot Check Accuracy: {sample_accuracy:.2f}%")

# Test 3: Confusion Matrix
print("\n" + "=" * 70)
print("TEST 3: Confusion Matrix")
print("=" * 70)

true_positives = np.sum((predicted_labels == 1) & (y_test == 1))
true_negatives = np.sum((predicted_labels == 0) & (y_test == 0))
false_positives = np.sum((predicted_labels == 1) & (y_test == 0))
false_negatives = np.sum((predicted_labels == 0) & (y_test == 1))

print(f"\n                 Predicted")
print(f"                 NEG    POS")
print(f"Actual  NEG    {true_negatives:5d}  {false_positives:5d}")
print(f"        POS    {false_negatives:5d}  {true_positives:5d}")

precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

print(f"\n📊 Metrics:")
print(f"   Precision: {precision:.2%}")
print(f"   Recall:    {recall:.2%}")
print(f"   F1-Score:  {f1_score:.2%}")

# Test 4: Sample Predictions with Actual Reviews
print("\n" + "=" * 70)
print("TEST 4: Sample Predictions (Decoded Reviews)")
print("=" * 70)

# Get word index
word_index = imdb.get_word_index()
reverse_word_index = {v: k for k, v in word_index.items()}

def decode_review(encoded_review):
    """Decode review from word IDs to text"""
    return ' '.join([reverse_word_index.get(i - 3, '?') for i in encoded_review if i >= 3])

# Show 5 random examples
print("\n🧪 Testing with actual IMDB reviews:\n")
sample_indices = np.random.choice(len(x_test), 5, replace=False)

for idx in sample_indices:
    review = decode_review(x_test[idx])
    actual = "POSITIVE" if y_test[idx] == 1 else "NEGATIVE"
    
    prediction_score = model.predict(x_test_padded[idx:idx+1], verbose=0)[0][0]
    predicted = "POSITIVE" if prediction_score > 0.5 else "NEGATIVE"
    confidence = prediction_score if prediction_score > 0.5 else 1 - prediction_score
    
    status = "✅" if actual == predicted else "❌"
    
    print(f"{status} Review: \"{review[:80]}...\"")
    print(f"   Actual: {actual}")
    print(f"   Predicted: {predicted} (confidence: {confidence*100:.1f}%)")
    print()

# Test 5: Edge Cases
print("=" * 70)
print("TEST 5: Edge Cases (Very Short Reviews)")
print("=" * 70)

# Find very short reviews (< 10 words)
short_reviews_idx = [i for i, review in enumerate(x_test) if len(review) < 10][:5]

if short_reviews_idx:
    print("\n🧪 Testing short reviews:\n")
    for idx in short_reviews_idx:
        review = decode_review(x_test[idx])
        actual = "POSITIVE" if y_test[idx] == 1 else "NEGATIVE"
        
        prediction_score = model.predict(x_test_padded[idx:idx+1], verbose=0)[0][0]
        predicted = "POSITIVE" if prediction_score > 0.5 else "NEGATIVE"
        
        status = "✅" if actual == predicted else "❌"
        print(f"{status} \"{review}\"")
        print(f"   Actual: {actual}, Predicted: {predicted}")
        print()

# Final Summary
print("=" * 70)
print("📋 VERIFICATION SUMMARY")
print("=" * 70)

if accuracy > 80:
    verdict = "✅ EXCELLENT - Model is production-ready!"
elif accuracy > 75:
    verdict = "✅ GOOD - Model performs well"
elif accuracy > 70:
    verdict = "⚠️  ACCEPTABLE - Consider retraining"
else:
    verdict = "❌ POOR - Model needs improvement"

print(f"\n{verdict}")
print(f"\nModel Performance: {accuracy:.2f}%")
print(f"Precision: {precision:.2%}")
print(f"Recall: {recall:.2%}")
print(f"F1-Score: {f1_score:.2%}")
print("\n✅ Verification complete!")
print("=" * 70)
