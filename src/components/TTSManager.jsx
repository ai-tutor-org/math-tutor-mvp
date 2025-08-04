import React, { useEffect, useRef } from 'react';

function TTSManager({ text, onStart, onEnd, onError }) {
    const utteranceRef = useRef(null);

    useEffect(() => {
        const synth = window.speechSynthesis;
        if (!synth) {
            console.warn('TTSManager: Speech synthesis not supported');
            return;
        }

        // Always cancel any ongoing speech when text changes or component unmounts.
        // This is the most crucial part to prevent race conditions.
        synth.cancel();

        if (text && text.trim() !== '') {
            const utterance = new SpeechSynthesisUtterance(text.trim());
            utteranceRef.current = utterance;

            // Configure voice settings
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 0.8;

            // Find a good voice
            const voices = synth.getVoices();
            let selectedVoice = voices.find(voice => voice.name === 'Google UK English Female');
            if (!selectedVoice) {
                selectedVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Female'));
            }
            if (!selectedVoice) {
                selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
            }
            utterance.voice = selectedVoice || null;


            utterance.onstart = onStart;

            utterance.onend = () => {
                utteranceRef.current = null;
                if (onEnd) onEnd();
            };

            utterance.onerror = (event) => {
                console.error('TTSManager Error:', event.error);
                utteranceRef.current = null;
                if (onError) onError(event.error);
                // Also call onEnd to ensure state machines don't get stuck
                if (onEnd) onEnd();
            };

            // A small delay can help prevent issues on some browsers
            const timer = setTimeout(() => {
                synth.speak(utterance);
            }, 100);

            return () => clearTimeout(timer);
        }

        // Cleanup function for when component unmounts or text becomes empty
        return () => {
            // On unmount, unconditionally cancel any speech. This is vital for
            // stopping speech when the user navigates away.
            synth.cancel();
        };
    }, [text, onStart, onEnd, onError]);

    return null;
}

export default TTSManager; 