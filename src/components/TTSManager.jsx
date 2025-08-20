import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

const TTSManager = forwardRef(({ text, onStart, onEnd, onError, isDevMode = false, isMobile = false }, ref) => {
    const [audioMapping, setAudioMapping] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const audioRef = useRef(null);
    const speechUtteranceRef = useRef(null);

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

        // Set playback rate to 1.5x in dev mode
        if (isDevMode) {
            audio.playbackRate = 1.5;
        }

        audio.onloadstart = () => {
            if (onStart) onStart();
        };

        // Only set audioRef when audio actually starts playing
        audio.onplay = () => {
            audioRef.current = audio;
        };

        audio.onended = () => {
            audioRef.current = null;
            setIsPaused(false);
            if (onEnd) onEnd();
        };

        audio.onerror = (event) => {
            console.error('Audio playback error:', event);
            audioRef.current = null;
            setIsPaused(false);
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
        utterance.onstart = () => {
            // Only set speechUtteranceRef when speech actually starts
            speechUtteranceRef.current = utterance;
            if (onStart) onStart();
        };
        utterance.onend = () => {
            speechUtteranceRef.current = null;
            setIsPaused(false);
            if (onEnd) onEnd();
        };
        utterance.onerror = (event) => {
            console.error('Web Speech API Error:', event.error);
            speechUtteranceRef.current = null;
            setIsPaused(false);
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

        // Reset pause state when starting new speech
        setIsPaused(false);

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        
        // Cancel any ongoing Web Speech API
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        speechUtteranceRef.current = null;

        // Check if we have a pre-generated audio file for this text
        // Apply same normalization as generate_audio.py (convert newlines to spaces)
        const normalizedText = textToSpeak.trim().replace(/\n/g, ' ');
        const audioFile = audioMapping[normalizedText];

        if (audioFile) {
            // Use pre-generated audio
            playPreGeneratedAudio(audioFile);
        } else {
            // Fall back to Web Speech API
            playWithWebSpeechAPI(normalizedText);
        }
    }, [audioMapping, playPreGeneratedAudio, playWithWebSpeechAPI]);

    const pauseTTS = useCallback(() => {
        if (audioRef.current && !audioRef.current.paused) {
            // For pre-generated audio - only pause if it's currently playing
            audioRef.current.pause();
            setIsPaused(true);
        } else if (speechUtteranceRef.current && window.speechSynthesis) {
            // For Web Speech API - check if synthesis is speaking before pausing
            if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                window.speechSynthesis.pause();
                setIsPaused(true);
            }
        }
    }, []);

    const resumeTTS = useCallback(() => {
        if (audioRef.current) {
            // For pre-generated audio
            audioRef.current.play().catch(error => {
                console.error('Failed to resume audio:', error);
                setIsPaused(false);
            });
            setIsPaused(false);
        } else if (speechUtteranceRef.current && window.speechSynthesis) {
            // For Web Speech API - check if synthesis is paused before resuming
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                setIsPaused(false);
            }
        }
    }, []);

    const stopTTS = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        speechUtteranceRef.current = null;
        setIsPaused(false);
    }, []);

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
        triggerTTS: (textToSpeak) => {
            if (!isMobile) {
                speakText(textToSpeak);
            }
        },
        pauseTTS,
        resumeTTS,
        stopTTS
    }), [speakText, isMobile, pauseTTS, resumeTTS, stopTTS]);

    // Effect to handle audio playback when text changes
    useEffect(() => {
        if (!isMobile) {
            speakText(text);
        }
    }, [text, speakText, isMobile]);

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
