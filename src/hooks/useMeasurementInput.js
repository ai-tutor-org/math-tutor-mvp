import { useState, useCallback } from 'react';

const useMeasurementInput = () => {
    const [measurementInput, setMeasurementInput] = useState('');

    const resetMeasurementState = useCallback(() => {
        setMeasurementInput('');
    }, []);

    const handleMeasurementCheck = useCallback((
        correctAnswer,
        interaction,
        handleAnswer
    ) => {
        const userAnswer = parseFloat(measurementInput);

        handleAnswer({
            interactionId: interaction?.contentProps?.interactionId,
            isCorrect: userAnswer === correctAnswer,
            answer: userAnswer,
        });

        setMeasurementInput(''); // Clear input after check
    }, [measurementInput]);

    return {
        measurementInput,
        setMeasurementInput,
        resetMeasurementState,
        handleMeasurementCheck
    };
};

export default useMeasurementInput;