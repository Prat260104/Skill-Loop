"""
Sentiment Analysis Model Training Script
Trains a custom LSTM neural network for sentiment classification.
"""

import numpy as np
import pickle
from tensorflow.keras.datasets import imdb
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout, Bidirectional
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping
import os

# Configuration
VOCAB_SIZE = 10000      # Top 10k most common words
MAX_LENGTH = 200        # Max review length (truncate/pad)
EMBEDDING_DIM = 128     # Word vector size
LSTM_UNITS = 128        # LSTM memory cells
BATCH_SIZE = 64         # Training batch size
EPOCHS = 10             # Training iterations (increased for better accuracy)

print("=" * 60)
print("🧠 SENTIMENT ANALYSIS MODEL TRAINING")
print("=" * 60)

# Step 1: Load IMDB Dataset
print("\n📥 Loading IMDB dataset...")
(x_train, y_train), (x_test, y_test) = imdb.load_data(num_words=VOCAB_SIZE)

print(f"✅ Training samples: {len(x_train)}")
print(f"✅ Test samples: {len(x_test)}")
print(f"   Sample review length: {len(x_train[0])} words")

# Step 2: Preprocess Data
print("\n🔧 Preprocessing data...")
x_train = pad_sequences(x_train, maxlen=MAX_LENGTH, padding='post', truncating='post')
x_test = pad_sequences(x_test, maxlen=MAX_LENGTH, padding='post', truncating='post')

print(f"✅ Padded training shape: {x_train.shape}")
print(f"✅ Padded test shape: {x_test.shape}")

# Step 3: Build LSTM Model
print("\n🏗️  Building LSTM architecture...")
model = Sequential([
    # Layer 1: Embedding (converts word IDs to dense vectors)
    Embedding(
        input_dim=VOCAB_SIZE,
        output_dim=EMBEDDING_DIM,
        input_length=MAX_LENGTH,
        name='embedding_layer'
    ),
    
    # Layer 2: Bidirectional LSTM (captures context from both directions)
    Bidirectional(
        LSTM(
            LSTM_UNITS,
            dropout=0.2,           # Prevents overfitting
            recurrent_dropout=0.2, # Dropout on recurrent connections
            name='lstm_layer'
        )
    ),
    
    # Layer 3: Dense hidden layer
    Dense(64, activation='relu', name='dense_hidden'),
    Dropout(0.5),
    
    # Layer 4: Output layer (sigmoid for binary classification)
    Dense(1, activation='sigmoid', name='output_layer')
])

# Step 4: Compile Model
print("\n⚙️  Compiling model...")
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Print model summary
model.summary()

# Step 5: Train Model
print("\n🏋️  Training model...")
print("   This will take ~5-10 minutes depending on your CPU/GPU\n")

# Early stopping to prevent overfitting
early_stop = EarlyStopping(
    monitor='val_loss',
    patience=2,
    restore_best_weights=True
)

history = model.fit(
    x_train, y_train,
    batch_size=BATCH_SIZE,
    epochs=EPOCHS,
    validation_split=0.2,  # 20% of training data for validation
    callbacks=[early_stop],
    verbose=1
)

# Step 6: Evaluate Model
print("\n📊 Evaluating model on test set...")
test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)

print(f"\n✅ Test Accuracy: {test_accuracy * 100:.2f}%")
print(f"✅ Test Loss: {test_loss:.4f}")

# Step 7: Save Model
print("\n💾 Saving model...")

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Save trained model
model.save('models/sentiment_model.h5')
print("✅ Model saved to: models/sentiment_model.h5")

# Step 8: Save Tokenizer (word index mapping)
print("\n💾 Saving tokenizer...")

# Get word index from IMDB dataset
word_index = imdb.get_word_index()

# Create reverse mapping (index → word)
reverse_word_index = {idx: word for word, idx in word_index.items()}

# Save tokenizer info
tokenizer_data = {
    'word_index': word_index,
    'reverse_word_index': reverse_word_index,
    'vocab_size': VOCAB_SIZE,
    'max_length': MAX_LENGTH
}

with open('models/tokenizer.pkl', 'wb') as f:
    pickle.dump(tokenizer_data, f)

print("✅ Tokenizer saved to: models/tokenizer.pkl")

# Step 9: Test with Sample Predictions
print("\n🧪 Testing with sample predictions...")

# Test samples
test_samples = [
    "This movie was absolutely wonderful! Best film I've seen in years.",
    "Terrible acting and boring plot. Complete waste of time.",
    "It was okay, nothing special."
]

# Load word index
word_to_idx = word_index

def preprocess_text(text):
    """Convert text to sequence of word indices"""
    words = text.lower().split()
    sequence = []
    for word in words:
        if word in word_to_idx:
            idx = word_to_idx[word]
            if idx < VOCAB_SIZE:  # Only use words in vocabulary
                sequence.append(idx)
    return sequence

for i, sample in enumerate(test_samples, 1):
    # Preprocess
    seq = preprocess_text(sample)
    padded = pad_sequences([seq], maxlen=MAX_LENGTH, padding='post')
    
    # Predict
    prediction = model.predict(padded, verbose=0)[0][0]
    sentiment = "POSITIVE" if prediction > 0.5 else "NEGATIVE"
    confidence = prediction if prediction > 0.5 else 1 - prediction
    
    print(f"\n{i}. '{sample[:50]}...'")
    print(f"   Prediction: {sentiment} (confidence: {confidence*100:.1f}%)")

print("\n" + "=" * 60)
print("🎉 TRAINING COMPLETE!")
print("=" * 60)
print(f"\n📁 Model files created:")
print(f"   - models/sentiment_model.h5 (~15-20 MB)")
print(f"   - models/tokenizer.pkl (~2-3 MB)")
print(f"\n✅ Ready to use in production!")
print(f"   Next: Create sentiment_analyzer.py service\n")
