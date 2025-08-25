import { useState, useCallback } from 'react';

const useShapeDesignInput = () => {
    const [currentPerimeter, setCurrentPerimeter] = useState(0);
    const [shapeDesignAttempts, setShapeDesignAttempts] = useState(0);

    const resetShapeDesignState = useCallback(() => {
        setCurrentPerimeter(0);
        setShapeDesignAttempts(0);
    }, []);

    const handleShapeDesignCheck = useCallback((
        targetPerimeter,
        feedbackIds,
        getFeedbackText,
        getFeedbackInteraction,
        setDynamicTutorText,
        setActiveFeedbackInteraction,
        setShowNextButton
    ) => {
        if (currentPerimeter === targetPerimeter) {
            // Correct answer
            const feedbackText = getFeedbackText(feedbackIds?.correct);
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
            setShowNextButton(true);
            setShapeDesignAttempts(0); // Reset for next interaction
        } else {
            // Incorrect answer
            const newAttempts = shapeDesignAttempts + 1;
            setShapeDesignAttempts(newAttempts);

            if (newAttempts === 1) {
                // First incorrect attempt - show hint
                const feedbackText = getFeedbackText(feedbackIds?.hint1);
                if (feedbackText) {
                    setDynamicTutorText(feedbackText.replace('{currentPerimeter}', currentPerimeter));
                }
            } else if (newAttempts === 2) {
                // Second incorrect attempt - show second hint
                const feedbackText = getFeedbackText(feedbackIds?.hint2);
                if (feedbackText) {
                    setDynamicTutorText(feedbackText.replace('{currentPerimeter}', currentPerimeter));
                }
            } else if (newAttempts === 3) {
                // Third incorrect attempt - show solution
                const feedbackInteraction = getFeedbackInteraction(feedbackIds?.solution);
                if (feedbackInteraction) {
                    setDynamicTutorText(feedbackInteraction.tutorText);
                    setActiveFeedbackInteraction(feedbackInteraction);
                }
                setShapeDesignAttempts(0); // Reset for next interaction
            }
        }
    }, [currentPerimeter, shapeDesignAttempts]);

    return {
        currentPerimeter,
        setCurrentPerimeter,
        shapeDesignAttempts,
        resetShapeDesignState,
        handleShapeDesignCheck
    };
};

export default useShapeDesignInput;