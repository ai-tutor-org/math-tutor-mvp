# Audio Generation Setup

This guide explains how to set up and use ElevenLabs TTS for the math tutor application.

## Prerequisites

1. **ElevenLabs Account**: Sign up at [elevenlabs.io](https://elevenlabs.io)
2. **API Key**: Get your API key from your ElevenLabs dashboard
3. **Python 3.7+**: Required to run the audio generation script

## Setup Instructions

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set your ElevenLabs API key**:
   
   **Option A**: Environment variable
   ```bash
   export ELEVENLABS_API_KEY="your_api_key_here"
   ```
   
   **Option B**: Create a `.env` file in the project root
   ```
   ELEVENLABS_API_KEY=your_api_key_here
   ```

3. **Generate audio files**:
   ```bash
   python generate_audio.py
   ```

The script will:
- Clean up any existing audio files for fresh generation
- Extract all tutor text from `src/contentData.js` using improved regex
- Generate unique MP3 files for each text segment
- Save files to `public/audio/`
- Create `audio_mapping.json` for the frontend

## How It Works

### Audio Generation
- Uses ElevenLabs "Hope" voice (ID: `tnSpp4vdxKPjI9w0GnoV`)
- Uses ElevenLabs SDK with `eleven_flash_v2_5` model for fast, high-quality generation
- Generates unique filenames based on content hash
- Always regenerates all files for consistency (cleans up old files first)
- Creates a fresh mapping file that exactly matches current content

### Frontend Integration
The updated `TTSManager` component:
1. Loads `audio_mapping.json` on startup
2. Checks for pre-generated audio for each text
3. Falls back to Web Speech API if audio file doesn't exist
4. Maintains the same interface for the rest of the app

## File Structure

```
public/audio/
├── audio_mapping.json     # Maps text to audio filenames
├── tutor_abc123def.mp3    # Generated audio files
├── tutor_456ghi789.mp3
└── ...
```

## Customization

You can modify the voice settings in `generate_audio.py`:
- **Voice ID**: Change `VOICE_ID` for different voices (currently using Hope's voice)
- **Model**: Switch between `eleven_flash_v2_5` (fast) or `eleven_multilingual_v2` (higher quality)
- **Output Format**: Adjust audio quality with different formats (currently `mp3_44100_128`)

## Cost Considerations

ElevenLabs pricing is per character:
- Your lesson has approximately 3,000-4,000 characters of tutor text
- This should cost less than $1 to generate all audio files
- Files are cached, so you only generate once

## Troubleshooting

- **"API key not set"**: Make sure to export your API key or create `.env` file
- **Audio not playing**: Check browser console for loading errors
- **Missing audio files**: Re-run the generation script (it will clean up and regenerate all files)
- **Fallback to Web Speech**: Normal behavior for missing audio files
- **Truncated text in mapping**: Fixed with improved regex that handles apostrophes and quotes
- **Old audio files persist**: Script now automatically cleans up old files before generating new ones