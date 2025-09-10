import { useState, useCallback } from 'react';
import useAnswerSound from '../../../hooks/useAnswerSound';
import { getPresentationId, getInteractionData, getFeedbackInteraction } from '../../../utils/lessonDataAccess';

const PerimeterHandler = () => {
    const [perimeterAttempts, setPerimeterAttempts] = useState(0);
    const { playAnswerSound } = useAnswerSound();

    const handlePerimeterCheck = useCallback((
        lessonId,
        currentPresIndex,
        currentInteractionIndex,
        leftInput,
        setLeftInput,
        setShowNextButton,
        setDynamicTutorText,
        setActiveFeedbackInteraction
    ) => {
        const presentationId = getPresentationId(lessonId, currentPresIndex);
        const interaction = getInteractionData(presentationId, currentInteractionIndex);

        const userAnswer = parseInt(leftInput);
        const correctAnswer = interaction?.contentProps?.correctAnswer;

        playAnswerSound(userAnswer === correctAnswer);

        if (userAnswer === correctAnswer) {
            const feedbackText = getFeedbackInteraction(presentationId, interaction?.contentProps?.feedbackIds?.correct)?.tutorText;
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
            setShowNextButton(true);
            setPerimeterAttempts(0);
        } else {
            const newAttempts = perimeterAttempts + 1;
            setPerimeterAttempts(newAttempts);

            if (newAttempts === 1) {
                handleFeedbackTextTrigger(interaction?.contentProps?.feedbackIds?.hint1);
                const feedbackText = getFeedbackInteraction(presentationId, interaction?.contentProps?.feedbackIds?.hint1)?.tutorText;
                if (feedbackText) {
                    setDynamicTutorText(feedbackText);
                }
                setLeftInput('');
            } else if (newAttempts === 2) {
                const feedbackInteraction = getFeedbackInteraction(presentationId, interaction?.contentProps?.feedbackIds?.solution);
                if (feedbackInteraction) {
                    setDynamicTutorText(feedbackInteraction.tutorText);
                    setActiveFeedbackInteraction(feedbackInteraction);
                }
                setLeftInput(correctAnswer.toString());
                setPerimeterAttempts(0);
            }
        }
    }, [perimeterAttempts, playAnswerSound]);

    return {
        handlePerimeterCheck
    };
};

export default PerimeterHandler;