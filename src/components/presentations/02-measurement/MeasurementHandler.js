import { useState, useCallback } from 'react';
import useAnswerSound from '../../../hooks/useAnswerSound';
import { getPresentationId, getInteractionData } from '../../../utils/lessonDataAccess';

const MeasurementHandler = () => {
    const { playAnswerSound } = useAnswerSound();
    const [measurementInput, setMeasurementInput] = useState('');

    const resetMeasurementState = useCallback(() => {
        setMeasurementInput('');
    }, []);

    const handleMeasurementCheck = useCallback((
        lessonId,
        currentPresIndex,
        currentInteractionIndex,
        setShowNextButton,
        handleFeedbackTextTrigger
    ) => {
        const presentationId = useMemo(() => getPresentationId(lessonId, currentPresIndex), [lessonId, currentPresIndex]);
        const interaction = useMemo(() => getInteractionData(presentationId, currentInteractionIndex), [presentationId, currentInteractionIndex]);

        const correctAnswer = interaction?.contentProps?.correctAnswer;
        const userAnswer = parseFloat(measurementInput);
        const isCorrect = userAnswer === correctAnswer;

        playAnswerSound(isCorrect);

        if (interaction?.type === 'shape-measurement') {
            if (answerData.isCorrect) {
                handleFeedbackTextTrigger(interaction?.contentProps?.feedbackIds?.correct);
                setShowNextButton(true);
            } else {
                handleFeedbackTextTrigger(interaction?.contentProps?.feedbackIds?.incorrect);
            }
            return;
        } else {
            // For other question types, advance as before
            advanceToNext();
        }

        setMeasurementInput(''); // Clear input after check
    }, [measurementInput]);

    return {
        measurementInput,
        setMeasurementInput,
        resetMeasurementState,
        handleMeasurementCheck
    };
};

export default MeasurementHandler;
