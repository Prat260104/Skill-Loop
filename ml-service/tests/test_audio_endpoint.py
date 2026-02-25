import requests
import os

# Base URL for the ML service
BASE_URL = "http://localhost:8000/api/v1/audio/transcribe"

# Use the existing test audio file
TEST_AUDIO_FILE = "tests/test_audio.wav"

def test_transcription():
    if not os.path.exists(TEST_AUDIO_FILE):
        print(f"Error: Could not find test audio file '{TEST_AUDIO_FILE}'")
        return
        
    print(f"Testing audio transcription with '{TEST_AUDIO_FILE}'...")
    print("This might take a minute on the first run as the model downloads...")
    
    try:
        # Open the file and send it as a multipart/form-data request
        with open(TEST_AUDIO_FILE, "rb") as audio_file:
            files = {"file": (TEST_AUDIO_FILE, audio_file, "audio/wav")}
            data = {"language": "en"}
            
            response = requests.post(BASE_URL, files=files, data=data)
            
            if response.status_code == 200:
                print("\n✅ Transcription Successful!")
                result = response.json()
                print("-" * 40)
                print(f"Detected Language: {result.get('language')} (Probability: {result.get('language_probability'):.2f})")
                print(f"Duration: {result.get('duration'):.2f} seconds")
                print("\nTranscribed Text:")
                print(result.get("text"))
                print("-" * 40)
            else:
                print(f"\n❌ Transcription Failed! Status Code: {response.status_code}")
                print(f"Error: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("\n❌ Connection Error: Is the ML service running on port 8000?")
        print("Run 'python app/main.py' or 'uvicorn app.main:app --reload'")
    except Exception as e:
        print(f"\n❌ An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    test_transcription()
