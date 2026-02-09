"""
Custom NER Model Training Script
=================================
Train a custom Named Entity Recognition model for resume parsing.

Entities:
- SKILL: Programming languages, tools, frameworks
- JOB_ROLE: Job titles, positions
- ORG: Company names, organizations

Usage:
    python train_ner_model.py
"""

import spacy
from spacy.training import Example
import random
import json
from pathlib import Path

# Configuration
TRAINING_DATA_PATH = "app/services/resume_parser/data/clean_resume_dataset.json"
MODEL_OUTPUT_PATH = "app/services/resume_parser/models/custom_ner_model"
EPOCHS = 50  # Increased for early stopping
DROPOUT = 0.5  # Dropout rate for regularization
VALIDATION_SPLIT = 0.2  # 20% data for validation
EARLY_STOPPING_PATIENCE = 5  # Stop if no improvement for 5 epochs


def load_training_data(file_path):
    """Load training data from JSON file."""
    print(f"📂 Loading training data from {file_path}...")
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Convert to spaCy format: (text, {"entities": [(start, end, label)]})
    training_data = []
    for item in data:
        text = item["text"]
        entities = [(start, end, label) for start, end, label in item["entities"]]
        training_data.append((text, {"entities": entities}))
    
    print(f"✅ Loaded {len(training_data)} training examples")
    return training_data


def create_blank_model():
    """Create a blank spaCy model with NER pipeline."""
    print("🏗️ Creating blank spaCy model...")
    
    # Create blank English model
    nlp = spacy.blank("en")
    
    # Add NER pipeline component
    if "ner" not in nlp.pipe_names:
        ner = nlp.add_pipe("ner")
    else:
        ner = nlp.get_pipe("ner")
    
    print("✅ Blank model created")
    return nlp, ner


def add_labels(ner, training_data):
    """Add entity labels to NER component."""
    print("🏷️ Adding entity labels...")
    
    # Extract all unique labels from training data
    labels = set()
    for _, annotations in training_data:
        for _, _, label in annotations["entities"]:
            labels.add(label)
    
    # Add labels to NER
    for label in labels:
        ner.add_label(label)
        print(f"   ✓ Added label: {label}")
    
    print(f"✅ Added {len(labels)} labels")
    return labels


def train_model(nlp, training_data, epochs=50, dropout=0.5, validation_split=0.2, patience=5):
    """Train the NER model with early stopping."""
    print(f"\n🏋️ Starting training for up to {epochs} epochs...")
    print(f"   Dropout: {dropout}")
    print(f"   Validation split: {validation_split * 100:.0f}%")
    print(f"   Early stopping patience: {patience} epochs")
    print("=" * 60)
    
    # Split data into train and validation
    random.shuffle(training_data)
    split_idx = int(len(training_data) * (1 - validation_split))
    train_data = training_data[:split_idx]
    val_data = training_data[split_idx:]
    
    print(f"   Training examples: {len(train_data)}")
    print(f"   Validation examples: {len(val_data)}")
    print("=" * 60)
    
    # Get NER component
    ner = nlp.get_pipe("ner")
    
    # Disable other pipeline components (we only have NER)
    other_pipes = [pipe for pipe in nlp.pipe_names if pipe != "ner"]
    
    # Early stopping variables
    best_val_loss = float('inf')
    patience_counter = 0
    best_model_path = MODEL_OUTPUT_PATH + "_best"
    
    with nlp.disable_pipes(*other_pipes):
        # Initialize optimizer
        optimizer = nlp.begin_training()
        
        # Training loop
        for epoch in range(epochs):
            # Shuffle training data each epoch
            random.shuffle(train_data)
            
            train_losses = {}
            
            # Training phase
            for text, annotations in train_data:
                doc = nlp.make_doc(text)
                example = Example.from_dict(doc, annotations)
                nlp.update(
                    [example],
                    drop=dropout,
                    sgd=optimizer,
                    losses=train_losses
                )
            
            # Validation phase (no dropout)
            val_losses = {}
            for text, annotations in val_data:
                doc = nlp.make_doc(text)
                example = Example.from_dict(doc, annotations)
                nlp.update(
                    [example],
                    drop=0.0,  # No dropout during validation
                    sgd=None,  # No optimizer updates
                    losses=val_losses
                )
            
            train_loss = train_losses.get('ner', 0)
            val_loss = val_losses.get('ner', 0)
            
            # Print progress
            if (epoch + 1) % 5 == 0 or epoch == 0:
                print(f"Epoch {epoch + 1:2d}/{epochs} | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f}")
            
            # Early stopping check
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                patience_counter = 0
                # Save best model
                Path(best_model_path).mkdir(parents=True, exist_ok=True)
                nlp.to_disk(best_model_path)
                print(f"   ✓ New best model saved (Val Loss: {val_loss:.4f})")
            else:
                patience_counter += 1
                
            # Check if should stop early
            if patience_counter >= patience:
                print(f"\n⚠️ Early stopping triggered at epoch {epoch + 1}")
                print(f"   No improvement for {patience} epochs")
                print(f"   Best validation loss: {best_val_loss:.4f}")
                # Load best model
                nlp = spacy.load(best_model_path)
                break
    
    print("=" * 60)
    print("✅ Training complete!")
    print(f"   Final best validation loss: {best_val_loss:.4f}")
    return nlp


def test_model(nlp):
    """Test the trained model with sample inputs."""
    print("\n🧪 Testing model with sample inputs...")
    print("=" * 60)
    
    test_cases = [
        "Python developer with AWS experience",
        "Software Engineer at Google",
        "Skilled in React, Node.js, and MongoDB",
        "Data Scientist at Microsoft India",
        "Expert in Machine Learning and TensorFlow"
    ]
    
    for test_text in test_cases:
        doc = nlp(test_text)
        
        print(f"\nInput: \"{test_text}\"")
        
        if doc.ents:
            print("Entities found:")
            for ent in doc.ents:
                print(f"   • {ent.text:20s} → {ent.label_}")
        else:
            print("   ⚠️ No entities detected")
    
    print("=" * 60)


def save_model(nlp, output_path):
    """Save the trained model to disk."""
    print(f"\n💾 Saving model to {output_path}...")
    
    # Create output directory if it doesn't exist
    Path(output_path).mkdir(parents=True, exist_ok=True)
    
    # Save model
    nlp.to_disk(output_path)
    
    print(f"✅ Model saved successfully!")
    print(f"\n📍 Model location: {Path(output_path).absolute()}")


def main():
    """Main training pipeline."""
    print("\n" + "=" * 60)
    print(" Custom NER Model Training for Resume Parsing")
    print("=" * 60 + "\n")
    
    # Step 1: Load training data
    training_data = load_training_data(TRAINING_DATA_PATH)
    
    # Step 2: Create blank model
    nlp, ner = create_blank_model()
    
    # Step 3: Add labels
    labels = add_labels(ner, training_data)
    
    # Step 4: Train model
    nlp = train_model(nlp, training_data, epochs=EPOCHS, dropout=DROPOUT)
    
    # Step 5: Test model
    test_model(nlp)
    
    # Step 6: Save model
    save_model(nlp, MODEL_OUTPUT_PATH)
    
    print("\n" + "=" * 60)
    print(" 🎉 Training Complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Test model accuracy: python test_ner_model.py")
    print("2. Integrate into parser: Update parser_logic.py")
    print("3. Restart FastAPI server to load new model")
    print()


if __name__ == "__main__":
    main()
