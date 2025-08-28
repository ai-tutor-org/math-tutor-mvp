import { useCallback, useRef } from 'react';

const useAnswerSound = () => {
    const correctSoundRef = useRef(null);
    const incorrectSoundRef = useRef(null);

    // Initialize audio objects on first use
    const initializeSounds = useCallback(() => {
        if (!correctSoundRef.current) {
            correctSoundRef.current = new Audio('/haptics/right-answer.mp3');
            correctSoundRef.current.preload = 'auto';
        }
        if (!incorrectSoundRef.current) {
            incorrectSoundRef.current = new Audio('/haptics/wrong-answer.mp3');
            incorrectSoundRef.current.preload = 'auto';
        }
    }, []);

    const playCorrectSound = useCallback(() => {
        initializeSounds();
        try {
            if (correctSoundRef.current) {
                correctSoundRef.current.currentTime = 0; // Reset to beginning
                correctSoundRef.current.play().catch(console.warn);
            }
        } catch (error) {
            console.warn('Could not play correct answer sound:', error);
        }
    }, [initializeSounds]);

    const playIncorrectSound = useCallback(() => {
        initializeSounds();
        try {
            if (incorrectSoundRef.current) {
                incorrectSoundRef.current.currentTime = 0; // Reset to beginning
                incorrectSoundRef.current.play().catch(console.warn);
            }
        } catch (error) {
            console.warn('Could not play incorrect answer sound:', error);
        }
    }, [initializeSounds]);

    return {
        playCorrectSound,
        playIncorrectSound
    };
};

export default useAnswerSound;