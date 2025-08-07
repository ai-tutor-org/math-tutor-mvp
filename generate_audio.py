#!/usr/bin/env python3
"""
Audio Generation Script for Math Tutor MVP

This script extracts tutor text from contentData.js and generates audio files
using the ElevenLabs API.

Requirements:
    pip install elevenlabs requests

Usage:
    1. Set your ElevenLabs API key as an environment variable:
       export ELEVENLABS_API_KEY="your_api_key_here"
    
    2. Run the script:
       python generate_audio.py

The script will:
- Parse contentData.js to extract all tutor text
- Generate unique audio files for each text segment
- Save files to public/audio/ directory
- Create a mapping file for the frontend to use
"""

from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
import os
import re
import json
import hashlib
from pathlib import Path

load_dotenv()

# ElevenLabs client configuration
elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

# Voice configuration - Hope (premade voice)
VOICE_ID = "tnSpp4vdxKPjI9w0GnoV"  # Hope's voice ID

# Output directory
AUDIO_DIR = Path("public/audio")
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

def extract_tutor_texts(content_data_path):
    """
    Extract all tutor text from contentData.js file.
    Returns a dictionary mapping text to unique identifiers.
    """
    print(f"Reading {content_data_path}...")
    
    with open(content_data_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all tutorText entries using regex - handle both single and double quotes properly
    # Pattern explanation:
    # - tutorText:\s* - matches "tutorText:" with optional whitespace
    # - " - matches opening double quote
    # - ((?:[^"\\]|\\.)* - matches any character except quote/backslash, or any escaped character
    # - " - matches closing double quote
    tutor_text_pattern = r'tutorText:\s*"((?:[^"\\]|\\.)*)"'
    matches = re.findall(tutor_text_pattern, content, re.DOTALL)
    
    # Clean up matches and create unique mapping
    tutor_texts = {}
    for match in matches:
        # Clean up the text - remove extra whitespace and escape sequences
        clean_text = match.replace('\\n', ' ').replace('\\"', '"').strip()
        if clean_text and clean_text not in tutor_texts:
            # Create a unique identifier based on content hash
            text_hash = hashlib.md5(clean_text.encode()).hexdigest()[:12]
            tutor_texts[clean_text] = f"tutor_{text_hash}"
    
    print(f"Found {len(tutor_texts)} unique tutor text segments")
    return tutor_texts

def generate_audio(text, filename, voice_id=VOICE_ID):
    """
    Generate audio file using ElevenLabs SDK.
    """
    try:
        print(f"Generating audio for: {text[:50]}...")
        
        # Generate audio using the SDK
        audio = elevenlabs.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_flash_v2_5",
            output_format="mp3_44100_128",
        )
        
        # Save the audio to file
        audio_path = AUDIO_DIR / f"{filename}.mp3"
        with open(audio_path, "wb") as f:
            # The audio object is an iterator of bytes
            for chunk in audio:
                f.write(chunk)
        
        print(f"✓ Saved: {audio_path}")
        return True
        
    except Exception as error:
        print(f"✗ Error generating audio: {error}")
        return False

def create_audio_mapping(tutor_texts):
    """
    Create a JSON mapping file for the frontend to use.
    """
    # Create mapping with placeholder for {userName}
    audio_mapping = {}
    
    for text, filename in tutor_texts.items():
        # Store both the original text and the filename
        audio_mapping[text] = f"{filename}.mp3"
    
    mapping_path = AUDIO_DIR / "audio_mapping.json"
    with open(mapping_path, 'w', encoding='utf-8') as f:
        json.dump(audio_mapping, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Created audio mapping: {mapping_path}")

def cleanup_old_audio_files():
    """
    Remove all existing audio files to ensure fresh generation.
    """
    print("🧹 Cleaning up old audio files...")
    
    # Remove all .mp3 files in the audio directory
    for audio_file in AUDIO_DIR.glob("*.mp3"):
        audio_file.unlink()
        print(f"   Removed: {audio_file.name}")
    
    # Remove old mapping file if it exists
    mapping_file = AUDIO_DIR / "audio_mapping.json"
    if mapping_file.exists():
        mapping_file.unlink()
        print("   Removed: audio_mapping.json")
    
    print("✅ Cleanup complete")

def main():
    """
    Main function to generate all audio files.
    """
    print("🎵 Math Tutor Audio Generation Script")
    print("=" * 40)
    
    # Check for API key
    if not os.getenv("ELEVENLABS_API_KEY"):
        print("❌ Error: ELEVENLABS_API_KEY environment variable not set")
        print("Please set your API key with: export ELEVENLABS_API_KEY='your_key_here'")
        print("Or create a .env file with: ELEVENLABS_API_KEY=your_key_here")
        return
    
    # Clean up old audio files first
    cleanup_old_audio_files()
    
    # Extract tutor texts
    content_data_path = "src/contentData.js"
    if not os.path.exists(content_data_path):
        print(f"❌ Error: {content_data_path} not found")
        return
    
    tutor_texts = extract_tutor_texts(content_data_path)
    
    if not tutor_texts:
        print("❌ No tutor texts found")
        return
    
    # Generate audio files
    print(f"\n🎤 Generating {len(tutor_texts)} audio files...")
    successful = 0
    failed = 0
    
    for text, filename in tutor_texts.items():
        if generate_audio(text, filename):
            successful += 1
        else:
            failed += 1
    
    # Create mapping file
    create_audio_mapping(tutor_texts)
    
    # Summary
    print(f"\n📊 Summary:")
    print(f"✓ Successful: {successful}")
    print(f"✗ Failed: {failed}")
    print(f"📁 Audio files saved to: {AUDIO_DIR}")
    
    if failed > 0:
        print(f"\n⚠️  {failed} files failed to generate. Check your API key and internet connection.")

if __name__ == "__main__":
    main()