import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

const TTSManager = forwardRef(({ text, onStart, onEnd, onError, isDevMode = false, isMobile = false, isMuted = false, onTimeUpdate }, ref) => {
    const [audioMapping, setAudioMapping] = useState(null);
    const [timingIndex, setTimingIndex] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const audioRef = useRef(null);
    const speechUtteranceRef = useRef(null);
    
    // Use a ref to track mute state without causing re-renders
    const isMutedRef = useRef(isMuted);
    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    // Load audio mapping and timing index on component mount
    useEffect(() => {
        const loadAudioData = async () => {
            try {
                const basePath = import.meta.env.BASE_URL || '/';
                
                // Load audio mapping
                const audioMappingPath = `${basePath}audio/audio_mapping.json`.replace('//', '/');
                const audioResponse = await fetch(audioMappingPath);
                if (audioResponse.ok) {
                    const mapping = await audioResponse.json();
                    setAudioMapping(mapping);
                    console.log('Audio mapping loaded successfully');
                } else {
                    console.warn('Audio mapping not found, falling back to Web Speech API');
                    setAudioMapping({});
                }
                
                // Load timing index
                const timingIndexPath = `${basePath}audio/timing/index.json`.replace('//', '/');
                const timingResponse = await fetch(timingIndexPath);
                if (timingResponse.ok) {
                    const timing = await timingResponse.json();
                    setTimingIndex(timing);
                    console.log('Timing index loaded successfully');
                } else {
                    console.warn('Timing index not found');
                    setTimingIndex({});
                }
                
            } catch (error) {
                console.warn('Failed to load audio data:', error);
                setAudioMapping({});
                setTimingIndex({});
            }
        };

        loadAudioData();
    }, []);

    const playPreGeneratedAudio = useCallback((audioFile) => {
        const basePath = import.meta.env.BASE_URL || '/';
        const audioPath = `${basePath}audio/${audioFile}`.replace('//', '/');
        const audio = new Audio(audioPath);

        // Set playback rate to 1.5x in dev mode
        if (isDevMode) {
            audio.playbackRate = 1.5;
        }
        
        // Set volume based on current mute state from ref
        audio.volume = isMutedRef.current ? 0 : 1;

        audio.onloadstart = () => {
            if (onStart) onStart();
        };

        // Only set audioRef when audio actually starts playing
        audio.onplay = () => {
            audioRef.current = audio;
        };

        // Add time update handler for highlighting
        if (onTimeUpdate) {
            audio.ontimeupdate = () => {
                onTimeUpdate(audio.currentTime);
            };
        }

        audio.onended = () => {
            audioRef.current = null;
            setIsPaused(false);
            if (onTimeUpdate) onTimeUpdate(0); // Reset time on end
            if (onEnd) onEnd();
        };

        audio.onerror = (event) => {
            console.error('Audio playback error:', event);
            audioRef.current = null;
            setIsPaused(false);
            if (onTimeUpdate) onTimeUpdate(0); // Reset time on error
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
    }, [onStart, onEnd, onError, isDevMode, onTimeUpdate]);

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
    }, [onStart, onEnd, onError, isDevMode]);

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
        if (onTimeUpdate) onTimeUpdate(0); // Reset time on stop
    }, [onTimeUpdate]);

    const getTimingData = useCallback(async (textToSpeak) => {
        if (!textToSpeak || !timingIndex) {
            return null;
        }

        // Normalize text same way as audio mapping
        const normalizedText = textToSpeak.trim().replace(/\n/g, ' ');
        
        // Get the audio filename from mapping
        const audioFile = audioMapping?.[normalizedText];
        if (!audioFile) {
            return null; // No timing data for fallback speech
        }

        // Extract filename without extension for timing lookup
        const baseFilename = audioFile.replace('.mp3', '');
        const timingFile = timingIndex[baseFilename];
        
        if (!timingFile) {
            return null;
        }

        try {
            const basePath = import.meta.env.BASE_URL || '/';
            const timingPath = `${basePath}audio/${timingFile}`.replace('//', '/');
            const response = await fetch(timingPath);
            
            if (response.ok) {
                const timingData = await response.json();
                return timingData;
            }
        } catch (error) {
            console.warn('Failed to load timing data:', error);
        }
        
        return null;
    }, [audioMapping, timingIndex]);

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
        triggerTTS: (textToSpeak) => {
            if (!isMobile) {
                speakText(textToSpeak);
            }
        },
        pauseTTS,
        resumeTTS,
        stopTTS,
        getTimingData
    }), [speakText, isMobile, pauseTTS, resumeTTS, stopTTS, getTimingData]);

    // Effect to handle audio playback when text changes
    useEffect(() => {
        if (!isMobile) {
            speakText(text);
        }
    }, [text, speakText, isMobile]);

    // Handle runtime volume changes for currently playing audio
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : 1;
        }
        // Note: Web Speech API volume cannot be changed after utterance starts
        // This is intentional - Web Speech will continue at normal volume
    }, [isMuted]);

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
