// Animation utility functions

/**
 * Determines if a tutor animation should loop continuously or play once
 * @param {string} animationName - The name of the animation
 * @returns {boolean} - True if animation should loop, false if it should play once
 */
export const shouldAnimationLoop = (animationName) => {
    const oneTimeAnimations = [
        'waving',
        'happy-applauding', 
        'on-completion-confetti-happy'
    ];
    return !oneTimeAnimations.includes(animationName);
};