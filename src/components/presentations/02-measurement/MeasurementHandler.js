import { useCallback } from 'react';
import useAnswerSound from '../../../hooks/useAnswerSound';
import { getPresentationId, getInteractionData, getFeedbackInteraction } from '../../../utils/lessonDataAccess';

const MeasurementHandler = () => {
    const { playAnswerSound } = useAnswerSound();

    const handleMeasurementCheck = useCallback((
        lessonId,
        currentPresIndex,
        currentInteractionIndex,
        leftInput,
        setLeftInput,
        setShowNextButton,
        setDynamicTutorText,
    ) => {
        const presentationId = getPresentationId(lessonId, currentPresIndex);
        const interaction = getInteractionData(presentationId, currentInteractionIndex);

        const correctAnswer = interaction?.contentProps?.correctAnswer;
        const userAnswer = parseFloat(leftInput);

        playAnswerSound(userAnswer === correctAnswer);

        if (userAnswer === correctAnswer) {
            const feedbackText = getFeedbackInteraction(presentationId, interaction?.contentProps?.feedbackIds?.correct)?.tutorText;
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
            setShowNextButton(true);
        } else {
            handleFeedbackTextTrigger(interaction?.contentProps?.feedbackIds?.incorrect);
            const feedbackText = getFeedbackInteraction(presentationId, interaction?.contentProps?.feedbackIds?.incorrect)?.tutorText;
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
        }

        setLeftInput('');
    }, [playAnswerSound]);

    return {
        handleMeasurementCheck
    };
};

export default MeasurementHandler;