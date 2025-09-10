import { useState, useCallback } from 'react';
import { useClickSound } from '../../../hooks/useClickSound';
import { getFeedbackInteraction, getInteractionData, getPresentationId } from '../../../utils/lessonDataAccess';

const ShapeDesignHandler = () => {
    const [currentPerimeter, setCurrentPerimeter] = useState(0);
    const [shapeDesignAttempts, setShapeDesignAttempts] = useState(0);

    const handleShapeDesignCheck = useCallback((
        lessonId,
        currentPresIndex,
        currentInteractionIndex,
        setShowNextButton,
        setDynamicTutorText,
        setActiveFeedbackInteraction
    ) => {
        const presentationId = getPresentationId(lessonId, currentPresIndex);
        const interaction = getInteractionData(presentationId, currentInteractionIndex);
        const targetPerimeter = interaction?.contentProps?.correctAnswer;

        const playClickSound = useClickSound();
        playClickSound();

        if (currentPerimeter === targetPerimeter) {
            const feedbackText = getFeedbackInteraction(presentationId, interaction?.contentProps?.feedbackIds?.correct)?.tutorText;
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
            setShowNextButton(true);
            setShapeDesignAttempts(0);
        } else {
            const newAttempts = shapeDesignAttempts + 1;
            setShapeDesignAttempts(newAttempts);

            if (newAttempts === 1) {
                const feedbackText = getFeedbackInteraction(presentationId, interaction?.contentProps?.feedbackIds?.hint1)?.tutorText;
                if (feedbackText) {
                    setDynamicTutorText(feedbackText.replace('{currentPerimeter}', currentPerimeter));
                }
            } else if (newAttempts === 2) {
                const feedbackText = getFeedbackInteraction(presentationId, interaction?.contentProps?.feedbackIds?.hint2)?.tutorText;
                if (feedbackText) {
                    setDynamicTutorText(feedbackText.replace('{currentPerimeter}', currentPerimeter));
                }
            } else if (newAttempts === 3) {
                const feedbackInteraction = getFeedbackInteraction(presentationId, interaction?.contentProps?.feedbackIds?.solution);
                if (feedbackInteraction) {
                    setDynamicTutorText(feedbackInteraction.tutorText);
                    setActiveFeedbackInteraction(feedbackInteraction);
                }
                setShapeDesignAttempts(0);
            }
        }
    }, [currentPerimeter, shapeDesignAttempts]);

    return {
        setCurrentPerimeter,
        handleShapeDesignCheck
    };
};

export default ShapeDesignHandler;