from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
import os
import shutil
import uuid
from typing import Optional

# Import the transcriber service getter
from app.services.audio.service import get_transcriber

router = APIRouter(
    prefix="",
    tags=["Audio Transcription"]
)

# Temporary directory for uploaded files before processing
TEMP_AUDIO_DIR = "temp_audio_files"
os.makedirs(TEMP_AUDIO_DIR, exist_ok=True)

@router.post("/transcribe")
async def transcribe_audio_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    language: Optional[str] = Form("en")
):
    """
    Endpoint to transcribe an uploaded audio file.
    """
    if not file.content_type.startswith("audio/"):
        return JSONResponse(status_code=400, content={"error": "Uploaded file must be an audio file."})

    # Generate a unique filename to prevent collisions
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    temp_file_path = os.path.join(TEMP_AUDIO_DIR, unique_filename)

    try:
        # Save the uploaded file temporarily
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Get the singleton transcriber instance
        transcriber = get_transcriber()

        # Perform the actual transcription (this is a blocking call, 
        # but in a real prod app you might want to offload to celery or background task if it takes too long.
        # For our use case, we wait for the result).
        result = transcriber.transcribe_audio(audio_file_path=temp_file_path, language=language)

        if "error" in result:
             raise HTTPException(status_code=500, detail=result["error"])
             
        # Add a cleanup task to remove the temp file after the response is sent
        background_tasks.add_task(os.remove, temp_file_path)

        return result

    except Exception as e:
         # Clean up the file if an error occurs during processing
         if os.path.exists(temp_file_path):
             os.remove(temp_file_path)
         raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
