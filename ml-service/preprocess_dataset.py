"""
Comprehensive Resume Dataset Preprocessor
=========================================
Downloads, cleans, and validates resume NER dataset
"""

import requests
import json
import re
from pathlib import Path
from typing import List, Tuple, Dict

print("=" * 70)
print(" Resume Dataset Preprocessing Pipeline")
print("=" * 70)

# Step 1: Download Dataset
print("\n📥 Step 1: Downloading Dataset...")

DATASET_URL = "https://raw.githubusercontent.com/DataTurks-Engg/Entity-Recognition-In-Resumes-SpaCy/master/traindata.json"

try:
    response = requests.get(DATASET_URL, timeout=30)
    response.raise_for_status()
    
    # Parse line-delimited JSON
    raw_data = []
    for line in response.text.strip().split('\n'):
        if line.strip():
            try:
                raw_data.append(json.loads(line))
            except:
                pass
    
    print(f"✅ Downloaded {len(raw_data)} raw examples")
    
except Exception as e:
    print(f"❌ Download failed: {e}")
    exit(1)

# Step 2: Data Cleaning Functions
print("\n🧹 Step 2: Setting up cleaning functions...")

def clean_text(text: str) -> str:
    """Clean and normalize text."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters that cause issues
    text = text.replace('\u00a0', ' ')  # Non-breaking space
    return text.strip()

def validate_entity(text: str, start: int, end: int, label: str) -> bool:
    """Validate if entity annotation is correct."""
    if start < 0 or end > len(text) or start >= end:
        return False
    
    entity_text = text[start:end]
    
    # Check for leading/trailing whitespace
    if entity_text != entity_text.strip():
        return False
    
    # Check if entity is not just punctuation
    if not re.search(r'[a-zA-Z0-9]', entity_text):
        return False
    
    # Check minimum length
    if len(entity_text) < 2:
        return False
    
    return True

def fix_entity_boundaries(text: str, start: int, end: int) -> Tuple[int, int]:
    """Fix entity boundaries by removing leading/trailing whitespace."""
    entity_text = text[start:end]
    
    # Find actual start (skip leading whitespace)
    offset = len(entity_text) - len(entity_text.lstrip())
    new_start = start + offset
    
    # Find actual end (skip trailing whitespace)
    entity_text = text[new_start:end]
    offset = len(entity_text) - len(entity_text.rstrip())
    new_end = end - offset
    
    return new_start, new_end

def remove_overlapping_entities(entities: List[Tuple[int, int, str]]) -> List[Tuple[int, int, str]]:
    """Remove overlapping entities, keeping longer ones."""
    if not entities:
        return []
    
    # Sort by start position, then by length (descending)
    sorted_entities = sorted(entities, key=lambda x: (x[0], -(x[1] - x[0])))
    
    cleaned = []
    for ent in sorted_entities:
        start, end, label = ent
        
        # Check for overlap with existing entities
        has_overlap = False
        for existing in cleaned:
            e_start, e_end, _ = existing
            
            # Overlap condition
            if not (end <= e_start or start >= e_end):
                has_overlap = True
                break
        
        if not has_overlap:
            cleaned.append(ent)
    
    return sorted(cleaned, key=lambda x: x[0])

# Step 3: Process Dataset
print("✅ Cleaning functions ready")
print("\n🔄 Step 3: Processing dataset...")

processed_data = []
stats = {
    "total_raw": len(raw_data),
    "skipped_no_text": 0,
    "skipped_no_entities": 0,
    "invalid_entities_removed": 0,
    "overlaps_removed": 0,
    "successful": 0
}

LABEL_MAP = {
    "Skills": "SKILL",
    "Designation": "JOB_ROLE",
    "Companies worked at": "ORG",
    "Company": "ORG",
    "Organization": "ORG"
}

TARGET_LABELS = ["SKILL", "JOB_ROLE", "ORG"]

for idx, example in enumerate(raw_data):
    try:
        # Extract text
        text = example.get('content', '')
        if not text or len(text) < 50:
            stats["skipped_no_text"] += 1
            continue
        
        # Clean text
        text = clean_text(text)
        
        # Extract annotations
        annotations = example.get('annotation', [])
        entities = []
        
        for ann in annotations:
            labels = ann.get('label', [])
            points = ann.get('points', [])
            
            for point in points:
                start = point.get('start', 0)
                end = point.get('end', 0)
                
                # Fix boundaries
                try:
                    start, end = fix_entity_boundaries(text, start, end)
                except:
                    stats["invalid_entities_removed"] += 1
                    continue
                
                # Map label
                if labels:
                    original_label = labels[0]
                    normalized_label = LABEL_MAP.get(original_label, original_label)
                    
                    # Only keep target labels
                    if normalized_label in TARGET_LABELS:
                        # Validate entity
                        if validate_entity(text, start, end, normalized_label):
                            entities.append((start, end, normalized_label))
                        else:
                            stats["invalid_entities_removed"] += 1
        
        if not entities:
            stats["skipped_no_entities"] += 1
            continue
        
        # Remove overlaps
        original_count = len(entities)
        entities = remove_overlapping_entities(entities)
        stats["overlaps_removed"] += original_count - len(entities)
        
        # Add to processed data
        if entities:
            processed_data.append({
                "text": text,
                "entities": [[s, e, l] for s, e, l in entities]
            })
            stats["successful"] += 1
            
    except Exception as e:
        print(f"⚠️ Error processing example {idx}: {e}")

print(f"✅ Processing complete!")

# Step 4: Statistics
print(f"\n📊 Step 4: Dataset Statistics")
print(f"   Raw examples: {stats['total_raw']}")
print(f"   Skipped (no text): {stats['skipped_no_text']}")
print(f"   Skipped (no entities): {stats['skipped_no_entities']}")
print(f"   Invalid entities removed: {stats['invalid_entities_removed']}")
print(f"   Overlapping entities removed: {stats['overlaps_removed']}")
print(f"   ✅ Clean examples: {stats['successful']}")

# Entity statistics
total_entities = sum(len(item['entities']) for item in processed_data)
label_counts = {}
for item in processed_data:
    for ent in item['entities']:
        label = ent[2]
        label_counts[label] = label_counts.get(label, 0) + 1

print(f"\n   Total entities: {total_entities}")
print(f"   Avg entities/resume: {total_entities / len(processed_data):.1f}")
print(f"\n   Label distribution:")
for label, count in sorted(label_counts.items(), key=lambda x: x[1], reverse=True):
    percentage = (count / total_entities) * 100
    print(f"      {label}: {count} ({percentage:.1f}%)")

# Step 5: Save
print(f"\n💾 Step 5: Saving cleaned dataset...")

output_path = "app/services/resume_parser/data/clean_resume_dataset.json"
Path(output_path).parent.mkdir(parents=True, exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(processed_data, f, indent=2, ensure_ascii=False)

print(f"✅ Saved to: {output_path}")

# Step 6: Validation
print(f"\n✔️ Step 6: Validating dataset...")

validation_errors = 0
for idx, item in enumerate(processed_data[:10]):  # Validate first 10
    text = item['text']
    for ent in item['entities']:
        start, end, label = ent
        if not validate_entity(text, start, end, label):
            print(f"⚠️ Validation error in example {idx}: {ent}")
            validation_errors += 1

if validation_errors == 0:
    print("✅ All samples validated successfully!")
else:
    print(f"⚠️ Found {validation_errors} validation errors")

# Step 7: Sample Preview
print(f"\n📋 Step 7: Sample Preview")

sample = processed_data[0]
print(f"   Text: {sample['text'][:120]}...")
print(f"   Entities ({len(sample['entities'])}):")
for ent in sample['entities'][:10]:
    start, end, label = ent
    word = sample['text'][start:end]
    print(f"      '{word}' → {label}")

print("\n" + "=" * 70)
print(" ✅ Dataset Preprocessing Complete!")
print("=" * 70)
print(f"\nCleaned Dataset: {len(processed_data)} resumes ready for training")
print(f"\nNext: Update train_ner_model.py to use:")
print(f'   TRAINING_DATA_PATH = "{output_path}"')
