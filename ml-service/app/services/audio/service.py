import os
import logging
from faster_whisper import WhisperModel

# Setup Logging
logger = logging.getLogger(__name__)

class AudioTranscriber:
    def __init__(self, model_size="large-v3-turbo", device="cpu", compute_type="int8"):
        """
        Initializes the faster-whisper model.
        - model_size: The model to use (large-v3-turbo for high accuracy & speed)
        - device: "cpu" or "cuda"
        - compute_type: "int8" is best for CPU to reduce memory without losing accuracy.
        """
        self.model_size = model_size
        self.device = device
        self.compute_type = compute_type
        
        logger.info(f"Loading faster-whisper model '{self.model_size}' on '{self.device}'...")
        try:
            # The model is downloaded the first time and cached.
            self.model = WhisperModel(self.model_size, device=self.device, compute_type=self.compute_type)
            logger.info("Whisper model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {str(e)}")
            raise e

    def transcribe_audio(self, audio_file_path: str, language: str = "en") -> dict:
        """
        Transcribes the given audio file using the loaded Whisper model.
        Returns the full text and segments.
        """
        if not os.path.exists(audio_file_path):
            return {"error": f"Audio file not found: {audio_file_path}"}
            
        logger.info(f"Starting transcription for {audio_file_path}...")
        try:
            # Fast transcription
            segments, info = self.model.transcribe(audio_file_path, beam_size=5, language=language)
            
            logger.info(f"Detected language '{info.language}' with probability {info.language_probability:.2f}")
            
            # Combine segments into full text
            full_text = ""
            for segment in segments:
                # Add a space between segments if needed
                text = segment.text.strip()
                if text:
                    full_text += text + " "
                    
            return {
                "text": full_text.strip(),
                "language": info.language,
                "language_probability": info.language_probability,
                "duration": info.duration
            }
            
        except Exception as e:
            logger.error(f"Error during transcription: {str(e)}")
            return {"error": str(e)}

# Singleton instance for the FastAPI app to reuse
transcriber_instance = None

def get_transcriber() -> AudioTranscriber:
    """Lazy load the transcriber to avoid slowing down fastAPI startup if unused."""
    global transcriber_instance
    if transcriber_instance is None:
        transcriber_instance = AudioTranscriber()
    return transcriber_instance
