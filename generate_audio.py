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

def get_variable_values():
    """
    Define the possible values for variables in tutor text.
    Returns a dictionary mapping variable names to their possible values.
    """
    return {
        'currentPerimeter': [
            '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36'
        ]
    }

def expand_template_text(template_text, variable_values):
    """
    Expand a template text with variables into multiple concrete texts.
    Returns a list of (expanded_text, unique_id) tuples.
    """
    import re
    
    # Find all variables in the template
    variable_pattern = r'\{(\w+)\}'
    variables = re.findall(variable_pattern, template_text)
    
    if not variables:
        # No variables, return as is
        text_hash = hashlib.md5(template_text.encode()).hexdigest()[:12]
        return [(template_text, f"tutor_{text_hash}")]
    
    expanded_texts = []
    
    # For each variable found, generate all possible combinations
    def generate_combinations(text, var_index=0):
        if var_index >= len(variables):
            # Base case: no more variables to substitute
            final_text = text
            text_hash = hashlib.md5(final_text.encode()).hexdigest()[:12]
            return [(final_text, f"tutor_{text_hash}")]
        
        var_name = variables[var_index]
        if var_name not in variable_values:
            print(f"Warning: No values defined for variable '{var_name}', skipping")
            return []
        
        results = []
        for value in variable_values[var_name]:
            # Replace the first occurrence of this variable
            new_text = re.sub(r'\{' + var_name + r'\}', value, text, count=1)
            results.extend(generate_combinations(new_text, var_index + 1))
        
        return results
    
    return generate_combinations(template_text)

def extract_tutor_texts(content_data_path):
    """
    Extract all tutor text from contentData.js file and expand templates.
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
    
    # Get variable values for template expansion
    variable_values = get_variable_values()
    
    # Clean up matches and expand templates
    tutor_texts = {}
    template_count = 0
    static_count = 0
    
    for match in matches:
        # Clean up the text - remove extra whitespace and escape sequences
        clean_text = match.replace('\\n', ' ').replace('\\"', '"').strip()
        if not clean_text:
            continue
            
        # Check if this text contains variables
        if '{' in clean_text and '}' in clean_text:
            # This is a template - expand it
            expanded_texts = expand_template_text(clean_text, variable_values)
            template_count += 1
            
            for expanded_text, unique_id in expanded_texts:
                if expanded_text not in tutor_texts:
                    tutor_texts[expanded_text] = unique_id
                    
        else:
            # Static text - add as is
            if clean_text not in tutor_texts:
                text_hash = hashlib.md5(clean_text.encode()).hexdigest()[:12]
                tutor_texts[clean_text] = f"tutor_{text_hash}"
                static_count += 1
    
    print(f"Found {static_count} static text segments and {template_count} templates")
    print(f"Generated {len(tutor_texts)} total unique audio segments")
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
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
            voice_settings={
                "speed": 0.85,
                "stability": 0.5,
                "similarity_boost": 0.75
            }
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

def smart_cleanup_audio_files(current_tutor_texts):
    """
    Remove only audio files that don't match current content, keep existing ones.
    """
    print("🧹 Smart cleanup: checking for outdated audio files...")
    
    # Load existing mapping if it exists
    mapping_file = AUDIO_DIR / "audio_mapping.json"
    existing_mapping = {}
    if mapping_file.exists():
        try:
            with open(mapping_file, 'r', encoding='utf-8') as f:
                existing_mapping = json.load(f)
        except:
            print("   Warning: Could not load existing mapping, will regenerate all")
    
    # Find files that should be removed (not in current content)
    current_filenames = set(current_tutor_texts.values())
    existing_files = set(f.name for f in AUDIO_DIR.glob("*.mp3"))
    
    files_to_remove = []
    for audio_file in AUDIO_DIR.glob("*.mp3"):
        filename = audio_file.name
        # Check if this file corresponds to current content
        file_is_current = filename in [f"{fname}.mp3" for fname in current_filenames]
        if not file_is_current:
            files_to_remove.append(audio_file)
    
    # Remove outdated files
    removed_count = 0
    for audio_file in files_to_remove:
        audio_file.unlink()
        print(f"   Removed outdated: {audio_file.name}")
        removed_count += 1
    
    if removed_count == 0:
        print("   No outdated files found")
    else:
        print(f"✅ Removed {removed_count} outdated audio files")
    
    return existing_mapping

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
    
    # Extract tutor texts first
    content_data_path = "src/contentData.js"
    if not os.path.exists(content_data_path):
        print(f"❌ Error: {content_data_path} not found")
        return
    
    tutor_texts = extract_tutor_texts(content_data_path)
    
    if not tutor_texts:
        print("❌ No tutor texts found")
        return
    
    # Smart cleanup - only remove outdated files
    existing_mapping = smart_cleanup_audio_files(tutor_texts)
    
    # Generate audio files (skip existing ones)
    print(f"\n🎤 Processing {len(tutor_texts)} audio files...")
    successful = 0
    failed = 0
    skipped = 0
    
    for text, filename in tutor_texts.items():
        # Check if we already have this exact audio file
        audio_path = AUDIO_DIR / f"{filename}.mp3"
        if audio_path.exists() and text in existing_mapping:
            print(f"⏭️  Skipping existing: {filename}.mp3")
            skipped += 1
            continue
        
        if generate_audio(text, filename):
            successful += 1
        else:
            failed += 1
    
    # Create mapping file
    create_audio_mapping(tutor_texts)
    
    # Summary
    print(f"\n📊 Summary:")
    print(f"✓ Generated: {successful}")
    print(f"⏭️  Skipped (existing): {skipped}")
    print(f"✗ Failed: {failed}")
    print(f"📁 Total audio files: {successful + skipped}")
    print(f"📁 Audio files saved to: {AUDIO_DIR}")
    
    if failed > 0:
        print(f"\n⚠️  {failed} files failed to generate. Check your API key and internet connection.")

if __name__ == "__main__":
    main()