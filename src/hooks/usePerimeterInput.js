import { useState, useCallback } from 'react';

const usePerimeterInput = () => {
    const [perimeterInput, setPerimeterInput] = useState('');
    const [perimeterAttempts, setPerimeterAttempts] = useState(0);
    const [currentEquationStep, setCurrentEquationStep] = useState(0);

    const resetPerimeterState = useCallback(() => {
        setPerimeterInput('');
        setPerimeterAttempts(0);
        setCurrentEquationStep(0);
    }, []);

    const handlePerimeterCheck = useCallback((
        correctAnswer,
        feedbackIds,
        getFeedbackInteraction,
        setDynamicTutorText,
        setActiveFeedbackInteraction,
        setShowNextButton
    ) => {
        const userAnswer = parseInt(perimeterInput);

        if (userAnswer === correctAnswer) {
            const feedbackText = getFeedbackInteraction(feedbackIds?.correct)?.tutorText;
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
            setShowNextButton(true);
            setPerimeterAttempts(0);
        } else {
            const newAttempts = perimeterAttempts + 1;
            setPerimeterAttempts(newAttempts);

            if (newAttempts === 1) {
                const feedbackText = getFeedbackInteraction(feedbackIds?.hint1)?.tutorText;
                if (feedbackText) {
                    setDynamicTutorText(feedbackText);
                }
                setPerimeterInput('');
            } else if (newAttempts === 2) {
                const feedbackInteraction = getFeedbackInteraction(feedbackIds?.solution);
                if (feedbackInteraction) {
                    setDynamicTutorText(feedbackInteraction.tutorText);
                    setActiveFeedbackInteraction(feedbackInteraction);
                }
                setCurrentEquationStep(0);
                setPerimeterInput(correctAnswer.toString());
                setPerimeterAttempts(0);
            }
        }
    }, [perimeterInput, perimeterAttempts]);

    return {
        perimeterInput,
        setPerimeterInput,
        perimeterAttempts,
        currentEquationStep,
        resetPerimeterState,
        handlePerimeterCheck
    };
};

export default usePerimeterInput;