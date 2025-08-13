import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

const TTSManager = forwardRef(({ text, onStart, onEnd, onError, isDevMode = false }, ref) => {
    const [audioMapping, setAudioMapping] = useState(null);
    const audioRef = useRef(null);

    // Load audio mapping on component mount
    useEffect(() => {
        const loadAudioMapping = async () => {
            try {
                const basePath = import.meta.env.BASE_URL || '/';
                const audioMappingPath = `${basePath}audio/audio_mapping.json`.replace('//', '/');
                const response = await fetch(audioMappingPath);
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

    const playPreGeneratedAudio = useCallback((audioFile) => {
        const basePath = import.meta.env.BASE_URL || '/';
        const audioPath = `${basePath}audio/${audioFile}`.replace('//', '/');
        const audio = new Audio(audioPath);
        audioRef.current = audio;

        // Set playback rate to 1.5x in dev mode
        if (isDevMode) {
            audio.playbackRate = 1.5;
        }

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
    }, [onStart, onEnd, onError]);

    const playWithWebSpeechAPI = useCallback((textToSpeak) => {
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
        utterance.rate = isDevMode ? 1.35 : 0.9; // 1.35x speed in dev mode
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
    }, [onStart, onEnd, onError]);

    const speakText = useCallback((textToSpeak) => {
        if (!textToSpeak || !textToSpeak.trim() || audioMapping === null) {
            return;
        }

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Check if we have a pre-generated audio file for this text
        const audioFile = audioMapping[textToSpeak.trim()];

        if (audioFile) {
            // Use pre-generated audio
            playPreGeneratedAudio(audioFile);
        } else {
            // Fall back to Web Speech API
            playWithWebSpeechAPI(textToSpeak.trim());
        }
    }, [audioMapping, playPreGeneratedAudio, playWithWebSpeechAPI]);

    // Expose triggerTTS method to parent components
    useImperativeHandle(ref, () => ({
        triggerTTS: (textToSpeak) => {
            speakText(textToSpeak);
        }
    }), [speakText]);

    // Effect to handle audio playback when text changes
    useEffect(() => {
        speakText(text);
    }, [text, speakText]);

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
});

TTSManager.displayName = 'TTSManager';

export default TTSManager;
