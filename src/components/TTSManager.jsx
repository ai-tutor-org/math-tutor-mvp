import React, { useState, useEffect, useRef } from 'react';

function TTSManager({ text, onStart, onEnd, onError }) {
    const [audioMapping, setAudioMapping] = useState(null);
    const audioRef = useRef(null);

    // Load audio mapping on component mount
    useEffect(() => {
        const loadAudioMapping = async () => {
            try {
                const response = await fetch('/audio/audio_mapping.json');
                if (response.ok) {
                    const mapping = await response.json();
                    setAudioMapping(mapping);
                    console.log('Audio mapping loaded successfully');
                } else {
                    console.warn('Audio mapping not found, falling back to Web Speech API');
                    setAudioMapping({});
                }
            } catch (error) {
                console.warn('Failed to load audio mapping, falling back to Web Speech API:', error);
                setAudioMapping({});
            }
        };

        loadAudioMapping();
    }, []);

    // Effect to handle audio playback when text changes
    useEffect(() => {
        if (!text || !text.trim() || audioMapping === null) {
            return;
        }

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Check if we have a pre-generated audio file for this text
        const audioFile = audioMapping[text.trim()];
        
        if (audioFile) {
            // Use pre-generated audio
            playPreGeneratedAudio(audioFile);
        } else {
            // Fall back to Web Speech API
            playWithWebSpeechAPI(text.trim());
        }
    }, [text, audioMapping, onStart, onEnd, onError]);

    const playPreGeneratedAudio = (audioFile) => {
        const audio = new Audio(`/audio/${audioFile}`);
        audioRef.current = audio;

        audio.onloadstart = () => {
            if (onStart) onStart();
        };

        audio.onended = () => {
            audioRef.current = null;
            if (onEnd) onEnd();
        };

        audio.onerror = (event) => {
            console.error('Audio playback error:', event);
            audioRef.current = null;
            if (onError) onError(event.error || 'Audio playback failed');
            if (onEnd) onEnd(); // Ensure state machines don't get stuck
        };

        // Small delay to ensure proper loading
        setTimeout(() => {
            audio.play().catch(error => {
                console.error('Failed to play audio:', error);
                if (onError) onError(error);
                if (onEnd) onEnd();
            });
        }, 100);
    };

    const playWithWebSpeechAPI = (textToSpeak) => {
        const synth = window.speechSynthesis;
        if (!synth) {
            console.warn('TTSManager: Speech synthesis not supported');
            if (onError) onError('Speech synthesis not supported');
            if (onEnd) onEnd();
            return;
        }

        // Cancel any ongoing speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        // Voice selection (simplified since this is fallback)
        const voices = synth.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        // Configuration
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;

        // Event handlers
        utterance.onstart = onStart;
        utterance.onend = () => {
            if (onEnd) onEnd();
        };
        utterance.onerror = (event) => {
            console.error('Web Speech API Error:', event.error);
            if (onError) onError(event.error);
            if (onEnd) onEnd();
        };

        setTimeout(() => {
            synth.speak(utterance);
        }, 100);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return null;
}

export default TTSManager; 
