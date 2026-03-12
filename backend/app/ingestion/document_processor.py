import logging
import uuid
from typing import Tuple

import pdfplumber
import docx
from PIL import Image
import pytesseract

import speech_recognition as sr
from moviepy.editor import VideoFileClip

from app.ingestion.vector_database import ingest_document


logger = logging.getLogger(__name__)


def extract_intelligent_pdf_text(page) -> str:
    """
    Intelligence 2.0: Advanced Column & Paragraph Reconstruction.
    - Handles Dual/Triple columns by tracking X-coordinate clusters.
    - Reconstructs paragraphs so text doesn't break mid-sentence.
    - Prevents mixing left/right column lines.
    """
    try:
        words = page.extract_words()
        if not words:
            return ""

        page_width = page.width
        # Sort words primarily by vertical position, then horizontal
        words.sort(key=lambda x: (x['top'], x['x0']))
        
        # 1. Group words into visual lines
        lines = []
        if words:
            current_line = [words[0]]
            for w in words[1:]:
                # Tolerance of 3.5 pixels covers most font variations on the same baseline
                if abs(w['top'] - current_line[-1]['top']) < 3.5:
                    current_line.append(w)
                else:
                    lines.append(current_line)
                    current_line = [w]
            lines.append(current_line)

        final_content = []
        left_buffer = []
        right_buffer = []

        def reconstruct_and_flush():
            """Joins lines in buffers to form a continuous paragraph before adding to final list."""
            for buffer in [left_buffer, right_buffer]:
                if not buffer: continue
                
                joined_text = ""
                for line_text in buffer:
                    line_text = line_text.strip()
                    if not line_text: continue
                    
                    if joined_text:
                        # Logic to join: if it doesn't end with sentence terminal, join with space
                        # Also handle hyphenation at end of line
                        if joined_text.endswith("-"):
                            joined_text = joined_text[:-1] + line_text
                        elif joined_text[-1] in ".!?:":
                            joined_text += "\n" + line_text # Likely new sentence/header
                        else:
                            joined_text += " " + line_text # Continue paragraph
                    else:
                        joined_text = line_text
                
                if joined_text:
                    final_content.append(joined_text)
                buffer.clear()

        mid_x = page_width / 2
        gutter_threshold = page_width * 0.035 # 3.5% gutter is standard for scientific papers

        for line in lines:
            line.sort(key=lambda x: x['x0'])
            
            # Identify columns within this line
            columns = []
            curr_col = [line[0]]
            for i in range(len(line) - 1):
                gap = line[i+1]['x0'] - line[i]['x1']
                if gap > gutter_threshold:
                    columns.append(curr_col)
                    curr_col = [line[i+1]]
                else:
                    curr_col.append(line[i+1])
            columns.append(curr_col)

            # --- CASE 1: Single segment ---
            if len(columns) == 1:
                col = columns[0]
                text = " ".join(w['text'] for w in col)
                left_edge = col[0]['x0']
                right_edge = col[-1]['x1']
                width_pct = (right_edge - left_edge) / page_width

                # If the line spans > 65% of the page, it's a section header or Title
                if width_pct > 0.65:
                    reconstruct_and_flush()
                    final_content.append(text)
                # Otherwise, it belongs to one of the columns
                elif right_edge < mid_x + (page_width * 0.05):
                    left_buffer.append(text)
                else:
                    right_buffer.append(text)

            # --- CASE 2: Dual column ---
            elif len(columns) == 2:
                left_buffer.append(" ".join(w['text'] for w in columns[0]))
                right_buffer.append(" ".join(w['text'] for w in columns[1]))

            # --- CASE 3: Multi-column (Triple etc) ---
            else:
                reconstruct_and_flush()
                # For high complexity, add as a single unified line to be safe
                final_content.append(" ".join(w['text'] for w in line))

        reconstruct_and_flush()
        # Join sections with double newline for visual separation
        return "\n\n".join(final_content)

    except Exception as e:
        logger.error(f"Intelligence 2.0 extraction error: {e}")
        return page.extract_text() or ""


