import pytesseract
from PIL import Image
import logging
import speech_recognition as sr
from moviepy.editor import VideoFileClip
import tempfile
import os

# Set Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

logger = logging.getLogger(__name__)


class MultimediaProcessor:

    # -----------------------------
    # IMAGE OCR
    # -----------------------------
    @staticmethod
    def extract_text_from_image(path: str) -> str:

        try:

            image = Image.open(path)

            text = pytesseract.image_to_string(image)

            return text.strip()

        except Exception as e:

            logger.error(f"Image OCR failed: {e}")

            return ""


    # -----------------------------
    # AUDIO → SPEECH TO TEXT
    # -----------------------------
    @staticmethod
    def extract_text_from_audio(path: str) -> str:

        recognizer = sr.Recognizer()

        try:

            with sr.AudioFile(path) as source:

                audio = recognizer.record(source)

                text = recognizer.recognize_google(audio)

                return text

        except Exception as e:

            logger.error(f"Audio transcription failed: {e}")

            return ""


    # -----------------------------
    # VIDEO → AUDIO → TEXT
    # -----------------------------
    @staticmethod
    def extract_text_from_video(path: str) -> str:

        try:

            video = VideoFileClip(path)

            # create temporary audio file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:

                audio_path = temp_audio.name

            video.audio.write_audiofile(audio_path)

            text = MultimediaProcessor.extract_text_from_audio(audio_path)

            os.remove(audio_path)

            return text

        except Exception as e:

            logger.error(f"Video processing failed: {e}")

            return ""


    # -----------------------------
    # MAIN MULTIMEDIA PROCESSOR
    # -----------------------------
    @staticmethod
    def process_file(path: str, filename: str):

        extension = filename.lower().split(".")[-1]

        if extension in ["jpg", "jpeg", "png", "bmp"]:

            return MultimediaProcessor.extract_text_from_image(path)

        elif extension in ["mp3", "wav"]:

            return MultimediaProcessor.extract_text_from_audio(path)

        elif extension in ["mp4", "mov", "avi", "mkv"]:

            return MultimediaProcessor.extract_text_from_video(path)

        else:

            raise ValueError(f"Unsupported multimedia type: {extension}")