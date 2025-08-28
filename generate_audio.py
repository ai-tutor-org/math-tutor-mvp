#!/usr/bin/env python3
"""
Audio Generation Script for Math Tutor MVP

This script extracts tutor text from the modular content structure and generates audio files
using the ElevenLabs API.

Requirements:
    pip install elevenlabs requests python-dotenv

Usage:
    1. Set your ElevenLabs API key as an environment variable:
       export ELEVENLABS_API_KEY="your_api_key_here"
    
    2. Run the script:
       python generate_audio.py

The script will:
- Parse the modular content files in src/content/ (with fallback to contentData.js)
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

def extract_tutor_texts_from_content(content_dir):
    """
    Extract all tutor text from the new modular content structure.
    Returns a dictionary mapping text to unique identifiers.
    """
    print(f"Reading content files from {content_dir}...")
    
    # Dynamically discover all .js files in the content directory
    content_files = []
    for root, _, files in os.walk(content_dir):
        for file in files:
            if file.endswith('.js'):
                # Get relative path from content_dir
                rel_path = os.path.relpath(os.path.join(root, file), content_dir)
                content_files.append(rel_path)
    
    # Sort files for consistent processing order
    content_files.sort()
    
    # Get variable values for template expansion
    variable_values = get_variable_values()
    
    # Process all content files
    tutor_texts = {}
    template_count = 0
    static_count = 0
    
    for file_path in content_files:
        full_path = os.path.join(content_dir, file_path)
        if not os.path.exists(full_path):
            print(f"⚠️  Warning: {full_path} not found, skipping...")
            continue
            
        print(f"  Processing {file_path}...")
        
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all tutorText entries using regex
        tutor_text_pattern = r'tutorText:\s*"((?:[^"\\]|\\.)*)"'
        matches = re.findall(tutor_text_pattern, content, re.DOTALL)
        
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

def extract_tutor_texts():
    """
    Extract all tutor text from the modular content structure.
    Returns a dictionary mapping text to unique identifiers.
    """
    content_dir = "src/content"
    if not os.path.exists(content_dir):
        print(f"❌ Error: Content directory {content_dir} not found")
        return {}
    
    return extract_tutor_texts_from_content(content_dir)

def convert_words_to_sentences(text, words):
    """
    Convert word-level timing data to sentence-level timing.
    Returns a list of sentence timing objects.
    """
    if not words:
        return []
    
    sentences = []
    
    # Find sentence boundaries using regex
    import re
    sentence_pattern = r'[.!?]+\s*'
    sentence_matches = list(re.finditer(sentence_pattern, text))
    
    # If no sentence breaks found, treat entire text as one sentence
    if not sentence_matches:
        return [{
            "text": text.strip(),
            "start": words[0]["start"],
            "end": words[-1]["end"]
        }]
    
    # Build word position map more accurately
    word_positions = []
    current_pos = 0
    
    for word in words:
        # Find the actual position of this word in the text
        word_start = text.find(word["word"], current_pos)
        if word_start == -1:
            # If exact match not found, approximate
            word_start = current_pos
        word_end = word_start + len(word["word"])
        word_positions.append((word_start, word_end))
        current_pos = word_end
    
    # Split into sentences
    sentence_start_idx = 0
    text_start = 0
    
    for match in sentence_matches:
        sentence_end_pos = match.end()
        
        # Find words that fall within this sentence
        sentence_word_indices = []
        
        for word_idx, (word_start, word_end) in enumerate(word_positions):
            if word_idx < sentence_start_idx:
                continue
                
            # Word is in this sentence if it starts before sentence boundary
            if word_start < sentence_end_pos:
                sentence_word_indices.append(word_idx)
            else:
                break
        
        if sentence_word_indices:
            sentence_text = text[text_start:sentence_end_pos].strip()
            first_word_idx = sentence_word_indices[0]
            last_word_idx = sentence_word_indices[-1]
            
            sentences.append({
                "text": sentence_text,
                "start": words[first_word_idx]["start"],
                "end": words[last_word_idx]["end"]
            })
            
            sentence_start_idx = last_word_idx + 1
            text_start = sentence_end_pos
    
    # Handle remaining text as final sentence if any
    if sentence_start_idx < len(words):
        remaining_text = text[text_start:].strip()
        if remaining_text:
            sentences.append({
                "text": remaining_text,
                "start": words[sentence_start_idx]["start"],
                "end": words[-1]["end"]
            })
    
    return sentences

def convert_character_timing_to_words(text, characters, char_start_times, char_end_times):
    """
    Convert character-level timing data to word-level timing.
    Returns a list of word timing objects.
    """
    words = []
    current_word = ""
    word_start_time = None
    char_index = 0
    
    for i, char in enumerate(characters):
        if char_index >= len(text):
            break
            
        if char.isalnum() or char in "'-":
            # Part of a word
            if current_word == "":
                word_start_time = char_start_times[i]
            current_word += char
        else:
            # End of word (space, punctuation, etc.)
            if current_word:
                words.append({
                    "word": current_word,
                    "start": word_start_time,
                    "end": char_end_times[i-1] if i > 0 else char_start_times[i]
                })
                current_word = ""
                word_start_time = None
        
        char_index += 1
    
    # Handle last word if text doesn't end with punctuation
    if current_word:
        words.append({
            "word": current_word,
            "start": word_start_time,
            "end": char_end_times[-1] if char_end_times else word_start_time
        })
    
    return words

def generate_audio_with_timing(text, filename, voice_id=VOICE_ID):
    """
    Generate audio file with timing data using ElevenLabs SDK.
    Returns tuple (success, timing_data).
    """
    try:
        print(f"Generating audio with timing for: {text[:50]}...")
        
        # Generate audio with timing using the SDK
        result = elevenlabs.text_to_speech.convert_with_timestamps(
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
        
        # Extract audio and timing data
        import base64
        audio_bytes = base64.b64decode(result['audio_base64'])
        alignment = result.get('alignment', {})
        
        # Save the audio to file
        audio_path = AUDIO_DIR / f"{filename}.mp3"
        with open(audio_path, "wb") as f:
            f.write(audio_bytes)
        
        # Convert character-level timing to word-level timing
        timing_data = None
        if alignment and 'characters' in alignment:
            characters = alignment['characters']
            char_start_times = alignment.get('character_start_times_seconds', [])
            char_end_times = alignment.get('character_end_times_seconds', [])
            
            if characters and char_start_times and char_end_times:
                words = convert_character_timing_to_words(text, characters, char_start_times, char_end_times)
                sentences = convert_words_to_sentences(text, words)
                timing_data = {
                    "text": text,
                    "sentences": sentences
                }
        
        print(f"✓ Saved: {audio_path}")
        if timing_data:
            print(f"✓ Generated timing data for {len(timing_data.get('sentences', []))} sentences")
        else:
            print("⚠️  No timing data available")
            
        return True, timing_data
        
    except Exception as error:
        print(f"✗ Error generating audio with timing: {error}")
        # Fallback to regular audio generation
        return generate_audio_fallback(text, filename, voice_id), None

def generate_audio_fallback(text, filename, voice_id=VOICE_ID):
    """
    Fallback to regular audio generation without timing.
    """
    try:
        print(f"Fallback: Generating audio without timing for: {text[:50]}...")
        
        # Generate audio using the SDK (regular method)
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

def generate_audio(text, filename, voice_id=VOICE_ID):
    """
    Generate audio file using ElevenLabs SDK.
    Maintained for backward compatibility.
    """
    success, _ = generate_audio_with_timing(text, filename, voice_id)
    return success

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

def save_individual_timing_file(filename, timing_data):
    """
    Save timing data for a single audio file.
    """
    if not timing_data:
        return
        
    timing_dir = AUDIO_DIR / "timing"
    timing_dir.mkdir(exist_ok=True)
    
    timing_path = timing_dir / f"{filename}.json"
    with open(timing_path, 'w', encoding='utf-8') as f:
        json.dump(timing_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Saved timing data: {timing_path}")

def create_timing_mapping(timing_data_collection):
    """
    Create individual timing files and update the timing index.
    """
    timing_dir = AUDIO_DIR / "timing"
    timing_dir.mkdir(exist_ok=True)
    
    # Load existing timing index if it exists
    timing_index_path = timing_dir / "index.json"
    timing_index = {}
    if timing_index_path.exists():
        try:
            with open(timing_index_path, 'r', encoding='utf-8') as f:
                timing_index = json.load(f)
        except:
            print("Warning: Could not load existing timing index, creating new one")
    
    # Add new timing data to index
    new_timing_count = 0
    for filename, timing_data in timing_data_collection.items():
        if timing_data:
            save_individual_timing_file(filename, timing_data)
            timing_index[filename] = f"timing/{filename}.json"
            new_timing_count += 1
    
    # Save updated timing index
    with open(timing_index_path, 'w', encoding='utf-8') as f:
        json.dump(timing_index, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Updated timing index: {timing_index_path}")
    print(f"✓ Added {new_timing_count} new timing files")
    print(f"✓ Total timing files available: {len(timing_index)}")

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
    
    # Extract tutor texts from modular content structure
    tutor_texts = extract_tutor_texts()
    
    if not tutor_texts:
        print("❌ No tutor texts found")
        return
    
    # Smart cleanup - only remove outdated files
    existing_mapping = smart_cleanup_audio_files(tutor_texts)
    
    # Generate audio files with timing (skip existing ones)
    print(f"\n🎤 Processing {len(tutor_texts)} audio files with timing data...")
    successful = 0
    failed = 0
    skipped = 0
    timing_data_collection = {}
    
    for text, filename in tutor_texts.items():
        # Check if we already have this exact audio file
        audio_path = AUDIO_DIR / f"{filename}.mp3"
        if audio_path.exists() and text in existing_mapping:
            print(f"⏭️  Skipping existing: {filename}.mp3")
            skipped += 1
            continue
        
        success, timing_data = generate_audio_with_timing(text, filename)
        if success:
            successful += 1
            if timing_data:
                timing_data_collection[filename] = timing_data
        else:
            failed += 1
    
    # Create mapping files
    create_audio_mapping(tutor_texts)
    create_timing_mapping(timing_data_collection)
    
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