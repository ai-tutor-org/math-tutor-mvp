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
        getFeedbackInteraction,
        setDynamicTutorText,
        setActiveFeedbackInteraction,
        setShowNextButton
    ) => {
        if (currentPerimeter === targetPerimeter) {
            const feedbackText = getFeedbackInteraction(feedbackIds?.correct)?.tutorText;
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
            setShowNextButton(true);
            setShapeDesignAttempts(0);
        } else {
            const newAttempts = shapeDesignAttempts + 1;
            setShapeDesignAttempts(newAttempts);

            if (newAttempts === 1) {
                const feedbackText = getFeedbackInteraction(feedbackIds?.hint1)?.tutorText;
                if (feedbackText) {
                    setDynamicTutorText(feedbackText.replace('{currentPerimeter}', currentPerimeter));
                }
            } else if (newAttempts === 2) {
                const feedbackText = getFeedbackInteraction(feedbackIds?.hint2)?.tutorText;
                if (feedbackText) {
                    setDynamicTutorText(feedbackText.replace('{currentPerimeter}', currentPerimeter));
                }
            } else if (newAttempts === 3) {
                const feedbackInteraction = getFeedbackInteraction(feedbackIds?.solution);
                if (feedbackInteraction) {
                    setDynamicTutorText(feedbackInteraction.tutorText);
                    setActiveFeedbackInteraction(feedbackInteraction);
                }
                setShapeDesignAttempts(0);
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