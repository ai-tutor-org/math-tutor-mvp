import { useCallback } from 'react';
import useAnswerSound from '../../../hooks/useAnswerSound';
import { getPresentationId, getInteractionData } from '../../../utils/lessonDataAccess';

const MeasurementHandler = () => {
    const { playAnswerSound } = useAnswerSound();

    const handleMeasurementCheck = useCallback((
        lessonId,
        currentPresIndex,
        currentInteractionIndex,
        leftInput,
        setLeftInput,
        setShowNextButton,
        handleFeedbackTextTrigger
    ) => {
        const presentationId = getPresentationId(lessonId, currentPresIndex);
        const interaction = getInteractionData(presentationId, currentInteractionIndex);

        const correctAnswer = interaction?.contentProps?.correctAnswer;
        const userAnswer = parseFloat(leftInput);
        const isCorrect = userAnswer === correctAnswer;

        playAnswerSound(isCorrect);

        if (isCorrect) {
            handleFeedbackTextTrigger(interaction?.contentProps?.feedbackIds?.correct);
            setShowNextButton(true);
        } else {
            handleFeedbackTextTrigger(interaction?.contentProps?.feedbackIds?.incorrect);
        }

        setLeftInput('');
    }, [playAnswerSound]);

    return {
        handleMeasurementCheck
    };
};

export default MeasurementHandler;