import { useCallback, useRef } from 'react';

export const useClickSound = () => {
    const audioRef = useRef(null);

    const playClickSound = useCallback(() => {
        try {
            // Create new audio instance if it doesn't exist
            if (!audioRef.current) {
                audioRef.current = new Audio('/haptics/click.mp3');
                audioRef.current.volume = 0.3; // Set moderate volume
                audioRef.current.preload = 'auto';
            }

            // Reset playback position and play
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((error) => {
                // Silently handle audio play errors (e.g., user hasn't interacted with page yet)
                console.debug('Click sound failed to play:', error);
            });
        } catch (error) {
            // Silently handle any audio creation errors
            console.debug('Click sound initialization failed:', error);
        }
    }, []);

    return playClickSound;
};