# --------------------------------
# PDF Extraction
# --------------------------------
def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from PDF with layout intelligence for columns.
    """
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = extract_intelligent_pdf_text(page)
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
    return text.strip()


# --------------------------------
# DOCX Extraction
# --------------------------------
def extract_text_from_docx(file_path: str) -> str:

    text = ""

    try:

        document = docx.Document(file_path)

        paragraphs = [p.text for p in document.paragraphs if p.text]

        text = "\n".join(paragraphs)

    except Exception as e:

        logger.error(f"DOCX extraction error: {e}")

    return text.strip()


# --------------------------------
# TXT Extraction
# --------------------------------
def extract_text_from_txt(file_path: str) -> str:

    try:

        with open(file_path, "r", encoding="utf-8") as f:

            return f.read()

    except Exception as e:

        logger.error(f"TXT extraction error: {e}")

        return ""


# --------------------------------
# IMAGE OCR
# --------------------------------
def extract_text_from_image(file_path: str) -> str:

    try:

        image = Image.open(file_path)

        text = pytesseract.image_to_string(image)

        return text.strip()

    except Exception as e:

        logger.error(f"Image OCR error: {e}")

        return ""


import subprocess
import tempfile
import os

# --------------------------------
# AUDIO SPEECH → TEXT
# --------------------------------
def extract_text_from_audio(file_path: str) -> str:
    """
    Transcribes audio using SpeechRecognition. 
    Converts non-wav files to wav first.
    """
    recognizer = sr.Recognizer()
    temp_wav = None

    try:
        extension = file_path.lower().split(".")[-1]
        
        # SpeechRecognition requires WAV/AIFF/FLAC. Convert if needed.
        if extension != "wav":
            temp_wav = os.path.join(tempfile.gettempdir(), f"temp_{uuid.uuid4()}.wav")
            # Use ffmpeg for conversion - extremely robust
            cmd = ["ffmpeg", "-i", file_path, "-ar", "16000", "-ac", "1", temp_wav, "-y"]
            subprocess.run(cmd, capture_output=True, check=True)
            process_path = temp_wav
        else:
            process_path = file_path

        with sr.AudioFile(process_path) as source:
            audio = recognizer.record(source)
            # Using Google's free tier as default
            text = recognizer.recognize_google(audio)
            
            # Cleanup temp wav
            if temp_wav and os.path.exists(temp_wav):
                os.remove(temp_wav)
                
            return text

    except Exception as e:
        logger.error(f"Audio transcription error: {e}")
        if temp_wav and os.path.exists(temp_wav):
            os.remove(temp_wav)
        return ""


# --------------------------------
# VIDEO → AUDIO → TEXT
# --------------------------------
def extract_text_from_video(file_path: str) -> str:
    """
    Robust Video transcription.
    Uses ffmpeg to extract audio directly (avoids MoviePy metadata errors).
    """
    temp_audio = os.path.join(tempfile.gettempdir(), f"v_audio_{uuid.uuid4()}.wav")
    
    try:
        # Extract audio ONLY from video
        # -vn: no video, -ac 1: mono, -ar 16000: freq
        cmd = [
            "ffmpeg", "-i", file_path, 
            "-vn", "-acodec", "pcm_s16le", 
            "-ar", "16000", "-ac", "1", 
            temp_audio, "-y"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"FFMPEG Error: {result.stderr}")
            # Fallback to MoviePy if ffmpeg fails
            try:
                video = VideoFileClip(file_path)
                video.audio.write_audiofile(temp_audio, logger=None)
            except Exception as ve:
                logger.error(f"MoviePy Fallback failed: {ve}")
                return ""

        text = extract_text_from_audio(temp_audio)
        
        # Cleanup
        if os.path.exists(temp_audio):
            os.remove(temp_audio)
            
        return text

    except Exception as e:
        logger.error(f"Video processing error: {e}")
        if os.path.exists(temp_audio):
            os.remove(temp_audio)
        return ""


# --------------------------------
# File Processor
# --------------------------------
def process_file(file_path: str, filename: str) -> Tuple[str, str]:

    extension = filename.lower().split(".")[-1]

    text = ""

    if extension == "pdf":

        text = extract_text_from_pdf(file_path)

    elif extension == "docx":

        text = extract_text_from_docx(file_path)

    elif extension == "txt":

        text = extract_text_from_txt(file_path)

    elif extension in ["jpg", "jpeg", "png", "bmp"]:

        text = extract_text_from_image(file_path)

    elif extension in ["wav", "mp3"]:

        text = extract_text_from_audio(file_path)

    elif extension in ["mp4", "mov", "avi"]:

        text = extract_text_from_video(file_path)

    else:

        raise ValueError(f"Unsupported file type: {extension}")

    return text, extension


# --------------------------------
# Main Document Processor (USED BY ADMIN ROUTES)
# --------------------------------
def process_document(file_path: str, filename: str, metadata: dict):

    """
    Full ingestion pipeline

    1. Extract text
    2. Chunk document
    3. Create embeddings
    4. Store in Qdrant
    """

    text, extension = process_file(file_path, filename)

    if not text:
        logger.error(f"Text extraction EMPTY for {filename}")
        raise ValueError("No text extracted from document")

    logger.info(f"Successfully extracted {len(text)} chars from {filename}. Snippet: {text[:500]}...")

    chunks, status = ingest_document(text, metadata)

    return {
        "file_type": extension,
        "chunks_stored": chunks,
        "status": status
    }