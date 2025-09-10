import { useState, useCallback } from 'react';
import useAnswerSound from '../../../hooks/useAnswerSound';
import { getPresentationId, getInteractionData } from '../../../utils/lessonDataAccess';

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
        handleFeedbackTextTrigger,
        handleFeedbackInteractionTrigger
    ) => {
        const presentationId = getPresentationId(lessonId, currentPresIndex);
        const interaction = getInteractionData(presentationId, currentInteractionIndex);

        const userAnswer = parseInt(leftInput);
        const correctAnswer = interaction?.contentProps?.correctAnswer;

        playAnswerSound(userAnswer === correctAnswer);

        if (userAnswer === correctAnswer) {
            handleFeedbackTextTrigger(interaction?.contentProps?.feedbackIds?.correct);
            setShowNextButton(true);
            setPerimeterAttempts(0);
        } else {
            const newAttempts = perimeterAttempts + 1;
            setPerimeterAttempts(newAttempts);

            if (newAttempts === 1) {
                handleFeedbackTextTrigger(interaction?.contentProps?.feedbackIds?.hint1);
                setLeftInput('');
            } else if (newAttempts === 2) {
                handleFeedbackInteractionTrigger(interaction?.contentProps?.feedbackIds?.solution);
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