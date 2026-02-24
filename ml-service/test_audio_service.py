import asyncio
import os
import time
from app.services.audio.service import get_transcriber

def test_transcription():
    print("Testing Audio Transcription Service...")
    
    # Check if the transcriber loads correctly
    print("1. Loading Transcriber...")
    start_time = time.time()
    try:
        transcriber = get_transcriber()
        print(f"   Success! Loaded in {time.time() - start_time:.2f} seconds.")
    except Exception as e:
        print(f"   Failed to load transcriber: {e}")
        return

    # Create a dummy audio file for testing if one doesn't exist
    # Note: In a real scenario, you'd want a real audio file.
    # We will just print instructions for the user.
    print("\n2. Ready for Audio File")
    print("   To test actual transcription, please provide a real audio file path.")
    print("   Example usage in code:")
    print("   result = transcriber.transcribe_audio('path/to/your/audio.mp3')")
    print("   print(result)")

if __name__ == "__main__":
    test_transcription()
