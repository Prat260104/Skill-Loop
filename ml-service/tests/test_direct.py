import requests
with open("tests/test_audio.wav", "rb") as f:
    res = requests.post("http://127.0.0.1:8000/api/v1/audio/transcribe", files={"file": f}, data={"language": "en"})
    print("STATUS:", res.status_code)
    print("TEXT:", res.text)
