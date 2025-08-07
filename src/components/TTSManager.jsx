import React, { useEffect, useState, useRef } from 'react';

function TTSManager({ text, onStart, onEnd, onError }) {
    const [voices, setVoices] = useState([]);
    const utteranceRef = useRef(null);

    // Effect to load voices
    useEffect(() => {
        const synth = window.speechSynthesis;
        if (!synth) {
            console.warn('TTSManager: Speech synthesis not supported');
            return;
        }

        const loadVoices = () => {
            const availableVoices = synth.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };

        // Voices are loaded asynchronously. The 'voiceschanged' event is the only reliable way.
        loadVoices();
        synth.onvoiceschanged = loadVoices;

        return () => {
            synth.onvoiceschanged = null;
        };
    }, []);

    // Effect to handle speaking when text or voices change
    useEffect(() => {
        const synth = window.speechSynthesis;
        if (!text || !text.trim() || voices.length === 0) {
            return;
        }

        // Always cancel ongoing speech before starting new speech.
        // This is crucial for preventing overlaps and race conditions.
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text.trim());
        utteranceRef.current = utterance;

        // --- Voice Selection ---
        let selectedVoice = voices.find(voice => voice.name === 'Google UK English Female');
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Female'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en') && voice.default);
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        utterance.voice = selectedVoice || null;

        // --- Configuration ---
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;

        // --- Event Handlers ---
        utterance.onstart = onStart;

        utterance.onend = () => {
            utteranceRef.current = null;
            if (onEnd) onEnd();
        };

        utterance.onerror = (event) => {
            console.error('TTSManager Error:', event.error);
            utteranceRef.current = null;
            if (onError) onError(event.error);
            if (onEnd) onEnd(); // Ensure state machines don't get stuck
        };

        // A small delay can help, especially on mobile browsers
        const timer = setTimeout(() => {
            synth.speak(utterance);
        }, 100);

        // Cleanup: cancel speech and timer
        return () => {
            clearTimeout(timer);
            // Check if this utterance is still the one being spoken before cancelling
            if (synth.speaking && utteranceRef.current === utterance) {
                synth.cancel();
            }
        };
    }, [text, voices, onStart, onEnd, onError]);

    return null;
}

export default TTSManager; 